"""
Units and Physical Dimension Standards for Tribological Modeling
Provides rigorous SI conversions, validation of physical bounds, and dimensional consistency checks.
"""

from typing import Any, Dict

# Conversion factors to standard SI units
GPA_TO_PA = 1e9
MPA_TO_PA = 1e6
PA_TO_GPA = 1e-9
PA_TO_MPA = 1e-6

MM_TO_M = 1e-3
UM_TO_M = 1e-6
M_TO_MM = 1e3
M_TO_UM = 1e6

MM3_TO_M3 = 1e-9
M3_TO_MM3 = 1e9

MM3_PER_NM_TO_M3_PER_NM = 1e-9
M3_PER_NM_TO_MM3_PER_NM = 1e9

MM3_PER_J_TO_M3_PER_J = 1e-9
M3_PER_J_TO_MM3_PER_J = 1e9

def validate_positive(value: float, name: str, strictly_positive: bool = True) -> float:
    """Validates that a physical input is non-negative or strictly positive."""
    if strictly_positive:
        if value <= 0.0:
            raise ValueError(f"Physical parameter '{name}' must be strictly positive (> 0), got: {value}")
    else:
        if value < 0.0:
            raise ValueError(f"Physical parameter '{name}' cannot be negative, got: {value}")
    return float(value)

def validate_range(value: float, name: str, min_val: float, max_val: float) -> float:
    """Validates that a physical quantity lies within an acceptable physical envelope."""
    if not (min_val <= value <= max_val):
        raise ValueError(
            f"Physical parameter '{name}' = {value} is outside physically realistic range [{min_val}, {max_val}]"
        )
    return float(value)

def convert_input_to_si(inputs: Dict[str, Any]) -> Dict[str, float]:
    """
    Normalizes mixed engineering units into standard SI units.
    Expected incoming units:
      - normal_load: N
      - sliding_distance: m
      - hardness: GPa (or Pa if > 1e6)
      - sliding_speed: m/s
      - surface_roughness: um
      - temperature: deg C
    """
    normal_load = validate_positive(inputs.get("normal_load", 100.0), "normal_load", strictly_positive=False)
    sliding_distance = validate_positive(inputs.get("sliding_distance", 1000.0), "sliding_distance", strictly_positive=False)
    
    raw_h = validate_positive(inputs.get("hardness", 4.0), "hardness", strictly_positive=True)
    hardness_pa = raw_h if raw_h > 1e6 else raw_h * GPA_TO_PA
    
    sliding_speed = validate_positive(inputs.get("sliding_speed", 1.0), "sliding_speed", strictly_positive=False)
    
    raw_ra = validate_positive(inputs.get("surface_roughness", 1.0), "surface_roughness", strictly_positive=False)
    roughness_m = raw_ra * UM_TO_M if raw_ra < 1e-2 else raw_ra
    
    temp_c = inputs.get("temperature", 25.0)
    validate_range(temp_c, "temperature", -50.0, 1000.0)
    
    return {
        "normal_load_N": normal_load,
        "sliding_distance_m": sliding_distance,
        "hardness_Pa": hardness_pa,
        "sliding_speed_m_s": sliding_speed,
        "surface_roughness_m": roughness_m,
        "temperature_C": float(temp_c)
    }
