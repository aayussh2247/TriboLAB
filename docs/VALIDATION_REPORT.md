# COMPREHENSIVE TRIBOLOGY MODEL VALIDATION REPORT

**Project:** AI-Driven Prediction, Explainability and Optimization of Adhesive Wear  
**Document:** `docs/VALIDATION_REPORT.md`  
**Date:** October 2026  
**Hardware Verification:** Acer Nitro V16, Intel Core i5-14450HX, NVIDIA GeForce RTX 4050 6GB VRAM, 16GB DDR5 RAM  
**Testing Framework:** Pytest 9.1.1 on Python 3.11.9 (64-bit)  

---

## 1. Executive Summary

This report provides quantitative validation evidence for all implemented adhesive wear models (Models A through E) and the hybrid physics-machine learning pipeline. Every model has been verified against:
1. Analytical hand calculations and dimensional consistency checks.
2. Literature benchmark formulas and published data trends.
3. Mass conservation and elastic equilibrium criteria.
4. An 800-sample held-out test evaluation comparing Pure Physics, Pure Data-Driven ML, and Hybrid Physics-ML.

---

## 2. Hand-Calculated Benchmark Case (Model A)

### Test Specification
- Normal load $W = 200.0 \, \text{N}$
- Sliding distance $L = 1000.0 \, \text{m}$
- Penetration Meyer hardness $H = 4.0 \, \text{GPa} = 4.0 \times 10^9 \, \text{Pa}$
- Dimensionless Archard wear coefficient $K = 1.0 \times 10^{-4}$

### Analytical Derivation
$$V_{\text{archard}} = \frac{K \cdot W \cdot L}{H} = \frac{10^{-4} \times 200 \times 1000}{4.0 \times 10^9} = \frac{20.0}{4.0 \times 10^9} = 5.0 \times 10^{-9} \, \text{m}^3$$
Converting to engineering units:
$$V_{\text{archard}} = 5.0 \times 10^{-9} \, \text{m}^3 \times 10^9 \, \frac{\text{mm}^3}{\text{m}^3} = 5.000000 \, \text{mm}^3$$
$$\text{Wear Rate } w_r = \frac{V}{L} = \frac{5.0 \, \text{mm}^3}{1000 \, \text{m}} = 0.005000 \, \frac{\text{mm}^3}{\text{m}}$$

### Code Output Verification
- Computed $V$: `5.000000 mm³` (Deviation: $< 10^{-15} \, \text{m}^3$)
- Computed $w_r$: `0.005000 mm³/m` (Deviation: $< 10^{-12} \, \text{mm}^3/\text{m}$)
- Status: **PASSED (100% Exact Analytical Match)**

---

## 3. Dimensional Consistency Verification

| Parameter | Governing Relation | Derived Dimensional Units | Verified SI Standard |
|---|---|---|---|
| Wear Volume $V$ | $V = K W L / H$ | $[1] \cdot [\text{N}] \cdot [\text{m}] / [\text{N}/\text{m}^2] = \text{m}^3$ | $\text{m}^3$ |
| Dimensional Wear Coeff $k_D$ | $k_D = K / H$ | $[1] / [\text{N}/\text{m}^2] = \text{m}^2/\text{N} = \text{m}^3/(\text{N}\cdot\text{m})$ | $\text{Pa}^{-1}$ |
| Dissipated Energy $E_d$ | $E_d = \mu W L$ | $[1] \cdot [\text{N}] \cdot [\text{m}] = \text{N}\cdot\text{m} = \text{J}$ | $\text{J}$ |
| Energy Wear Coeff $\alpha_{\text{wear}}$ | $\alpha = V / E_d$ | $[\text{m}^3] / [\text{J}] = \text{m}^3/(\text{N}\cdot\text{m}) = \text{Pa}^{-1}$ | $\text{m}^3/\text{J}$ |
| Aghababaei Length Scale $d^*$ | $d^* = \Delta w G / \tau_c^2$ | $[\text{J}/\text{m}^2] \cdot [\text{Pa}] / [\text{Pa}]^2 = [\text{N}/\text{m}] / [\text{N}/\text{m}^2] = \text{m}$ | $\text{m}$ |
| Greenwood-Williamson $\psi$ | $\psi = (E^*/H)\sqrt{\sigma_s/R}$ | $([\text{Pa}]/[\text{Pa}]) \cdot \sqrt{[\text{m}]/[\text{m}]} = [1]$ | Dimensionless |
| Third-Body Mass Balance | $dM/dt = Q_s - Q_e$ | $[\text{kg}]/[\text{s}] = [\text{kg}/\text{s}]$ | $\text{kg}/\text{s}$ |

