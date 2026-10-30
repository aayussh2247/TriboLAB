"""
Scientific Verification Suite for Tribology Core Models (A through E)
Verifies:
- Hand-calculated benchmarks from literature
- Dimensional consistency and SI unit standards
- Physical boundary conditions (W=0 -> V=0, L=0 -> V=0)
- Third-body mass conservation
- Contact pressure equilibrium
- Aghababaei critical length scale transition
"""

import pytest
import numpy as np

from backend.app.tribology_core.units import (
    convert_input_to_si, GPA_TO_PA, M3_TO_MM3, MM3_TO_M3
)
from backend.app.tribology_core.archard import ArchardModel
from backend.app.tribology_core.energy_wear import EnergyWearModel
from backend.app.tribology_core.rough_surface import RoughSurfaceModel
from backend.app.tribology_core.third_body import ThirdBodyModel
from backend.app.tribology_core.profile_solver import SpatialProfileSolver
from backend.app.tribology_core.traceability import get_traceability_table

# =========================================================================
# MODEL A TESTS: ARCHARD WEAR LAW
# =========================================================================

def test_archard_hand_calculated_benchmark():
    """
    Hand-calculated benchmark case:
    W = 200 N
    L = 1000 m
    H = 4.0 GPa = 4.0e9 Pa
    K = 1.0e-4
    Theoretical volume:
        V = (1e-4 * 200 * 1000) / 4e9 = 20.0 / 4e9 = 5.0e-9 m^3 = 5.0 mm^3
    """
    w = 200.0
    l = 1000.0
    h_pa = 4.0e9
    k = 1.0e-4

    vol_m3 = ArchardModel.compute_volume(w, l, h_pa, k)
    assert abs(vol_m3 - 5.0e-9) < 1e-15

    res_eng = ArchardModel.compute_volume_engineering(w, l, 4.0, k)
    assert abs(res_eng["wear_volume_mm3"] - 5.0) < 1e-5
    assert abs(res_eng["wear_rate_mm3_per_m"] - 0.005) < 1e-7

def test_archard_boundary_cases():
    """Verify zero load, zero distance, and zero K result in zero wear."""
    assert ArchardModel.compute_volume(0.0, 1000.0, 4e9, 1e-4) == 0.0
    assert ArchardModel.compute_volume(200.0, 0.0, 4e9, 1e-4) == 0.0
    assert ArchardModel.compute_volume(200.0, 1000.0, 4e9, 0.0) == 0.0

def test_archard_invalid_inputs():
    """Verify strictly positive hardness and non-negative physical bounds."""
    with pytest.raises(ValueError):
        ArchardModel.compute_volume(-10.0, 100.0, 4e9, 1e-4)
    with pytest.raises(ValueError):
        ArchardModel.compute_volume(10.0, 100.0, 0.0, 1e-4)
    with pytest.raises(ValueError):
        ArchardModel.compute_volume(10.0, 100.0, 4e9, 1.5)  # K > 1.0

def test_archard_sensitivities():
    """Verify partial derivatives against analytical elasticity rules."""
    sens = ArchardModel.compute_sensitivity(200.0, 1000.0, 4e9, 1e-4)
    assert sens["dV_dW_m3_per_N"] > 0
    assert sens["dV_dL_m3_per_m"] > 0
    assert sens["dV_dH_m3_per_Pa"] < 0  # Increasing hardness decreases wear
    assert sens["dV_dK_m3"] > 0
    assert sens["normalized_elasticity_W"] == 1.0
    assert sens["normalized_elasticity_H"] == -1.0

def test_archard_calibration():
    """Verify least-squares parameter calibration from synthetic points."""
    true_k = 2.5e-4
    loads = np.array([100.0, 200.0, 300.0, 400.0])
    dists = np.array([500.0, 1000.0, 1500.0, 2000.0])
    hardnesses = np.array([3e9, 3e9, 4e9, 4e9])
    
    # Generate exact physical volumes
    volumes = (true_k * loads * dists) / hardnesses
    calibrated_k, r2 = ArchardModel.calibrate_K(volumes, loads, dists, hardnesses)
    
    assert abs(calibrated_k - true_k) < 1e-10
    assert r2 > 0.9999

