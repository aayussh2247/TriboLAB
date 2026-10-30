"""
Comprehensive Research-Grade Test Suite for SHAP Explainability Module
Verifies:
- Shapley Additivity (Efficiency Axiom: f(x) = E[f(x)] + sum(phi_i))
- Prediction Consistency (Model inference matches explainer prediction)
- Feature Alignment (Exact ordering and preprocessing transformation)
- Multi-target isolation (wear_volume [mm3] vs wear_rate [mm3/m])
- Beeswarm & Dependence plot generation with real distributions
- Force plot decomposition
- CSV and Research Report exports
- Regression testing of existing endpoints (/predict, /archard, /optimize, etc.)
"""

import pytest
import numpy as np
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)

def test_shap_status():
    response = client.get("/shap/status")
    assert response.status_code == 200
    data = response.json()
    assert data["model_loaded"] is True
    assert data["shap_loaded"] is True
    assert data["explainer_type"] == "shap.TreeExplainer"
    assert "wear_volume" in data["available_targets"]
    assert "wear_rate" in data["available_targets"]
    assert data["feature_count_raw"] == 11
    assert data["feature_count_transformed"] == 14
    assert len(data["warnings_or_errors"]) == 0

def test_global_importance_calculation():
    response = client.get("/shap/global-importance?target=wear_volume&sample_size=100&top_k=10")
    assert response.status_code == 200
    data = response.json()
    assert data["target"] == "wear_volume"
    assert data["target_unit"] == "mm³"
    assert len(data["features"]) == 10

    # Verify descending ordering
    vals = [f["mean_abs_shap"] for f in data["features"]]
    for i in range(len(vals) - 1):
        assert vals[i] >= vals[i + 1]

    # Verify top driver is a known major tribology factor (e.g. wear_coefficient or normal_load)
    top_feature = data["features"][0]["feature"]
    assert top_feature in ["wear_coefficient", "normal_load", "sliding_distance"]
    assert vals[0] > 0

def test_waterfall_additivity_property_evaluation_sample():
    """
    Shapley Efficiency Axiom test:
    Verify expected_value + sum(shap_values) == predicted_value within float numerical tolerance.
    """
    payload = {
        "target": "wear_volume",
        "sample_index": 0
    }
    response = client.post("/shap/waterfall", json=payload)
    assert response.status_code == 200
    data = response.json()

    base_val = data["expected_value"]
    pred_val = data["predicted_value"]
    sum_shap = data["sum_of_shap_values"]
    diff = data["additivity_diff"]

    assert abs((base_val + sum_shap) - pred_val) < 0.005
    assert diff < 0.005
    assert data["additivity_verified"] is True
    assert len(data["steps"]) == 14
    assert len(data["plot_image_base64"]) > 1000

def test_waterfall_custom_prediction_consistency():
    """
    Verify explanation of custom input matches the /predict endpoint inference.
    """
    conditions = {
        "normal_load": 450.0,
        "sliding_speed": 1.2,
        "surface_roughness": 1.4,
        "sliding_distance": 2500.0,
        "hardness": 3.2,
        "friction_coeff": 0.35,
        "temperature": 85.0,
        "lubrication": 0,
        "material_pair": "Steel-Steel"
    }

    # 1. Direct prediction
    pred_res = client.post("/predict", json=conditions)
    assert pred_res.status_code == 200
    direct_wear = pred_res.json()["predicted_wear_volume_mm3"]

    # 2. SHAP waterfall explanation of same conditions
    wf_res = client.post("/shap/waterfall", json={
        "target": "wear_volume",
        "custom_input": conditions
    })
    assert wf_res.status_code == 200
    wf_data = wf_res.json()

    explained_wear = wf_data["predicted_value"]
    # Verify predictions match within float tolerance
    assert abs(direct_wear - explained_wear) < 0.01
    assert wf_data["additivity_verified"] is True

def test_multi_target_switching():
    """
    Verify wear_volume and wear_rate use distinct models, units, and output scales.
    """
    # Wear volume
    res_vol = client.get("/shap/global-importance?target=wear_volume&sample_size=50")
    assert res_vol.status_code == 200
    data_vol = res_vol.json()
    assert data_vol["target_unit"] == "mm³"

    # Wear rate
    res_rate = client.get("/shap/global-importance?target=wear_rate&sample_size=50")
    assert res_rate.status_code == 200
    data_rate = res_rate.json()
    assert data_rate["target_unit"] == "mm³/m"

    # Values must not be identical because wear_rate is normalized by distance
    assert data_vol["features"][0]["mean_abs_shap"] != data_rate["features"][0]["mean_abs_shap"]

