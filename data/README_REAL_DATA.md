# Real Data Training Guide (Adhesive Wear AI)

Iss project me aap apna **Real Experimental / Lab Tribology Data** (Pin-on-Disk, Reciprocating Rig, Block-on-Ring) asani se train kar sakte hain.

---

## 1. Required Columns Format (CSV)

Aapka real dataset CSV format me hona chahiye jisme yeh columns ho:

| Column Name | Unit / Type | Description | Example |
|---|---|---|---|
| `material_pair` | String | Material Combination | `Steel-Steel`, `Steel-Bronze`, `Aluminum-Steel` |
| `normal_load` | N (Newton) | Applied normal load | `100`, `250`, `500` |
| `sliding_speed` | m/s | Linear sliding velocity | `0.5`, `1.0`, `2.5` |
| `surface_roughness` | μm ($R_a$) | Initial surface roughness | `0.4`, `1.0`, `2.2` |
| `sliding_distance` | m (meters) | Total sliding distance | `500`, `2000`, `5000` |
| `hardness` | GPa | Hardness of softer material | `1.8`, `2.5`, `4.0` |
| `friction_coeff` | dimensionless | Coefficient of friction ($\mu$) | `0.25`, `0.35`, `0.65` |
| `temperature` | °C | Contact bulk/ambient temp | `25.0`, `60.0`, `120.0` |
| `lubrication` | 0 or 1 | 0 = Dry sliding, 1 = Lubricated | `0` ya `1` |
| `contact_pressure` | MPa | Apparent contact pressure | `5.0`, `12.5` |
| `wear_coefficient`| dimensionless | Empirical Archard K factor | `1.5e-5`, `2.4e-4` |
| `wear_volume` | **$\text{mm}^3$ (TARGET)** | **Measured wear volume loss** | **`0.042`, `0.158`** |

*(Note: Agar aapke paas `wear_rate` ($\text{mm}^3/\text{m}$) hai, toh `wear_volume = wear_rate * sliding_distance` se calculate ho jata hai).*

---

## 2. Training Command

Apna dataset `data/` folder me rakhein (e.g. `data/my_real_data.csv`), aur bas yeh command run karein:

```bash
# Apne real dataset par train karein:
python ml/train.py --data data/my_real_data.csv
```

### Kya hoga train karne par:
1. Saare models (**XGBoost, Random Forest, Gradient Boosting, Linear Regression**) aapke real data par train honge.
2. 5-Fold Cross Validation aur holdout test split automatically execute hoga.
3. Best performing model `models/best_model.pkl` me save hoga.
4. Naye **SHAP TreeExplainer** feature weights calculate honge (`models/shap_explainer.pkl`).
5. Evaluation graphs `outputs/model_evaluation/evaluation_plots.png` me generate ho jayenge.
6. Frontend aur Backend restart hote hi real data ke predictions dikhane lagenge!

---

## 3. Quick Test with Sample / Synthetic Data

Agar default synthetic baseline par dubara train karna ho:
```bash
python ml/train.py
```
