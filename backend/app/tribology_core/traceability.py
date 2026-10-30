"""
Scientific Traceability Table & Literature Verification Registry
Connects every governing formulation to its original published paper, DOI,
mathematical equation number, code implementation file, and verification tests.
"""

from typing import Dict, Any, List

TRACEABILITY_REGISTRY: List[Dict[str, Any]] = [
    {
        "model_id": "Model A",
        "model_name": "Classical Archard Wear Law Baseline",
        "paper_title": "Contact and Rubbing of Flat Surfaces",
        "authors": "J. F. Archard",
        "year": 1953,
        "journal": "Journal of Applied Physics",
        "volume_issue": "24(8), 981–988",
        "doi": "10.1063/1.1721448",
        "equation_number": "Eq. (7): V = K * W * L / H",
        "variables": {
            "V": "Wear volume (m^3 or mm^3)",
            "K": "Dimensionless wear coefficient (-)",
            "W": "Normal load (N)",
            "L": "Sliding distance (m)",
            "H": "Hardness of softer body (Pa or GPa)"
        },
        "implementation_file": "backend/app/tribology_core/archard.py",
        "unit_test_file": "tests/test_tribology_core.py",
        "verification_status": "VERIFIED (Hand benchmark & Dimensional analysis)",
        "full_text_inspected": True
    },
    {
        "model_id": "Model B",
        "model_name": "Energy-Based Wear Formulation",
        "paper_title": "Quantification of fretting damage / Improving Archard’s Wear Model",
        "authors": "S. Fouvry, P. Kapsa, L. Vincent / J. Choudhry, A. Almqvist, R. Larsson",
        "year": "1996 / 2024",
        "journal": "Wear / Tribology Letters",
        "volume_issue": "200(1-2), 186-205 / 72(3), 93",
        "doi": "10.1016/S0043-1648(96)07306-1 / 10.1007/s11249-024-01888-8",
        "equation_number": "V = alpha_wear * sum(E_d); dh(x) = alpha_wear * mu * p(x) * ds",
        "variables": {
            "V": "Wear volume (m^3)",
            "alpha_wear": "Energy wear coefficient (m^3/J)",
            "E_d": "Dissipated friction energy (J)",
            "mu": "Friction coefficient (-)",
            "p(x)": "Local contact pressure (Pa)"
        },
        "implementation_file": "backend/app/tribology_core/energy_wear.py",
        "unit_test_file": "tests/test_tribology_core.py",
        "verification_status": "VERIFIED (Equivalence with Archard at constant mu verified)",
        "full_text_inspected": True
    },
    {
        "model_id": "Model C",
        "model_name": "Asperity and Rough-Surface Wear (Greenwood-Williamson + Critical Length Scale)",
        "paper_title": "Modeling Adhesive Wear in Asperity and Rough Surface Contacts: A Review / Critical length scale controls adhesive wear mechanisms",
        "authors": "H. Zhang, R. Goltsberg, I. Etsion / R. Aghababaei, D. H. Warner, J.-F. Molinari",
        "year": "2022 / 2016",
        "journal": "Materials / Nature Communications",
        "volume_issue": "15(19), 6855 / 7, 11816",
        "doi": "10.3390/ma15196855 / 10.1038/ncomms11816",
        "equation_number": "d* = Lambda * (Delta_w * G) / tau_c^2; A_r(d) = eta * A0 * int A_asp phi(z) dz",
        "variables": {
            "d*": "Critical junction diameter for wear debris generation (m)",
            "Delta_w": "Work of adhesion (J/m^2)",
            "G": "Shear modulus (Pa)",
            "tau_c": "Junction shear strength (Pa)",
            "phi(z)": "Gaussian summit distribution (1/m)"
        },
        "implementation_file": "backend/app/tribology_core/rough_surface.py",
        "unit_test_file": "tests/test_tribology_core.py",
        "verification_status": "VERIFIED (Bimodal smoothing vs debris partition)",
        "full_text_inspected": True
    },
    {
        "model_id": "Model D",
        "model_name": "Third-Body Mass Balance & Tribological Circuit",
        "paper_title": "Wear modeling and the third body concept",
        "authors": "N. Fillot, I. Iordanoff, Y. Berthier",
        "year": 2007,
        "journal": "Wear",
        "volume_issue": "262(7–8), 949–957",
        "doi": "10.1016/j.wear.2006.10.011",
        "equation_number": "dM_3B/dt = Q_s - Q_e; V_meas = (1/rho) * int Q_e dt",
        "variables": {
            "M_3B": "Trapped debris mass (kg)",
            "Q_s": "Source flow from first bodies (kg/s)",
            "Q_e": "Ejection flow escaping contact (kg/s)",
            "beta": "Screening coefficient (-)",
            "kappa": "Ejection efficiency factor (-)"
        },
        "implementation_file": "backend/app/tribology_core/third_body.py",
        "unit_test_file": "tests/test_tribology_core.py",
        "verification_status": "VERIFIED (Exact conservation: M_detached == M_trapped + M_ejected)",
        "full_text_inspected": True
    },
    {
        "model_id": "Model E",
        "model_name": "Spatial Wear Profile and Contact Mechanics Solver",
        "paper_title": "Modeling adhesive and abrasive wear phenomena in fretting interfaces / Simulating sliding wear with FEM",
        "authors": "P. Arnaud, S. Baydoun, S. Fouvry / P. Podra, S. Andersson",
        "year": "2021 / 1999",
        "journal": "Tribology International",
        "volume_issue": "161, 107077 / 32(2), 71–81",
        "doi": "10.1016/j.triboint.2021.107077 / 10.1016/S0301-679X(99)00012-2",
        "equation_number": "Delta h(x) = k_D * p(x) * ds; Equilibrium: int p(x) dx = W'",
        "variables": {
            "h(x)": "Spatial wear scar depth (m or um)",
            "p(x)": "Contact pressure distribution (Pa or MPa)",
            "a0": "Initial Hertzian semi-contact width (m)",
            "W'": "Normal load per unit length (N/m)"
        },
        "implementation_file": "backend/app/tribology_core/profile_solver.py",
        "unit_test_file": "tests/test_tribology_core.py",
        "verification_status": "VERIFIED (Conformal flattening and volume conservation)",
        "full_text_inspected": True
    }
]

def get_traceability_table() -> List[Dict[str, Any]]:
    return TRACEABILITY_REGISTRY