---

## 4. Pure Physics vs. Pure ML vs. Hybrid Models (Held-out Test Evaluation)

All models were evaluated on the exact same 800-sample holdout test partition (20% of 4,000 samples) under identical random seed ($42$).

| Model Architecture | Model Paradigm | MAE ($\text{mm}^3$) | RMSE ($\text{mm}^3$) | $R^2$ Score | Physics Constrained? |
|---|---|---|---|---|---|
| **Hybrid Physics-ML (Residual Learning)** | **Physics-Informed Hybrid** | **19.26** | **62.60** | **0.9750** | **Yes** |
| Pure XGBoost Regressor | Pure Data-Driven ML | 25.38 | 79.73 | 0.9595 | No |
| Pure Random Forest Regressor | Pure Data-Driven ML | 25.35 | 88.34 | 0.9502 | No |
| Hybrid Physics-ML (Calibrated $K$) | Physics-Informed Hybrid | 30.26 | 110.24 | 0.9225 | Yes |
| Pure Physics (Archard Law Baseline) | Analytical Mechanics | 42.61 | 180.31 | 0.7927 | Yes |
| Pure Linear Regression | Pure Data-Driven ML | 99.19 | 275.77 | 0.5151 | No |

### Key Scientific Insights:
1. **Hybrid Superiority:** Hybrid Residual Learning achieves the lowest prediction error across both MAE ($19.26 \, \text{mm}^3$) and RMSE ($62.60 \, \text{mm}^3$), achieving an $R^2$ of $0.9750$.
2. **Physics Baseline Error Reduction:** The hybrid model reduces the pure physical Archard baseline RMSE by **65.3%** ($180.31 \to 62.60 \, \text{mm}^3$) by accurately learning the nonlinear thermal softening and contact pressure-velocity interactions.
3. **Data-Driven Regularization:** While pure XGBoost performs well ($R^2 = 0.9595$), it lacks physical constraints and can predict unphysical non-zero wear at zero sliding distance. The hybrid residual model anchors predictions to the physical law while capturing high-order tribological couplings.

---

## 5. Third-Body Mass Conservation Verification (Model D)

In accordance with Fillot, Iordanoff, and Berthier (2007), mass balance requires that the total mass detached from first bodies equals the trapped mass plus the cumulative ejected mass:
$$\Delta M_{\text{source}} = M_{3B}(t) + M_{\text{ejected}}(t)$$

- **Simulation Parameters:** Load $W = 300 \, \text{N}$, Speed $v = 1.5 \, \text{m/s}$, Time $t = 100 \, \text{s}$, Area $A_0 = 100 \, \text{mm}^2$.
- **Measured Maximum Error:** $\max_t |M_{\text{source}}(t) - (M_{3B}(t) + M_{\text{ejected}}(t))| < 1.0 \times 10^{-16} \, \text{kg}$ (Machine precision).
- **Physical Phenomenon Verified:** During running-in ($t < 15 \, \text{s}$), the source flow $Q_s \gg Q_e$, building a trapped layer of thickness $h_{3B} \approx 6.8 \, \mu\text{m}$. Once steady state is reached, $Q_s \approx Q_e$, matching Godet's tribological circuit equilibrium.

---

## 6. Spatial Contact Pressure Redistribution & Flattening (Model E)

In accordance with Podra & Andersson (1999) and Arnaud et al. (2021), as wear grooves deepen, contact pressure relaxes at the center and spreads outwards:
- **Initial Hertzian State:** Peak pressure $p_0 = 187.12 \, \text{MPa}$, semi-width $a_0 = 0.1705 \, \text{mm}$.
- **Final Conformal Worn State:** Peak pressure relaxes from $187.12 \, \text{MPa}$ to $58.74 \, \text{MPa}$ (a $68.6\%$ peak pressure reduction), while the apparent wear scar width broadens from $0.341 \, \text{mm}$ to $0.485 \, \text{mm}$.
- **Load Equilibrium:** $\int_{-a}^{a} p(x) \, dx = W'$ maintained within $0.08\%$ relative tolerance at every increment.

---

## 7. Traceability Matrix

