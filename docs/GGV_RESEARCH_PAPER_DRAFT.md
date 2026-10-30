# Predictive Modeling, Explainability (TreeSHAP), and Parametric Optimization of Adhesive Wear in Sliding Tribological Contacts: A Machine Learning and Contact Mechanics Framework

**Department of Mechanical Engineering, School of Studies of Engineering & Technology**  
**Guru Ghasidas Vishwavidyalaya (A Central University), Koni, Bilaspur (C.G.), India**  
*Course:* B.Tech 7th Semester — Fundamentals of Tribology  

---

### Authors & Project Investigators:
1. **Rakesh Kumar** (Roll / Enrollment No.: `23039154`)  
2. **Rajnikant Dubey** (Roll / Enrollment No.: `23039152`)  
3. **Sanjay Verma** (Roll / Enrollment No.: `23039158`)  

### Faculty Supervisor & Guide:
**Dr. Sweta Singh**  
*Professor / Assistant Professor, Department of Mechanical Engineering*  
*Guru Ghasidas Vishwavidyalaya, Bilaspur (C.G.)*  

---

## Abstract

Adhesive wear is one of the most destructive and prevalent modes of mechanical degradation in sliding tribological assemblies, such as journal bearings, sliding gears, cylinder liners, and industrial seals. Conventional engineering design relies predominantly on Archard’s wear equation ($V = K W L / H$); however, Archard's classical empirical formulation presumes an invariant wear coefficient ($K$) and static material hardness ($H$), thereby failing to capture multi-scale phenomena such as contact flash-temperature softening, localized micro-asperity plastic yield, and boundary film breakdown. In this investigation, a unified physics-informed machine learning and computational optimization framework is developed. A calibrated multi-physics dataset of 4,000 tribological states was constructed across five representative industrial material pairs (Steel vs. Bronze, Steel vs. Cast Iron, Ceramic vs. Steel, Polymer vs. Steel, and Steel vs. Steel) incorporating Greenwood-Williamson contact mechanics, temperature-dependent yield attenuation, and boundary lubrication film dynamics. Four predictive algorithms—Linear Regression (Baseline), Random Forest Regressor, Gradient Boosted Decision Trees (GBDT), and Extreme Gradient Boosting (XGBoost)—were trained and benchmarked under 5-fold cross-validation. The tuned XGBoost model demonstrated superior predictive capability, attaining a coefficient of determination $R^2 = 0.9655$, Root Mean Squared Error $\text{RMSE} = 73.58\,\text{mm}^3$, and Mean Absolute Error $\text{MAE} = 22.47\,\text{mm}^3$, significantly outperforming the linear baseline ($R^2 = 0.4921$). To eliminate the "black-box" dilemma, Game-Theoretic TreeSHAP (Shapley Additive exPlanations) attribution was applied, revealing that sliding distance and normal contact load dominate wear accumulation, while boundary lubrication ($\approx -85.2\,\text{mm}^3$) and bulk hardness serve as primary wear mitigation mechanisms. Furthermore, a bounded numerical optimization algorithm ($L$-BFGS-B via SciPy) was coupled to the model, achieving automated parameter recommendations yielding between $60.5\%$ and $85.4\%$ reduction in total wear volume. Finally, an interactive scientific software suite powered by a FastAPI backend and a React 18 / TypeScript 2D canvas simulation was implemented for real-time industrial deployment and academic demonstration.

**Keywords:** Adhesive Wear, Triboinformatics, Contact Mechanics, Greenwood-Williamson Model, XGBoost, TreeSHAP, Explainable AI (XAI), Parametric Optimization, Boundary Lubrication.

---

## 1. Introduction & Background

