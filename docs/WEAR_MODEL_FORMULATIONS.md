# WEAR MODEL FORMULATIONS: DERIVATIONS, UNITS, AND IMPLEMENTATION DETAILS

**Project:** AI-Driven Prediction, Explainability and Optimization of Adhesive Wear  
**Author:** Tribology & Computational Mechanics Research Group  
**Document:** `docs/WEAR_MODEL_FORMULATIONS.md`  
**Date:** October 2026  
**Status:** Validated Technical Specification  

---

## 1. Notation and SI Unit Standards

All computations in this project adhere strictly to the International System of Units (SI) internally, with documented conversion factors for engineering units:
- **Length / Spatial coordinate ($x, y, z$):** Meters ($\text{m}$) internally; millimeters ($\text{mm}$) or micrometers ($\mu\text{m}$) in presentation.
- **Normal load ($W, F_N$):** Newtons ($\text{N}$).
- **Contact pressure ($p$):** Pascals ($\text{Pa} = \text{N}/\text{m}^2$) internally; megapascals ($\text{MPa} = 10^6 \, \text{Pa}$) in UI.
- **Material hardness ($H$):** Pascals ($\text{Pa}$) internally; gigapascals ($\text{GPa} = 10^9 \, \text{Pa}$) in UI.
- **Elastic modulus ($E$):** Pascals ($\text{Pa}$) internally; gigapascals ($\text{GPa}$) in UI.
- **Frictional energy ($E_d$):** Joules ($\text{J} = \text{N}\cdot\text{m}$).
- **Energy density ($e_d$):** Joules per square meter ($\text{J}/\text{m}^2$).
- **Wear volume ($V$):** Cubic meters ($\text{m}^3$) internally; cubic millimeters ($\text{mm}^3 = 10^{-9} \, \text{m}^3$) in UI.
- **Wear depth ($h$):** Meters ($\text{m}$) internally; micrometers ($\mu\text{m} = 10^{-6} \, \text{m}$) in UI.
- **Specific wear rate ($w_r = V / L$):** $\text{m}^3/\text{m} = \text{m}^2$ internally; $\text{mm}^3/\text{m}$ in UI.
- **Dimensional wear coefficient ($k_D$):** $\text{m}^3/(\text{N}\cdot\text{m}) = \text{Pa}^{-1}$ internally; $\text{mm}^3/(\text{N}\cdot\text{m}) = 10^{-9} \, \text{Pa}^{-1}$.
- **Energy wear coefficient ($\alpha_{\text{wear}}$):** $\text{m}^3/\text{J} = \text{m}^2/\text{N} = \text{Pa}^{-1}$ internally; $\text{mm}^3/\text{J} = 10^{-9} \, \text{m}^3/\text{J}$.

---

## 2. Model A: Classical Archard Wear Law (Baseline)

### 2.1 Published Form
From Archard (1953), "Contact and Rubbing of Flat Surfaces", Eq. (7):
$$V = K \frac{W \cdot L}{H}$$

Local differential form:
$$\frac{dh(x)}{ds} = k_D \cdot p(x) = \frac{K}{H} \cdot p(x)$$

### 2.2 Physical Derivation
1. **Asperity Junction Formation:** When two rough surfaces meet under normal load $W$, contact occurs only at microscopic summits (asperities).
2. **Plastic Yielding:** At the asperity tips, intense local stress causes plastic deformation. The real contact area $A_r$ is determined by the softer material's Meyer hardness (plastic indentation resistance $H$):
   $$A_r = \sum_i a_i = \frac{W}{H}$$
3. **Single Asperity Shearing:** Consider an asperity junction with circular contact radius $a_i$ ($a_i \approx \sqrt{\omega R}$). During sliding through distance $2a_i$, the junction sustains contact. If fracture occurs in the bulk rather than at the interface, a hemispherical fragment of volume $\delta v_i = \frac{2}{3} \pi a_i^3$ is detached.
4. **Volume per Unit Sliding Distance:** The wear volume per unit sliding distance from this single event is:
   $$\frac{\delta v_i}{2 a_i} = \frac{\frac{2}{3}\pi a_i^3}{2 a_i} = \frac{1}{3} \pi a_i^2 = \frac{1}{3} a_i^{\text{area}}$$
