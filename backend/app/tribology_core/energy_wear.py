"""
Model B: Energy-Based Wear Formulation
References:
1. Fouvry, S., Kapsa, P., & Vincent, L. (1996). "Quantification of fretting damage."
   Wear, 200(1-2), 186-205. DOI: 10.1016/S0043-1648(96)07306-1
2. Choudhry, J., Almqvist, A., & Larsson, R. (2024). "Improving Archard’s Wear Model: An Energy-Based Approach."
   Tribology Letters, 72(3), 93. DOI: 10.1007/s11249-024-01888-8
"""

import numpy as np
from typing import Dict, Any, List, Optional
from .units import (
    validate_positive, validate_range,
    M3_TO_MM3, MM3_TO_M3, M3_PER_J_TO_MM3_PER_J, MM3_PER_J_TO_M3_PER_J
)

class EnergyWearModel:
    """
    Thermodynamic Energy-Based Wear Model.
    Governing Equation (Fouvry 1996):
        V = alpha_wear * E_d
    Where:
        E_d = mu * W * L (Total dissipated frictional work, Joules)
        alpha_wear = Specific energy wear coefficient (m^3 / J)
        dh(x) = alpha_wear * tau(x) * ds = alpha_wear * mu * p(x) * ds
        
    Choudhry et al. (2024) Extension:
        Wear coefficient K scales nonlinearly with accumulated deformation energy U_def:
        K_eff = K_0 * (1 + beta * (U_def / U_crit)^m)
    """

    CITATION_FOUVRY = {
        "title": "Quantification of fretting damage",
        "authors": "S. Fouvry, P. Kapsa, L. Vincent",
        "year": 1996,
        "journal": "Wear",
        "doi": "10.1016/S0043-1648(96)07306-1",
        "equation": "V = alpha_wear * sum(E_d) (Eq. 2)"
    }

    CITATION_CHOUDHRY = {
        "title": "Improving Archard’s Wear Model: An Energy-Based Approach",
        "authors": "Jamal Choudhry, Andreas Almqvist, Roland Larsson",
        "year": 2024,
        "journal": "Tribology Letters",
        "doi": "10.1007/s11249-024-01888-8",
        "equation": "Energy-dependent wear coefficient coupled with boundary element deformation"
    }

    ASSUMPTIONS = [
        "Volumetric wear loss is directly proportional to friction work dissipated at the interface",
        "Coulomb friction applies locally: tau(x) = mu * p(x)",
        "Specific energy coefficient alpha_wear remains constant within a given lubrication regime",
        "Thermal radiation and remote elastic bulk absorption are negligible relative to local contact dissipation"
    ]

    LIMITATIONS = [
        "In partial-slip fretting contacts, non-sliding stick regions dissipate zero energy despite sustaining fatigue damage",
        "alpha_wear is sensitive to ambient environment (humidity, oxidation rate)",
        "Requires dynamic coefficient of friction measurement"
    ]

    @staticmethod
    def compute_dissipated_energy(normal_load_N: float, sliding_distance_m: float, friction_coeff: float) -> float:
        """
        Computes total dissipated friction energy in Joules (J = N * m).
        E_d = mu * W * L
        """
        validate_positive(normal_load_N, "normal_load_N", strictly_positive=False)
        validate_positive(sliding_distance_m, "sliding_distance_m", strictly_positive=False)
        validate_range(friction_coeff, "friction_coeff", 0.0, 2.5)

        return float(friction_coeff * normal_load_N * sliding_distance_m)

    @staticmethod
    def compute_volume(energy_dissipated_J: float, alpha_wear_m3_per_J: float) -> float:
        """
        Computes wear volume from dissipated energy:
        V = alpha_wear * E_d  (m^3)
        """
        validate_positive(energy_dissipated_J, "energy_dissipated_J", strictly_positive=False)
        validate_positive(alpha_wear_m3_per_J, "alpha_wear_m3_per_J", strictly_positive=False)

        return float(alpha_wear_m3_per_J * energy_dissipated_J)

    @staticmethod
    def archard_to_energy_coefficient(wear_coeff_K: float, hardness_Pa: float, friction_coeff: float) -> float:
        """
        Connects Archard wear coefficient K to energy wear coefficient alpha_wear:
        V_archard = K * W * L / H
        V_energy = alpha_wear * mu * W * L
        Equating volumes:
            alpha_wear = K / (mu * H)   [m^3 / J = Pa^-1]
        """
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)
        validate_positive(friction_coeff, "friction_coeff", strictly_positive=True)
        validate_range(wear_coeff_K, "wear_coeff_K", 0.0, 1.0)

        return float(wear_coeff_K / (friction_coeff * hardness_Pa))

    @staticmethod
    def choudhry_deformation_energy_wear_coeff(
        base_K0: float,
        accumulated_def_energy_J: float,
        critical_energy_J: float = 50.0,
        beta_scale: float = 0.35,
        power_m: float = 1.2
    ) -> float:
        """
        Implements Choudhry et al. (2024) deformation-energy dependent wear coefficient:
        K_eff = K_0 * [1 + beta * (U_def / U_crit)^m]
        """
        validate_positive(critical_energy_J, "critical_energy_J", strictly_positive=True)
        ratio = max(0.0, accumulated_def_energy_J / critical_energy_J)
        k_eff = base_K0 * (1.0 + beta_scale * (ratio ** power_m))
        return float(k_eff)

    @staticmethod
    def evaluate_energy_model(
        normal_load_N: float,
        sliding_distance_m: float,
        friction_coeff: float,
        alpha_wear_mm3_per_J: float,
        counterface_hardness_GPa: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Comprehensive evaluation returning both SI and engineering units,
        along with comparison to equivalent Archard baseline if hardness is provided.
        """
        alpha_si = alpha_wear_mm3_per_J * MM3_PER_J_TO_M3_PER_J
        ed_joules = EnergyWearModel.compute_dissipated_energy(normal_load_N, sliding_distance_m, friction_coeff)
        vol_m3 = EnergyWearModel.compute_volume(ed_joules, alpha_si)
        vol_mm3 = vol_m3 * M3_TO_MM3

        out = {
            "dissipated_energy_J": round(ed_joules, 2),
            "alpha_wear_mm3_per_J": alpha_wear_mm3_per_J,
            "alpha_wear_m3_per_J": alpha_si,
            "wear_volume_m3": vol_m3,
            "wear_volume_mm3": round(vol_mm3, 6),
            "wear_rate_mm3_per_m": round(vol_mm3 / sliding_distance_m, 8) if sliding_distance_m > 0 else 0.0,
            "formula": "V = alpha_wear * sum(E_d) where E_d = mu * W * L",
            "citation": EnergyWearModel.CITATION_FOUVRY,
            "assumptions": EnergyWearModel.ASSUMPTIONS,
            "limitations": EnergyWearModel.LIMITATIONS
        }

        if counterface_hardness_GPa is not None:
            h_pa = counterface_hardness_GPa * 1e9
            # Equivalent Archard K
            equiv_k = alpha_si * friction_coeff * h_pa
            out["equivalent_archard_K"] = round(equiv_k, 8)

        return out
