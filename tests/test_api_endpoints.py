"""
Integration Test Suite for Scientific FastAPI Endpoints
Tests:
- GET  /api/tribology/literature
- POST /api/tribology/models/archard
- POST /api/tribology/models/energy
- POST /api/tribology/models/rough-surface
- POST /api/tribology/models/third-body
- POST /api/tribology/models/spatial-profile
- GET  /api/tribology/models/hybrid-benchmark
- POST /api/tribology/export/simulation-csv
"""

from backend.app.main import (
    get_scientific_literature_traceability,
    evaluate_archard_model,
    evaluate_energy_model,
    evaluate_rough_surface_model,
    evaluate_third_body_model,
    evaluate_spatial_profile_solver,
    get_hybrid_benchmark_metrics,
    export_simulation_csv
)

def test_api_literature_traceability():
    res = get_scientific_literature_traceability()
    assert res["status"] == "success"
    assert res["models_count"] == 5
    assert len(res["traceability_registry"]) == 5

def test_api_archard_endpoint():
    payload = {
        "normal_load": 200.0,
        "sliding_distance": 1000.0,
        "hardness": 4.0,
        "wear_coefficient": 1.0e-4
    }
    res = evaluate_archard_model(payload)
    assert abs(res["wear_volume_mm3"] - 5.0) < 1e-4
    assert res["wear_rate_mm3_per_m"] > 0
    assert "analytical_sensitivities" in res
    assert res["analytical_sensitivities"]["normalized_elasticity_W"] == 1.0

def test_api_energy_endpoint():
    payload = {
        "normal_load": 300.0,
        "sliding_distance": 1000.0,
        "friction_coeff": 0.40,
        "alpha_wear_mm3_per_J": 1.0e-4,
        "hardness": 4.0
    }
    res = evaluate_energy_model(payload)
    assert res["dissipated_energy_J"] == 120000.0
    assert res["wear_volume_mm3"] > 0
    assert "choudhry_effective_wear_coefficient" in res

def test_api_rough_surface_endpoint():
    payload = {
        "normal_load": 200.0,
        "sliding_distance": 1000.0,
        "hardness": 4.0,
        "surface_roughness": 1.5,
        "youngs_modulus_gpa": 110.0,
        "work_of_adhesion_j_m2": 0.8,
        "wear_coefficient": 1.5e-4
    }
    res = evaluate_rough_surface_model(payload)
    assert res["rough_surface_wear_volume_mm3"] > 0
    assert res["debris_producing_junction_fraction"] <= 1.0
    assert res["plasticity_index"] > 0

def test_api_third_body_endpoint():
    payload = {
        "normal_load": 300.0,
        "sliding_speed": 1.5,
        "total_time_s": 50.0,
        "hardness": 4.0,
        "wear_coefficient": 1.5e-4
    }
    res = evaluate_third_body_model(payload)
    assert len(res["time_points_s"]) > 0
    assert res["mass_conservation_max_error_kg"] < 1e-12
    assert res["steady_state_predicted_thickness_um"] > 0

def test_api_spatial_profile_endpoint():
    payload = {
        "normal_load": 500.0,
        "contact_length_mm": 20.0,
        "cylinder_radius_mm": 25.0,
        "youngs_modulus_gpa": 110.0,
        "hardness": 4.0,
        "wear_coefficient": 1.5e-4,
        "sliding_distance_m": 5.0
    }
    res = evaluate_spatial_profile_solver(payload)
    assert res["max_wear_depth_um"] > 0
    assert len(res["x_coordinates_mm"]) == 51
    assert res["pressure_flattening_ratio"] < 1.0

def test_api_hybrid_benchmark_endpoint():
    res = get_hybrid_benchmark_metrics()
    assert "evaluation_records" in res
    assert len(res["evaluation_records"]) >= 4
    # Best model must be Hybrid Residual Learning
    assert "Hybrid" in res["best_model_name"]
    assert res["best_r_squared"] > 0.90

def test_api_export_csv_endpoint():
    payload = {
        "simulation_type": "spatial_profile",
        "x_coordinates_mm": [-0.5, 0.0, 0.5],
        "initial_hertz_pressure_mpa": [50.0, 100.0, 50.0],
        "final_contact_pressure_mpa": [40.0, 70.0, 40.0],
        "final_wear_depth_profile_um": [1.2, 3.5, 1.2]
    }
    res = export_simulation_csv(payload)
    assert res.status_code == 200
    assert "x_position_mm" in res.body.decode("utf-8")
