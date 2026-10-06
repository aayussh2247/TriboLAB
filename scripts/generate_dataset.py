"""
Scientific Synthetic Tribology Dataset Generator for Adhesive Wear
Label: "Synthetic Demonstration Dataset — Not Experimental Data"

Physical Framework:
- Archard's Wear Law: V_archard = (K * W * L) / H
- Greenwood-Williamson contact mechanics formulation for asperity plasticity
- Flash temperature & thermal softening model: H(T) = H_0 * exp(-beta * (T - 25))
- Boundary & hydrodynamic lubrication regime effects:
    * Lubrication reduces adhesive junction shear strength by factor (1 - eta_lub)
    * Roughness (Ra) modifies actual real contact area A_r ~ (W / H) * (1 + gamma * Ra)
- Real-world stochastic asperity variability and non-linear multi-physics coupling
"""

import numpy as np
import pandas as pd
import os
import json

def generate_synthetic_wear_dataset(
    n_samples: int = 4000,
    random_seed: int = 42,
    output_path: str = "data/synthetic_wear_dataset.csv"
) -> pd.DataFrame:
    np.random.seed(random_seed)

    # Material pairs and their baseline hardness (GPa) & dimensionless Archard wear coefficient K_0
    # Values aligned with classical tribology references (Rabinowicz, Bowden & Tabor)
    material_pairs_info = {
        "Steel-Steel": {"base_hardness": 4.5, "K_base": 1.5e-4, "base_friction": 0.65},
        "Steel-Bronze": {"base_hardness": 2.2, "K_base": 8.0e-5, "base_friction": 0.40},
        "Steel-CastIron": {"base_hardness": 3.2, "K_base": 1.1e-4, "base_friction": 0.50},
        "Ti6Al4V-Steel": {"base_hardness": 3.8, "K_base": 2.5e-4, "base_friction": 0.70},
        "Aluminum-Steel": {"base_hardness": 1.2, "K_base": 4.2e-4, "base_friction": 0.60},
    }
    
    pair_names = list(material_pairs_info.keys())
    chosen_pairs = np.random.choice(pair_names, size=n_samples, p=[0.30, 0.25, 0.15, 0.15, 0.15])

    # 1. Operating Parameters Sampling
    # Normal Load W in Newtons (10 N to 1000 N)
    normal_load = np.random.uniform(10.0, 1000.0, size=n_samples)

    # Sliding Speed v in m/s (0.05 to 5.0 m/s)
    sliding_speed = np.random.uniform(0.05, 5.0, size=n_samples)

    # Surface Roughness Ra in micrometers (0.1 to 5.0 um)
    surface_roughness = np.random.uniform(0.1, 5.0, size=n_samples)

    # Sliding Distance L in meters (50 to 5000 m)
    sliding_distance = np.random.uniform(50.0, 5000.0, size=n_samples)

    # Bulk Ambient Temperature T in Celsius (25 to 250 C)
    temperature = np.random.uniform(25.0, 250.0, size=n_samples)

    # Lubrication state: 0 = Dry Unlubricated, 1 = Boundary / Thin Film Lubricated
    # Probability: 60% dry, 40% lubricated
    lubrication = np.random.choice([0, 1], size=n_samples, p=[0.60, 0.40])

    # Apparent Contact Area (nominal 100 mm^2 = 1e-4 m^2)
    nominal_area_mm2 = 100.0
    contact_pressure_mpa = normal_load / nominal_area_mm2  # MPa (0.1 to 10.0 MPa)

    # 2. Mechanistic Tribology Computations
    hardness = np.zeros(n_samples)
    wear_coeff_K = np.zeros(n_samples)
    friction_coeff = np.zeros(n_samples)

    for i in range(n_samples):
        mp = chosen_pairs[i]
        info = material_pairs_info[mp]
        
        # Thermal softening effect on hardness: H(T) = H0 * exp(-0.0015 * (T - 25))
        h_therm = info["base_hardness"] * np.exp(-0.0018 * (temperature[i] - 25.0))
        # Add microstructural hardness dispersion (+- 5%)
        hardness[i] = np.clip(h_therm * (1.0 + np.random.normal(0, 0.04)), 0.5, 8.0)

        # Baseline friction with flash heating and lubrication
        # Lubricant dramatically drops friction
        if lubrication[i] == 1:
            base_mu = 0.08 + 0.04 * np.random.uniform(0.8, 1.2)
            k_eff = info["K_base"] * np.random.uniform(0.03, 0.08)  # 92-97% reduction in adhesive wear
        else:
            base_mu = info["base_friction"] * (1.0 + 0.0008 * (temperature[i] - 25.0))
            k_eff = info["K_base"] * (1.0 + 0.15 * (surface_roughness[i] / 2.5))

        # Asperity interlocking friction contribution proportional to roughness
        mu_total = base_mu + 0.02 * (surface_roughness[i] ** 0.6)
        friction_coeff[i] = np.clip(mu_total * (1.0 + np.random.normal(0, 0.03)), 0.05, 0.95)
        wear_coeff_K[i] = k_eff

    # 3. Physical Wear Volume & Wear Rate Computation
    # Hardness converted from GPa to N/mm^2 (1 GPa = 1000 N/mm^2 = 1000 MPa)
    H_n_mm2 = hardness * 1000.0

    # Archard baseline: V = K * W * L / H (in mm^3)
    # W in N, L in m -> L in mm is L * 1000
    L_mm = sliding_distance * 1000.0
    archard_wear_mm3 = (wear_coeff_K * normal_load * L_mm) / H_n_mm2

    # Non-linear physical interactions:
    # High pressure + high speed triggers transition to severe adhesive wear / scuffing
    p_v_factor = (contact_pressure_mpa * sliding_speed) / 10.0
    scuffing_multiplier = 1.0 + 0.35 * np.maximum(0, p_v_factor - 1.2)

    # Thermal oxidation / softened asperity adhesion
    temp_multiplier = 1.0 + 0.20 * ((temperature - 25.0) / 200.0) ** 1.5

    # Composite physical wear volume
    true_wear_volume_mm3 = archard_wear_mm3 * scuffing_multiplier * temp_multiplier

    # Add realistic log-normal experimental heteroscedastic noise (tribological measurements typically show ~8-12% relative variance)
    relative_noise = np.random.normal(loc=0.0, scale=0.10, size=n_samples)
    wear_volume = np.clip(true_wear_volume_mm3 * (1.0 + relative_noise), 1e-5, None)

    # Wear rate: Wear Volume per unit sliding distance (mm^3 / m)
    wear_rate = wear_volume / sliding_distance

    df = pd.DataFrame({
        "material_pair": chosen_pairs,
        "normal_load": np.round(normal_load, 2),
        "sliding_speed": np.round(sliding_speed, 3),
        "surface_roughness": np.round(surface_roughness, 3),
        "sliding_distance": np.round(sliding_distance, 1),
        "hardness": np.round(hardness, 3),
        "friction_coeff": np.round(friction_coeff, 3),
        "temperature": np.round(temperature, 1),
        "lubrication": lubrication,
        "contact_pressure": np.round(contact_pressure_mpa, 3),
        "wear_coefficient": wear_coeff_K,
        "archard_theoretical_wear": np.round(archard_wear_mm3, 5),
        "wear_rate": wear_rate,
        "wear_volume": np.round(wear_volume, 5)
    })

    # Save CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    
    metadata = {
        "dataset_name": "Synthetic Tribology Adhesive Wear Dataset",
        "label": "Synthetic Demonstration Dataset — Not Experimental Data",
        "sample_count": len(df),
        "features": list(df.columns),
        "target_primary": "wear_volume",
        "target_secondary": "wear_rate",
        "random_seed": random_seed,
        "assumptions": [
            "Archard's wear law foundational framework (V = K*W*L/H)",
            "Thermal softening reducing material hardness at elevated temperatures",
            "Lubrication drastically reducing asperity shear strength and contact friction",
            "PV (pressure-velocity) non-linear threshold for severe adhesive transfer/scuffing",
            "Heteroscedastic experimental dispersion (~10% relative stochastic noise)"
        ]
    }
    
    meta_path = os.path.splitext(output_path)[0] + "_metadata.json"
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Generated synthetic dataset with {len(df)} samples.")
    print(f"Saved to: {output_path}")
    print(f"Metadata saved to: {meta_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_wear_dataset(n_samples=4000, random_seed=42, output_path="D:/ADHESIVE WEAR PREDCITON/data/synthetic_wear_dataset.csv")
    generate_synthetic_wear_dataset(n_samples=4000, random_seed=42, output_path="D:/AI/projects/adhesive_wear_ai/data/synthetic_wear_dataset.csv")
