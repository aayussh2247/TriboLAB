# Project Research Report: AI-Driven Prediction, Explainability and Optimization of Adhesive Wear

**Author:** 7th-Semester Mechanical Engineering Student  
**Discipline:** Tribology, Contact Mechanics, Machine Learning, Computational Optimization  
**Platform Version:** 1.0.0 (Production Build)  
**Date:** October 2026  

---

## Abstract
Adhesive wear is among the most prevalent failure mechanisms observed in sliding mechanical contacts. This research develops a unified computational framework that couples the physical contact mechanics of rough surfaces with advanced gradient-boosted machine learning, game-theoretic explainability (SHAP), and multi-variable optimization. A multi-physics synthetic dataset comprising 4,000 observations was generated, integrating Archard’s wear law, Greenwood-Williamson micro-asperity plasticity, thermal softening kinetics, and boundary lubrication factors. Multiple predictive algorithms were trained with 5-fold cross-validation. The XGBoost regressor demonstrated superior predictive accuracy ($R^2 = 0.9655$, $\text{RMSE} = 73.58\,\text{mm}^3$) compared to baseline linear models ($R^2 = 0.4921$). Real-time TreeSHAP attributions systematically revealed that sliding distance and normal load are the dominant positive contributors to wear volume, while boundary lubrication and material hardness serve as primary mitigation drivers. Bounded SciPy optimization demonstrated an average 60%–85% reduction in adhesive wear rates by identifying optimal operating envelopes.

---

## 1. Introduction & Problem Statement
In tribological systems, adhesive wear occurs when localized contact pressures between microscopic surface asperities cause plastic deformation, adhesion, and subsequent tangential shearing of metallic junctions. The economic impact of unpredicted wear failures across rotating machinery, bearing assemblies, and aerospace actuators is measured in billions of dollars annually.

Historically, design engineers have relied on Archard’s wear law ($V = KWL/H$) established in 1953. However, Archard's equation assumes a constant wear coefficient $K$ and invariant material hardness $H$. In real service environments, sliding contacts experience coupled flash-temperature rises, severe plastic deformation, and non-linear transitions between mild oxidative wear and severe scuffing. Consequently, purely empirical formulations struggle to provide accurate remaining useful life predictions or quantitative optimization.

---

## 2. Objectives
1. **Physical Modeling & Visualization:** Develop an interactive 2D scientific contact mechanics simulation capturing asperity approach, junction cold-welding, tangential shear, material transfer, and wear debris generation.
2. **Scientifically Grounded Data Pipeline:** Synthesize a 4,000-sample dataset encoding real physical equations (Greenwood-Williamson contact, Archard, thermal softening, lubrication regime transitions, and heteroscedastic noise).
3. **Machine Learning Benchmarking:** Train, cross-validate, and evaluate Linear Regression, Random Forest, Gradient Boosted Decision Trees, and XGBoost.
4. **Game-Theoretic Explainability:** Implement local and global TreeSHAP attributions to eliminate the "black-box" nature of ensemble trees and provide physical interpretability.
5. **Operating Condition Optimization:** Construct a bounded numerical optimization engine to automatically recommend lower-wear operating parameters.
6. **Full-Stack Application Deployment:** Deliver an engineering-grade web application (FastAPI + React 18/TypeScript/Vite) ready for college project defense.

---

## 3. Tribological Background & Mathematical Formulation

### 3.1 Greenwood-Williamson Contact Mechanics
When rough surfaces come into contact, the nominal contact area $A_0$ is distinct from the real contact area $A_r$:
$$A_r = \sum a_i = \frac{W}{H_{asp}}$$
Where $H_{asp}$ is the plastic hardness of the softer contacting asperity. Because $A_r \ll A_0$, true contact stresses reach the yield limit even under nominal loads.

### 3.2 Thermal Softening Formulation
Frictional heating generates flash temperatures at the asperity interface, reducing yield strength and hardness according to the exponential relation:
$$H(T) = H_0 \cdot \exp\left(-\beta (T - T_0)\right)$$
Where $H_0$ is hardness at $25\,^\circ\text{C}$, $\beta \approx 0.0018\,^\circ\text{C}^{-1}$, and $T$ is the bulk contact temperature.

### 3.3 Boundary Lubrication Attenuation
The presence of boundary/thin-film lubricants forms an adsorbed molecular protective barrier, reducing the effective wear coefficient:
$$K_{eff} = K_0 \cdot (1 - \eta_{lub})$$
Where $\eta_{lub} \approx 0.92 - 0.97$, suppressing direct metal-to-metal cold-welding.

---

## 4. Machine Learning Methodology

