"""
SHAP Summary / Beeswarm "Dot-Dot" Distribution Plot Generator
Produces publication-quality SHAP beeswarm scatter plots for:
1. Wear Volume (mm³)
2. Wear Rate (mm³/m)
"""

import os
import sys
import tempfile
import base64

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ.setdefault("MPLCONFIGDIR", os.path.join(tempfile.gettempdir(), "mpl_shap_cache"))
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import shap

from backend.app.services.shap_service import ShapExplainabilityService

def generate_all_beeswarm_plots(sample_size: int = 300, output_dir: str = "outputs"):
    os.makedirs(output_dir, exist_ok=True)
    svc = ShapExplainabilityService()

    targets = [
        ("wear_volume", "shap_beeswarm_summary_wear_volume.png"),
        ("wear_rate", "shap_beeswarm_summary_wear_rate.png")
    ]

    print(f"Generating SHAP Beeswarm (Dot-Dot) Plots (Sample size: {sample_size})...")

    for target, filename in targets:
        print(f" -> Computing TreeSHAP for '{target}'...")
        data = svc.get_beeswarm_data(target=target, sample_size=sample_size)
        out_path = os.path.join(output_dir, filename)
        
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(data["plot_image_base64"]))
        
        print(f"    [+] Saved high-res beeswarm plot to: {out_path} ({len(data['sample_points'])} sample points)")

    print("All SHAP beeswarm graphs generated successfully!")

if __name__ == "__main__":
    generate_all_beeswarm_plots()
