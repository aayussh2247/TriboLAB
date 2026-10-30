"""
Model A: Classical Archard Wear Law Baseline
Reference: Archard, J. F. (1953). "Contact and Rubbing of Flat Surfaces."
Journal of Applied Physics, 24(8), 981–988. DOI: 10.1063/1.1721448
"""

import numpy as np
from typing import Dict, Any, List, Tuple
from .units import (
    validate_positive, validate_range,
    M3_TO_MM3, MM3_TO_M3, GPA_TO_PA, PA_TO_GPA,
    M3_PER_NM_TO_MM3_PER_NM
)

class ArchardModel:
    """
    Classical Archard Adhesive Wear Model.
    Governing Equation:
        V = K * W * L / H
    Where:
        V: Wear Volume (m^3 internally, mm^3 in UI)
        K: Dimensionless Wear Coefficient
        W: Normal Load (N)
        L: Sliding Distance (m)
        H: Hardness of Softer Material (Pa internally, GPa in UI)
    """

    CITATION = {
        "title": "Contact and Rubbing of Flat Surfaces",
        "authors": "J. F. Archard",
        "year": 1953,
        "journal": "Journal of Applied Physics",
        "doi": "10.1063/1.1721448",
        "equation": "V = K * W * L / H (Eq. 7)"
    }

    ASSUMPTIONS = [
        "Purely plastic deformation at active asperity junctions (A_r = W / H)",
        "Hemispherical wear particle geometry of radius equal to junction radius",
        "Constant indentation hardness H independent of temperature and strain rate",
        "Constant detachment probability K throughout the contact life",
        "Immediate debris removal from the interface (no third-body layer)"
    ]

    LIMITATIONS = [
        "Dimensionless coefficient K varies by up to 4 orders of magnitude depending on lubrication and metallurgy",
        "Does not capture the run-in to steady-state transition",
        "Does not predict severe wear transition (scuffing/seizure) at high p*v",
        "Ignores surface roughness evolution during sliding"
    ]

    @staticmethod
    def compute_volume(normal_load_N: float, sliding_distance_m: float, hardness_Pa: float, wear_coeff_K: float) -> float:
        """
        Computes total wear volume in cubic meters (m^3).
        All inputs must be in SI units: N, m, Pa, [-].
        """
        validate_positive(normal_load_N, "normal_load_N", strictly_positive=False)
        validate_positive(sliding_distance_m, "sliding_distance_m", strictly_positive=False)
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)
        validate_range(wear_coeff_K, "wear_coeff_K", 0.0, 1.0)

        if normal_load_N == 0.0 or sliding_distance_m == 0.0 or wear_coeff_K == 0.0:
            return 0.0

        return (wear_coeff_K * normal_load_N * sliding_distance_m) / hardness_Pa

    @staticmethod
    def compute_volume_engineering(normal_load_N: float, sliding_distance_m: float, hardness_GPa: float, wear_coeff_K: float) -> Dict[str, Any]:
        """
        Convenience wrapper accepting hardness in GPa and returning results in mm^3.
        """
        hardness_Pa = hardness_GPa * GPA_TO_PA
        vol_m3 = ArchardModel.compute_volume(normal_load_N, sliding_distance_m, hardness_Pa, wear_coeff_K)
        vol_mm3 = vol_m3 * M3_TO_MM3
        
        wear_rate_m3_m = vol_m3 / sliding_distance_m if sliding_distance_m > 0 else 0.0
        wear_rate_mm3_m = vol_mm3 / sliding_distance_m if sliding_distance_m > 0 else 0.0
        
        kd_si = wear_coeff_K / hardness_Pa  # m^3 / (N * m) = Pa^-1
        kd_eng = kd_si * M3_PER_NM_TO_MM3_PER_NM  # mm^3 / (N * m)

        return {
            "wear_volume_m3": vol_m3,
            "wear_volume_mm3": round(vol_mm3, 6),
            "wear_rate_m3_per_m": wear_rate_m3_m,
            "wear_rate_mm3_per_m": round(wear_rate_mm3_m, 8),
            "dimensional_wear_coeff_si": kd_si,
            "dimensional_wear_coeff_mm3_per_Nm": kd_eng,
            "hardness_Pa": hardness_Pa,
            "inputs": {
                "normal_load_N": normal_load_N,
                "sliding_distance_m": sliding_distance_m,
                "hardness_GPa": hardness_GPa,
                "wear_coeff_K": wear_coeff_K
            },
            "formula": "V = (K * W * L) / H",
            "citation": ArchardModel.CITATION,
            "assumptions": ArchardModel.ASSUMPTIONS,
            "limitations": ArchardModel.LIMITATIONS
        }

    @staticmethod
    def compute_sensitivity(normal_load_N: float, sliding_distance_m: float, hardness_Pa: float, wear_coeff_K: float) -> Dict[str, float]:
        """
        Analytical partial derivatives:
        dV/dW = K * L / H
        dV/dL = K * W / H
        dV/dH = -K * W * L / H^2
        dV/dK = W * L / H
        """
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)
        base_v = (wear_coeff_K * normal_load_N * sliding_distance_m) / hardness_Pa
        
        dV_dW = (wear_coeff_K * sliding_distance_m) / hardness_Pa
        dV_dL = (wear_coeff_K * normal_load_N) / hardness_Pa
        dV_dH = -base_v / hardness_Pa
        dV_dK = (normal_load_N * sliding_distance_m) / hardness_Pa

        return {
            "dV_dW_m3_per_N": dV_dW,
            "dV_dL_m3_per_m": dV_dL,
            "dV_dH_m3_per_Pa": dV_dH,
            "dV_dK_m3": dV_dK,
            "normalized_elasticity_W": 1.0,   # linear
            "normalized_elasticity_L": 1.0,   # linear
            "normalized_elasticity_H": -1.0,  # inverse linear
            "normalized_elasticity_K": 1.0    # linear
        }

    @staticmethod
    def calibrate_K(wear_volumes_m3: np.ndarray, normal_loads_N: np.ndarray, sliding_distances_m: np.ndarray, hardnesses_Pa: np.ndarray) -> Tuple[float, float]:
        """
        Calibrates wear coefficient K from experimental or training data using ordinary least squares:
        Target: V_i = K * (W_i * L_i / H_i)
        Returns:
            calibrated_K: Optimal slope
            r_squared: Coefficient of determination
        """
        x = (normal_loads_N * sliding_distances_m) / hardnesses_Pa
        y = wear_volumes_m3
        
        # Fit through origin (V=0 when x=0 as dictated by physics)
        slope = np.sum(x * y) / np.sum(x * x)
        y_pred = slope * x
        
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r2 = 1.0 - (ss_res / ss_tot) if ss_tot > 0 else 1.0

        return float(slope), float(r2)
