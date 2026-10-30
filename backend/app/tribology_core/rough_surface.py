"""
Model C: Asperity and Rough-Surface Wear Model
References:
1. Zhang, H., Goltsberg, R., & Etsion, I. (2022). "Modeling Adhesive Wear in Asperity and Rough Surface Contacts: A Review."
   Materials, 15(19), 6855. DOI: 10.3390/ma15196855
2. Aghababaei, R., Warner, D. H., & Molinari, J.-F. (2016). "Critical length scale controls adhesive wear mechanisms."
   Nature Communications, 7, 11816. DOI: 10.1038/ncomms11816
3. Greenwood, J. A., & Williamson, J. B. P. (1966). "Contact of nominally flat surfaces."
   Proc. R. Soc. Lond. A, 295, 300–319.
"""

import numpy as np
from scipy import integrate
from typing import Dict, Any, Tuple
from .units import validate_positive, validate_range, UM_TO_M, M_TO_UM, GPA_TO_PA, M3_TO_MM3

class RoughSurfaceModel:
    """
    Greenwood-Williamson statistical rough contact coupled with Aghababaei's critical length scale d*.
    
    Physical Principles:
    1. Asperity heights follow Gaussian distribution phi(z) ~ N(0, sigma_s^2).
    2. Total real area of contact Ar and normal load W are integrated across all active summits.
    3. Aghababaei Critical Length Scale:
          d* = Lambda * (Delta_w * G) / tau_c^2
       Junctions with contact diameter 2*a < d* undergo plastic smoothing without volume loss.
       Junctions with contact diameter 2*a >= d* produce discrete wear debris particles.
    """

    CITATION_ZHANG = {
        "title": "Modeling Adhesive Wear in Asperity and Rough Surface Contacts: A Review",
        "authors": "Haibo Zhang, Roman Goltsberg, Izhak Etsion",
        "year": 2022,
        "journal": "Materials",
        "doi": "10.3390/ma15196855",
        "equation": "Review of Greenwood-Williamson, CEB, and asperity junction formulations"
    }

    CITATION_AGHABABAEI = {
        "title": "Critical length scale controls adhesive wear mechanisms",
        "authors": "Ramin Aghababaei, Derek H. Warner, Jean-François Molinari",
        "year": 2016,
        "journal": "Nature Communications",
        "doi": "10.1038/ncomms11816",
        "equation": "d* = Lambda * (Delta_w * G) / tau_c^2"
    }

    ASSUMPTIONS = [
        "Summit heights follow a Gaussian distribution phi(z) = 1/(sigma_s*sqrt(2*pi)) * exp(-z^2 / (2*sigma_s^2))",
        "Constant average summit radius of curvature R across all asperities",
        "No elastic coupling between adjacent asperities (Winkler approximation)",
        "Junctions smaller than d* deform plastically without liberating particulate wear debris",
        "Junctions exceeding d* crack at their root, creating wear particles"
    ]

    LIMITATIONS = [
        "Engineering surfaces possess multiscale self-affine fractal roughness rather than a single length scale R",
        "Work of adhesion Delta_w is sensitive to surface contamination, humidity, and oxide layers",
        "Does not track 3D debris kinematics after detachment"
    ]

    @staticmethod
    def compute_critical_length_scale(
        work_of_adhesion_J_per_m2: float,
        shear_modulus_Pa: float,
        junction_shear_strength_Pa: float,
        lambda_geom: float = 1.0
    ) -> float:
        """
        Computes Aghababaei critical junction diameter d* in meters:
            d* = lambda_geom * (Delta_w * G) / tau_c^2
        """
        validate_positive(work_of_adhesion_J_per_m2, "work_of_adhesion_J_per_m2", strictly_positive=True)
        validate_positive(shear_modulus_Pa, "shear_modulus_Pa", strictly_positive=True)
        validate_positive(junction_shear_strength_Pa, "junction_shear_strength_Pa", strictly_positive=True)

        d_star = lambda_geom * (work_of_adhesion_J_per_m2 * shear_modulus_Pa) / (junction_shear_strength_Pa ** 2)
        return float(d_star)

    @staticmethod
    def compute_plasticity_index(
        equivalent_youngs_modulus_Pa: float,
        hardness_Pa: float,
        roughness_sigma_m: float,
        asperity_radius_m: float
    ) -> float:
        """
        Greenwood-Williamson Plasticity Index:
            psi = (E* / H) * sqrt(sigma_s / R)
        - psi < 0.6: Elastic contact dominant
        - 0.6 <= psi <= 1.0: Elasto-plastic transition
        - psi > 1.0: Plastic contact dominant
        """
        validate_positive(equivalent_youngs_modulus_Pa, "equivalent_youngs_modulus_Pa", strictly_positive=True)
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)
        validate_positive(roughness_sigma_m, "roughness_sigma_m", strictly_positive=True)
        validate_positive(asperity_radius_m, "asperity_radius_m", strictly_positive=True)

        psi = (equivalent_youngs_modulus_Pa / hardness_Pa) * np.sqrt(roughness_sigma_m / asperity_radius_m)
        return float(psi)

    @staticmethod
    def solve_contact_and_wear(
        normal_load_N: float,
        sliding_distance_m: float,
        nominal_area_m2: float,
        hardness_Pa: float,
        equivalent_youngs_modulus_Pa: float,
        roughness_sigma_m: float,
        asperity_radius_m: float = 50e-6,
        asperity_density_per_m2: float = 1e9,
        work_of_adhesion_J_per_m2: float = 0.8,
        base_wear_coeff_K: float = 1.5e-4
    ) -> Dict[str, Any]:
        """
        Solves rough-surface contact mechanics and computes adhesive wear:
        1. Solves mean plane separation d satisfying total normal load W.
        2. Computes real contact area Ar = sum(A_asp).
        3. Computes critical length scale d* and critical interference omega* = (d*/2)^2 / R.
        4. Calculates debris-producing fraction of contact f_wear (contacts with omega >= omega*).
        5. Computes net wear volume.
        """
        validate_positive(normal_load_N, "normal_load_N", strictly_positive=False)
        validate_positive(nominal_area_m2, "nominal_area_m2", strictly_positive=True)
        validate_positive(hardness_Pa, "hardness_Pa", strictly_positive=True)
        validate_positive(roughness_sigma_m, "roughness_sigma_m", strictly_positive=True)

        # 1. Plasticity index
        psi = RoughSurfaceModel.compute_plasticity_index(
            equivalent_youngs_modulus_Pa, hardness_Pa, roughness_sigma_m, asperity_radius_m
        )

        # 2. Critical length scale d*
        # Junction shear strength tau_c approx H / (2 * sqrt(3)) ~ 0.28 * H for metals
        tau_c = 0.28 * hardness_Pa
        shear_modulus = equivalent_youngs_modulus_Pa / (2.0 * (1.0 + 0.30))  # nu ~ 0.3
        d_star_m = RoughSurfaceModel.compute_critical_length_scale(
            work_of_adhesion_J_per_m2, shear_modulus, tau_c, lambda_geom=1.0
        )
        # Critical interference to reach diameter d*: 2*a = 2*sqrt(omega * R) >= d* => omega* = d*^2 / (4*R)
        omega_star_m = (d_star_m ** 2) / (4.0 * asperity_radius_m)

        # 3. Find separation d such that integrated load equals normal_load_N
        # Under plastic Meyer assumption (A_asp = 2*pi*R*omega, W_asp = 2*pi*R*omega*H):
        # W(d) = eta * A0 * 2*pi*R*H * int_d^inf (z - d) phi(z) dz
        sigma = roughness_sigma_m
        eta = asperity_density_per_m2
        a0 = nominal_area_m2
        r = asperity_radius_m
        load_prefactor = eta * a0 * 2.0 * np.pi * r * hardness_Pa

        def load_at_separation(d_val: float) -> float:
            # Gaussian integration of (z - d) from d to 6*sigma
            if d_val >= 5.5 * sigma:
                return 0.0
            
            # Using standard normal integral substitution
            u = d_val / sigma
            # int_u^inf (t - u) exp(-t^2 / 2) dt = exp(-u^2 / 2) - u * sqrt(pi / 2) * erfc(u / sqrt(2))
            from scipy.special import erfc
            int_val = sigma * (np.exp(-0.5 * u**2) / np.sqrt(2.0 * np.pi) - 0.5 * u * erfc(u / np.sqrt(2.0)))
            return float(load_prefactor * max(0.0, int_val))

        # Binary search for separation d
        d_low = -3.0 * sigma
        d_high = 5.0 * sigma
        d_sol = 2.0 * sigma

        if normal_load_N > 0:
            for _ in range(50):
                d_mid = 0.5 * (d_low + d_high)
                w_mid = load_at_separation(d_mid)
                if abs(w_mid - normal_load_N) / max(normal_load_N, 1e-6) < 1e-4:
                    d_sol = d_mid
                    break
                if w_mid > normal_load_N:
                    d_low = d_mid
                else:
                    d_high = d_mid
            d_sol = 0.5 * (d_low + d_high)

        # 4. Compute real contact area Ar and debris fraction f_debris
        # Total contact occurs for z > d_sol
        # Debris-producing contact occurs for z > d_sol + omega_star_m
        u_tot = d_sol / sigma
        u_debris = (d_sol + omega_star_m) / sigma

        from scipy.special import erfc
        def area_integral(u: float) -> float:
            if u >= 6.0:
                return 0.0
            val = sigma * (np.exp(-0.5 * u**2) / np.sqrt(2.0 * np.pi) - 0.5 * u * erfc(u / np.sqrt(2.0)))
            return float(max(0.0, val))

        area_total_val = area_integral(u_tot)
        area_debris_val = area_integral(u_debris)

        debris_fraction = area_debris_val / area_total_val if area_total_val > 1e-18 else 0.0
        debris_fraction = float(np.clip(debris_fraction, 0.0, 1.0))

        # Real contact area
        ar_m2 = eta * a0 * 2.0 * np.pi * r * area_total_val

        # 5. Effective wear volume
        # Particles only detach from junctions with size >= d*
        # Sub-critical junctions smooth out without volumetric loss
        archard_baseline_v_m3 = (base_wear_coeff_K * normal_load_N * sliding_distance_m) / hardness_Pa
        effective_wear_volume_m3 = archard_baseline_v_m3 * debris_fraction

        return {
            "plasticity_index": round(psi, 3),
            "contact_regime": "Elastic" if psi < 0.6 else ("Elasto-Plastic" if psi <= 1.0 else "Fully Plastic"),
            "critical_length_scale_d_star_um": round(d_star_m * M_TO_UM, 4),
            "critical_interference_omega_star_um": round(omega_star_m * M_TO_UM, 5),
            "mean_plane_separation_d_um": round(d_sol * M_TO_UM, 3),
            "real_contact_area_fraction": round(ar_m2 / nominal_area_m2, 6),
            "debris_producing_junction_fraction": round(debris_fraction, 4),
            "subcritical_smoothing_junction_fraction": round(1.0 - debris_fraction, 4),
            "archard_baseline_volume_mm3": round(archard_baseline_v_m3 * M3_TO_MM3, 6),
            "rough_surface_wear_volume_mm3": round(effective_wear_volume_m3 * M3_TO_MM3, 6),
            "wear_reduction_due_to_subcritical_smoothing_percent": round((1.0 - debris_fraction) * 100.0, 2),
            "citation": RoughSurfaceModel.CITATION_ZHANG,
            "assumptions": RoughSurfaceModel.ASSUMPTIONS,
            "limitations": RoughSurfaceModel.LIMITATIONS
        }