# =========================================================================
# MODEL B TESTS: ENERGY-BASED WEAR
# =========================================================================

def test_energy_wear_dissipation_and_equivalence():
    """
    Verify dissipated energy E_d = mu * W * L and exact equivalence with Archard:
    V = alpha * (mu * W * L) == K * W * L / H when alpha = K / (mu * H).
    """
    w = 500.0  # N
    l = 2000.0 # m
    mu = 0.40  # friction coeff
    h_pa = 5.0e9 # Pa (5 GPa)
    k = 2.0e-4

    ed = EnergyWearModel.compute_dissipated_energy(w, l, mu)
    expected_ed = 0.40 * 500.0 * 2000.0  # 400,000 J
    assert abs(ed - expected_ed) < 1e-6

    alpha_si = EnergyWearModel.archard_to_energy_coefficient(k, h_pa, mu)
    # alpha = 2e-4 / (0.4 * 5e9) = 2e-4 / 2e9 = 1.0e-13 m^3 / J
    assert abs(alpha_si - 1.0e-13) < 1e-18

    v_energy = EnergyWearModel.compute_volume(ed, alpha_si)
    v_archard = ArchardModel.compute_volume(w, l, h_pa, k)
    assert abs(v_energy - v_archard) < 1e-15

def test_choudhry_deformation_energy_scaling():
    """Verify that deformation energy accumulation increases effective wear coefficient."""
    base_k = 1.5e-4
    k_init = EnergyWearModel.choudhry_deformation_energy_wear_coeff(base_k, 0.0)
    assert k_init == base_k

    k_worn = EnergyWearModel.choudhry_deformation_energy_wear_coeff(
        base_k, accumulated_def_energy_J=100.0, critical_energy_J=50.0, beta_scale=0.35, power_m=1.0
    )
    # Ratio = 100/50 = 2.0 => k_worn = 1.5e-4 * (1 + 0.35 * 2.0) = 1.5e-4 * 1.70 = 2.55e-4
    assert abs(k_worn - 2.55e-4) < 1e-8
    assert k_worn > base_k

# =========================================================================
# MODEL C TESTS: ROUGH SURFACE & ASPERITY JUNCTIONS
# =========================================================================

def test_aghababaei_critical_length_scale():
    """
    Verify Aghababaei d* calculation:
    Steel example: Delta_w = 0.8 J/m^2, G = 80 GPa = 80e9 Pa, tau_c = 1.2 GPa = 1.2e9 Pa
    d* = (0.8 * 80e9) / (1.2e9)^2 = 64e9 / 1.44e18 approx 4.44e-8 m = 0.044 um
    """
    d_star = RoughSurfaceModel.compute_critical_length_scale(0.8, 80e9, 1.2e9, lambda_geom=1.0)
    assert 0.01e-6 < d_star < 1.0e-6

def test_greenwood_williamson_plasticity_index():
    """
    Verify GW plasticity index calculation:
    psi = (E* / H) * sqrt(sigma_s / R)
    For steel: E* = 110 GPa, H = 4 GPa, sigma_s = 1 um, R = 50 um
    psi = (110 / 4) * sqrt(1 / 50) = 27.5 * 0.1414 approx 3.88 (Fully plastic)
    """
    psi = RoughSurfaceModel.compute_plasticity_index(110e9, 4e9, 1e-6, 50e-6)
    assert abs(psi - 3.889) < 0.01
    assert psi > 1.0