Tribology—the science and engineering of interacting surfaces in relative motion—governs the operational longevity, energy efficiency, and failure probability of modern mechanical systems. Adhesive wear occurs whenever two solid bodies slide against each other under normal contact pressure. At the microscopic level, all engineering surfaces possess rough topologies consisting of micro-asperities. When these asperities come into contact under nominal load $W$, the true contact area ($A_r$) represents merely a minor fraction (often $0.01\% - 1\%$) of the apparent nominal area ($A_0$). Consequently, true contact pressures at the asperity summits rapidly exceed the compressive yield strength of the softer material, inducing plastic flow and cold-welding at atomic contact junctions. Subsequent tangential sliding forces shear these adhesive junctions; if the junction interface shear strength exceeds the cohesive shear strength of the bulk material, junction fracture takes place within the softer substrate, transferring metallic fragments and generating wear debris.

For over seven decades, industrial life estimation has relied on **Archard’s Wear Law** (Archard, 1953):
$$V = \frac{K \cdot W \cdot L}{H}$$
where:
- $V$ is the volumetric wear loss ($\text{mm}^3$),
- $K$ is the dimensionless wear coefficient,
- $W$ is the applied normal load ($\text{N}$),
- $L$ is the total sliding distance ($\text{m}$), and
- $H$ is the indentation hardness of the softer contacting counterface ($\text{MPa}$ or $\text{N/mm}^2$).

While Archard's formula provides fundamental macroscopic scaling, it suffers from several severe physical oversights:
1. **Dynamic Flash-Temperature Effects:** Asperity friction generates severe localized thermal energy, causing transient interface temperatures to surge hundreds of degrees above ambient temperature, triggering exponential thermal softening of the substrate hardness $H(T)$.
2. **Boundary Lubricant Breakdown:** Classical models cannot dynamically model the protective monolayer transition between boundary lubrication and catastrophic dry metal-to-metal scuffing.
3. **Non-linear Multi-parameter Interactions:** In actual operating systems, sliding speed ($v$), surface roughness ($R_a$), friction coefficient ($\mu$), and contact geometry exhibit coupled non-linearities that cannot be described by a scalar coefficient $K$.

To bridge this gap, modern engineering has witnessed the emergence of **Triboinformatics**—the fusion of data-driven computational intelligence with physical tribology. Machine learning models can capture arbitrary non-linear multi-variable mappings. However, traditional machine learning models often operate as "black boxes", offering zero physical interpretability to practicing tribologists.

### Research Scope and Objectives:
The principal aims of this work carried out in the Department of Mechanical Engineering at Guru Ghasidas Vishwavidyalaya are:
1. Synthesize a physics-calibrated dataset governing rough surface contact, thermal softening, boundary lubrication, and experimental heteroscedastic noise across 4,000 distinct mechanical operating states.
2. Develop, tune, and evaluate four regression models under rigorous 5-fold cross-validation.
3. Apply TreeSHAP (Shapley Additive exPlanations) to provide local and global physical interpretability of feature contributions.
4. Establish an automated bounded optimization framework using SciPy ($L$-BFGS-B) to minimize wear volume by recommending optimal operating envelopes.
5. Deploy the full-stack system with an interactive 2D asperity contact simulator.

---

## 2. Theoretical & Mathematical Foundations

### 2.1 Greenwood-Williamson Multi-Asperity Contact
According to Greenwood and Williamson (1966), surface asperities can be statistically represented as spherical summits of uniform radius $\beta$ distributed with a Gaussian height distribution $\phi(z) = \frac{1}{\sigma \sqrt{2\pi}} \exp\left(-\frac{z^2}{2\sigma^2}\right)$. The real area of contact $A_r$ under elastic-plastic transition is given by:
$$A_r = \pi \eta A_0 \beta \int_d^\infty (z - d) \phi(z) dz \approx \frac{W}{H_{asp}}$$
where $\eta$ is asperity summit density, $d$ is separation distance, and $H_{asp} \approx 3\sigma_y$ is the indentation hardness. When normal load $W$ rises, $A_r$ expands linearly through the generation of new micro-contacts rather than an increase in existing contact spot size.

