export interface WearPredictionInput {
  normal_load: number;
  sliding_speed: number;
  surface_roughness: number;
  sliding_distance: number;
  hardness: number;
  friction_coeff?: number;
  temperature: number;
  lubrication: number;
  material_pair?: string;
  wear_coefficient?: number;
}

export interface WearPredictionOutput {
  predicted_wear_volume_mm3: number;
  predicted_wear_rate_mm3_m: number;
  archard_theoretical_wear_mm3: number;
  wear_risk_category: string;
  contact_pressure_mpa: number;
  computed_friction_coeff: number;
  computed_wear_coefficient: number;
  model_name: string;
  input_summary: Record<string, any>;
}

export interface ArchardCalculationInput {
  normal_load: number;
  sliding_distance: number;
  hardness: number;
  wear_coefficient: number;
}

export interface ArchardCalculationOutput {
  theoretical_wear_volume_mm3: number;
  theoretical_wear_rate_mm3_m: number;
  archard_formula: string;
  variables_used: Record<string, number>;
}

export interface ShapExplanationOutput {
  base_value: number;
  prediction_value: number;
  feature_contributions: Array<{
    feature: string;
    shap_value: number;
    impact: string;
    magnitude: number;
  }>;
  explanation_summary: string;
}

export interface OptimizationOutput {
  current_predicted_wear_mm3: number;
  optimized_predicted_wear_mm3: number;
  estimated_wear_reduction_percent: number;
  current_parameters: Record<string, any>;
  optimized_parameters: Record<string, any>;
  recommended_actions: string[];
  disclaimer: string;
}

export interface WhatIfSweepOutput {
  sweep_parameter: string;
  sweep_values: number[];
  predicted_wear_values: number[];
  archard_wear_values: number[];
}

export interface ModelPerformanceData {
  best_model_name: string;
  best_model_metrics: {
    cv_r2_mean: number;
    cv_r2_std: number;
    test_mae: number;
    test_rmse: number;
    test_r2: number;
    test_mape_percent: number;
  };
  all_models_comparison: Record<string, {
    cv_r2_mean: number;
    cv_r2_std: number;
    test_mae: number;
    test_rmse: number;
    test_r2: number;
    test_mape_percent: number;
  }>;
  dataset_sample_count: number;
}

const API_BASE = "http://127.0.0.1:8000";

export const apiService = {
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async predictWear(data: WearPredictionInput): Promise<WearPredictionOutput> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to compute wear prediction");
    return res.json();
  },

  async calculateArchard(data: ArchardCalculationInput): Promise<ArchardCalculationOutput> {
    const res = await fetch(`${API_BASE}/archard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to calculate Archard wear");
    return res.json();
  },

  async explainPrediction(data: WearPredictionInput): Promise<ShapExplanationOutput> {
    const res = await fetch(`${API_BASE}/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to compute SHAP values");
    return res.json();
  },

  async optimizeConditions(current: WearPredictionInput): Promise<OptimizationOutput> {
    const res = await fetch(`${API_BASE}/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_conditions: current })
    });
    if (!res.ok) throw new Error("Failed to execute optimization");
    return res.json();
  },

  async whatIfSweep(data: {
    base_conditions: WearPredictionInput;
    sweep_parameter: string;
    min_value: number;
    max_value: number;
    steps?: number;
  }): Promise<WhatIfSweepOutput> {
    const res = await fetch(`${API_BASE}/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to execute parameter sweep");
    return res.json();
  },

  async getModelPerformance(): Promise<ModelPerformanceData> {
    const res = await fetch(`${API_BASE}/model-performance`);
    if (!res.ok) throw new Error("Failed to load model performance");
    return res.json();
  },

  async getFeatureImportance() {
    const res = await fetch(`${API_BASE}/feature-importance`);
    return res.json();
  },

  async getDatasetSummary() {
    const res = await fetch(`${API_BASE}/dataset-summary`);
    return res.json();
  }
};