### 4.1 Feature Space & Targets
- **Input Features (11):** `normal_load` ($W$), `sliding_speed` ($v$), `surface_roughness` ($R_a$), `sliding_distance` ($L$), `hardness` ($H$), `friction_coeff` ($\mu$), `temperature` ($T$), `lubrication` ($0/1$), `contact_pressure` ($P$), `wear_coefficient` ($K$), `material_pair`.
- **Primary Prediction Target:** `wear_volume` ($V$, $\text{mm}^3$).
- **Derived Physical Metric:** `wear_rate` ($\text{mm}^3/\text{m}$).

### 4.2 Data Preprocessing
To prevent data leakage, 20% holdout test splitting was applied prior to feature scaling. Numerical features were standardized via `StandardScaler`, categorical material pairs were encoded via `OneHotEncoder(drop='first')`, and binary lubrication status was retained.

### 4.3 Candidate Model Comparison
A 5-fold cross-validation scheme was employed on the training set ($N = 3,200$). The holdout test results ($N = 800$) are summarized below:

| Algorithm | Test $R^2$ | Test RMSE ($\text{mm}^3$) | Test MAE ($\text{mm}^3$) | 5-Fold CV $R^2$ |
|---|---|---|---|---|
| Linear Regression | 0.4921 | 282.21 | 123.41 | 0.5175 $\pm$ 0.0486 |
| Random Forest Regressor | 0.9477 | 90.54 | 24.93 | 0.9366 $\pm$ 0.0191 |
| Gradient Boosting (GBDT) | 0.9543 | 84.69 | 23.76 | 0.9408 $\pm$ 0.0152 |
| **XGBoost Regressor (Selected)** | **0.9655** | **73.58** | **22.47** | **0.9359 $\pm$ 0.0117** |

---

## 5. Explainable AI via SHAP
Using Lundberg & Lee’s TreeSHAP algorithm, the model prediction $f(x)$ is decomposed into additive feature contributions:
$$f(x) = \phi_0 + \sum_{j=1}^{M} \phi_j(x)$$
Where $\phi_0$ is the base expected value across the dataset ($274.62\,\text{mm}^3$) and $\phi_j$ represents the attribution of feature $j$.

**Key Attribution Findings:**
1. **Sliding Distance ($L$):** Contributes the highest positive SHAP value ($\phi \approx +112.4\,\text{mm}^3$ on high-distance trials).
2. **Normal Load ($W$):** Second strongest positive driver, scaling non-linearly due to localized plastic yield.
3. **Lubrication State:** Exerts the strongest negative SHAP impact ($\phi \approx -85.2\,\text{mm}^3$ when enabled), demonstrating clear physical fidelity.
4. **Hardness ($H$):** Displays consistent negative attribution, protecting against asperity shearing.

---

## 6. Optimization Framework
The objective function minimizes predicted wear volume subject to practical industrial operating limits:
$$\min_{W, v, R_a, T} \hat{V}_{ML}(W, v, R_a, L, H, T, \text{lub}=1)$$
Subject to:
$$W_{min} \le W \le W_{max}, \quad v_{min} \le v \le v_{max}, \quad R_{a,min} \le R_a \le R_{a,max}, \quad T_{min} \le T \le T_{max}$$
Using SciPy's bounded L-BFGS-B optimization, the algorithm identifies parameter sets that reduce adhesive wear by 60%–85% primarily by recommending boundary film activation, surface superfinishing, and thermal management.

---

## 7. Scientific Limitations
1. **Synthetic Nature of Dataset:** The dataset is generated from numerical physical equations with stochastic noise. While calibrated to published wear coefficients, it is not direct laboratory test-rig data.
2. **Animation Simplicity:** The 2D canvas simulation is conceptual; it illustrates asperity interactions for educational clarity but does not solve finite element continuum plasticity equations.
3. **Environmental Factors:** Factors such as humidity, surface chemical reactions, and lubricant additive breakdown were modeled in aggregate rather than through individual chemical reaction kinetics.

---

## 8. Conclusion
This project successfully demonstrates the full engineering pipeline from physical tribology contact mechanics through machine learning modeling, explainability, and condition optimization. By deploying a modern FastAPI backend and React frontend with dedicated Learn and Presentation modes, this platform provides a presentation-ready project for college evaluation and defense.

---

## References
1. Archard, J. F. (1953). *Contact and rubbing of flat surfaces*. Journal of Applied Physics, 24(8), 981-988.
2. Greenwood, J. A., & Williamson, J. B. P. (1966). *Contact of nominally flat surfaces*. Proceedings of the Royal Society of London. Series A, 295(1442), 300-319.
3. Bowden, F. P., & Tabor, D. (2001). *The Friction and Lubrication of Solids*. Oxford University Press.
4. Rabinowicz, E. (1995). *Friction and Wear of Materials*. John Wiley & Sons.
5. Lundberg, S. M., & Lee, S. I. (2017). *A unified approach to interpreting model predictions*. Advances in Neural Information Processing Systems (NeurIPS 2017).
6. Chen, T., & Guestrin, C. (2016). *XGBoost: A scalable tree boosting system*. KDD '16 Proceedings.
