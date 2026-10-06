@echo off
TITLE Tribology AI Backend
cd /d "D:\ADHESIVE WEAR PREDCITON"
"D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