5. **Probability of Detachment ($K$):** Most asperity collisions shear harmlessly at the interface. Let $K$ be the probability that an asperity encounter results in a detached wear particle.
6. **Summation across all active junctions:**
   $$\frac{dV}{dL} = K \sum_i \frac{\delta v_i}{2 a_i} = \frac{K}{3} A_r = \frac{K}{3} \frac{W}{H}$$
   Absorbing the geometric factor $\frac{1}{3}$ into the definition of $K$ (Archard convention):
   $$V = K \frac{W \cdot L}{H}$$

### 2.3 Symbol Table & Code Representation
| Symbol | SI Unit | Variable Name in Code | Physical Meaning |
|---|---|---|---|
| $V$ | $\text{m}^3$ | `wear_volume_m3` | Total volumetric material loss |
| $K$ | Dimensionless | `wear_coeff_K` | Dimensionless probability of wear detachment |
| $W$ | $\text{N}$ | `normal_load_N` | Total normal load applied to the contact |
| $L$ | $\text{m}$ | `sliding_distance_m` | Total cumulative sliding distance |
| $H$ | $\text{Pa}$ | `hardness_Pa` | Indentation hardness of softer body |
| $k_D$ | $\text{m}^3/(\text{N}\cdot\text{m})$ | `dimensional_wear_kd` | Dimensional wear coefficient ($k_D = K/H$) |
| $w_r$ | $\text{m}^3/\text{m}$ | `wear_rate_m3_per_m` | Volumetric wear rate per meter sliding |

### 2.4 Assumptions & Conditions of Validity
- Contact asperities deform purely plastically ($A_r = W/H$).
- Hardness $H$ remains constant during sliding (no thermal softening or work hardening).
- Detached particles leave the contact immediately (no third-body layer).
- Mild adhesive wear without gross seizure or galling.

### 2.5 Input Classification
- **Measurable:** Normal load $W$, sliding distance $L$, hardness $H$.
- **Calibrated:** Archard wear coefficient $K$ (fitted from calibration experiments).
- **Unavailable / Unaccounted:** Real-time interfacial temperature, debris screening, dynamic roughness changes.

### 2.6 Computational Form in Application
```python
def compute_archard_volume(normal_load_N: float, sliding_distance_m: float, hardness_Pa: float, K: float) -> float:
    assert normal_load_N >= 0.0, "Normal load must be non-negative"
    assert sliding_distance_m >= 0.0, "Sliding distance must be non-negative"
    assert hardness_Pa > 0.0, "Hardness must be strictly positive"
    assert 0.0 <= K <= 1.0, "Dimensionless K must be within [0, 1]"
    
    return (K * normal_load_N * sliding_distance_m) / hardness_Pa
```

### 2.7 Dimensional Consistency Check
$$[V] = \frac{[K] \cdot [W] \cdot [L]}{[H]} = \frac{1 \cdot \text{N} \cdot \text{m}}{\text{N}/\text{m}^2} = \text{m}^3 \quad \text{[CONSISTENT]}$$
$$[k_D] = \frac{[K]}{[H]} = \frac{1}{\text{N}/\text{m}^2} = \frac{\text{m}^2}{\text{N}} = \frac{\text{m}^3}{\text{N}\cdot\text{m}} \quad \text{[CONSISTENT]}$$

---

## 3. Model B: Energy-Based Wear Formulation

### 3.1 Published Form
From Fouvry et al. (1996) and Choudhry et al. (2024), Eq. (1):
$$V = \alpha_{\text{wear}} \cdot \sum E_d$$
Local wear depth:
$$dh(x) = \alpha_{\text{wear}} \cdot \tau(x) \cdot ds = \alpha_{\text{wear}} \cdot \mu \cdot p(x) \cdot ds$$

