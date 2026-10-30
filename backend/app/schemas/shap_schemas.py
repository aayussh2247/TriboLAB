"""
Pydantic Schemas for SHAP Explainability in Tribology AI Application
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from backend.app.schemas.wear_schemas import WearPredictionInput

class ShapStatusResponse(BaseModel):
    model_name: str
    model_type: str
    target: str
    target_unit: str
    available_targets: List[str]
    model_loaded: bool
    shap_loaded: bool
    explainer_type: str
    explained_samples_count: int
    background_dataset_size: int
    feature_count_raw: int
    feature_count_transformed: int
    features_raw: List[str]
    features_transformed: List[str]
    last_explanation_timestamp: str
    computation_duration_ms: float
    cache_active: bool
    warnings_or_errors: List[str]

class FeatureImportanceItem(BaseModel):
    feature: str
    display_name: str
    mean_abs_shap: float
    rank: int
    physical_unit: str

class GlobalImportanceResponse(BaseModel):
    target: str
    target_unit: str
    sample_count: int
    features: List[FeatureImportanceItem]
    computation_duration_ms: float
    disclaimer: str

class BeeswarmSamplePoint(BaseModel):
    sample_index: int
    feature: str
    feature_value: float
    feature_value_norm: float  # 0.0 to 1.0 for color mapping
    shap_value: float

class BeeswarmResponse(BaseModel):
    target: str
    target_unit: str
    sample_count: int
    features_ordered: List[str]
    sample_points: List[BeeswarmSamplePoint]
    plot_image_base64: Optional[str] = None
    computation_duration_ms: float

class WaterfallStep(BaseModel):
    feature: str
    display_name: str
    actual_value: Optional[float]
    display_value: str
    shap_value: float
    cumulative_value: float
    impact: str  # "Increases Wear" or "Decreases Wear"

class WaterfallRequest(BaseModel):
    target: str = Field(default="wear_volume", description="wear_volume or wear_rate")
    sample_index: Optional[int] = Field(default=None, description="Index from holdout evaluation set")
    custom_input: Optional[WearPredictionInput] = Field(default=None, description="Custom conditions from UI")

class WaterfallResponse(BaseModel):
    target: str
    target_unit: str
    expected_value: float
    predicted_value: float
    sum_of_shap_values: float
    additivity_diff: float
    additivity_verified: bool
    explanation_source: str  # e.g. "Evaluation Sample #42" or "Custom UI Input"
    steps: List[WaterfallStep]
    explanation_summary: str
    plot_image_base64: Optional[str] = None
    computation_duration_ms: float

class DependenceResponse(BaseModel):
    target: str
    target_unit: str
    primary_feature: str
    primary_unit: str
    interaction_feature: Optional[str]
    interaction_unit: Optional[str]
    x_values: List[float]
    y_shap_values: List[float]
    interaction_values: Optional[List[float]] = None
    sample_count: int
    tribological_note: str
    plot_image_base64: Optional[str] = None
    computation_duration_ms: float

class ForcePlotResponse(BaseModel):
    target: str
    target_unit: str
    base_value: float
    prediction_value: float
    positive_features: List[Dict[str, Any]]
    negative_features: List[Dict[str, Any]]
    explanation_summary: str

class InteractionResponse(BaseModel):
    target: str
    target_unit: str
    feature_1: str
    feature_2: str
    tribological_mechanism: str
    correlation: float
    joint_effect_summary: str
    sample_data: List[Dict[str, Any]]

class EvaluationSampleItem(BaseModel):
    index: int
    actual_wear: float
    predicted_wear: float
    residual_error: float
    operating_conditions: Dict[str, Any]

class ValidationTestResult(BaseModel):
    test_name: str
    status: str  # "PASSED" or "FAILED"
    details: str
    numeric_tolerance: Optional[float] = None
    measured_error: Optional[float] = None

class ValidationSuiteResponse(BaseModel):
    target: str
    timestamp: str
    all_passed: bool
    tests: List[ValidationTestResult]
