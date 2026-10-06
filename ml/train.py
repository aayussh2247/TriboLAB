"""
Machine Learning Training, Validation, Explainability, and Evaluation Pipeline
for Adhesive Wear Prediction in Tribology.

Models trained and compared:
1. Linear Regression (Baseline)
2. Random Forest Regressor
3. Gradient Boosting Regressor
4. XGBoost Regressor

Outputs:
- models/best_model.pkl
- models/preprocessor.pkl
- models/model_metadata.json
- outputs/model_evaluation/evaluation_plots.png
- outputs/model_evaluation/metrics_comparison.json
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb
import shap

def train_and_evaluate(
    data_path: str = "data/synthetic_wear_dataset.csv",
    models_dir: str = "models",
    outputs_dir: str = "outputs/model_evaluation",
    random_seed: int = 42
):
    print(">>> Loading dataset from:", data_path)
    df = pd.read_csv(data_path)
    print(f"Dataset loaded: {df.shape[0]} samples, {df.shape[1]} columns.")

    # Define Feature Sets
    # Note: wear_volume is the primary prediction target.
    # archard_theoretical_wear and wear_rate are derived/target columns, excluded from training inputs to prevent leakage
    feature_cols = [
        "normal_load",
        "sliding_speed",
        "surface_roughness",
        "sliding_distance",
        "hardness",
        "friction_coeff",
        "temperature",
        "lubrication",
        "contact_pressure",
        "wear_coefficient",
        "material_pair"
    ]
    target_col = "wear_volume"

    X = df[feature_cols]
    y = df[target_col]

    # Preprocessing Pipeline
    numeric_features = [
        "normal_load", "sliding_speed", "surface_roughness",
        "sliding_distance", "hardness", "friction_coeff",
        "temperature", "contact_pressure", "wear_coefficient"
    ]
    categorical_features = ["material_pair"]
    binary_features = ["lubrication"]

    # Train / Test Split (80% Train, 20% Holdout Test)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=random_seed
    )
    print(f"Train set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(drop="first", sparse_output=False), categorical_features),
            ("bin", "passthrough", binary_features)
        ],
        remainder="drop"
    )

    # Models definition
    candidate_models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=150, max_depth=14, min_samples_split=4, random_state=random_seed, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=180, learning_rate=0.08, max_depth=6, random_state=random_seed
        ),
        "XGBoost": xgb.XGBRegressor(
            n_estimators=200, learning_rate=0.07, max_depth=6, subsample=0.85,
            random_state=random_seed, n_jobs=-1
        )
    }

    results = {}
    fitted_pipelines = {}
    best_model_name = None
    best_test_r2 = -float("inf")

    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(outputs_dir, exist_ok=True)

    print("\n--- Model Training & Cross-Validation ---")
    kf = KFold(n_splits=5, shuffle=True, random_state=random_seed)

    for name, model in candidate_models.items():
        pipe = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("regressor", model)
        ])

        # 5-Fold Cross-Validation on Training set
        cv_scores = cross_val_score(pipe, X_train, y_train, cv=kf, scoring="r2", n_jobs=-1)
        cv_r2_mean = float(np.mean(cv_scores))
        cv_r2_std = float(np.std(cv_scores))

        # Fit on full train set
        pipe.fit(X_train, y_train)
        fitted_pipelines[name] = pipe

        # Test evaluation
        y_pred = pipe.predict(X_test)
        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))
        
        # Mean Absolute Percentage Error (MAPE)
        mape = float(np.mean(np.abs((y_test - y_pred) / np.maximum(y_test, 1e-4))) * 100.0)

        results[name] = {
            "cv_r2_mean": cv_r2_mean,
            "cv_r2_std": cv_r2_std,
            "test_mae": mae,
            "test_rmse": rmse,
            "test_r2": r2,
            "test_mape_percent": mape
        }

        print(f"[{name}] Test R²: {r2:.4f} | RMSE: {rmse:.4f} mm³ | MAE: {mae:.4f} mm³ | CV R²: {cv_r2_mean:.4f} (±{cv_r2_std:.4f})")

        if r2 > best_test_r2:
            best_test_r2 = r2
            best_model_name = name

    print(f"\n>>> Best Performing Model: {best_model_name} (Test R² = {best_test_r2:.4f})")

    # Save Best Model Pipeline
    best_pipe = fitted_pipelines[best_model_name]
    best_model_path = os.path.join(models_dir, "best_model.pkl")
    joblib.dump(best_pipe, best_model_path)
    print(f"Saved best model pipeline to: {best_model_path}")

    # Extract Preprocessed Feature Names for Interpretability & SHAP
    preprocessor_fitted = best_pipe.named_steps["preprocessor"]
    cat_encoder = preprocessor_fitted.named_transformers_["cat"]
    cat_cols_encoded = list(cat_encoder.get_feature_names_out(categorical_features))
    transformed_feature_names = numeric_features + cat_cols_encoded + binary_features

    # Fit a dedicated SHAP explainer on the best model's regressor
    print("\n--- Fitting SHAP Explainer ---")
    regressor = best_pipe.named_steps["regressor"]
    X_train_trans = preprocessor_fitted.transform(X_train)
    X_test_trans = preprocessor_fitted.transform(X_test)

    # Use TreeExplainer for tree-based models, otherwise LinearExplainer
    if best_model_name in ["XGBoost", "Random Forest", "Gradient Boosting"]:
        # TreeExplainer is exact and ultra-fast
        shap_explainer = shap.TreeExplainer(regressor)
    else:
        shap_explainer = shap.LinearExplainer(regressor, X_train_trans)

    explainer_path = os.path.join(models_dir, "shap_explainer.pkl")
    joblib.dump(shap_explainer, explainer_path)
    print(f"Saved SHAP explainer to: {explainer_path}")

    # Calculate global SHAP values on test sample
    sample_size = min(300, len(X_test_trans))
    shap_vals = shap_explainer.shap_values(X_test_trans[:sample_size])
    mean_abs_shap = np.mean(np.abs(shap_vals), axis=0)

    shap_importance = dict(sorted(
        zip(transformed_feature_names, [float(v) for v in mean_abs_shap]),
        key=lambda item: item[1],
        reverse=True
    ))

    # Save Model Metadata
    metadata = {
        "model_name": best_model_name,
        "features_raw": feature_cols,
        "features_transformed": transformed_feature_names,
        "target": target_col,
        "metrics_all_models": results,
        "best_model_metrics": results[best_model_name],
        "shap_global_importance": shap_importance,
        "random_seed": random_seed,
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "dataset_path": data_path
    }

    metadata_path = os.path.join(models_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved model metadata to: {metadata_path}")

    # Save Metrics Comparison JSON
    metrics_path = os.path.join(outputs_dir, "metrics_comparison.json")
    with open(metrics_path, "w") as f:
        json.dump(results, f, indent=2)

    # Generate Research Visualization Plots
    print("\n--- Generating Scientific Evaluation Plots ---")
    fig, axes = plt.subplots(2, 2, figsize=(14, 11))
    plt.subplots_adjust(hspace=0.3, wspace=0.25)

    # 1. Actual vs Predicted (Best Model)
    y_test_pred = best_pipe.predict(X_test)
    ax1 = axes[0, 0]
    ax1.scatter(y_test, y_test_pred, alpha=0.5, color="#0284c7", edgecolors="none", s=25)
    min_val = min(y_test.min(), y_test_pred.min())
    max_val = max(y_test.max(), y_test_pred.max())
    ax1.plot([min_val, max_val], [min_val, max_val], "r--", lw=2, label="Perfect 1:1 Fit")
    ax1.set_xlabel("Actual Wear Volume ($mm^3$)", fontsize=11)
    ax1.set_ylabel("Predicted Wear Volume ($mm^3$)", fontsize=11)
    ax1.set_title(f"Actual vs. Predicted ({best_model_name}) | $R^2 = {best_test_r2:.4f}$", fontsize=12, fontweight="bold")
    ax1.legend()
    ax1.grid(True, linestyle=":", alpha=0.6)

    # 2. Residuals Distribution
    ax2 = axes[0, 1]
    residuals = y_test - y_test_pred
    sns.histplot(residuals, kde=True, ax=ax2, color="#059669", bins=30)
    ax2.axvline(0, color="red", linestyle="--", lw=1.5)
    ax2.set_xlabel("Residual Error (Actual - Predicted) [$mm^3$]", fontsize=11)
    ax2.set_ylabel("Frequency", fontsize=11)
    ax2.set_title(f"Residual Distribution (Mean Error: {np.mean(residuals):.4f})", fontsize=12, fontweight="bold")
    ax2.grid(True, linestyle=":", alpha=0.6)

    # 3. Model Comparison Bar Chart (R² and RMSE)
    ax3 = axes[1, 0]
    model_names_list = list(results.keys())
    r2_scores = [results[m]["test_r2"] for m in model_names_list]
    colors = ["#38bdf8" if m == best_model_name else "#94a3b8" for m in model_names_list]
    bars = ax3.barh(model_names_list, r2_scores, color=colors, height=0.5)
    ax3.set_xlim(0, 1.05)
    ax3.set_xlabel("Holdout Test $R^2$ Score", fontsize=11)
    ax3.set_title("Model Performance Comparison ($R^2$ Metric)", fontsize=12, fontweight="bold")
    for bar in bars:
        width = bar.get_width()
        ax3.text(width + 0.02, bar.get_y() + bar.get_height()/2, f"{width:.3f}", va="center", fontsize=10, fontweight="bold")
    ax3.grid(True, linestyle=":", alpha=0.6, axis="x")

    # 4. Global Feature Importance (Top Features)
    ax4 = axes[1, 1]
    top_feats = list(shap_importance.keys())[:8]
    top_vals = [shap_importance[k] for k in top_feats]
    ax4.barh(top_feats[::-1], top_vals[::-1], color="#6366f1", height=0.55)
    ax4.set_xlabel("Mean Absolute SHAP Value (Impact on Wear)", fontsize=11)
    ax4.set_title("Top Feature Tribological Impact (SHAP Global)", fontsize=12, fontweight="bold")
    ax4.grid(True, linestyle=":", alpha=0.6, axis="x")

    plot_save_path = os.path.join(outputs_dir, "evaluation_plots.png")
    plt.tight_layout()
    plt.savefig(plot_save_path, dpi=300)
    plt.close()
    print(f"Saved evaluation plots to: {plot_save_path}")

    # Synchronize models and outputs to both target paths
    if "AI" in data_path:
        sync_target = "D:/ADHESIVE WEAR PREDCITON"
    else:
        sync_target = "D:/AI/projects/adhesive_wear_ai"
    
    os.makedirs(os.path.join(sync_target, "models"), exist_ok=True)
    os.makedirs(os.path.join(sync_target, "outputs/model_evaluation"), exist_ok=True)
    joblib.dump(best_pipe, os.path.join(sync_target, "models/best_model.pkl"))
    joblib.dump(shap_explainer, os.path.join(sync_target, "models/shap_explainer.pkl"))
    with open(os.path.join(sync_target, "models/model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)
    with open(os.path.join(sync_target, "outputs/model_evaluation/metrics_comparison.json"), "w") as f:
        json.dump(results, f, indent=2)

    return metadata

if __name__ == "__main__":
    train_and_evaluate(
        data_path="D:/ADHESIVE WEAR PREDCITON/data/synthetic_wear_dataset.csv",
        models_dir="D:/ADHESIVE WEAR PREDCITON/models",
        outputs_dir="D:/ADHESIVE WEAR PREDCITON/outputs/model_evaluation"
    )
