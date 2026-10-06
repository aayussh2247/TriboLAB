# Guide for Importing Future Laboratory Experimental Tribology Data

This guide details how to substitute the synthetic demonstration dataset (`data/synthetic_wear_dataset.csv`) with actual physical test rig data (e.g., Pin-on-Disk, Block-on-Ring, Reciprocating Tribometers).

## Required CSV Schema

To retrain the machine learning models and maintain full compatibility with the FastAPI backend, the experimental dataset must be formatted as a CSV with the following columns:

| Column Name | Units | Data Type | Physical Meaning |
|---|---|---|---|
| `material_pair` | - | String | Counterface material combination (e.g., `Steel-Steel`, `Steel-Bronze`, `Ti6Al4V-Steel`) |
| `normal_load` | N | Float | Applied normal contact load (W) |
| `sliding_speed` | m/s | Float | Linear sliding velocity (v) |
| `surface_roughness` | μm | Float | Arithmetic mean surface roughness (Ra) of counterface |
| `sliding_distance` | m | Float | Total cumulative sliding distance (L) |
| `hardness` | GPa | Float | Vickers / Brinell hardness converted to GPa (H) |
| `friction_coeff` | - | Float | Average steady-state coefficient of friction (μ) |
| `temperature` | °C | Float | Bulk steady-state contact or ambient chamber temperature (T) |
| `lubrication` | Binary | Integer | `0` = Dry contact, `1` = Lubricated regime |
| `contact_pressure` | MPa | Float | Nominal apparent contact pressure (W / Apparent Area) |
| `wear_coefficient` | - | Float | Calculated dimensionless Archard constant (K) |
| `wear_volume` | mm³ | Float | **Primary ML Prediction Target**: Measured wear volume via profilometry or mass loss conversion |
| `wear_rate` | mm³/m | Float | Wear volume normalized by distance (wear_volume / sliding_distance) |

## Steps to Retrain with Experimental Data

1. Place your CSV file in `data/experimental_wear_dataset.csv`.
2. Run the ML pipeline with the new file argument:
   ```powershell
   & "D:\AI\projects\adhesive_wear_ai\.venv\Scripts\python.exe" ml/train.py --data data/experimental_wear_dataset.csv
   ```
3. The training pipeline will automatically:
   - Perform 5-fold cross-validation.
   - Recompute TreeSHAP values on experimental observations.
   - Export newly fitted weights to `models/best_model.pkl`.
   - Update model metadata and reload the FastAPI engine without downtime.