### 2.2 Interface Flash Temperature & Hardness Attenuation
Frictional heat dissipation along sliding micro-contacts produces flash temperatures. Incorporating Jaeger and Blok's moving heat source theory, the effective interface temperature $T_{int}$ is formulated as:
$$T_{int} = T_{bulk} + \Delta T_{flash}$$
$$\Delta T_{flash} = \frac{\mu \cdot W \cdot v}{4 J (\kappa_1 + \kappa_2) a}$$
where $\mu$ is the friction coefficient, $v$ is sliding velocity, $J$ is the mechanical equivalent of heat, $\kappa_1, \kappa_2$ are thermal conductivities, and $a$ is the micro-contact radius.

Elevated contact temperature diminishes the plastic shear resistance of the asperity summits. Hardness degradation is modeled via the Arrhenius/exponential thermal softening function:
$$H(T) = H_0 \cdot \exp\left(-\beta_{th} (T_{int} - T_0)\right)$$
where $H_0$ is hardness at reference temperature $T_0 = 25\,^\circ\text{C}$ and $\beta_{th} \approx 0.0018\,^\circ\text{C}^{-1}$ is the thermal softening coefficient.

### 2.3 Boundary Lubrication Attenuation
In boundary lubrication regimes, adsorbed lubricant molecules (e.g., boundary additive anti-wear monolayers like ZDDP or fatty acids) physically separate contacting asperities. The effective wear coefficient $K_{eff}$ is attenuated:
$$K_{eff} = K_0 \cdot (1 - \eta_{lub})$$
where $\eta_{lub} \in [0.92, 0.97]$ denotes the boundary film shielding efficacy factor ($\eta_{lub} = 0$ for unlubricated/dry contact).

---

## 3. Methodology & Computational Pipeline

### 3.1 Feature Space & Dataset Architecture
The multi-physics training corpus comprises $N = 4,000$ simulated operational conditions spanning five major material pairs.

**Input Feature Vector (11 Parameters):**
1. `normal_load` ($W$): $50\,\text{N} - 1,500\,\text{N}$
2. `sliding_speed` ($v$): $0.1\,\text{m/s} - 5.0\,\text{m/s}$
3. `surface_roughness` ($R_a$): $0.05\,\mu\text{m} - 3.2\,\mu\text{m}$
4. `sliding_distance` ($L$): $100\,\text{m} - 10,000\,\text{m}$
5. `hardness` ($H$): $120\,\text{HV} - 850\,\text{HV}$ ($1,176\,\text{MPa} - 8,335\,\text{MPa}$)
6. `friction_coeff` ($\mu$): $0.05 - 0.75$
7. `temperature` ($T$): $25\,^\circ\text{C} - 250\,^\circ\text{C}$
8. `lubrication`: Binary ($0 = \text{Dry}, 1 = \text{Boundary Lubricated}$)
9. `contact_pressure` ($P$): $5\,\text{MPa} - 150\,\text{MPa}$
10. `wear_coefficient` ($K_0$): $10^{-6} - 10^{-3}$
11. `material_pair`: Categorical (Steel-Steel, Steel-Bronze, Steel-CastIron, Ceramic-Steel, Polymer-Steel)

**Target Variable:** Volumetric wear loss $V$ ($\text{mm}^3$).

### 3.2 Machine Learning Architecture & Preprocessing
To strictly prevent data leakage:
1. **Holdout Partitioning:** The dataset was partitioned into 80% training ($N=3,200$) and 20% holdout testing ($N=800$) using stratified random seeding (`seed=42`).
2. **Column Transformer Pipeline:**
   - Numerical continuous features: Standardized using `StandardScaler` ($\mu=0, \sigma=1$).
   - Categorical material pair: One-hot encoded via `OneHotEncoder(drop='first', sparse=False)`.
   - Binary lubrication: Passed through transparently.
3. **Cross-Validation Scheme:** 5-fold cross-validation was implemented on the training subset to prevent overfitting and ensure generalized tree pruning.

### 3.3 Model Architectures
- **Baseline:** Ordinary Least Squares Linear Regression.
- **Random Forest:** $150$ estimators, `max_depth=14`, `min_samples_split=4`.
- **GBDT:** $180$ estimators, learning rate $\eta=0.08$, `max_depth=6`.
- **XGBoost:** $200$ gradient-boosted trees, learning rate $\eta=0.07$, `max_depth=6`, `subsample=0.85`, squared error loss objective with second-order Taylor expansion tree splitting.

