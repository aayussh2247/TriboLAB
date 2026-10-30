# MODEL ASSUMPTIONS, VALIDITY ENVELOPES, AND KNOWN SCIENTIFIC LIMITATIONS

**Project:** AI-Driven Prediction, Explainability and Optimization of Adhesive Wear  
**Author:** Tribology & Computational Mechanics Research Group  
**Document:** `docs/MODEL_ASSUMPTIONS_AND_LIMITATIONS.md`  
**Date:** October 2026  

---

## 1. Scope and Scientific Purpose

No single tribological formulation can universally describe the full spectrum of contact mechanics, metallurgy, surface chemistry, and debris rheology across all engineering regimes. This document explicitly defines the physical boundaries, mechanical assumptions, calibration dependencies, and limitations of each model implemented in this project.

---

## 2. Model A: Classical Archard Wear Law

### Assumptions
1. **Perfect Asperity Plasticity:** The real contact area $A_r$ is determined solely by plastic indentation: $A_r = W / H$. Elastic springback and elasto-plastic intermediate regimes are neglected.
2. **Homogeneous Isotropic Hardness:** The Meyer hardness $H$ of the softer contacting partner is assumed spatially uniform and constant over time. Microstructural grain boundary variations, strain hardening, work hardening, and thermal softening are omitted.
3. **Constant Detachment Probability ($K$):** The dimensionless wear coefficient $K$ is treated as a global constant independent of sliding distance, contact pressure, sliding speed, and surface roughness.
4. **Immediate Debris Evacuation:** Detached particles are removed instantaneously from the interface. No third-body debris bed or abrasive recirculating action is modeled.

### Validity Envelope
- **Operating Regime:** Mild adhesive wear regime (Archard mild-wear regime).
- **Contact Pressure:** $p < 0.3 \, H$ (below the macroscopic plastic collapse limit).
- **Sliding Speed:** Low-to-moderate sliding speed where interfacial flash temperature rise $\Delta T_{\text{flash}} < 50\,^\circ\text{C}$.
- **Lubrication:** Unlubricated dry contact or stable boundary-lubricated contact where $K$ has been independently calibrated under identical chemical conditions.

### Known Limitations
- Fails to predict the run-in to steady-state transition (underestimates initial running-in wear and overestimates long-term steady-state wear when protective tribofilms form).
- Does not predict the transition to severe scuffing, seizure, or catastrophic galling at high $p \cdot v$ operating levels.
- Cannot be applied to viscoelastic polymers or brittle ceramics without re-deriving the contact deformation equations.

---

## 3. Model B: Energy-Based Wear Formulation

### Assumptions
1. **Dissipative Thermodynamic Linearity:** Wear volume is assumed strictly linear with cumulative dissipated frictional work: $V = \alpha_{\text{wear}} \cdot \sum E_d$.
2. **Constant Specific Energy Coefficient ($\alpha_{\text{wear}}$):** The proportionality factor $\alpha_{\text{wear}}$ is assumed constant within a given lubrication regime.
3. **Colocated Dissipation and Damage:** Frictional work dissipated at the contact interface is assumed to cause localized damage directly at the point of contact, neglecting remote elastic strain storage.

### Validity Envelope
- **Reciprocating & Gross Slip Fretting Contacts:** Fretting stroke $\delta > 20 \, \mu\text{m}$ (gross slip regime where entire contact slides).
- **Energy Dissipation Rate:** Valid across mild and oxidational fretting wear regimes where friction loops are measurable via piezotransducers.

### Known Limitations
- In partial slip fretting regimes, central stick zones dissipate zero frictional energy but sustain high fatigue damage. Model B must not be used to predict fatigue crack nucleation in stick-slip contacts.
- $\alpha_{\text{wear}}$ is not an intrinsic material constant: it varies with ambient relative humidity, oxidation kinetics, and interfacial temperature.

---

## 4. Model C: Rough Surface & Critical Length Scale Asperity Model

### Assumptions
1. **Greenwood-Williamson Topography:** Asperity summits are spherical with constant radius $R$, whose heights follow an ideal Gaussian probability distribution $\phi(z) \sim \mathcal{N}(0, \sigma_s^2)$.
2. **Uncoupled Asperities:** Neighboring asperities do not interact elastically (Winkler-like foundation approximation; bulk substrate deflection between asperities is neglected).
3. **Aghababaei Brittle-Ductile Cleavage:** Asperity junctions with diameter $d < d^*$ deform plastically without volumetric loss; junctions with $d \ge d^*$ detach a discrete hemispherical fragment.

