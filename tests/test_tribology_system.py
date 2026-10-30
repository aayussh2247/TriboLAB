import pytest
import os
import numpy as np
import pandas as pd

from backend.app.main import (
    health_check,
    calculate_archard_wear,
    predict_wear_volume,
    explain_prediction,
    optimize_conditions,
    what_if_parameter_sweep
)
from backend.app.schemas.wear_schemas import (
    ArchardCalculationInput,
    WearPredictionInput,
    ShapExplanationInput,
    OptimizationInput,
    WhatIfSweepInput
)
from scripts.generate_dataset import generate_synthetic_wear_dataset

def test_health_endpoint():
    data = health_check()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["shap_loaded"] is True

def test_archard_calculation():
    payload = ArchardCalculationInput(
        normal_load=200.0,
        sliding_distance=1000.0,
        hardness=4.0,  # 4 GPa
        wear_coefficient=1.0e-4
    )
    data = calculate_archard_wear(payload)
    # Theoretical: (1e-4 * 200 * 1000 * 1000) / (4 * 1000) = 20.0 / 4 = 5.0 mm3
    assert abs(data["theoretical_wear_volume_mm3"] - 5.0) < 1e-4
    assert data["theoretical_wear_rate_mm3_m"] > 0

def test_predict_wear_endpoint():
    payload = WearPredictionInput(
        normal_load=250.0,
        sliding_speed=1.2,
        surface_roughness=1.5,
        sliding_distance=1500.0,
        hardness=3.8,
        temperature=60.0,
        lubrication=0,
        material_pair="Steel-Steel"
    )
    data = predict_wear_volume(payload)
    assert data["predicted_wear_volume_mm3"] > 0
    assert data["archard_theoretical_wear_mm3"] > 0
    assert "wear_risk_category" in data

def test_shap_explain_endpoint():
    payload = ShapExplanationInput(
        normal_load=300.0,
        sliding_speed=1.5,
        surface_roughness=1.2,
        sliding_distance=2000.0,
        hardness=3.5,
        temperature=75.0,
        lubrication=1,
        material_pair="Steel-Steel"
    )
    data = explain_prediction(payload)
    assert "feature_contributions" in data
    assert len(data["feature_contributions"]) > 0
    assert "explanation_summary" in data

def test_optimize_endpoint():
    payload = OptimizationInput(
        current_conditions=WearPredictionInput(
            normal_load=400.0,
            sliding_speed=2.0,
            surface_roughness=2.5,
            sliding_distance=2000.0,
            hardness=3.0,
            temperature=120.0,
            lubrication=0,
            material_pair="Steel-Steel"
        )
    )
    data = optimize_conditions(payload)
    assert data["optimized_predicted_wear_mm3"] < data["current_predicted_wear_mm3"]
    assert data["estimated_wear_reduction_percent"] > 0

def test_what_if_sweep_endpoint():
    payload = WhatIfSweepInput(
        base_conditions=WearPredictionInput(
            normal_load=200.0,
            sliding_speed=1.0,
            surface_roughness=1.0,
            sliding_distance=1000.0,
            hardness=4.0,
            temperature=50.0,
            lubrication=0,
            material_pair="Steel-Steel"
        ),
        sweep_parameter="normal_load",
        min_value=50.0,
        max_value=500.0,
        steps=10
    )
    data = what_if_parameter_sweep(payload)
    assert len(data["sweep_values"]) == 10
    assert len(data["predicted_wear_values"]) == 10
    # Wear should monotonically trend upward with higher normal load
    assert data["predicted_wear_values"][-1] > data["predicted_wear_values"][0]

def test_dataset_generation_properties():
    temp_csv = "data/test_temp_dataset.csv"
    df = generate_synthetic_wear_dataset(n_samples=50, random_seed=99, output_path=temp_csv)
    assert len(df) == 50
    assert "wear_volume" in df.columns
    assert (df["wear_volume"] > 0).all()
    if os.path.exists(temp_csv):
        os.remove(temp_csv)
    meta = temp_csv.replace(".csv", "_metadata.json")
    if os.path.exists(meta):
        os.remove(meta)
