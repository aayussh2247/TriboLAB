@echo off
TITLE Adhesive Wear AI Research Platform Runner
COLOR 0B

echo ===============================================================================
echo   AI-Driven Prediction, Explainability and Optimization of Adhesive Wear
echo ===============================================================================
echo [1/4] Checking Python Virtual Environment...

IF NOT EXIST "D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at D:\AI\projects\adhesive_wear_ai\.venv
    pause
    exit /b 1
)

echo [2/4] Verifying Environment Diagnostics...
& "D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" scripts\check_environment.py

echo [3/4] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Tribology Backend (FastAPI)" cmd /k "cd /d D:\ADHESIVE WEAR PREDCITON && D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [4/4] Starting React Vite Frontend on http://localhost:5173 ...
start "Tribology Frontend (Vite React)" cmd /k "cd /d D:\ADHESIVE WEAR PREDCITON\frontend && npm run dev"

echo ===============================================================================
echo   Platform successfully launched!
echo   Backend API:  http://127.0.0.1:8000/docs
echo   Frontend App: http://localhost:5173
echo ===============================================================================
pause
