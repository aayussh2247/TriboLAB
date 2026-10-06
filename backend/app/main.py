"""
FastAPI Application for Adhesive Wear Tribology Research
Provides endpoints:
- GET  /health
- POST /predict
- POST /archard
- POST /explain
- POST /optimize
- POST /what-if
- GET  /model-performance
- GET  /dataset-summary
- GET  /feature-importance
"""

import os
import json
import logging
import numpy as np
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from backend.app.schemas.wear_schemas import (
    WearPredictionInput, WearPredictionOutput,
    ArchardCalculationInput, ArchardCalculationOutput,
    ShapExplanationInput, ShapExplanationOutput,
    OptimizationInput, OptimizationOutput,
    WhatIfSweepInput, WhatIfSweepOutput
)
from backend.app.services.tribology_service import TribologyModelService

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("TribologyAPI")

app = FastAPI(
    title="Adhesive Wear AI Research Platform API",
    description="Scientific machine learning, explainability (SHAP), and optimization API for adhesive wear in tribological contacts.",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate artifacts directory (support running from D:\ADHESIVE WEAR PREDCITON or D:\AI\projects\adhesive_wear_ai)
ROOT_CWD = os.getcwd()
models_dir = os.path.join(ROOT_CWD, "models") if os.path.exists(os.path.join(ROOT_CWD, "models")) else "D:/ADHESIVE WEAR PREDCITON/models"
data_dir = os.path.join(ROOT_CWD, "data") if os.path.exists(os.path.join(ROOT_CWD, "data")) else "D:/ADHESIVE WEAR PREDCITON/data"

tribology_service = TribologyModelService(models_dir=models_dir, data_dir=data_dir)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing Tribology AI Backend Services...")
    tribology_service.load_artifacts()
    logger.info("Best model and SHAP explainers loaded successfully.")

@app.get("/health", tags=["Diagnostic"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Tribology Adhesive Wear Prediction Engine",
        "model_loaded": tribology_service.model_pipeline is not None,
        "shap_loaded": tribology_service.shap_explainer is not None,
        "best_model_name": tribology_service.model_metadata.get("model_name", "Unknown")
    }

@app.post("/predict", response_model=WearPredictionOutput, tags=["Prediction"])
async def predict_wear_volume(payload: WearPredictionInput):
    try:
        logger.info(f"Prediction request received: Load={payload.normal_load}N, Distance={payload.sliding_distance}m, Lub={payload.lubrication}")
        result = tribology_service.predict_wear(payload.dict())
        return result
    except Exception as e:
        logger.error(f"Prediction failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/archard", response_model=ArchardCalculationOutput, tags=["Physical Model"])
async def calculate_archard_wear(payload: ArchardCalculationInput):
    """
    Computes classic Archard's Law Wear: V = (K * W * L) / H
    H in GPa -> converted to N/mm^2 (H * 1000)
    L in m -> converted to mm (L * 1000)
    """
    h_n_mm2 = payload.hardness * 1000.0
    l_mm = payload.sliding_distance * 1000.0
    v_archard_mm3 = (payload.wear_coefficient * payload.normal_load * l_mm) / h_n_mm2
    wear_rate = v_archard_mm3 / payload.sliding_distance

    return {
        "theoretical_wear_volume_mm3": round(v_archard_mm3, 6),
        "theoretical_wear_rate_mm3_m": round(wear_rate, 8),
        "archard_formula": "V = (K * W * L) / H",
        "variables_used": {
            "normal_load_N": payload.normal_load,
            "sliding_distance_m": payload.sliding_distance,
            "hardness_GPa": payload.hardness,
            "wear_coefficient_K": payload.wear_coefficient
        }
    }

@app.post("/explain", response_model=ShapExplanationOutput, tags=["Explainability"])
async def explain_prediction(payload: ShapExplanationInput):
    try:
        logger.info("Computing real SHAP explanation for prediction...")
        result = tribology_service.explain_prediction(payload.dict())
        return result
    except Exception as e:
        logger.error(f"SHAP explanation failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize", response_model=OptimizationOutput, tags=["Optimization"])
async def optimize_conditions(payload: OptimizationInput):
    try:
        logger.info("Optimizing operating conditions to minimize adhesive wear...")
        result = tribology_service.optimize_operating_conditions(payload.current_conditions.dict())
        return result
    except Exception as e:
        logger.error(f"Optimization failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/what-if", response_model=WhatIfSweepOutput, tags=["What-If Analysis"])
async def what_if_parameter_sweep(payload: WhatIfSweepInput):
    try:
        param = payload.sweep_parameter
        values = np.linspace(payload.min_value, payload.max_value, payload.steps).tolist()
        pred_wear_list = []
        archard_wear_list = []

        base_dict = payload.base_conditions.dict()
        for v in values:
            test_dict = dict(base_dict)
            test_dict[param] = v
            res = tribology_service.predict_wear(test_dict)
            pred_wear_list.append(res["predicted_wear_volume_mm3"])
            archard_wear_list.append(res["archard_theoretical_wear_mm3"])

        return {
            "sweep_parameter": param,
            "sweep_values": [round(val, 3) for val in values],
            "predicted_wear_values": pred_wear_list,
            "archard_wear_values": archard_wear_list
        }
    except Exception as e:
        logger.error(f"What-if sweep failure: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-performance", tags=["Performance & Metrics"])
async def get_model_performance():
    metrics = tribology_service.model_metadata.get("metrics_all_models", {})
    best_meta = tribology_service.model_metadata.get("best_model_metrics", {})
    return {
        "best_model_name": tribology_service.model_metadata.get("model_name", "XGBoost Regressor"),
        "best_model_metrics": best_meta,
        "all_models_comparison": metrics,
        "dataset_sample_count": tribology_service.model_metadata.get("train_samples", 3200) + tribology_service.model_metadata.get("test_samples", 800)
    }

@app.get("/feature-importance", tags=["Performance & Metrics"])
async def get_feature_importance():
    shap_importance = tribology_service.model_metadata.get("shap_global_importance", {})
    return {
        "global_importance_shap": shap_importance
    }

@app.get("/dataset-summary", tags=["Dataset"])
async def get_dataset_summary():
    if tribology_service.dataset_df is None:
        raise HTTPException(status_code=404, detail="Dataset not loaded.")
    df = tribology_service.dataset_df
    
    # Statistical summary
    num_summary = df.describe().to_dict()
    mat_distribution = df["material_pair"].value_counts().to_dict()
    lub_distribution = df["lubrication"].value_counts().to_dict()

    return {
        "total_records": len(df),
        "columns": list(df.columns),
        "material_distribution": mat_distribution,
        "lubrication_distribution": {
            "Dry (0)": lub_distribution.get(0, 0),
            "Lubricated (1)": lub_distribution.get(1, 0)
        },
        "numerical_statistics": num_summary,
        "disclaimer": "Synthetic Demonstration Dataset — Not Experimental Data"
    }
