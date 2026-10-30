@echo off
TITLE Multi-Project Runner: Purana + Tribology Lab (Beta)
COLOR 0B

echo ===============================================================================
echo     TRIBOLOGY AI PLATFORMS - DUAL LAUNCHER (PURANA + BETA LAB)
echo ===============================================================================
echo.

set "PURANA_DIR=D:\ADHESIVE WEAR PREDCITON"
set "BETA_DIR=D:\AI\projects\TribologyLab"

set "PYTHON_PURANA=python"
if exist "D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" (
    set "PYTHON_PURANA=D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe"
) else if exist "%PURANA_DIR%\.venv\Scripts\python.exe" (
    set "PYTHON_PURANA=%PURANA_DIR%\.venv\Scripts\python.exe"
) else if exist "%PURANA_DIR%\venv\Scripts\python.exe" (
    set "PYTHON_PURANA=%PURANA_DIR%\venv\Scripts\python.exe"
) else if exist "D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" (
    set "PYTHON_PURANA=D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe"
)

set "PYTHON_BETA=python"
if exist "D:\AI\.venv\Scripts\python.exe" (
    set "PYTHON_BETA=D:\AI\.venv\Scripts\python.exe"
) else if exist "%BETA_DIR%\.venv\Scripts\python.exe" (
    set "PYTHON_BETA=%BETA_DIR%\.venv\Scripts\python.exe"
)

echo [1/3] Starting Purana Platform (Adhesive Wear AI)...
start "Purana - FastAPI Backend (Port 8000)" cmd /k "cd /d "%PURANA_DIR%" && "%PYTHON_PURANA%" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
start "Purana - React Frontend (Port 5173)" cmd /k "cd /d "%PURANA_DIR%\frontend" && npm run dev"

echo [2/3] Starting Beta Platform (Tribology Lab - Port 8088)...
if exist "%BETA_DIR%\backend\run_server.py" (
    start "Beta - Tribology Lab (Port 8088)" cmd /k "cd /d "%BETA_DIR%" && "%PYTHON_BETA%" "%BETA_DIR%\backend\run_server.py""
)

echo [3/3] Opening Browser...
ping -n 4 127.0.0.1 >nul
start http://localhost:5173
ping -n 2 127.0.0.1 >nul
start http://localhost:8088/
ping -n 2 127.0.0.1 >nul
start http://127.0.0.1:8000/docs

echo ===============================================================================
echo   Purana:    http://localhost:5173
echo   Beta:      http://localhost:8088/
echo   API Docs:  http://127.0.0.1:8000/docs
echo ===============================================================================
pause
