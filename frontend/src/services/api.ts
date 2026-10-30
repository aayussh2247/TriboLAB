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

// --- SHAP Explainability Interfaces ---
export interface ShapStatusResponse {
  model_name: string;
  model_type: string;
  target: string;
  target_unit: string;
  available_targets: string[];
  model_loaded: boolean;
  shap_loaded: boolean;
  explainer_type: string;
  explained_samples_count: number;
  background_dataset_size: number;
  feature_count_raw: number;
  feature_count_transformed: number;
  features_raw: string[];
  features_transformed: string[];
  last_explanation_timestamp: string;
  computation_duration_ms: number;
  cache_active: boolean;
  warnings_or_errors: string[];
}

export interface FeatureImportanceItem {
  feature: string;
  display_name: string;
  mean_abs_shap: number;
  rank: number;
  physical_unit: string;
}

export interface GlobalImportanceResponse {
  target: string;
  target_unit: string;
  sample_count: number;
  features: FeatureImportanceItem[];
  computation_duration_ms: number;
  disclaimer: string;
}

export interface BeeswarmSamplePoint {
  sample_index: number;
  feature: string;
  feature_value: number;
  feature_value_norm: number;
  shap_value: number;
}

export interface BeeswarmResponse {
  target: string;
  target_unit: string;
  sample_count: number;
  features_ordered: string[];
  sample_points: BeeswarmSamplePoint[];
  plot_image_base64?: string;
  computation_duration_ms: number;
}

export interface WaterfallStep {
  feature: string;
  display_name: string;
  actual_value?: number;
  display_value: string;
  shap_value: number;
  cumulative_value: number;
  impact: string;
}

export interface WaterfallResponse {
  target: string;
  target_unit: string;
  expected_value: number;
  predicted_value: number;
  sum_of_shap_values: number;
  additivity_diff: number;
  additivity_verified: boolean;
  explanation_source: string;
  steps: WaterfallStep[];
  explanation_summary: string;
  plot_image_base64?: string;
  computation_duration_ms: number;
}

export interface DependenceResponse {
  target: string;
  target_unit: string;
  primary_feature: string;
  primary_unit: string;
  interaction_feature?: string;
  interaction_unit?: string;
  x_values: number[];
  y_shap_values: number[];
  interaction_values?: number[];
  sample_count: number;
  tribological_note: string;
  plot_image_base64?: string;
  computation_duration_ms: number;
}

export interface ForcePlotResponse {
  target: string;
  target_unit: string;
  base_value: number;
  prediction_value: number;
  positive_features: Array<{
    feature: string;
    display_name: string;
    display_value: string;
    shap_value: number;
    magnitude: number;
  }>;
  negative_features: Array<{
    feature: string;
    display_name: string;
    display_value: string;
    shap_value: number;
    magnitude: number;
  }>;
  explanation_summary: string;
}

export interface InteractionResponse {
  target: string;
  target_unit: string;
  feature_1: string;
  feature_2: string;
  tribological_mechanism: string;
  correlation: number;
  joint_effect_summary: string;
  sample_data: Array<Record<string, any>>;
}

export interface EvaluationSampleItem {
  index: number;
  actual_wear: number;
  predicted_wear: number;
  residual_error: number;
  operating_conditions: Record<string, any>;
}

export interface ValidationTestResult {
  test_name: string;
  status: "PASSED" | "FAILED";
  details: string;
  numeric_tolerance?: number;
  measured_error?: number;
}

export interface ValidationSuiteResponse {
  target: string;
  timestamp: string;
  all_passed: boolean;
  tests: ValidationTestResult[];
}

export interface HardwareStatusOutput {
  device_type: string;
  gpu_detected: boolean;
  gpu_name: string;
  cuda_version: string;
  driver_version: string;
  vram_total_mb?: number;
  vram_used_mb?: number;
  vram_total_gb?: number;
  vram_used_gb?: number;
  vram_percent?: number;
  gpu_temperature_c: number;
  gpu_utilization_percent?: number;
  power_state: string;
  compute_capability: string;
  host_cpu: string;
  cpu_cores_threads?: string;
  cpu_usage_percent?: number;
  cpu_temperature_c?: number;
  host_os: string;
  os_build?: string;
  cpu_count_logical: number;
  cpu_count_physical: number;
  total_ram_gb: number;
  used_ram_gb?: number;
  available_ram_gb?: number;
  ram_usage_percent: number;
  total_disk_gb?: number;
  used_disk_gb?: number;
  disk_usage_percent?: number;
  ml_backend: string;
  optimizer: string;
  xai_engine: string;
  service_status: string;
  uptime?: string;
  latency_ms?: number;
  status_code?: number;
}

const API_BASE = "http://127.0.0.1:8000";

