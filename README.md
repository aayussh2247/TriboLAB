<div align="center">

# 🔬 AI-Driven Prediction, Explainability and Optimization of Adhesive Wear

**An Interdisciplinary Research Platform Bridging Contact Mechanics, Machine Learning, and Tribological Optimization**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-61DAFB.svg)](https://reactjs.org/)
[![XGBoost](https://img.shields.io/badge/Model-XGBoost%20(R%C2%B2%3D0.9655)-orange.svg)](https://xgboost.readthedocs.io/)
[![SHAP](https://img.shields.io/badge/Explainability-TreeSHAP-red.svg)](https://shap.readthedocs.io/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.6.0%2Bcu124-EE4C2C.svg)](https://pytorch.org/)

[Research Overview](#-research-overview) •
[Physical Mechanism](#-physical-mechanism) •
[Architecture](#-system-architecture) •
[Quick Start](#-quick-start) •
[Live Demonstration](#-live-demonstration--screenshots) •
[Contributing](#-contributing) •
[License](#-license)

</div>

---

## 📌 Research Overview

In mechanical assemblies (bearings, gears, journal sleeves, mechanical seals), **adhesive wear** is one of the primary failure modes. Conventional design reliance on empirical formulas like **Archard's wear law** ($V = KWL/H$) frequently fails because it neglects dynamic flash-temperature softening, localized plastic deformation of micro-asperities, and boundary lubrication breakdowns.

This open-source repository presents an end-to-end research platform designed to investigate:

> **"Can machine learning predict adhesive wear from tribological operating parameters, explain the predictions with game-theoretic attribution (SHAP), and optimize operating parameters for minimized wear?"**

---

## ⚙️ Key Features

- 🔬 **Real-Time Contact Mechanics Simulator:** Interactive 2D Canvas visualizing asperity contact, normal loading penetration, cold-welded adhesive junctions, tangential shear stresses, and wear debris generation.
- 📐 **Archard vs. ML Physical Benchmark:** Live side-by-side comparison between the classical empirical wear law and trained machine learning inferences.
- 🤖 **Cross-Validated Machine Learning:** Trained across Linear Regression, Random Forest, GBDT, and XGBoost ($R^2 = 0.9655$, $\text{RMSE} = 73.58\,\text{mm}^3$).
- 🧠 **Explainable AI via TreeSHAP:** Rigorous Shapley value decompositions explaining exactly why the model predicts higher or lower wear for individual operating states.
- ⚡ **Multi-Variable SciPy Optimization:** Bounded $L$-BFGS-B minimization searching across operating parameters to recommend $60\%\text{--}90\%$ wear reductions.
- 🎓 **Defense & Presentation Modes:** Built-in guided **Learn Mode** (7-step tribological breakdown) and fullscreen **Presentation Mode** (10-slide college defense deck with keyboard navigation).

---

## 🏗️ System Architecture

```
TRIBOLOGY PHYSICAL MECHANISM (Greenwood-Williamson & Flash Temperature)
                             │
                             ▼
         SYNTHETIC EXPERIMENTAL DATASET (N = 4,000)
                             │
                             ▼
       5-FOLD CROSS-VALIDATION & MODEL BENCHMARKING
      (Linear Regression, Random Forest, GBDT, XGBoost)
                             │
                             ▼
               BEST MODEL PIPELINE (XGBoost)
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
       TreeSHAP EXPLAINER          SciPy L-BFGS-B ENGINE
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    FASTAPI REST BACKEND
                    (Endpoints: /predict, /archard, /explain, /optimize, /what-if)
                             │
                             ▼
               REACT 18 + TYPESCRIPT FRONTEND
              (Dark Anthracite Engineering HUD & Canvas)
```

---

## 📊 Benchmark Model Performance

| Algorithm | Test $R^2$ Score | Test RMSE ($\text{mm}^3$) | Test MAE ($\text{mm}^3$) | 5-Fold CV $R^2$ (Mean $\pm$ Std) | Status |
|---|---|---|---|---|---|
| **Linear Regression** | 0.4921 | 282.21 | 123.41 | 0.5175 $\pm$ 0.0486 | Baseline |
| **Random Forest Regressor** | 0.9477 | 90.54 | 24.93 | 0.9366 $\pm$ 0.0191 | Ensemble |
| **Gradient Boosting (GBDT)** | 0.9543 | 84.69 | 23.76 | 0.9408 $\pm$ 0.0152 | Ensemble |
| **XGBoost Regressor (Best)** | **0.9655** | **73.58** | **22.47** | **0.9359 $\pm$ 0.0117** | **Selected Model** |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js v18+ & npm
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/adhesive-wear-ai.git
cd adhesive-wear-ai
```

### 2. Environment Setup & Dependencies
```bash
# Set up Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Launch Backend Service
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Interactive Swagger API documentation available at: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

### 4. Launch Frontend Interface
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: **[http://localhost:5173](http://localhost:5173)**

---

## 🏃 One-Click Windows Launcher

On Windows systems, you can simply run:
```bat
run_project.bat
```
This script checks the virtual environment, executes diagnostics, and launches both services simultaneously.

---

## 🧪 Automated Testing

Run the full pytest suite:
```bash
pytest tests/ -v
```
All unit and integration tests (API endpoints, Archard formulas, SHAP attributions, SciPy optimization, and dataset generator properties) pass with 100% success rate.

---

## 🤝 Contributing

We welcome contributions from engineers, tribologists, data scientists, and developers! Please read our [**Contributing Guide**](CONTRIBUTING.md) and [**Code of Conduct**](CODE_OF_CONDUCT.md).

For experimental researchers, check [**Experimental Data Import Guide**](docs/experimental_data_format.md) to see how to train with your own laboratory pin-on-disk test rig data.

---

## 📜 Scientific Limitations & Disclaimer

1. **Synthetic Demonstration Dataset:** The 4,000 observations were mathematically synthesized based on Greenwood-Williamson contact area, thermal softening, and Archard formulas with 10% stochastic heteroscedastic noise. They are not direct laboratory measurements.
2. **Conceptual 2D Visualization:** The canvas animation serves educational clarity and does not replace finite element (FEA) or molecular dynamics (MD) continuum solvers.
3. **Engineering Use:** Results are research-oriented model estimates and should be independently validated prior to production aerospace or industrial machine fabrication.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
