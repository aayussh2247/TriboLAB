"""
Model D: Third-Body Wear Formulation
Reference: Fillot, N., Iordanoff, I., & Berthier, Y. (2007). "Wear modeling and the third body concept."
Wear, 262(7–8), 949–957. DOI: 10.1016/j.wear.2006.10.011
"""

import numpy as np
from typing import Dict, Any, List, Tuple
from .units import validate_positive, validate_range, M3_TO_MM3

class ThirdBodyModel:
    """
    Third-Body Tribological Circuit and Mass Balance Model.
    
    Governing Mass Balance Equation:
        dM_3B / dt = Q_s(t) - Q_e(t)
        
    Where:
        M_3B(t): Trapped third-body debris mass inside contact (kg)
        Q_s(t): Source flow (mass detached from first bodies into debris bed, kg/s)
                Q_s(t) = Q_s0 * exp(-beta_screen * (M_3B / M_max))
        Q_e(t): Ejection flow (mass permanently expelled from contact boundaries, kg/s)
                Q_e(t) = kappa_eject * M_3B * (v / 2a)
        V_meas(t): Net external wear volume = (1 / rho) * int(Q_e dt)
    """

    CITATION = {
        "title": "Wear modeling and the third body concept",
        "authors": "N. Fillot, I. Iordanoff, Y. Berthier",
        "year": 2007,
        "journal": "Wear",
        "doi": "10.1016/j.wear.2006.10.011",
        "equation": "dM_3B/dt = Q_s - Q_e (Tribological Circuit Mass Balance)"
    }

    ASSUMPTIONS = [
        "First-body material loss feeds an intermediate interfacial debris layer (third body)",
        "The trapped debris layer screens first bodies from direct metallic asperity shearing",
        "Debris ejection at contact boundaries represents the only true external wear loss",
        "Debris bed porosity and density remain quasi-uniform over the nominal contact pad"
    ]

    LIMITATIONS = [
        "Screening coefficient beta and ejection efficiency kappa require calibration for specific contact traps",
        "Does not track particle crushing, chemical oxidation, or sintering into glaze layers",
        "Homogenized 1D continuum representation of discrete granular dynamics"
    ]

    @staticmethod
    def simulate_evolution(
        normal_load_N: float,
        sliding_speed_m_s: float,
        total_time_s: float,
        nominal_area_m2: float,
        contact_length_m: float,
        hardness_Pa: float,
        base_wear_coeff_K: float = 1.5e-4,
        material_density_kg_m3: float = 7800.0,
        debris_porosity: float = 0.35,
        beta_screen: float = 2.5,
        kappa_eject: float = 0.05,
        max_trapped_layer_thickness_m: float = 20e-6,
        n_steps: int = 200
    ) -> Dict[str, Any]:
        """
        Numerically integrates the third-body mass balance ODE over time:
            dM_3B/dt = Q_s - Q_e
        Tracks:
            - M_3B(t): Trapped mass
            - h_3B(t): Debris layer thickness
            - Q_s(t), Q_e(t): Instantaneous mass flows
            - V_source(t): Total volume detached from first bodies
            - V_external(t): Net external measured wear volume
            - Mass conservation check: M_detached = M_3B(t) + M_ejected(t)
        """
        validate_positive(normal_load_N, "normal_load_N", strictly_positive=False)
        validate_positive(sliding_speed_m_s, "sliding_speed_m_s", strictly_positive=False)
        validate_positive(total_time_s, "total_time_s", strictly_positive=True)
        validate_positive(nominal_area_m2, "nominal_area_m2", strictly_positive=True)
        validate_positive(contact_length_m, "contact_length_m", strictly_positive=True)
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)

        dt = total_time_s / n_steps
        effective_debris_density = material_density_kg_m3 * (1.0 - debris_porosity)
        m_max = effective_debris_density * nominal_area_m2 * max_trapped_layer_thickness_m

        # Initial pristine source detachment rate (Archard baseline volumetric rate * density)
        # dV_archard/dt = (K * W * v) / H
        archard_vol_rate_m3_s = (base_wear_coeff_K * normal_load_N * sliding_speed_m_s) / hardness_Pa
        q_s0 = material_density_kg_m3 * archard_vol_rate_m3_s  # kg / s

        # Transit frequency factor: v / L_c
        transit_freq = sliding_speed_m_s / contact_length_m if contact_length_m > 0 else 0.0

        # State variables
        m_3b = 0.0  # initial clean surface, no trapped debris
        cum_ejected_mass = 0.0
        cum_detached_mass = 0.0

        time_series = []
        m_3b_series = []
        h_3b_series = []
        q_s_series = []
        q_e_series = []
        external_wear_vol_mm3 = []
        source_wear_vol_mm3 = []
        conservation_error = []

        for step in range(n_steps + 1):
            t = step * dt
            
            # Current flows
            q_s = q_s0 * np.exp(-beta_screen * (m_3b / max(m_max, 1e-12)))
            q_e = kappa_eject * m_3b * transit_freq

            # Current layer thickness
            h_bed = m_3b / (effective_debris_density * nominal_area_m2)

            # Volumetric calculations
            v_ext_m3 = cum_ejected_mass / material_density_kg_m3
            v_src_m3 = cum_detached_mass / material_density_kg_m3

            # Conservation balance: detached mass == trapped mass + ejected mass
            balance_diff = abs(cum_detached_mass - (m_3b + cum_ejected_mass))

            time_series.append(round(t, 2))
            m_3b_series.append(float(m_3b))
            h_3b_series.append(float(h_bed * 1e6))  # um
            q_s_series.append(float(q_s))
            q_e_series.append(float(q_e))
            external_wear_vol_mm3.append(float(v_ext_m3 * M3_TO_MM3))
            source_wear_vol_mm3.append(float(v_src_m3 * M3_TO_MM3))
            conservation_error.append(float(balance_diff))

            # Unconditionally stable exponential integration for linear damping ODE:
            # dM/dt = Q_s - k_eff * M
            if step < n_steps:
                k_eff = kappa_eject * transit_freq
                if k_eff > 1e-12:
                    exp_factor = np.exp(-k_eff * dt)
                    m_3b_next = m_3b * exp_factor + (q_s / k_eff) * (1.0 - exp_factor)
                    delta_ejected = (q_s * dt) - (m_3b_next - m_3b)
                else:
                    m_3b_next = m_3b + q_s * dt
                    delta_ejected = 0.0

                m_3b = max(0.0, float(m_3b_next))
                cum_ejected_mass += max(0.0, float(delta_ejected))
                cum_detached_mass += float(q_s * dt)

        # Analytical steady-state calculation: Q_s = Q_e
        # q_s0 * exp(-beta * M / M_max) = kappa * M * transit_freq
        # Approximate steady-state mass:
        denom = (kappa_eject * transit_freq) + (q_s0 * beta_screen / m_max)
        steady_state_mass = q_s0 / denom if denom > 0 else 0.0
        steady_state_h_um = (steady_state_mass / (effective_debris_density * nominal_area_m2)) * 1e6

        return {
            "time_points_s": time_series,
            "trapped_debris_mass_kg": m_3b_series,
            "debris_layer_thickness_um": h_3b_series,
            "source_flow_rate_kg_s": q_s_series,
            "ejection_flow_rate_kg_s": q_e_series,
            "net_external_wear_volume_mm3": external_wear_vol_mm3,
            "gross_detached_volume_mm3": source_wear_vol_mm3,
            "mass_conservation_max_error_kg": max(conservation_error),
            "steady_state_predicted_thickness_um": round(float(steady_state_h_um), 3),
            "running_in_attenuation_ratio": round(external_wear_vol_mm3[-1] / max(source_wear_vol_mm3[-1], 1e-12), 4),
            "citation": ThirdBodyModel.CITATION,
            "assumptions": ThirdBodyModel.ASSUMPTIONS,
            "limitations": ThirdBodyModel.LIMITATIONS
        }
