"""
Pydantic Schemas for Tribology API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WearPredictionInput(BaseModel):
    normal_load: float = Field(..., ge=1.0, le=2000.0, description="Normal Load W in Newtons (N)")
    sliding_speed: float = Field(..., ge=0.01, le=20.0, description="Sliding Speed v in m/s")
    surface_roughness: float = Field(..., ge=0.05, le=20.0, description="Surface Roughness Ra in micrometers (μm)")
    sliding_distance: float = Field(..., ge=1.0, le=50000.0, description="Sliding Distance L in meters (m)")
    hardness: float = Field(..., ge=0.1, le=25.0, description="Material Hardness H in GPa")
    friction_coeff: Optional[float] = Field(None, ge=0.01, le=1.5, description="Coefficient of Friction μ")
    temperature: float = Field(..., ge=0.0, le=500.0, description="Ambient / bulk contact temperature in °C")
    lubrication: int = Field(..., ge=0, le=1, description="Lubrication State: 0 = Dry, 1 = Lubricated")
    material_pair: str = Field(default="Steel-Steel", description="Material Pair combination")
    wear_coefficient: Optional[float] = Field(None, ge=1e-8, le=1e-2, description="Empirical wear coefficient K")

class WearPredictionOutput(BaseModel):
    predicted_wear_volume_mm3: float
    predicted_wear_rate_mm3_m: float
    archard_theoretical_wear_mm3: float
    wear_risk_category: str
    contact_pressure_mpa: float
    computed_friction_coeff: float
    computed_wear_coefficient: float
    model_name: str
    input_summary: Dict[str, Any]

class ArchardCalculationInput(BaseModel):
    normal_load: float = Field(..., ge=1.0, description="Normal Load W in Newtons (N)")
    sliding_distance: float = Field(..., ge=1.0, description="Sliding Distance L in meters (m)")
    hardness: float = Field(..., ge=0.1, description="Hardness H in GPa")
    wear_coefficient: float = Field(..., ge=1e-8, le=1e-2, description="Dimensionless Archard wear coefficient K")

class ArchardCalculationOutput(BaseModel):
    theoretical_wear_volume_mm3: float
    theoretical_wear_rate_mm3_m: float
    archard_formula: str
    variables_used: Dict[str, float]

class ShapExplanationInput(WearPredictionInput):
    pass

class ShapExplanationOutput(BaseModel):
    base_value: float
    prediction_value: float
    feature_contributions: List[Dict[str, Any]]
    explanation_summary: str

class OptimizationInput(BaseModel):
    current_conditions: WearPredictionInput
    fixed_parameters: Optional[List[str]] = Field(default=["material_pair", "sliding_distance"], description="Features that should not be altered during optimization")
    target_reduction_percent: Optional[float] = Field(default=50.0, ge=10.0, le=95.0)

class OptimizationOutput(BaseModel):
    current_predicted_wear_mm3: float
    optimized_predicted_wear_mm3: float
    estimated_wear_reduction_percent: float
    current_parameters: Dict[str, Any]
    optimized_parameters: Dict[str, Any]
    recommended_actions: List[str]
    disclaimer: str

class WhatIfSweepInput(BaseModel):
    base_conditions: WearPredictionInput
    sweep_parameter: str = Field(..., description="Parameter to vary: normal_load, sliding_speed, surface_roughness, hardness, temperature")
    min_value: float
    max_value: float
    steps: int = Field(default=15, ge=5, le=50)

class WhatIfSweepOutput(BaseModel):
    sweep_parameter: str
    sweep_values: List[float]
    predicted_wear_values: List[float]
    archard_wear_values: List[float]
