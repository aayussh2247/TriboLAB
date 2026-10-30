@echo off
TITLE Multi-Project Runner: Purana + Tribology Lab (Beta)
COLOR 0A

echo ===============================================================================
echo     TRIBOLOGY AI PLATFORMS - DUAL LAUNCHER (PURANA + BETA LAB)
echo ===============================================================================
echo.

:: ==========================================
:: [A] PATH CONFIGURATIONS
:: ==========================================
set "PURANA_DIR=D:\ADHESIVE WEAR PREDCITON"
set "BETA_DIR=D:\AI\projects\TribologyLab"

:: Python for Purana
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

:: Python for Beta Lab
set "PYTHON_BETA=python"
if exist "D:\AI\.venv\Scripts\python.exe" (
    set "PYTHON_BETA=D:\AI\.venv\Scripts\python.exe"
) else if exist "%BETA_DIR%\.venv\Scripts\python.exe" (
    set "PYTHON_BETA=%BETA_DIR%\.venv\Scripts\python.exe"
)

:: ==========================================
:: [1] START PURANA PLATFORM
:: ==========================================
echo [1/3] Starting PURANA Platform (Adhesive Wear AI)...
echo       - Backend on  http://127.0.0.1:8000
echo       - Frontend on http://localhost:5173
start "Purana - FastAPI Backend (Port 8000)" cmd /k "cd /d "%PURANA_DIR%" && "%PYTHON_PURANA%" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
start "Purana - React Frontend (Port 5173)" cmd /k "cd /d "%PURANA_DIR%\frontend" && npm run dev"

:: ==========================================
:: [2] START BETA PLATFORM (TribologyLab)
:: ==========================================
echo.
echo [2/3] Starting BETA Platform (Tribology Lab - AI for Wear Analysis)...
echo       - Full App on http://localhost:8088
if exist "%BETA_DIR%\backend\run_server.py" (
    start "Beta - Tribology Lab (Port 8088)" cmd /k "cd /d "%BETA_DIR%" && "%PYTHON_BETA%" "%BETA_DIR%\backend\run_server.py""
) else (
    echo       [!] TribologyLab folder not found at %BETA_DIR%
)

:: ==========================================
:: [3] LAUNCH ALL APPS IN BROWSER
:: ==========================================
echo.
echo [3/3] Waiting 4 seconds for servers to start...
timeout /t 4 /nobreak >nul

echo Opening Purana App, Beta Lab, and API Docs in your browser...
start http://localhost:5173
timeout /t 1 /nobreak >nul
start http://localhost:8088/
timeout /t 1 /nobreak >nul
start http://127.0.0.1:8000/docs

echo.
echo ===============================================================================
echo  ALL PLATFORMS ARE RUNNING SIMULTANEOUSLY!
echo.
echo   [1] PURANA APP (Adhesive Wear):    http://localhost:5173
echo   [2] BETA APP (Tribology Lab):      http://localhost:8088/
echo   [3] PURANA API DOCS / SWAGGER:     http://127.0.0.1:8000/docs
echo ===============================================================================
echo Both apps are active in separate terminals without any port conflicts.
echo You can keep or minimize this window.
pause
