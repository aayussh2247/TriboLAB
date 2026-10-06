# Contributing to Adhesive Wear AI Platform

Thank you for your interest in contributing to **Adhesive Wear AI**! We welcome mechanical engineers, tribologists, data scientists, machine learning researchers, and full-stack software developers.

---

## 🛠️ How You Can Contribute

1. **Experimental Data Integration:**
   - Contribute laboratory pin-on-disk, reciprocating tribometer, or block-on-ring experimental test data (see [`docs/experimental_data_format.md`](docs/experimental_data_format.md)).
2. **Tribological Modeling:**
   - Implement advanced contact models (e.g., Persson contact mechanics, acoustic emission wear onset, flash temperature models).
3. **Machine Learning & Deep Learning:**
   - Benchmark neural network architectures (MLP, TabNet, Physics-Informed Neural Networks / PINNs).
4. **Interactive Visualizations & UX:**
   - Enhance the contact mechanics 2D canvas simulation (e.g., adding wear scar depth profilometry, debris particle coagulation).
5. **Documentation & Unit Tests:**
   - Expand test coverage and add experimental case studies.

---

## 🚀 Development Setup Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/adhesive-wear-ai.git
cd adhesive-wear-ai
```

### 2. Environment Configuration
Set up your isolated Python 3.11 virtual environment and install dependencies:
```bash
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On Linux/macOS:
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Running Backend
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🧪 Testing Before Submitting

Always run the automated test suite before opening a pull request:
```bash
pytest tests/ -v
```

Also verify that the frontend builds without TypeScript or bundling errors:
```bash
cd frontend
npm run build
```

---

## 📜 Pull Request Guidelines

1. **Create a descriptive feature branch:**
   ```bash
   git checkout -b feature/pin-on-disk-loader
   ```
2. **Commit with clean conventions:**
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `test:` for test additions
3. **Ensure no secrets or heavy temporary files are tracked:**
   - Confirm `.env` or large caches are not included (`git status`).
4. **Open a Pull Request:** Provide a clear summary of your changes, physical rationale, and verification screenshots or logs.

---

## 💬 Community & Academic Inquiries

If you are a student or researcher wanting to use this platform for your thesis, conference paper, or university coursework, feel free to cite our repository and open an issue or discussion!