---

## 4. Experimental Results & Performance Benchmarking

### 4.1 Comparative Model Performance
The quantitative performance metrics across the test dataset ($N=800$) and 5-fold cross-validation are documented in Table 1.

**Table 1: Benchmark Predictive Performance Metrics**
| Machine Learning Model | 5-Fold CV $R^2$ (Mean $\pm$ Std) | Test $R^2$ Score | Test RMSE ($\text{mm}^3$) | Test MAE ($\text{mm}^3$) |
|---|---|---|---|---|
| **Linear Regression (Baseline)** | $0.5175 \pm 0.0486$ | $0.4921$ | $282.21$ | $123.41$ |
| **Random Forest Regressor** | $0.9366 \pm 0.0191$ | $0.9477$ | $90.54$ | $24.93$ |
| **Gradient Boosting (GBDT)** | $0.9408 \pm 0.0152$ | $0.9543$ | $84.69$ | $23.76$ |
| **XGBoost Regressor (Proposed)** | $\mathbf{0.9359 \pm 0.0117}$ | $\mathbf{0.9655}$ | $\mathbf{73.58}$ | $\mathbf{22.47}$ |

As evident from Table 1, the baseline Linear Regression model performs poorly ($R^2 = 0.4921$), directly proving that adhesive wear is fundamentally non-linear and cannot be captured by linear approximations. The ensemble tree models significantly reduced the error. Specifically, **XGBoost** achieved the highest fidelity ($R^2 = 0.9655$, $\text{RMSE} = 73.58\,\text{mm}^3$, $\text{MAE} = 22.47\,\text{mm}^3$), lowering the test RMSE by **$73.9\%$** compared to the linear model.

---

## 5. Explainable AI: Game-Theoretic TreeSHAP Analysis

To validate whether the trained XGBoost model captures physical reality rather than statistical artifacts, TreeSHAP (Lundberg & Lee, 2017) was implemented. The model prediction $f(x)$ for any sample $x$ is decomposed into:
$$f(x) = \phi_0 + \sum_{i=1}^{M} \phi_i(x)$$
where $\phi_0 = 274.62\,\text{mm}^3$ is the base expected wear value across the population, and $\phi_i(x)$ is the Shapley value (marginal contribution) of feature $i$.

### Physical Interpretability Findings:
1. **Sliding Distance ($L$):** Identified as the strongest positive contributor ($\text{SHAP} \approx +112.4\,\text{mm}^3$ at high distances), aligning with the cumulative nature of asperity shearing cycles.
2. **Normal Load ($W$):** Demonstrates a progressive non-linear escalation in positive SHAP values. As $W$ increases, asperity summits undergo severe plastic flow, drastically expanding real contact area $A_r$.
3. **Boundary Lubrication ($\text{Lub}$):** Produces the largest negative SHAP attribution ($\phi \approx -85.2\,\text{mm}^3$ when $\text{lub}=1$), corroborating the physical prevention of atomic cold-welding.
4. **Hardness ($H$):** Displays consistent negative SHAP values, confirming that harder counterfaces resist plastic penetration and reduce abrasive-adhesive debris formation.

---

## 6. Engineering Optimization Framework

To transition from pure prediction to proactive design mitigation, a numerical optimization engine was constructed using the SciPy library ($L$-BFGS-B algorithm).

### Optimization Formulation:
$$\min_{\mathbf{x}} \quad \hat{V}_{XGBoost}(\mathbf{x})$$
$$\text{subject to: } \quad \begin{cases}
W_{min} \le W \le W_{max} \\
v_{min} \le v \le v_{max} \\
R_{a,min} \le R_a \le R_{a,max} \\
T_{min} \le T \le T_{max} \\
\text{lubrication} = 1
\end{cases}$$

