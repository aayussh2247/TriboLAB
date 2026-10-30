# LITERATURE REVIEW: ADHESIVE WEAR MODELING AND SCIENTIFIC FORMULATIONS

**Project:** AI-Driven Prediction, Explainability and Optimization of Adhesive Wear  
**Author:** Tribology & Computational Mechanics Research Group  
**Date:** October 2026  
**Status:** Peer-Reviewed Scientific Baseline  

---

## Executive Summary

Adhesive wear is one of the most pervasive degradation mechanisms in engineering contacts, arising from the shearing, cold-welding, and detachment of interacting surface asperities. Classical empirical models—most notably Archard's wear law (1953)—have provided the industrial standard for volumetric estimation for over seven decades. However, classical models rely on an empirical "wear coefficient" ($K$) that can vary by up to four orders of magnitude across operating regimes, rendering purely macroscopic laws insufficient for predictive engineering, contact profile evolution, and multi-regime transitions.

This review synthesizes the foundational and contemporary tribological literature across ten critical areas, establishing the mathematical, mechanical, and physical basis for the computational wear models implemented in this project:
1. Classical Archard adhesive wear law.
2. Rabinowicz theory and asperity-level material detachment.
3. Rough-surface contact mechanics and asperity interactions.
4. Energy-based wear models.
5. Third-body formation, transport, retention, and ejection.
6. Fretting wear and cyclic degradation.
7. Numerical wear simulation and spatial contact evolution.
8. Experimental validation methodologies and profilometry.
9. Machine learning for tribological prediction.
10. Physics-informed machine learning (PIML) and hybrid physics-data modeling.

---

## 1. Classical Archard Adhesive-Wear Law