export const apiService = {
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getHardwareStatus(): Promise<HardwareStatusOutput> {
    const res = await fetch(`${API_BASE}/hardware-status`);
    if (!res.ok) throw new Error("Failed to load hardware telemetry");
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
  },

  // --- SHAP Explainability Service Methods ---
  async getShapStatus(): Promise<ShapStatusResponse> {
    const res = await fetch(`${API_BASE}/shap/status`);
    if (!res.ok) throw new Error("Failed to load SHAP status");
    return res.json();
  },

  async getShapEvaluationSamples(limit = 50): Promise<EvaluationSampleItem[]> {
    const res = await fetch(`${API_BASE}/shap/evaluation-samples?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to load evaluation samples");
    return res.json();
  },

  async getShapGlobalImportance(target = "wear_volume", sampleSize = 300, topK?: number): Promise<GlobalImportanceResponse> {
    let url = `${API_BASE}/shap/global-importance?target=${target}&sample_size=${sampleSize}`;
    if (topK) url += `&top_k=${topK}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load global SHAP importance");
    return res.json();
  },

  async getShapBeeswarm(target = "wear_volume", sampleSize = 250): Promise<BeeswarmResponse> {
    const res = await fetch(`${API_BASE}/shap/beeswarm?target=${target}&sample_size=${sampleSize}`);
    if (!res.ok) throw new Error("Failed to compute SHAP beeswarm summary");
    return res.json();
  },

  async explainShapWaterfall(data: {
    target: string;
    sample_index?: number;
    custom_input?: WearPredictionInput;
  }): Promise<WaterfallResponse> {
    const res = await fetch(`${API_BASE}/shap/waterfall`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to compute SHAP waterfall attribution");
    return res.json();
  },

  async getShapDependence(
    featureName: string,
    interactionFeature?: string,
    target = "wear_volume",
    sampleSize = 300
  ): Promise<DependenceResponse> {
    let url = `${API_BASE}/shap/dependence?feature_name=${encodeURIComponent(featureName)}&target=${target}&sample_size=${sampleSize}`;
    if (interactionFeature) {
      url += `&interaction_feature=${encodeURIComponent(interactionFeature)}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to compute SHAP dependence plot");
    return res.json();
  },

  async getShapForce(data: {
    target: string;
    sample_index?: number;
    custom_input?: WearPredictionInput;
  }): Promise<ForcePlotResponse> {
    const res = await fetch(`${API_BASE}/shap/force`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to compute SHAP force decomposition");
    return res.json();
  },

  async getShapInteraction(feature1: string, feature2: string, target = "wear_volume"): Promise<InteractionResponse> {
    const url = `${API_BASE}/shap/interaction?feature_1=${encodeURIComponent(feature1)}&feature_2=${encodeURIComponent(feature2)}&target=${target}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to analyze SHAP feature interaction");
    return res.json();
  },

  async runShapValidationTests(target = "wear_volume"): Promise<ValidationSuiteResponse> {
    const res = await fetch(`${API_BASE}/shap/validation-tests?target=${target}`);
    if (!res.ok) throw new Error("Failed to execute SHAP validation suite");
    return res.json();
  },

  getExportImportanceCsvUrl(target = "wear_volume"): string {
    return `${API_BASE}/shap/export/importance-csv?target=${target}`;
  },

  getExportSamplesCsvUrl(target = "wear_volume", sampleSize = 200): string {
    return `${API_BASE}/shap/export/samples-csv?target=${target}&sample_size=${sampleSize}`;
  },

  async exportResearchReport(target = "wear_volume", sampleIndex = 0): Promise<string> {
    const res = await fetch(`${API_BASE}/shap/export/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, sample_index: sampleIndex })
    });
    if (!res.ok) throw new Error("Failed to generate research report");
    return res.text();
  },

  // --- Scientific Multi-Model & 10-Panel Visualization Endpoints ---
  async getAll10ResearchPlots(params?: {
    normal_load?: number;
    sliding_speed?: number;
    hardness?: number;
    friction_coeff?: number;
    wear_coeff_K?: number;
  }): Promise<any> {
    const query = new URLSearchParams();
    if (params?.normal_load !== undefined) query.set("normal_load", params.normal_load.toString());
    if (params?.sliding_speed !== undefined) query.set("sliding_speed", params.sliding_speed.toString());
    if (params?.hardness !== undefined) query.set("hardness", params.hardness.toString());
    if (params?.friction_coeff !== undefined) query.set("friction_coeff", params.friction_coeff.toString());
    if (params?.wear_coeff_K !== undefined) query.set("wear_coeff_K", params.wear_coeff_K.toString());

    const res = await fetch(`${API_BASE}/api/tribology/visualizations/all-10-plots?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch 10-panel research plots");
    return res.json();
  },

  async getScientificTraceability(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/tribology/literature`);
    if (!res.ok) throw new Error("Failed to fetch scientific literature traceability");
    return res.json();
  },

  async getHybridBenchmarkMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/tribology/models/hybrid-benchmark`);
    if (!res.ok) throw new Error("Failed to fetch hybrid benchmark metrics");
    return res.json();
  },

  getDownloadPublicationFigureUrl(): string {
    return `${API_BASE}/api/tribology/visualizations/download-publication-figure`;
  }
};