### 3.2 Physical Derivation
1. **Thermodynamic Basis:** Frictional contact converts mechanical work into interfacial shear work, plastic strain energy, and heat. Wear particle formation requires the expenditure of mechanical energy to sever atomic bonds and nucleate subsurface shear cracks.
2. **Dissipated Friction Energy Density:** At location $x$, under shear traction $\tau(x) = \mu \cdot p(x)$ and differential sliding increment $ds$:
   $$de_d(x) = \tau(x) \, ds = \mu \, p(x) \, ds \quad [\text{J}/\text{m}^2]$$
3. **Linear Energy Dissipation Hypothesis:** Assuming the volume of material removed is directly proportional to the total energy dissipated in frictional shearing:
   $$dh(x) = \alpha_{\text{wear}} \, de_d(x) = \alpha_{\text{wear}} \, \mu \, p(x) \, ds$$
4. **Integration over Contact Area $A$ and Sliding Distance $L$:**
   $$V = \int_A h(x) \, dA = \alpha_{\text{wear}} \int_A \int_0^L \mu \, p(x) \, ds \, dA = \alpha_{\text{wear}} \, \mu \, W \, L = \alpha_{\text{wear}} \, E_d^{\text{total}}$$
   Where $E_d^{\text{total}} = F_{\text{fric}} \cdot L = \mu W L$.

### 3.3 Symbol Table & Code Representation
| Symbol | SI Unit | Variable Name in Code | Physical Meaning |
|---|---|---|---|
| $E_d$ | $\text{J}$ | `energy_dissipated_J` | Cumulative dissipated friction energy |
| $\alpha_{\text{wear}}$ | $\text{m}^3/\text{J}$ or $\text{Pa}^{-1}$ | `alpha_wear_m3_per_J` | Specific energy wear coefficient |
| $\tau$ | $\text{Pa}$ | `shear_stress_Pa` | Local interfacial shear traction ($\tau = \mu \cdot p$) |
| $\mu$ | Dimensionless | `friction_coeff` | Dynamic coefficient of friction |
| $e_d$ | $\text{J}/\text{m}^2$ | `local_energy_density_J_per_m2` | Local dissipated energy density |

### 3.4 Equivalence with Archard's Law
Notice the exact physical connection:
$$V = \alpha_{\text{wear}} (\mu W L) = K \frac{W L}{H} \implies \alpha_{\text{wear}} = \frac{K}{\mu H} = \frac{k_D}{\mu}$$
The energy formulation naturally incorporates friction coefficient variations ($\mu$), making it superior under variable lubricated and boundary states where friction and wear decouple.

---

## 4. Model C: Asperity and Rough-Surface Wear (Greenwood-Williamson + Critical Length Scale)

### 4.1 Published Form
From Zhang, Goltsberg, and Etsion (2022), Eqs. (1)–(4), combined with Aghababaei et al. (2016):
$$A_r(d) = \eta A_0 \int_{d}^{\infty} A_{\text{asp}}(z - d) \phi(z) \, dz$$
$$d^* = \Lambda \frac{\Delta w \cdot G}{\tau_c^2}$$
Volumetric wear rate:
$$\dot{V} = \int_{z > d + \omega^*} V_{\text{det}}(z - d) \cdot \eta A_0 \phi(z) \cdot \frac{v}{2 r_{\text{contact}}} \, dz$$