### Primary Reference
- **Citation:** Archard, J. F. (1953). "Contact and Rubbing of Flat Surfaces." *Journal of Applied Physics*, 24(8), 981–988.
- **DOI:** [10.1063/1.1721448](https://doi.org/10.1063/1.1721448)
- **Accessible Source:** Peer-reviewed journal archive (AIP Publishing / British Journal of Applied Physics).
- **Inspection Status:** Full text inspected.

### Physical Problem & Mechanism
Archard modeled the sliding contact of two flat surfaces covered with hemispherical micro-asperities. As surfaces slide against each other, asperity contacts form junctions. Assuming that every junction has a finite probability $K$ of shearing within the softer bulk rather than along the contact interface, a hemispherical wear particle is formed.

### Governing Formulation
$$\text{Eq. (1):} \quad V = K \frac{W \cdot L}{H}$$

In local differential form for distributed contact pressure $p(\mathbf{x})$:
$$\text{Eq. (2):} \quad \frac{dh(\mathbf{x})}{ds} = k_D \cdot p(\mathbf{x}) = \frac{K}{H} \cdot p(\mathbf{x})$$

Where:
- $V$: Total wear volume ($\text{m}^3$ or $\text{mm}^3$).
- $K$: Dimensionless Archard wear coefficient (probability of wear particle detachment per junction encounter, dimensionless, typically $10^{-7}$ to $10^{-2}$).
- $W$: Normal load ($\text{N}$).
- $L$: Total sliding distance ($\text{m}$).
- $H$: Penetration hardness of the softer contacting partner ($\text{Pa} = \text{N}/\text{m}^2$ or $\text{MPa}$).
- $h(\mathbf{x})$: Local wear depth ($\text{m}$ or $\mu\text{m}$).
- $s$: Relative sliding distance increment ($\text{m}$).
- $k_D = K / H$: Dimensional wear coefficient ($\text{m}^3/(\text{N}\cdot\text{m})$ or $\text{mm}^3/(\text{N}\cdot\text{m})$ or $\text{Pa}^{-1}$).
- $p(\mathbf{x})$: Local contact pressure ($\text{Pa}$ or $\text{MPa}$).

### Assumptions & Validity Range
1. Plastic deformation at all active asperity junctions: real area of contact $A_r = W / H$.
2. Hemispherical asperity tips and wear particles of radius $r$, giving volume $v_p = \frac{2}{3}\pi r^3$ and contact area $\pi r^2$.
3. Constant hardness $H$; no strain hardening or thermal softening considered.
4. Mild, steady-state wear without third-body layer accumulation or surface topography alteration.
5. $K$ is assumed constant throughout the sliding process.

### Limitations
- $K$ is an empirical catch-all parameter spanning $10^{-8}$ (mild lubricated) to $10^{-2}$ (severe dry adhesion).
- Ignores surface roughness evolution, temperature rise, debris trapping, and multi-regime transitions.

---

## 2. Rabinowicz Theory & Asperity-Level Material Detachment

### Primary References
- **Citation 1:** Rabinowicz, E. (1958). "The Effect of Size on the Looseness of Wear Fragments." *Wear*, 2(1), 4–8. DOI: [10.1016/0043-1648(58)90339-4](https://doi.org/10.1016/0043-1648(58)90339-4)
- **Citation 2:** Aghababaei, R., Warner, D. H., & Molinari, J.-F. (2016). "Critical length scale controls adhesive wear mechanisms." *Nature Communications*, 7, 11816. DOI: [10.1038/ncomms11816](https://doi.org/10.1038/ncomms11816)
- **Inspection Status:** Full text inspected for both references.

### Physical Mechanism
Rabinowicz postulated an energy criterion for the detachment of adhesive wear particles: a particle can only separate if the elastic strain energy stored in the deformed volume exceeds the surface energy required to create new free fracture surfaces. 

In 2016, Aghababaei, Warner, and Molinari extended this through atomistic and cohesive-zone mechanics, discovering a fundamental **critical length scale ($d^*$)**:
- When junction diameter $d < d^*$: Asperities accommodate shear by ductile plastic flow without particle detachment (surface smoothing / atom-by-atom burnishing).
- When junction diameter $d \ge d^*$: Elastic energy release drives crack propagation across the junction root, liberating a discrete debris fragment.

### Governing Formulations
Rabinowicz's classical minimal fragment diameter:
$$\text{Eq. (3):} \quad d_{\min} \approx 60,000 \, \frac{\gamma_{adh}}{H}$$

Aghababaei-Warner-Molinari critical junction diameter:
$$\text{Eq. (4):} \quad d^* = \Lambda \cdot \frac{\Delta w \cdot G}{\tau_c^2} \approx \lambda \cdot \frac{\Delta w \cdot E}{\sigma_Y^2}$$

Where:
- $d^*$: Critical junction diameter ($\text{m}$ or $\mu\text{m}$).
- $\Delta w = \gamma_1 + \gamma_2 - \gamma_{12}$: Work of adhesion / Dupre adhesive energy ($\text{J}/\text{m}^2$).
- $G$: Shear modulus ($\text{Pa}$).
- $E$: Young's modulus ($\text{Pa}$).
- $\tau_c$: Interface junction shear strength ($\text{Pa}$).
- $\sigma_Y$: Material yield strength ($\text{Pa}$).
- $\Lambda, \lambda$: Dimensionless geometric coefficients ($\approx 0.5$ to $2.0$ depending on junction aspect ratio).

### Applicability to this Project
Provides the physical threshold for Model C (Rough Surface Contact): asperity contacts smaller than $d^*$ undergo plastic flattening without volume loss, while contacts exceeding $d^*$ generate wear debris.

---

## 3. Rough-Surface Contact Mechanics & Asperity Interactions

### Primary Reference
- **Citation:** Zhang, H., Goltsberg, R., & Etsion, I. (2022). "Modeling Adhesive Wear in Asperity and Rough Surface Contacts: A Review." *Materials*, 15(19), 6855.
- **DOI:** [10.3390/ma15196855](https://doi.org/10.3390/ma15196855)
- **Accessible Source:** Open Access via MDPI / PubMed Central (PMC9573368).
- **Inspection Status:** Full text inspected.

### Physical Problem & Review Scope
Zhang, Goltsberg, and Etsion comprehensively evaluate analytical and numerical adhesive wear models from single-asperity contacts to Gaussian and non-Gaussian rough surfaces. They contrast the Greenwood-Williamson (GW) statistical model, Chang-Etsion-Bogy (CEB) elastic-plastic model, and Kogut-Etsion (KE) finite element solution.

### Governing Formulations
For a rough surface with summit height distribution $\phi(z)$, summit density $\eta$, and average summit radius $R$, contacting a flat counterface at separation distance $d$:

$$\text{Eq. (5):} \quad A_r(d) = \eta A_0 \int_{d}^{\infty} A_{asp}(z - d) \, \phi(z) \, dz$$
$$\text{Eq. (6):} \quad W(d) = \eta A_0 \int_{d}^{\infty} W_{asp}(z - d) \, \phi(z) \, dz$$

Where for elastic contacts (Hertz):
$$A_{asp}(\omega) = \pi R \omega, \quad W_{asp}(\omega) = \frac{4}{3} E^* R^{1/2} \omega^{3/2}$$

And for fully plastic contacts ($\omega \ge \omega_c = \left(\frac{\pi K_H H}{2 E^*}\right)^2 R$):
$$A_{asp}(\omega) = 2 \pi R \omega, \quad W_{asp}(\omega) = 2 \pi R \omega H$$

The plasticity index $\psi$ (Greenwood & Williamson 1966) dictates the contact regime:
$$\text{Eq. (7):} \quad \psi = \frac{E^*}{H} \sqrt{\frac{\sigma_s}{R}}$$
- $\psi < 0.6$: Predominantly elastic contact; low adhesive wear.
- $0.6 \le \psi \le 1.0$: Elasto-plastic transition.
- $\psi > 1.0$: Predominantly plastic asperity contact; Archard plastic regime valid.

---

## 4. Energy-Based Wear Models

### Primary References
- **Citation 1:** Choudhry, J., Almqvist, A., & Larsson, R. (2024). "Improving Archard’s Wear Model: An Energy-Based Approach." *Tribology Letters*, 72(3), Article 93. DOI: [10.1007/s11249-024-01888-8](https://doi.org/10.1007/s11249-024-01888-8)
- **Citation 2:** Fouvry, S., Kapsa, P., & Vincent, L. (1996). "Quantification of fretting damage." *Wear*, 200(1–2), 186–205. DOI: [10.1016/S0043-1648(96)07306-1](https://doi.org/10.1016/S0043-1648(96)07306-1)
- **Inspection Status:** Full text inspected for both references.

### Physical Mechanism & Derivation
Traditional wear laws assume wear volume is solely a function of load and distance. The energy approach recognizes that wear is a dissipative thermodynamic process driven by the **friction work** dissipated at the interface.

Fouvry et al. (1996) formulated the accumulated dissipated friction energy density:
$$\text{Eq. (8):} \quad E_d = \int_0^s \tau(\mathbf{x}, t) \, ds = \int_0^s \mu(\mathbf{x}, t) \, p(\mathbf{x}, t) \, ds$$

The local wear depth $h(\mathbf{x})$ is directly proportional to $E_d$:
$$\text{Eq. (9):} \quad dh(\mathbf{x}) = \alpha_{\text{wear}} \cdot dE_d(\mathbf{x}) = \alpha_{\text{wear}} \cdot \mu \cdot p(\mathbf{x}) \, ds$$
Total volumetric wear is the spatial integral:
$$\text{Eq. (10):} \quad V = \alpha_{\text{wear}} \cdot \sum E_d = \alpha_{\text{wear}} \int_A \int_0^s \tau(\mathbf{x}, t) \, ds \, dA$$

Where:
- $\alpha_{\text{wear}}$: Specific energy wear coefficient ($\text{m}^3/\text{J}$ or $\text{mm}^3/\text{J}$).
- $E_d$: Dissipated frictional energy density ($\text{J}/\text{m}^2$).
- $\sum E_d$: Total accumulated dissipated energy ($\text{J}$).
- $\tau(\mathbf{x})$: Local shear traction ($\text{Pa}$).
- $\mu$: Coefficient of friction (dimensionless).

### Choudhry et al. (2024) Deformation Energy Upgrade
Choudhry, Almqvist, and Larsson reformulate the wear coefficient $K$ as a spatially variable function of accumulated plastic deformation energy $U_{\text{def}}(\mathbf{x})$:
$$\text{Eq. (11):} \quad K(\mathbf{x}) = K_0 \cdot \left[1 + \beta \left(\frac{U_{\text{def}}(\mathbf{x})}{U_{\text{crit}}}\right)^m\right]$$
This links Boundary Element Method (BEM) elastic-plastic displacement fields directly with the spatial wear rate, capturing asperity collision damage without requiring empirical curve-fitting.

---

## 5. Third-Body Formation, Transport, Retention, and Ejection

### Primary Reference
- **Citation:** Fillot, N., Iordanoff, I., & Berthier, Y. (2007). "Wear modeling and the third body concept." *Wear*, 262(7–8), 949–957.
- **DOI:** [10.1016/j.wear.2006.10.011](https://doi.org/10.1016/j.wear.2006.10.011)
- **Accessible Source:** Elsevier / ScienceDirect.
- **Inspection Status:** Full text inspected.

### Physical Mechanism
Maurice Godet (1984) and Yves Berthier (1990) introduced the **third-body concept**: rubbing first bodies do not shed material directly to the environment; detached fragments form an intermediate interfacial layer (the third body) consisting of wear debris, compacted oxide patches, and mechanically mixed layers.

Fillot, Iordanoff, and Berthier (2007) formalized the **Tribological Circuit** via interfacial mass conservation:
$$\text{Eq. (12):} \quad \frac{dM_{3B}(t)}{dt} = Q_s(t) - Q_e(t)$$

Where:
- $M_{3B}$: Mass of the third-body debris layer trapped within the contact ($\text{kg}$ or $\text{g}$).
- $Q_s$: **Source flow** (mass detachment rate from the first bodies into the debris bed, $\text{kg}/\text{s}$).
- $Q_e$: **Ejection flow** (mass loss escaping the contact edges, representing net macroscopic wear, $\text{kg}/\text{s}$).

### Screening and Retention Dynamics
The trapped third-body layer acts as a mechanical screen, cushioning direct asperity-asperity collisions and reducing the source flow $Q_s$:
$$\text{Eq. (13):} \quad Q_s(t) = Q_{s,0} \cdot \exp\left(-\beta_{\text{screen}} \cdot \frac{M_{3B}(t)}{M_{\max}}\right)$$
The ejection flow depends on sliding velocity $v$, contact half-width $a$, and interfacial adhesion:
$$\text{Eq. (14):} \quad Q_e(t) = \kappa_{\text{eject}} \cdot M_{3B}(t) \cdot \frac{v}{2a}$$

### Net External Wear Volume
The net measurable wear volume $V_{\text{meas}}(t)$ is determined strictly by the ejected debris:
$$\text{Eq. (15):} \quad V_{\text{meas}}(t) = \frac{1}{\rho_{\text{debris}}} \int_0^t Q_e(t') \, dt'$$
This explains the classic **run-in to steady-state transition**: initial sliding rapidly generates third bodies ($Q_s \gg Q_e$), building an interfacial bed until dynamic equilibrium ($Q_s = Q_e$) is achieved.

---

## 6. Fretting Wear & Cyclic Evolution

### Primary Reference
- **Citation:** Arnaud, P., Baydoun, S., & Fouvry, S. (2021). "Modeling adhesive and abrasive wear phenomena in fretting interfaces: A multiphysics approach coupling friction energy, third body and contact oxygenation concepts." *Tribology International*, 161, Article 107077.
- **DOI:** [10.1016/j.triboint.2021.107077](https://doi.org/10.1016/j.triboint.2021.107077)
- **Accessible Source:** ScienceDirect / Tribology International.
- **Inspection Status:** Full text inspected.

### Physical Problem & Multiphysics Coupling
Under small-displacement oscillatory sliding (fretting), the wear regime transitions spatially between abrasive (oxidational) and adhesive (metallic transfer) wear based on oxygen availability.

Arnaud, Baydoun, and Fouvry couple:
1. **Frictional Energy Dissipation:** Local wear depth $dh = \alpha(x) \cdot q(x) \cdot ds$.
2. **Contact Oxygenation Concept (COC):** Advection-Dispersion-Reaction (ADR) governing equation for partial pressure of di-oxygen $P_{\text{O}_2}(x, t)$ through the porous third-body bed:
$$\text{Eq. (16):} \quad \frac{\partial C_{\text{O}_2}}{\partial t} + \frac{\partial(v_x C_{\text{O}_2})}{\partial x} = D_{\text{eff}} \frac{\partial^2 C_{\text{O}_2}}{\partial x^2} - k_{\text{ox}} C_{\text{O}_2}$$
3. **Threshold Regime Selection:**
$$\text{Eq. (17):} \quad \alpha(x) = \begin{cases} \alpha_{\text{abrasive}} & \text{if } P_{\text{O}_2}(x) > P_{\text{O}_2}^{\text{crit}} \quad (\text{oxidized protective debris}) \\ \alpha_{\text{adhesive}} & \text{if } P_{\text{O}_2}(x) \le P_{\text{O}_2}^{\text{crit}} \quad (\text{severe metal-metal microwelding}) \end{cases}$$
With $\alpha_{\text{adhesive}} \gg \alpha_{\text{abrasive}}$. This model accurately reproduces the transition from U-shaped to W-shaped wear scar profiles observed experimentally in fretting fatigue.

---

## 7. Numerical Wear Simulation & Spatial Profile Evolution

### Primary References
- **Citation 1:** Podra, P., & Andersson, S. (1999). "Simulating sliding wear with finite element method." *Tribology International*, 32(2), 71–81. DOI: [10.1016/S0301-679X(99)00012-2](https://doi.org/10.1016/S0301-679X(99)00012-2)
- **Citation 2:** Hegadekatte, V., Kurzenhäuser, S., Huber, N., & Kraft, O. (2005). "A predictive modeling approach for simulations of wear in sliding contacts." *Tribology Letters*, 17(4), 741–749. DOI: [10.1007/s11249-005-3603-7](https://doi.org/10.1007/s11249-005-3603-7)
- **Inspection Status:** Full text inspected for both references.

### Formulation & Numerical Discretization
In continuous sliding or reciprocating motion, contact pressure $p(x)$ dynamically redistributes as the contacting surfaces wear away. Simulating spatial wear profiles requires coupling contact mechanics with iterative geometry updates:

1. **Initial Contact State:** For a cylinder-on-flat geometry of radius $R'$ and equivalent modulus $E^*$, the Hertzian semi-contact width $a_0$ and peak pressure $p_0$ are:
$$\text{Eq. (18):} \quad a_0 = \sqrt{\frac{4 W' R'}{\pi E^*}}, \quad p_0 = \frac{2 W'}{\pi a_0}$$
Where $W'$ is the normal load per unit length.

2. **Discrete Wear Increment:** Over a sliding increment $\Delta s = v \cdot \Delta t$ or cycle step $\Delta N$:
$$\text{Eq. (19):} \quad \Delta h_k(x) = k_D \cdot p_k(x) \cdot \Delta s$$
3. **Geometry & Contact Pressure Update:** The gap function $g_{k+1}(x)$ increases by the local wear depth:
$$\text{Eq. (20):} \quad g_{k+1}(x) = g_k(x) + \Delta h_k(x)$$
As $g(x)$ deepens at the center, the contact width expands ($a_k > a_0$), causing the peak contact pressure to drop and flatten into a conformal contact pressure profile.
4. **Relaxation & Convergence Criterion:**
$$\text{Eq. (21):} \quad \int_{-a}^{a} p_{k+1}(x) \, dx = W', \quad \frac{\|p_{k+1} - p_k\|_\infty}{\|p_k\|_\infty} < \varepsilon_{\text{tol}}$$

---

## 8. Experimental Validation Methodologies

### Standards & Measurement Protocols
- **ASTM G99:** Standard Test Method for Wear Testing with a Pin-on-Disk Apparatus.
- **ASTM G133:** Standard Test Method for Linearly Reciprocating Ball-on-Flat Commercial Wear Testing.
- **Profilometry:** 2D stylus profilometry and 3D optical white-light interferometry for cross-sectional area $A_{\text{scar}}$ and maximum depth $h_{\max}$.

### Quantitative Validation Metrics
Volumetric wear calculation from 2D profile integration along stroke length $L_{\text{stroke}}$:
$$\text{Eq. (22):} \quad V_{\text{exp}} = L_{\text{stroke}} \int_{-a}^{a} h_{\text{meas}}(x) \, dx$$
Model prediction accuracy must be validated using:
- **Mean Absolute Error (MAE):** $\text{MAE} = \frac{1}{N}\sum |y_i - \hat{y}_i|$
- **Root Mean Square Error (RMSE):** $\text{RMSE} = \sqrt{\frac{1}{N}\sum (y_i - \hat{y}_i)^2}$
- **Coefficient of Determination ($R^2$):** $R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$

---

## 9. Machine Learning in Tribology

### Review of Published Literature
Recent literature (e.g., Argatov 2020; Marian et al. 2022) demonstrates that standard machine learning algorithms (Random Forest, Gradient Boosted Trees / XGBoost, Multi-Layer Perceptrons) achieve strong statistical correlations on multi-parameter wear datasets. 

Key insights:
- Pure data-driven models often capture nonlinear temperature, sliding speed, and roughness interactions better than single-term analytical formulas.
- However, unconstrained machine learning models risk violating physical bounds: predicting negative wear volume, predicting non-zero wear at zero sliding distance, or predicting severe wear under zero normal load.

---

## 10. Physics-Informed & Hybrid Physics-ML Modeling

### Formulations
To ensure physical consistency while leveraging data-driven accuracy, two primary hybrid architectures are supported in literature:

1. **Residual Physics-ML Formulation:**
A physics baseline (e.g., Archard's law or Energy wear) predicts the dominant nominal wear $V_{\text{phys}}(\mathbf{x})$. The machine learning model learns the residual discrepancy $\Delta V_{\text{res}}$ arising from thermal softening, roughness, and speed effects:
$$\text{Eq. (23):} \quad V_{\text{pred}}(\mathbf{x}) = V_{\text{phys}}(\mathbf{x}) + f_{\text{ML}}^{\text{residual}}(\mathbf{x})$$

2. **Calibrated Physical Parameter Formulation:**
The machine learning model predicts the effective physical wear coefficient $K_{\text{eff}}(\mathbf{x})$ as a function of contact state, which is then passed into the physically exact governing equation:
$$\text{Eq. (24):} \quad K_{\text{eff}}(\mathbf{x}) = g_{\text{ML}}(p, v, T, R_a, \mu)$$
$$\text{Eq. (25):} \quad V_{\text{pred}}(\mathbf{x}) = \frac{K_{\text{eff}}(\mathbf{x}) \cdot W \cdot L}{H(T)}$$

Where $H(T) = H_0 \exp(-\beta (T - T_0))$ enforces thermal softening physics.

---

## Summary of Reference Traceability

| Model ID | Physical Mechanism | Primary Citation | DOI / URL | Implementation Module |
|---|---|---|---|---|
| **Model A** | Classical Archard Law | Archard (1953) | [10.1063/1.1721448](https://doi.org/10.1063/1.1721448) | `tribology_core/archard.py` |
| **Model B** | Energy-Based Wear | Choudhry et al. (2024), Fouvry et al. (1996) | [10.1007/s11249-024-01888-8](https://doi.org/10.1007/s11249-024-01888-8) | `tribology_core/energy_wear.py` |
| **Model C** | Rough Surface & Asperity Detachment | Zhang et al. (2022), Aghababaei et al. (2016) | [10.3390/ma15196855](https://doi.org/10.3390/ma15196855), [10.1038/ncomms11816](https://doi.org/10.1038/ncomms11816) | `tribology_core/rough_surface.py` |
| **Model D** | Third-Body Mass Balance | Fillot, Iordanoff, Berthier (2007) | [10.1016/j.wear.2006.10.011](https://doi.org/10.1016/j.wear.2006.10.011) | `tribology_core/third_body.py` |
| **Model E** | Spatial Wear Profile & Solver | Arnaud et al. (2021), Podra & Andersson (1999) | [10.1016/j.triboint.2021.107077](https://doi.org/10.1016/j.triboint.2021.107077) | `tribology_core/profile_solver.py` |
| **Hybrid** | Physics-Informed ML & Residuals | Marian et al. (2022), Argatov (2020) | Comprehensive PIML Tribology Review | `ml/hybrid_model.py` |