def test_beeswarm_data_and_image():
    response = client.get("/shap/beeswarm?target=wear_volume&sample_size=80")
    assert response.status_code == 200
    data = response.json()
    assert len(data["sample_points"]) > 0
    assert len(data["features_ordered"]) > 0
    assert data["plot_image_base64"] is not None
    assert len(data["plot_image_base64"]) > 1000

    # Check sample point normalization (0.0 to 1.0)
    pt = data["sample_points"][0]
    assert 0.0 <= pt["feature_value_norm"] <= 1.0

def test_dependence_plot_endpoint():
    response = client.get("/shap/dependence?feature_name=normal_load&interaction_feature=sliding_distance&target=wear_volume&sample_size=80")
    assert response.status_code == 200
    data = response.json()
    assert data["primary_feature"] == "normal_load"
    assert data["primary_unit"] == "N"
    assert len(data["x_values"]) == len(data["y_shap_values"])
    assert "Archard" in data["tribological_note"]
    assert data["plot_image_base64"] is not None

def test_force_plot_endpoint():
    payload = {
        "target": "wear_volume",
        "sample_index": 2
    }
    response = client.post("/shap/force", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "base_value" in data
    assert "prediction_value" in data
    assert len(data["positive_features"]) + len(data["negative_features"]) == 14

def test_interaction_analysis_endpoint():
    response = client.get("/shap/interaction?feature_1=normal_load&feature_2=sliding_distance&target=wear_volume")
    assert response.status_code == 200
    data = response.json()
    assert "Archard Work Product" in data["tribological_mechanism"]
    assert "correlation" in data
    assert len(data["sample_data"]) > 0

def test_validation_suite_endpoint():
    response = client.get("/shap/validation-tests?target=wear_volume")
    assert response.status_code == 200
    data = response.json()
    assert data["all_passed"] is True
    assert len(data["tests"]) >= 5
    for t in data["tests"]:
        assert t["status"] == "PASSED"

def test_export_endpoints():
    # 1. Importance CSV
    res_imp = client.get("/shap/export/importance-csv?target=wear_volume")
    assert res_imp.status_code == 200
    assert "Rank,Feature,Display Name" in res_imp.text

    # 2. Samples CSV
    res_samp = client.get("/shap/export/samples-csv?target=wear_volume&sample_size=20")
    assert res_samp.status_code == 200
    assert "sample_id,shap_" in res_samp.text

    # 3. Research Report Markdown
    res_rep = client.post("/shap/export/report", json={"target": "wear_volume", "sample_index": 0})
    assert res_rep.status_code == 200
    assert "# Tribological Research Explanation Report" in res_rep.text
    assert "Global Feature Importance" in res_rep.text
    assert "Local Prediction Explanation" in res_rep.text

def test_regression_existing_endpoints():
    # Health
    h = client.get("/health")
    assert h.status_code == 200
    assert h.json()["model_loaded"] is True

    # Predict
    p = client.post("/predict", json={
        "normal_load": 200.0,
        "sliding_speed": 1.0,
        "surface_roughness": 1.0,
        "sliding_distance": 1000.0,
        "hardness": 4.0,
        "temperature": 50.0,
        "lubrication": 0,
        "material_pair": "Steel-Steel"
    })
    assert p.status_code == 200
    assert p.json()["predicted_wear_volume_mm3"] > 0

    # Archard
    a = client.post("/archard", json={
        "normal_load": 200.0,
        "sliding_distance": 1000.0,
        "hardness": 4.0,
        "wear_coefficient": 1.0e-4
    })
    assert a.status_code == 200
    assert abs(a.json()["theoretical_wear_volume_mm3"] - 5.0) < 1e-4

    # Optimize
    opt = client.post("/optimize", json={
        "current_conditions": {
            "normal_load": 300.0,
            "sliding_speed": 1.5,
            "surface_roughness": 2.0,
            "sliding_distance": 1500.0,
            "hardness": 3.0,
            "temperature": 100.0,
            "lubrication": 0,
            "material_pair": "Steel-Steel"
        }
    })
    assert opt.status_code == 200
    assert opt.json()["estimated_wear_reduction_percent"] > 0