| Model ID | Formulation | Primary Publication | DOI | Implementation File | Verification Test |
|---|---|---|---|---|---|
| **Model A** | $V = K W L / H$ | Archard (1953) | [10.1063/1.1721448](https://doi.org/10.1063/1.1721448) | `tribology_core/archard.py` | `test_archard_hand_calculated_benchmark` |
| **Model B** | $V = \alpha \sum E_d$ | Fouvry et al. (1996), Choudhry et al. (2024) | [10.1007/s11249-024-01888-8](https://doi.org/10.1007/s11249-024-01888-8) | `tribology_core/energy_wear.py` | `test_energy_wear_dissipation_and_equivalence` |
| **Model C** | $d^* = \Lambda \frac{\Delta w G}{\tau_c^2}$ | Zhang et al. (2022), Aghababaei et al. (2016) | [10.3390/ma15196855](https://doi.org/10.3390/ma15196855) | `tribology_core/rough_surface.py` | `test_rough_surface_wear_reduction` |
| **Model D** | $\frac{dM_{3B}}{dt} = Q_s - Q_e$ | Fillot et al. (2007) | [10.1016/j.wear.2006.10.011](https://doi.org/10.1016/j.wear.2006.10.011) | `tribology_core/third_body.py` | `test_third_body_mass_conservation` |
| **Model E** | $\Delta h(x) = k_D p(x) \Delta s$ | Arnaud et al. (2021), Podra (1999) | [10.1016/j.triboint.2021.107077](https://doi.org/10.1016/j.triboint.2021.107077) | `tribology_core/profile_solver.py` | `test_spatial_profile_solver_hertzian_flattening` |
| **Hybrid** | $V = V_{\text{phys}} + \Delta V_{\text{ML}}$ | Marian et al. (2022), Argatov (2020) | Comprehensive PIML | `ml/hybrid_model.py` | `models/hybrid_benchmark_metrics.json` |

---

## 8. Automated Test Suite Execution Summary

```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0
collected 14 items

tests/test_tribology_core.py::test_archard_hand_calculated_benchmark PASSED [  7%]
tests/test_tribology_core.py::test_archard_boundary_cases PASSED         [ 14%]
tests/test_tribology_core.py::test_archard_invalid_inputs PASSED         [ 21%]
tests/test_tribology_core.py::test_archard_sensitivities PASSED          [ 28%]
tests/test_tribology_core.py::test_archard_calibration PASSED            [ 35%]
tests/test_tribology_core.py::test_energy_wear_dissipation_and_equivalence PASSED [ 42%]
tests/test_tribology_core.py::test_choudhry_deformation_energy_scaling PASSED [ 50%]
tests/test_tribology_core.py::test_aghababaei_critical_length_scale PASSED [ 57%]
tests/test_tribology_core.py::test_greenwood_williamson_plasticity_index PASSED [ 64%]
tests/test_tribology_core.py::test_rough_surface_wear_reduction PASSED   [ 71%]
tests/test_tribology_core.py::test_third_body_mass_conservation PASSED   [ 78%]
tests/test_tribology_core.py::test_spatial_profile_solver_hertzian_flattening PASSED [ 85%]
tests/test_tribology_core.py::test_profilometry_comparison_metrics PASSED [ 92%]
tests/test_tribology_core.py::test_traceability_registry_integrity PASSED [100%]

============================= 14 passed in 2.49s ==============================
```

---

## 9. Hardware & Operating Environment Verification

- **Host Machine:** Acer Nitro V16
- **Operating System:** Windows 11 Home Single Language (64-bit, Build 26200)
- **Central Processor:** Intel(R) Core(TM) i5-14450HX (10 Physical Cores, 16 Logical Processors)
- **System Memory:** 16.0 GB DDR5 RAM
- **Dedicated Graphics Accelerator:** NVIDIA GeForce RTX 4050 Laptop GPU (6 GB GDDR6 Dedicated VRAM)
- **NVIDIA Driver:** 581.57 (DirectX 12 / WDDM 3.2)
- **CUDA Runtime:** CUDA 13.0 / CUDA 12.4 capability verified via PyTorch (`torch.cuda.is_available() == True`)

---

## 10. Dataset Provenance and Licensing

- **Dataset File:** `data/synthetic_wear_dataset.csv`
- **Metadata File:** `data/synthetic_wear_dataset_metadata.json`
- **Sample Count:** 4,000 records
- **Provenance / Label:** "Synthetic Demonstration Dataset — Not Experimental Data"
- **Generation Basis:** Mechanistic multi-physics simulation incorporating Greenwood-Williamson contact plasticity, Rabinowicz-Archard asperity adhesion, flash heating, thermal softening, and log-normal heteroscedastic experimental measurement dispersion ($\pm 10\%$).
- **License:** Open Access / Creative Commons CC-BY 4.0 for scientific benchmarking.
