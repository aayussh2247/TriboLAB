# Environment Audit & Setup Specification

## System Architecture & Hardware Audit

- **Operating System:** Microsoft Windows 11 Home Single Language (64-bit, Build 26200)
- **Processor:** Intel(R) Core(TM) i5-14450HX (10 Physical Cores, 16 Logical Processors)
- **System Memory:** 16 GB DDR5 RAM
- **Dedicated GPU:** NVIDIA GeForce RTX 4050 Laptop GPU (6 GB GDDR6 VRAM, Driver 581.57, CUDA 13.0 API support)
- **Integrated Graphics:** Intel(R) UHD Graphics

## Storage Allocation Audit

| Drive | Total Capacity | Free Space | Utilization Strategy |
|---|---|---|---|
| **C:** | 174.85 GB | 12.56 GB | **Preserved / Read-Only** (No large dependencies or caches) |
| **D:** | 300.29 GB | 180.42 GB | **Target Workspace & Environments** (`D:\AI\projects\adhesive_wear_ai`) |

## Detected Runtimes & Tooling

- **Python Runtime:** Python 3.11.9 (`C:\Program Files\Python311\python.exe`) — **Selected for ML & Deep Learning stability**. *(Python 3.14t experimental build bypassed)*
- **Node.js:** v24.11.1
- **npm:** 11.6.2
- **Git:** 2.52.0.windows.1
- **VS Code:** Installed (v1.139.1)
- **Containerization (Docker):** Not installed (Native Windows + Venv utilized)

## Safe Installation & Dependency Strategy

1. **Virtual Environment Isolation:**
   - Location: `D:\AI\projects\adhesive_wear_ai\.venv`
   - Initialized via: `& "C:\Program Files\Python311\python.exe" -m venv D:\AI\projects\adhesive_wear_ai\.venv`
2. **PyTorch & CUDA Acceleration:**
   - The NVIDIA RTX 4050 (Driver 581.57) supports modern CUDA. We install the stable PyTorch distribution with CUDA support (`cu124` or `cu121`) directly inside the virtual environment on drive D:.
   - Robust CPU fallback is natively integrated into all model architectures and evaluation pipelines.
3. **Machine Learning & Tribology Toolchain:**
   - `numpy`, `pandas`, `scipy`, `scikit-learn`, `xgboost`, `shap`, `joblib`, `matplotlib`, `seaborn`
4. **Backend Services:**
   - `fastapi`, `uvicorn`, `pydantic`, `pytest`, `httpx`
5. **Frontend Application:**
   - React 18 / Vite / TypeScript / Tailwind CSS / Framer Motion / Lucide-React / Recharts & HTML5 Canvas for real-time contact mechanics simulation.