### 4.2 Physical Derivation
1. **Gaussian Surface Topography:** Summit heights $z$ follow Gaussian distribution $\phi(z) = \frac{1}{\sigma_s \sqrt{2\pi}} \exp\left(-\frac{z^2}{2\sigma_s^2}\right)$.
2. **Asperity Interference:** For a mean plane separation $d$, an asperity of height $z > d$ experiences interference $\omega = z - d$.
3. **Contact Mechanics:** For spherical asperity tips of radius $R$:
   - Interference radius: $a(\omega) = \sqrt{\omega R}$.
   - Contact area: $A_{\text{asp}}(\omega) = \pi R \omega$.
   - Normal load: $W_{\text{asp}}(\omega) = \frac{4}{3} E^* R^{1/2} \omega^{3/2}$ (elastic) or $2 \pi R \omega H$ (plastic).
4. **Debris Detachment Criterion (Aghababaei et al. 2016):**
   - A junction produces wear debris if and only if junction diameter $2 a(\omega) \ge d^*$.
   - The critical interference is:
     $$\omega^* = \frac{(d^* / 2)^2}{R} = \frac{d^{*2}}{4 R}$$
   - When $\omega < \omega^*$: Plastic flattening occurs; zero volume loss ($V = 0$).
   - When $\omega \ge \omega^*$: Crack propagation detaches a debris particle of volume $v_p = \frac{2}{3} \pi a^3$.

### 4.3 Computational Form
The active debris-producing fraction of real contact area is:
$$f_{\text{wear}} = \frac{\int_{d + \omega^*}^{\infty} A_{\text{asp}}(z - d) \phi(z) \, dz}{\int_{d}^{\infty} A_{\text{asp}}(z - d) \phi(z) \, dz}$$
Effective wear volume:
$$V_{\text{rough}} = f_{\text{wear}} \cdot K_{\text{base}} \cdot \frac{W L}{H}$$

---

## 5. Model D: Third-Body Wear (Fillot-Berthier Mass Balance)

