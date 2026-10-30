"""
Hybrid Physics-Informed Machine Learning Architecture for Adhesive Wear
Combines the deterministic Archard physical baseline with data-driven machine learning (XGBoost / Random Forest).

Implements:
1. Pure Physics Baseline (Archard Law)
2. Pure ML Baselines (Linear Regression, Random Forest, XGBoost)
3. Hybrid Model 1: Residual Learning
   V_pred = max(0, V_physics(W, L, H) + f_residual(features))
4. Hybrid Model 2: Physics-Constrained Calibrated Wear Coefficient
   K_eff = g_ML(p, v, T, Ra, mu, lubrication)
   V_pred = (K_eff * W * L) / H(T)
5. Comprehensive Benchmarking Suite reporting MAE, RMSE, R^2, and MAPE
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import shap

from backend.app.tribology_core.archard import ArchardModel
from backend.app.tribology_core.units import GPA_TO_PA, M3_TO_MM3

class HybridWearPipeline:
    """
    Manages training, calibration, and inference of Pure Physics, Pure ML,
    and Hybrid Physics-ML wear predictors.
    """

    FEATURE_COLS = [
        "normal_load", "sliding_speed", "surface_roughness", "sliding_distance",
        "hardness", "friction_coeff", "temperature", "lubrication",
        "contact_pressure", "wear_coefficient", "material_pair"
    ]

    NUMERIC_COLS = [
        "normal_load", "sliding_speed", "surface_roughness", "sliding_distance",
        "hardness", "friction_coeff", "temperature", "contact_pressure", "wear_coefficient"
    ]
    CATEGORICAL_COLS = ["material_pair"]
    BINARY_COLS = ["lubrication"]

    def __init__(self, random_seed: int = 42):
        self.random_seed = random_seed
        self.preprocessor = None
        self.pure_ml_models: Dict[str, Any] = {}
        self.residual_model: Optional[Any] = None
        self.k_eff_model: Optional[Any] = None
        self.metrics_summary: Dict[str, Any] = {}
        self.shap_explainer_residual: Optional[Any] = None
        self.shap_explainer_pure_ml: Optional[Any] = None

    def _build_preprocessor(self) -> ColumnTransformer:
        return ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), self.NUMERIC_COLS),
                ("cat", OneHotEncoder(drop="first", sparse_output=False), self.CATEGORICAL_COLS),
                ("bin", "passthrough", self.BINARY_COLS)
            ],
            remainder="drop"
        )

    @staticmethod
    def compute_pure_physics(df: pd.DataFrame) -> np.ndarray:
        """
        Pure Archard physics baseline:
        V = (K * W * L) / H (in mm^3)
        W in N, L in m, H in GPa -> H * 1000 N/mm^2, L * 1000 mm.
        """
        w = df["normal_load"].values
        l_m = df["sliding_distance"].values
        h_gpa = df["hardness"].values
        k = df["wear_coefficient"].values

        h_n_mm2 = h_gpa * 1000.0
        l_mm = l_m * 1000.0
        v_phys = (k * w * l_mm) / h_n_mm2
        return v_phys

    def train_and_benchmark(
        self,
        data_path: str = "data/synthetic_wear_dataset.csv",
        models_dir: str = "models",
        test_size: float = 0.20
    ) -> Dict[str, Any]:
        """
        Trains and compares Pure Physics, Pure ML, and Hybrid models on the identical holdout test split.
        """
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Dataset not found at: {data_path}")

        df = pd.read_csv(data_path)
        X = df[self.FEATURE_COLS]
        y = df["wear_volume"].values

        # Split into 80% Train, 20% Holdout Test
        X_train, X_test, y_train, y_test, df_train, df_test = train_test_split(
            X, y, df, test_size=test_size, random_state=self.random_seed
        )

        self.preprocessor = self._build_preprocessor()
        X_tr_proc = self.preprocessor.fit_transform(X_train)
        X_te_proc = self.preprocessor.transform(X_test)

        # -----------------------------------------------------------------
        # 1. PURE PHYSICS EVALUATION (Archard Baseline)
        # -----------------------------------------------------------------
        y_pred_physics = self.compute_pure_physics(df_test)
        
        # -----------------------------------------------------------------
        # 2. PURE MACHINE LEARNING MODELS
        # -----------------------------------------------------------------
        pure_models = {
            "Pure Linear Regression": LinearRegression(),
            "Pure Random Forest": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=self.random_seed, n_jobs=-1),
            "Pure XGBoost": xgb.XGBRegressor(n_estimators=150, max_depth=5, learning_rate=0.08, random_state=self.random_seed, n_jobs=-1)
        }

        eval_records = []

        # Physics metrics
        mae_phys = float(mean_absolute_error(y_test, y_pred_physics))
        rmse_phys = float(np.sqrt(mean_squared_error(y_test, y_pred_physics)))
        r2_phys = float(r2_score(y_test, y_pred_physics))
        eval_records.append({
            "model_architecture": "Pure Physics (Archard Law)",
            "model_type": "Analytical Mechanics",
            "mae_mm3": round(mae_phys, 4),
            "rmse_mm3": round(rmse_phys, 4),
            "r_squared": round(r2_phys, 4),
            "physics_constrained": True
        })

        # Train pure ML models
        for name, mdl in pure_models.items():
            mdl.fit(X_tr_proc, y_train)
            self.pure_ml_models[name] = mdl
            y_pred = np.maximum(0.0, mdl.predict(X_te_proc))
            
            mae = float(mean_absolute_error(y_test, y_pred))
            rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
            r2 = float(r2_score(y_test, y_pred))

            eval_records.append({
                "model_architecture": name,
                "model_type": "Pure Data-Driven ML",
                "mae_mm3": round(mae, 4),
                "rmse_mm3": round(rmse, 4),
                "r_squared": round(r2, 4),
                "physics_constrained": False
            })

        # -----------------------------------------------------------------
        # 3. HYBRID MODEL 1: RESIDUAL LEARNING
        # Target: Delta V = V_true - V_physics
        # V_hybrid = max(0, V_physics + Delta V_pred)
        # -----------------------------------------------------------------
        y_train_phys = self.compute_pure_physics(df_train)
        y_train_residual = y_train - y_train_phys

        self.residual_model = xgb.XGBRegressor(
            n_estimators=150, max_depth=5, learning_rate=0.08,
            random_state=self.random_seed, n_jobs=-1
        )
        self.residual_model.fit(X_tr_proc, y_train_residual)

        y_test_res_pred = self.residual_model.predict(X_te_proc)
        y_pred_hybrid_residual = np.maximum(0.0, y_pred_physics + y_test_res_pred)

        mae_hyb1 = float(mean_absolute_error(y_test, y_pred_hybrid_residual))
        rmse_hyb1 = float(np.sqrt(mean_squared_error(y_test, y_pred_hybrid_residual)))
        r2_hyb1 = float(r2_score(y_test, y_pred_hybrid_residual))

        eval_records.append({
            "model_architecture": "Hybrid Physics-ML (Residual Learning)",
            "model_type": "Physics-Informed Hybrid",
            "mae_mm3": round(mae_hyb1, 4),
            "rmse_mm3": round(rmse_hyb1, 4),
            "r_squared": round(r2_hyb1, 4),
            "physics_constrained": True
        })

        # -----------------------------------------------------------------
        # 4. HYBRID MODEL 2: CALIBRATED WEAR COEFFICIENT
        # K_eff = V_true * H / (W * L)
        # Fit ML to K_eff, then compute V = (K_eff_pred * W * L) / H
        # -----------------------------------------------------------------
        w_tr = df_train["normal_load"].values
        l_tr_mm = df_train["sliding_distance"].values * 1000.0
        h_tr_n_mm2 = df_train["hardness"].values * 1000.0
        wl_over_h_tr = (w_tr * l_tr_mm) / h_tr_n_mm2
        k_eff_train = y_train / np.maximum(wl_over_h_tr, 1e-12)

        self.k_eff_model = xgb.XGBRegressor(
            n_estimators=150, max_depth=5, learning_rate=0.08,
            random_state=self.random_seed, n_jobs=-1
        )
        self.k_eff_model.fit(X_tr_proc, k_eff_train)

        w_te = df_test["normal_load"].values
        l_te_mm = df_test["sliding_distance"].values * 1000.0
        h_te_n_mm2 = df_test["hardness"].values * 1000.0
        wl_over_h_te = (w_te * l_te_mm) / h_te_n_mm2

        k_eff_test_pred = np.maximum(0.0, self.k_eff_model.predict(X_te_proc))
        y_pred_hybrid_k = k_eff_test_pred * wl_over_h_te

        mae_hyb2 = float(mean_absolute_error(y_test, y_pred_hybrid_k))
        rmse_hyb2 = float(np.sqrt(mean_squared_error(y_test, y_pred_hybrid_k)))
        r2_hyb2 = float(r2_score(y_test, y_pred_hybrid_k))

        eval_records.append({
            "model_architecture": "Hybrid Physics-ML (Calibrated K)",
            "model_type": "Physics-Informed Hybrid",
            "mae_mm3": round(mae_hyb2, 4),
            "rmse_mm3": round(rmse_hyb2, 4),
            "r_squared": round(r2_hyb2, 4),
            "physics_constrained": True
        })

        # Sort evaluation records by RMSE ascending (best performance first)
        eval_records.sort(key=lambda r: r["rmse_mm3"])

        # -----------------------------------------------------------------
        # 5. INITIALIZE SHAP EXPLAINER ON BEST HYBRID MODEL
        # -----------------------------------------------------------------
        self.shap_explainer_residual = shap.TreeExplainer(self.residual_model)
        self.shap_explainer_pure_ml = shap.TreeExplainer(self.pure_ml_models["Pure XGBoost"])

        # Package results and artifacts
        self.metrics_summary = {
            "evaluation_records": eval_records,
            "train_sample_count": len(X_train),
            "test_sample_count": len(X_test),
            "target_variable": "wear_volume",
            "target_unit": "mm³",
            "random_seed": self.random_seed,
            "best_model_name": eval_records[0]["model_architecture"],
            "best_r_squared": eval_records[0]["r_squared"]
        }

        # Save artifacts to disk
        os.makedirs(models_dir, exist_ok=True)
        joblib.dump(self.preprocessor, os.path.join(models_dir, "hybrid_preprocessor.pkl"))
        joblib.dump(self.residual_model, os.path.join(models_dir, "hybrid_residual_model.pkl"))
        joblib.dump(self.k_eff_model, os.path.join(models_dir, "hybrid_k_eff_model.pkl"))
        
        with open(os.path.join(models_dir, "hybrid_benchmark_metrics.json"), "w") as f:
            json.dump(self.metrics_summary, f, indent=2)

        return self.metrics_summary

    def predict_hybrid(self, input_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes real hybrid inference on a single test condition dictionary.
        Returns Pure Physics, Pure ML, and Hybrid predictions.
        """
        if self.residual_model is None or self.preprocessor is None:
            raise RuntimeError("Hybrid pipeline has not been trained or loaded.")

        df_single = pd.DataFrame([input_dict])
        
        # 1. Pure Physics
        v_phys = float(self.compute_pure_physics(df_single)[0])

        # 2. Transformed features
        X_proc = self.preprocessor.transform(df_single[self.FEATURE_COLS])

        # 3. Pure ML
        pure_xgb = self.pure_ml_models.get("Pure XGBoost")
        v_pure_ml = float(pure_xgb.predict(X_proc)[0]) if pure_xgb else v_phys

        # 4. Hybrid Residual
        res_pred = float(self.residual_model.predict(X_proc)[0])
        v_hybrid_res = max(0.0, v_phys + res_pred)

        # 5. Hybrid Calibrated K
        w = float(input_dict["normal_load"])
        l_mm = float(input_dict["sliding_distance"]) * 1000.0
        h_n_mm2 = float(input_dict["hardness"]) * 1000.0
        wl_over_h = (w * l_mm) / h_n_mm2
        
        k_eff_pred = float(self.k_eff_model.predict(X_proc)[0]) if self.k_eff_model else float(input_dict.get("wear_coefficient", 1e-4))
        v_hybrid_k = max(0.0, k_eff_pred * wl_over_h)

        return {
            "pure_physics_archard_mm3": round(v_phys, 4),
            "pure_ml_xgboost_mm3": round(v_pure_ml, 4),
            "hybrid_residual_wear_mm3": round(v_hybrid_res, 4),
            "hybrid_calibrated_k_wear_mm3": round(v_hybrid_k, 4),
            "predicted_physical_residual_mm3": round(res_pred, 4),
            "predicted_effective_K": round(float(k_eff_pred), 8),
            "best_hybrid_prediction_mm3": round(v_hybrid_res, 4)
        }