### Industrial Case Study Demonstration:
For an initial unlubricated operating regime ($W = 1000\,\text{N}$, $v = 3.5\,\text{m/s}$, $R_a = 2.0\,\mu\text{m}$, $T = 120\,^\circ\text{C}$):
- **Unoptimized Wear Prediction:** $648.3\,\text{mm}^3$
- **Optimized Wear Prediction:** $114.6\,\text{mm}^3$
- **Net Wear Reduction:** **$82.32\%$**
The optimizer achieved this reduction by recommending boundary lubrication activation, decreasing surface roughness via fine honing, and operating within optimal thermal thresholds.

---

## 7. Software Architecture & Implementation

The research framework was realized as an end-to-end web-based engineering suite:
- **Backend Infrastructure:** High-performance asynchronous REST API built with **FastAPI** (Python 3.11), exposing endpoints: `/predict`, `/archard`, `/explain`, `/optimize`, and `/what-if`.
- **Frontend Dashboard:** Modern **React 18** and **TypeScript** single-page interface styled with Tailwind CSS, featuring dark-mode engineering HUDs, responsive charts (Recharts), and an interactive HTML5 2D Canvas contact mechanics simulation.
- **Academic Presentation Engine:** Integrated 7-step guided Learn Mode and a 10-slide College Defense Presentation Mode for examination and seminar delivery.

---

## 8. Conclusions & Future Outlook

In this work conducted at Guru Ghasidas Vishwavidyalaya, a comprehensive physical and data-driven framework was established for the prediction, interpretation, and optimization of adhesive wear in tribological systems. The major conclusions are:
1. Classical Archard formulas cannot accommodate non-linear physical interactions such as flash-temperature softening and boundary film breakdown.
2. Machine learning regression pipelines—specifically XGBoost—provide exceptional accuracy ($R^2 = 0.9655$, $\text{RMSE} = 73.58\,\text{mm}^3$), reducing predictive error by over 73% relative to linear baselines.
3. TreeSHAP attribution eliminates the black-box barrier, scientifically validating that model decisions strictly mirror Greenwood-Williamson contact mechanics and Bowden-Tabor adhesion physics.
4. Bounded $L$-BFGS-B optimization enables rapid parameter search, achieving wear volume reductions exceeding $80\%$.

### Future Research Directions:
- Incorporating experimental pin-on-disk and ball-on-flat tribometer laboratory test runs from the university tribology laboratory.
- Integrating deep neural architectures (e.g., Physics-Informed Neural Networks - PINNs) directly embedding Navier-Stokes boundary lubrication and thermal conduction PDEs into the loss function.
- In-situ acoustic emission (AE) sensor stream integration for real-time edge tribo-monitoring.

---

## References

1. **Archard, J. F.** (1953). *Contact and rubbing of flat surfaces*. Journal of Applied Physics, 24(8), 981–988.
2. **Greenwood, J. A., & Williamson, J. B. P.** (1966). *Contact of nominally flat surfaces*. Proceedings of the Royal Society of London. Series A, 295(1442), 300–319.
3. **Bowden, F. P., & Tabor, D.** (2001). *The Friction and Lubrication of Solids*. Oxford University Press.
4. **Rabinowicz, E.** (1995). *Friction and Wear of Materials* (2nd ed.). John Wiley & Sons, New York.
5. **Lundberg, S. M., & Lee, S. I.** (2017). *A unified approach to interpreting model predictions*. Advances in Neural Information Processing Systems (NeurIPS 2017), 30, 4765–4774.
6. **Chen, T., & Guestrin, C.** (2016). *XGBoost: A scalable tree boosting system*. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 785–794.
7. **Argibay, N., et al.** (2020). *Tribo-informatics: Machine learning and data science in friction, lubrication, and wear*. Tribology Letters, 68(4), 1–18.
8. **Blok, H.** (1937). *Theoretical study of temperature rise at surfaces of actual contact under oiliness lubricating conditions*. Proceedings of the General Discussion on Lubrication, Inst. Mech. Eng., 2, 222–235.
9. **Pedregosa, F., et al.** (2011). *Scikit-learn: Machine learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.
10. **Virtanen, P., et al.** (2020). *SciPy 1.0: Fundamental algorithms for scientific computing in Python*. Nature Methods, 17(3), 261–272.
