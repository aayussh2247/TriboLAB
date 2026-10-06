#!/usr/bin/env python3
"""
Environment Startup Diagnostic Script for:
AI-Driven Prediction, Explainability and Optimization of Adhesive Wear
"""

import sys
import platform
import os

def check_system():
    print("=" * 60)
    print(" TRIBOLOGY AI SYSTEM ENVIRONMENT DIAGNOSTIC")
    print("=" * 60)
    print(f"OS: {platform.system()} {platform.release()} ({platform.version()})")
    print(f"Architecture: {platform.machine()} ({platform.architecture()[0]})")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {platform.python_version()}")

    # Check Core ML Libraries
    libs = [
        ("NumPy", "numpy"),
        ("Pandas", "pandas"),
        ("SciPy", "scipy"),
        ("Scikit-Learn", "sklearn"),
        ("XGBoost", "xgboost"),
        ("SHAP", "shap"),
        ("FastAPI", "fastapi"),
        ("Uvicorn", "uvicorn"),
        ("Joblib", "joblib"),
    ]

    print("\n[ML & Backend Libraries Check]")
    for name, mod in libs:
        try:
            m = __import__(mod)
            ver = getattr(m, "__version__", "Installed")
            print(f"  [OK] {name:<15}: {ver}")
        except ImportError as e:
            print(f"  [FAIL] {name:<13}: Not found ({e})")

    # PyTorch and CUDA Check
    print("\n[Deep Learning & Hardware Acceleration]")
    try:
        import torch
        print(f"  [OK] PyTorch: {torch.__version__}")
        cuda_avail = torch.cuda.is_available()
        print(f"  CUDA Available: {cuda_avail}")
        if cuda_avail:
            device_count = torch.cuda.device_count()
            print(f"  Device Count: {device_count}")
            for i in range(device_count):
                dev_name = torch.cuda.get_device_name(i)
                mem = torch.cuda.get_device_properties(i).total_memory / (1024 ** 3)
                print(f"  GPU [{i}]: {dev_name} ({mem:.2f} GB VRAM)")
        else:
            print("  [INFO] Hardware Fallback: Using CPU Acceleration (Multi-threaded Intel Core)")
    except ImportError as e:
        print(f"  [FAIL] PyTorch: Not found ({e})")

    print("=" * 60)

if __name__ == "__main__":
    check_system()