### Validity Envelope
- **Roughness:** Root-mean-square roughness $R_q$ between $0.05 \, \mu\text{m}$ and $5.0 \, \mu\text{m}$.
- **Plasticity Index:** $0.6 < \psi < 2.5$.
- **Adhesive Strength:** Metallic interfaces with well-defined interface shear strength $\tau_c$ and surface energy $\gamma$.

### Known Limitations
- Real engineering surfaces exhibit multiscale, fractal, self-affine topography not fully captured by single-scale Greenwood-Williamson parameters ($R, \eta, \sigma_s$).
- Asperity tip radius $R$ is instrument-resolution dependent.
- The work of adhesion $\Delta w$ for oxidized or lubricated surfaces is difficult to measure experimentally and must often be estimated from contact angle or surface tension literature.

---

## 5. Model D: Third-Body Wear Formulation (Fillot-Berthier)

### Assumptions
1. **Lumped Reservoir Mass Conservation:** Debris is treated as a continuous lumped mass $M_{3B}$ within the contact, governed by source flow $Q_s$ and ejection flow $Q_e$.
2. **Exponential Screening:** The rate of new asperity detachment decays exponentially with the thickness of the trapped third-body bed: $Q_s = Q_{s,0} \exp(-\beta M_{3B}/M_{\max})$.
3. **Edge Ejection Proportionality:** Debris ejection is proportional to particle convective velocity and contact geometry: $Q_e \propto M_{3B} \cdot \frac{v}{2a}$.

### Validity Envelope
- Enclosed or semi-enclosed contacts where wear debris is partially trapped (fretting interfaces, conformal bushings, pin-on-flat with debris recirculation).
- Dry metallic contacts with non-volatile solid particulate debris.

### Known Limitations
- The discrete element particle dynamics (DEM) of individual debris granules (rolling, crushing, agglomeration, sintering into mechanically mixed layers) are homogenized into macroscopic rate constants.
- The ejection coefficient $\kappa_{\text{eject}}$ and screening factor $\beta_{\text{screen}}$ are empirical parameters requiring experimental calibration via wear debris trapping measurements.

---

## 6. Model E: Spatial Wear Profile & Solver

### Assumptions
1. **Quasi-Static Contact Mechanics:** Contact pressure redistribution is computed quasi-statically at discrete cycle intervals $\Delta N$, neglecting high-frequency dynamic vibrations and inertial wave propagation.
2. **Elastic Half-Space Foundation:** Substrates are assumed semi-infinite elastic half-spaces (valid when contact width $2a$ is much smaller than component thickness $H_{\text{body}}$).
3. **Decoupled Normal and Tangential Solvers:** Contact pressure $p(x)$ is computed from normal displacement; friction shear traction $\tau(x) = \mu p(x)$ is assumed not to distort the normal pressure distribution (valid for similar elastic constants $\nu_1 \approx \nu_2$).

### Validity Envelope
- Line contacts (cylindrical roller on flat plate, circular pin on flat plate).
- Moderate wear depths ($h_{\max} < 0.1 \cdot a_0$).

### Known Limitations
- When wear depth becomes large ($h > 0.5 \, a_0$), edge singularities develop at the boundary of the wear scar requiring fine spatial meshes and numerical damping to avoid oscillations.
- FEM import is currently limited to 2D cross-sectional profiles ($x, z$). Full 3D finite element meshes must be pre-sliced into cross-sections.

---

## 7. Machine Learning & Hybrid Modeling

### Assumptions
1. **IID Data Distribution:** Machine learning training and evaluation assume samples are drawn from the same operating domain as the target application.
2. **Interpolation Reliability:** Gradient boosted trees and neural networks are reliable interpolators within the training convex hull $[W_{\min}, W_{\max}] \times [v_{\min}, v_{\max}] \times [T_{\min}, T_{\max}]$; they cannot extrapolate to unseen extreme regimes (e.g., cryogenic temperatures, hypervelocity sliding).

### Known Limitations
- The primary dataset provided for initial calibration is a **scientifically grounded synthetic dataset** generated according to Greenwood-Williamson contact, flash heating, and lubrication physics. It is **not** raw physical profilometer data from physical tribometer machines.
- All conclusions, model metrics, and SHAP feature importances based on synthetic data must be explicitly labeled as **computational validation benchmarks**, not experimental metallurgical proof.