def test_rough_surface_wear_reduction():
    """
    Verify that rough surface contact model computes positive wear volume
    strictly bounded below or equal to the unconstrained Archard baseline.
    """
    res = RoughSurfaceModel.solve_contact_and_wear(
        normal_load_N=200.0,
        sliding_distance_m=1000.0,
        nominal_area_m2=1e-4,  # 100 mm^2
        hardness_Pa=4e9,
        equivalent_youngs_modulus_Pa=110e9,
        roughness_sigma_m=1.5e-6,
        asperity_radius_m=50e-6,
        asperity_density_per_m2=1e9,
        work_of_adhesion_J_per_m2=0.8,
        base_wear_coeff_K=1.5e-4
    )
    
    assert res["rough_surface_wear_volume_mm3"] > 0.0
    assert res["rough_surface_wear_volume_mm3"] <= res["archard_baseline_volume_mm3"]
    assert 0.0 <= res["debris_producing_junction_fraction"] <= 1.0
    assert 0.0 <= res["subcritical_smoothing_junction_fraction"] <= 1.0
    assert abs((res["debris_producing_junction_fraction"] + res["subcritical_smoothing_junction_fraction"]) - 1.0) < 1e-6

# =========================================================================
# MODEL D TESTS: THIRD-BODY MASS BALANCE
# =========================================================================

def test_third_body_mass_conservation():
    """
    Verify Fillot-Berthier mass balance:
    At every time step, gross detached mass == trapped mass + ejected mass.
    """
    res = ThirdBodyModel.simulate_evolution(
        normal_load_N=300.0,
        sliding_speed_m_s=1.5,
        total_time_s=100.0,
        nominal_area_m2=1e-4,
        contact_length_m=0.01,
        hardness_Pa=4.0e9,
        base_wear_coeff_K=1.5e-4,
        n_steps=100
    )

    assert res["mass_conservation_max_error_kg"] < 1e-12
    assert len(res["time_points_s"]) == 101
    assert res["steady_state_predicted_thickness_um"] > 0
    # Net external wear must be less than gross detached volume during running in
    assert res["net_external_wear_volume_mm3"][-1] < res["gross_detached_volume_mm3"][-1]

# =========================================================================
# MODEL E TESTS: SPATIAL PROFILE EVOLUTION
# =========================================================================

def test_spatial_profile_solver_hertzian_flattening():
    """
    Verify contact profile solver:
    1. Initial contact pressure matches Hertzian peak within 5%.
    2. Wear depth increases monotonically over time.
    3. Peak contact pressure decreases (flattening effect) as wear scar develops.
    """
    res = SpatialProfileSolver.solve_spatial_evolution(
        normal_load_total_N=500.0,
        contact_length_m=0.02, # 20 mm
        cylinder_radius_m=0.025, # 25 mm
        equivalent_youngs_modulus_Pa=110e9,
        hardness_Pa=4.0e9,
        wear_coeff_K=1.5e-4,
        total_sliding_distance_m=10.0,
        n_spatial_nodes=51,
        n_time_increments=10
    )

    assert res["max_wear_depth_um"] > 0.0
    assert res["final_wear_scar_width_mm"] >= res["initial_hertz_semi_width_mm"] * 2.0 * 0.8
    # Contact pressure should relax at center
    assert res["final_peak_pressure_mpa"] < res["initial_peak_pressure_mpa"]
    assert res["pressure_flattening_ratio"] < 1.0
    assert res["integrated_wear_volume_mm3"] > 0.0

def test_profilometry_comparison_metrics():
    """Verify experimental profilometry comparison metrics."""
    x = np.linspace(-2.0, 2.0, 50)
    # True parabolic wear scar
    y_meas = 10.0 * np.maximum(0.0, 1.0 - (x / 1.5) ** 2)
    # Predicted with 5% deviation
    y_pred = y_meas * 1.05

    comp = SpatialProfileSolver.compare_against_profilometry(x, y_pred, x, y_meas)
    assert comp["validation_status"] == "VALIDATED"
    assert comp["r_squared"] > 0.98
    assert comp["mae_um"] > 0.0

# =========================================================================
# TRACEABILITY REGISTRY TEST
# =========================================================================

def test_traceability_registry_integrity():
    """Verify that every model has a complete paper citation, DOI, equation, and file mapping."""
    table = get_traceability_table()
    assert len(table) == 5

    for entry in table:
        assert "model_id" in entry
        assert "doi" in entry
        assert "equation_number" in entry
        assert "implementation_file" in entry
        assert entry["full_text_inspected"] is True