### 5.1 Published Form
From Fillot, Iordanoff, and Berthier (2007), Eqs. (1)–(3):
$$\frac{dM_{3B}(t)}{dt} = Q_s(t) - Q_e(t)$$
Net external measured wear volume:
$$V_{\text{meas}}(t) = \frac{1}{\rho_{\text{debris}}} \int_0^t Q_e(t') \, dt'$$

### 5.2 Physical Derivation
1. **Tribological Circuit:** Contacting bodies 1 and 2 do not directly lose mass to the outside environment. Detached material first feeds the **interfacial third-body reservoir** ($M_{3B}$).
2. **Source Flow ($Q_s$):** Nascent material detachment rate from pristine first bodies:
   $$Q_s(t) = Q_{s,0} \cdot \exp\left(-\beta_{\text{screen}} \frac{M_{3B}(t)}{M_{\max}}\right)$$
   Where $Q_{s,0} = \rho \cdot \dot{V}_{\text{Archard}} = \rho \cdot \frac{K W v}{H}$. As the third-body layer builds up, it cushions asperity collisions, shielding first bodies from direct metallic shear (**screening effect**).
3. **Ejection Flow ($Q_e$):** Debris pushed to the edges of the contact is permanently evacuated:
   $$Q_e(t) = \kappa_{\text{eject}} \cdot M_{3B}(t) \cdot \frac{v}{2a}$$
   Where $2a$ is contact width, $v$ is sliding velocity, and $\kappa_{\text{eject}}$ is the dimensionless ejection probability per transit.
4. **Analytical Steady-State Solution:**
   Setting $dM_{3B}/dt = 0 \implies Q_s = Q_e$:
   $$M_{3B}^{\text{steady}} \approx \frac{Q_{s,0}}{\kappa_{\text{eject}} \frac{v}{2a} + \frac{Q_{s,0} \beta_{\text{screen}}}{M_{\max}}}$$
   At steady state, the net external wear rate equals $Q_e = Q_s$. During the initial running-in period ($M_{3B} \approx 0$), $Q_s \gg Q_e$, meaning external mass loss is minimal while the interfacial third-body layer builds up.

---

## 6. Model E: Spatial Wear Profile and Numerical Solver

### 6.1 Published Form
From Arnaud, Baydoun, and Fouvry (2021) and Podra & Andersson (1999):
$$p_0(x) = p_{\max} \sqrt{1 - (x/a)^2}$$
$$h_{k+1}(x) = h_k(x) + k_D \cdot p_k(x) \cdot \Delta s$$

### 6.2 Numerical Method & Profile Evolution Solver
1. **Spatial Discretization:** The contact width $[-a_{\max}, a_{\max}]$ is discretized into $M$ uniformly spaced nodes $x_i = -a + i \Delta x$.
2. **Initial Contact Pressure:** Hertzian line contact:
   $$a_0 = \sqrt{\frac{4 W' R'}{\pi E^*}}, \quad p_0(x) = \frac{2 W'}{\pi a_0} \sqrt{1 - \left(\frac{x}{a_0}\right)^2}$$
3. **Local Depth Increment:** For each cycle or distance increment $\Delta s$:
   $$\Delta h_k(x_i) = k_D \cdot p_k(x_i) \cdot \Delta s$$
4. **Contact Pressure Relaxation:** As center material wears away, the gap $g(x)$ widens, transferring contact load toward the unworn shoulders. We solve the elastic half-space Winkler / BEM relation under total load equilibrium:
   $$p_{k+1}(x_i) = \max\left(0, \frac{W' - \int E^* \frac{g(x) - h(x)}{R'} dx}{2 a_k} + \dots\right)$$
   Enforcing $\int_{-a_k}^{a_k} p_{k+1}(x) \, dx = W'$.

---

## 7. Comparative Model Matrix

| Feature | Model A (Archard) | Model B (Energy) | Model C (Rough Surface) | Model D (Third-Body) | Model E (Spatial Solver) |
|---|---|---|---|---|---|
| **Governing Quantity** | Load $W$, Hardness $H$ | Dissipated Energy $E_d$ | Asperity heights $\phi(z)$, $d^*$ | Mass flows $Q_s, Q_e$ | Pressure profile $p(x)$ |
| **Spatially Resolved?** | No (Lumped) | Optional | Asperity scale | Lumped / 1D | Yes (1D / 2D mesh) |
| **Friction Sensitivity** | None | Direct ($\mu$) | Asperity shear | Rheological shear | Local shear traction |
| **Running-in Dynamics** | Not captured | Linear only | Smoothing threshold | Explicitly captured | Contact flattening |
| **Computational Cost** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | $\mathcal{O}(N_{\text{quad}})$ | $\mathcal{O}(N_{\text{steps}})$ ODE | $\mathcal{O}(M \times N_{\text{steps}})$ |
| **Primary Limitation** | Constant $K$ assumption | Requires calibrated $\alpha$ | Micro-parameters required | Ejection coeff unknown | Boundary compliance |

---

## 8. Traceability to Code and Tests

| Model | Primary Implementation File | Unit Test File | Benchmark Reference |
|---|---|---|---|
| **Model A** | `backend/app/tribology_core/archard.py` | `tests/test_tribology_core.py` | Hand calculation (W=200N, L=1000m, H=4GPa, K=1e-4 -> V=5.0 mm³) |
| **Model B** | `backend/app/tribology_core/energy_wear.py` | `tests/test_tribology_core.py` | Fouvry (1996) steel fretting energy coefficient $\alpha = 4.5 \times 10^{-15} \, \text{m}^3/\text{J}$ |
| **Model C** | `backend/app/tribology_core/rough_surface.py` | `tests/test_tribology_core.py` | Aghababaei (2016) $d^*$ threshold transition for steel ($d^* \approx 0.8 \, \mu\text{m}$) |
| **Model D** | `backend/app/tribology_core/third_body.py` | `tests/test_tribology_core.py` | Fillot (2007) mass balance conservation $\Delta M_{3B} = \int (Q_s - Q_e) dt$ |
| **Model E** | `backend/app/tribology_core/profile_solver.py` | `tests/test_tribology_core.py` | Podra & Andersson (1999) conformal flattening and Hertzian initial peak |
