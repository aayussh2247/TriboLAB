"""
Tribological Computation & Machine Learning Inference Engine
Manages model loading, Archard physical calculations, real SHAP computations, and SciPy optimization.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from scipy.optimize import minimize

class TribologyModelService:
    def __init__(self, models_dir: str = "models", data_dir: str = "data"):
        self.models_dir = models_dir
        self.data_dir = data_dir
        self.model_pipeline = None
        self.shap_explainer = None
        self.model_metadata = {}
        self.dataset_df = None
        self.load_artifacts()

    def load_artifacts(self):
        # 1. Load Trained Best Pipeline
        model_path = os.path.join(self.models_dir, "best_model.pkl")
        if os.path.exists(model_path):
            self.model_pipeline = joblib.load(model_path)
            print(f"[TribologyService] Loaded model pipeline from {model_path}")
        else:
            print(f"[TribologyService WARNING] Model file not found at {model_path}")

        # 2. Load SHAP Explainer
        explainer_path = os.path.join(self.models_dir, "shap_explainer.pkl")
        if os.path.exists(explainer_path):
            self.shap_explainer = joblib.load(explainer_path)
            print(f"[TribologyService] Loaded SHAP explainer from {explainer_path}")
        else:
            print(f"[TribologyService WARNING] SHAP explainer not found at {explainer_path}")

        # 3. Load Model Metadata
        meta_path = os.path.join(self.models_dir, "model_metadata.json")
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.model_metadata = json.load(f)

        # 4. Load Synthetic Dataset for summaries
        data_path = os.path.join(self.data_dir, "synthetic_wear_dataset.csv")
        if os.path.exists(data_path):
            self.dataset_df = pd.read_csv(data_path)

    def compute_physical_attributes(self, inp: Dict[str, Any]) -> Tuple[float, float, float, float]:
        """
        Derives contact pressure, baseline wear coefficient K, and friction coefficient
        according to tribological contact principles.
        """
        nominal_area_mm2 = 100.0  # nominal contact pad area
        contact_pressure = inp["normal_load"] / nominal_area_mm2

        # Empirical wear coefficients based on material pair and lubrication
        k_defaults = {
            "Steel-Steel": 1.5e-4,
            "Steel-Bronze": 8.0e-5,
            "Steel-CastIron": 1.1e-4,
            "Ti6Al4V-Steel": 2.5e-4,
            "Aluminum-Steel": 4.2e-4
        }
        base_k = k_defaults.get(inp.get("material_pair", "Steel-Steel"), 1.5e-4)

        if inp["lubrication"] == 1:
            wear_k = base_k * 0.05
            mu = 0.09 + 0.015 * (inp["surface_roughness"] ** 0.4)
        else:
            wear_k = base_k * (1.0 + 0.12 * (inp["surface_roughness"] / 2.5))
            mu_base = 0.60 if "Steel" in inp.get("material_pair", "") else 0.45
            mu = mu_base + 0.025 * (inp["surface_roughness"] ** 0.6)

        if inp.get("wear_coefficient") is not None:
            wear_k = inp["wear_coefficient"]
        if inp.get("friction_coeff") is not None:
            mu = inp["friction_coeff"]

        # Archard theoretical wear: V = (K * W * L) / H (in mm^3)
        # H in GPa -> H in N/mm^2 = H * 1000
        # L in m -> L in mm = L * 1000
        h_n_mm2 = inp["hardness"] * 1000.0
        l_mm = inp["sliding_distance"] * 1000.0
        archard_wear = (wear_k * inp["normal_load"] * l_mm) / h_n_mm2

        return contact_pressure, wear_k, mu, archard_wear

    def predict_wear(self, input_dict: Dict[str, Any]) -> Dict[str, Any]:
        contact_pressure, wear_k, mu, archard_wear = self.compute_physical_attributes(input_dict)

        df_row = pd.DataFrame([{
            "normal_load": float(input_dict["normal_load"]),
            "sliding_speed": float(input_dict["sliding_speed"]),
            "surface_roughness": float(input_dict["surface_roughness"]),
            "sliding_distance": float(input_dict["sliding_distance"]),
            "hardness": float(input_dict["hardness"]),
            "friction_coeff": float(mu),
            "temperature": float(input_dict["temperature"]),
            "lubrication": int(input_dict["lubrication"]),
            "contact_pressure": float(contact_pressure),
            "wear_coefficient": float(wear_k),
            "material_pair": str(input_dict.get("material_pair", "Steel-Steel"))
        }])

        pred_wear_volume = float(self.model_pipeline.predict(df_row)[0])
        pred_wear_volume = max(0.0001, pred_wear_volume)
        pred_wear_rate = pred_wear_volume / input_dict["sliding_distance"]

        # Risk categorization based on specific wear rates (mm^3 / (N*m))
        dimensional_wear_coefficient = pred_wear_volume / (input_dict["normal_load"] * input_dict["sliding_distance"])
        if dimensional_wear_coefficient < 5e-5:
            risk = "LOW (Mild Oxidative/Adhesive Wear)"
        elif dimensional_wear_coefficient < 2.5e-4:
            risk = "MEDIUM (Moderate Adhesive Wear Regime)"
        else:
            risk = "HIGH (Severe Adhesive Wear / Scuffing Risk)"

        return {
            "predicted_wear_volume_mm3": round(pred_wear_volume, 4),
            "predicted_wear_rate_mm3_m": round(pred_wear_rate, 6),
            "archard_theoretical_wear_mm3": round(archard_wear, 4),
            "wear_risk_category": risk,
            "contact_pressure_mpa": round(contact_pressure, 3),
            "computed_friction_coeff": round(mu, 3),
            "computed_wear_coefficient": wear_k,
            "model_name": self.model_metadata.get("model_name", "XGBoost Regressor"),
            "input_summary": input_dict
        }

    def explain_prediction(self, input_dict: Dict[str, Any]) -> Dict[str, Any]:
        contact_pressure, wear_k, mu, _ = self.compute_physical_attributes(input_dict)

        df_row = pd.DataFrame([{
            "normal_load": float(input_dict["normal_load"]),
            "sliding_speed": float(input_dict["sliding_speed"]),
            "surface_roughness": float(input_dict["surface_roughness"]),
            "sliding_distance": float(input_dict["sliding_distance"]),
            "hardness": float(input_dict["hardness"]),
            "friction_coeff": float(mu),
            "temperature": float(input_dict["temperature"]),
            "lubrication": int(input_dict["lubrication"]),
            "contact_pressure": float(contact_pressure),
            "wear_coefficient": float(wear_k),
            "material_pair": str(input_dict.get("material_pair", "Steel-Steel"))
        }])

        # Preprocess features
        preprocessor = self.model_pipeline.named_steps["preprocessor"]
        regressor = self.model_pipeline.named_steps["regressor"]
        transformed = preprocessor.transform(df_row)
        pred_val = float(regressor.predict(transformed)[0])

        # Compute Local SHAP Values
        shap_vals = self.shap_explainer.shap_values(transformed)
        if isinstance(shap_vals, list):
            shap_vals = shap_vals[0]
        
        feature_names = self.model_metadata.get(
            "features_transformed",
            [f"feat_{i}" for i in range(transformed.shape[1])]
        )

        row_shap = shap_vals[0]
        base_val = float(getattr(self.shap_explainer, "expected_value", np.mean(shap_vals)))
        if isinstance(base_val, np.ndarray):
            base_val = float(base_val[0])

        contributions = []
        for name, val in zip(feature_names, row_shap):
            contributions.append({
                "feature": name,
                "shap_value": round(float(val), 4),
                "impact": "Increases Wear" if val > 0 else "Decreases Wear",
                "magnitude": abs(round(float(val), 4))
            })

        contributions.sort(key=lambda x: x["magnitude"], reverse=True)

        # Synthesize Tribological Explanation
        top_driver = contributions[0]
        second_driver = contributions[1]
        summary_text = (
            f"The predicted wear volume of {pred_val:.2f} mm³ deviates from baseline ({base_val:.2f} mm³) "
            f"predominantly due to {top_driver['feature']} ({top_driver['impact']}, contribution: {top_driver['shap_value']:+.2f} mm³) "
            f"and {second_driver['feature']} ({second_driver['impact']}, contribution: {second_driver['shap_value']:+.2f} mm³)."
        )

        return {
            "base_value": round(base_val, 4),
            "prediction_value": round(pred_val, 4),
            "feature_contributions": contributions,
            "explanation_summary": summary_text
        }

    def optimize_operating_conditions(self, current_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Uses bounded multi-variable optimization (L-BFGS-B / SLSQP) to find
        the lowest wear operating conditions within physically practical operating envelopes.
        """
        current_res = self.predict_wear(current_input)
        curr_wear = current_res["predicted_wear_volume_mm3"]

        # Decision variables to optimize: [normal_load, sliding_speed, surface_roughness, temperature]
        # Fixed during mechanical trial: material_pair, sliding_distance (set by machine task)
        # Recommendation automatically tests enabling lubrication
        x0 = [
            current_input["normal_load"],
            current_input["sliding_speed"],
            current_input["surface_roughness"],
            current_input["temperature"]
        ]

        # Engineering constraints (allowable variation bounds: ±40% around current, or practical machine limits)
        bounds = [
            (max(10.0, current_input["normal_load"] * 0.5), min(1000.0, current_input["normal_load"] * 1.1)),
            (max(0.05, current_input["sliding_speed"] * 0.5), min(5.0, current_input["sliding_speed"] * 1.1)),
            (max(0.1, current_input["surface_roughness"] * 0.4), min(5.0, current_input["surface_roughness"] * 1.0)),
            (max(25.0, current_input["temperature"] * 0.6), min(250.0, current_input["temperature"] * 1.0))
        ]

        def objective(x):
            cand_input = {
                "normal_load": x[0],
                "sliding_speed": x[1],
                "surface_roughness": x[2],
                "sliding_distance": current_input["sliding_distance"],
                "hardness": current_input["hardness"],
                "temperature": x[3],
                "lubrication": 1,  # optimal regime recommends boundary/fluid film
                "material_pair": current_input.get("material_pair", "Steel-Steel")
            }
            res = self.predict_wear(cand_input)
            return res["predicted_wear_volume_mm3"]

        opt_result = minimize(objective, x0, bounds=bounds, method="L-BFGS-B")
        opt_x = opt_result.x

        opt_input = {
            "normal_load": round(float(opt_x[0]), 2),
            "sliding_speed": round(float(opt_x[1]), 3),
            "surface_roughness": round(float(opt_x[2]), 3),
            "sliding_distance": current_input["sliding_distance"],
            "hardness": current_input["hardness"],
            "temperature": round(float(opt_x[3]), 1),
            "lubrication": 1,
            "material_pair": current_input.get("material_pair", "Steel-Steel")
        }

        opt_res = self.predict_wear(opt_input)
        opt_wear = opt_res["predicted_wear_volume_mm3"]
        reduction_pct = max(0.0, ((curr_wear - opt_wear) / max(curr_wear, 1e-4)) * 100.0)

        actions = [
            f"Activate boundary lubrication: delivers significant reduction in adhesive asperity junction shearing.",
            f"Adjust normal load to ~{opt_input['normal_load']} N to maintain acceptable contact pressure.",
            f"Superfinish counterface to target roughness Ra ~{opt_input['surface_roughness']} μm to mitigate asperity micro-interlocking.",
            f"Regulate operating temperature below {opt_input['temperature']} °C to prevent thermal softening of the contact interface."
        ]

        return {
            "current_predicted_wear_mm3": round(curr_wear, 4),
            "optimized_predicted_wear_mm3": round(opt_wear, 4),
            "estimated_wear_reduction_percent": round(reduction_pct, 2),
            "current_parameters": current_input,
            "optimized_parameters": opt_input,
            "recommended_actions": actions,
            "disclaimer": "Model-based recommendation requiring experimental validation. Physical machinery constraints must be independently confirmed."
        }
