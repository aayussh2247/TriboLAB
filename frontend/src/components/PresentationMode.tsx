import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Presentation } from "lucide-react";

interface PresentationModeProps {
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onClose }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "1. The Fundamental Problem of Adhesive Wear",
      subtitle: "Tribological Degradation in Mechanical Systems",
      bullets: [
        "Mechanical engineering components (bearings, gears, slider guides) experience severe surface degradation under boundary contact.",
        "Adhesive wear is the predominant degradation mode occurring when localized asperity junctions micro-weld and shear apart.",
        "Objective: Build an interdisciplinary AI framework to model physical mechanisms, predict wear volume, explain features via SHAP, and optimize conditions."
      ],
      tag: "OVERVIEW & MOTIVATION"
    },
    {
      title: "2. The Physical Reality: Rough Surface Contacts",
      subtitle: "Greenwood-Williamson Contact Mechanics",
      bullets: [
        "Machined and ground metallic surfaces are never atomically smooth; they exhibit micro-topographies of peaks (asperities) and valleys.",
        "Apparent Contact Area (A_0) vs True Real Contact Area (A_r): A_r is typically < 1% of A_0.",
        "Micro-asperities bear the entire normal load W, generating localized pressures that easily surpass material compressive yield strength."
      ],
      tag: "CONTACT MECHANICS"
    },
    {
      title: "3. Asperity Contact to Adhesive Junction Formation",
      subtitle: "Interfacial Cold-Welding Mechanics",
      bullets: [
        "Under plastic deformation, natural oxide and contaminant surface layers rupture.",
        "Virgin metallic lattices touch directly across asperity junctions.",
        "Interatomic attraction and adhesive bonding establish localized micro-welds with high shear strength."
      ],
      tag: "PHYSICAL MECHANISM"
    },
    {
      title: "4. Sliding, Shearing, and Material Transfer",
      subtitle: "The Mechanism of Wear Debris Generation",
      bullets: [
        "Tangential motion imposes severe shear stress across the welded junctions.",
        "If junction bond strength exceeds the shear yield strength of the softer substrate, fracture propagates sub-surface inside the bulk material.",
        "Material transfers to the counterface and subsequently detaches as loose wear particles under repeated cyclic stress."
      ],
      tag: "WEAR MECHANISM"
    },
    {
      title: "5. Classical Empirical Framework: Archard's Wear Law",
      subtitle: "V = (K · W · L) / H",
      bullets: [
        "V = Total Wear Volume (mm³)",
        "W = Normal Load (N) | L = Sliding Distance (m) | H = Material Hardness (GPa or N/mm²)",
        "K = Dimensionless Archard Wear Coefficient (typically 10⁻³ to 10⁻⁷).",
        "Limitation: Archard assumes constant K and linear hardness, failing to capture flash temperature softening, roughness interaction, and lubricant starvation regimes."
      ],
      tag: "EMPIRICAL FOUNDATION"
    },
    {
      title: "6. Digital Transformation: Physical Mechanism to Structured Data",
      subtitle: "High-Fidelity Tribology Synthetic Dataset (N = 4,000)",
      bullets: [
        "Encoded multi-physics phenomena: Greenwood-Williamson contact, thermal softening H(T) = H_0·exp(-βΔT), PV scuffing factors, and boundary film protection.",
        "Features: normal_load, sliding_speed, roughness Ra, distance, hardness, friction μ, temperature, lubrication, contact pressure.",
        "Realistic experimental heteroscedastic stochastic noise (~10%) incorporated to avoid trivial over-fitting."
      ],
      tag: "DATASET ENGINEERING"
    },
    {
      title: "7. Machine Learning Modeling & Cross-Validation",
      subtitle: "Benchmarking Linear vs Ensemble Algorithms",
      bullets: [
        "Linear Regression (Baseline): R² = 0.4921 (Fails on non-linear multi-physics coupling).",
        "Random Forest Regressor: R² = 0.9477 | RMSE = 90.54 mm³.",
        "Gradient Boosting Regressor: R² = 0.9543 | RMSE = 84.69 mm³.",
        "XGBoost Regressor (Best Model): R² = 0.9655 | RMSE = 73.58 mm³ | MAE = 22.47 mm³.",
        "5-Fold Cross-Validation confirms high generalizability (CV R² = 0.9359 ± 0.0117)."
      ],
      tag: "MACHINE LEARNING"
    },
    {
      title: "8. Explainable AI: Rigorous SHAP (Shapley Additive exPlanations)",
      subtitle: "Cracking the Black Box with Game Theory",
      bullets: [
        "TreeExplainer computes exact Shapley values for individual predictions.",
        "Dominant Wear Drivers identified: Sliding distance (positive), Normal load (positive), Hardness (negative), Lubrication (strong negative reduction).",
        "Individual prediction transparency: Every inference includes mathematical attribution breakdown of why wear was calculated high or low."
      ],
      tag: "EXPLAINABLE AI (SHAP)"
    },
    {
      title: "9. Multi-Variable Operating Condition Optimization",
      subtitle: "Bounded SciPy Minimization (L-BFGS-B)",
      bullets: [
        "Objective: Minimize predicted wear volume within allowable industrial operating envelopes.",
        "Algorithm optimizes load, speed, roughness finish, and temperature regulation.",
        "Provides actionable recommendations: typically achieving 60% to 85% reduction in wear rates via boundary lubrication and superfinishing."
      ],
      tag: "TRIBOLOGICAL OPTIMIZATION"
    },
    {
      title: "10. Engineering Conclusion & Scientific Limitations",
      subtitle: "Summary for College Defense & Future Research",
      bullets: [
        "Machine Learning successfully captures non-linear tribological regimes beyond classical Archard empirical simplifications.",
        "Physical Limitations: Synthetic data is demonstration-grade; real industrial certification requires laboratory pin-on-disk validation.",
        "Future Scope: Integration of high-frequency acoustic emission (AE) sensors and real-time wear track computer vision."
      ],
      tag: "CONCLUSION & DEFENSE"
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft") {
        setSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, slides.length]);

  const current = slides[slide];

  return (
    <div className="fixed inset-0 z-50 bg-[#090d16] flex flex-col justify-between p-8 text-slate-100 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <Presentation className="w-6 h-6 text-cyan-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
            RESEARCH PRESENTATION MODE • COLLEGE DEFENSE
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-mono text-sm text-cyan-400">
            SLIDE {slide + 1} / {slides.length}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="max-w-5xl mx-auto my-auto w-full py-8">
        <div className="inline-block px-3 py-1 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-xs font-semibold mb-4 tracking-wider">
          {current.tag}
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight font-sans mb-3">
          {current.title}
        </h1>
        <h2 className="text-xl md:text-2xl font-mono text-cyan-400/90 mb-8">
          {current.subtitle}
        </h2>

        <div className="space-y-4">
          {current.bullets.map((b, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/40 border border-cyan-700/50 flex items-center justify-center font-mono text-cyan-300 font-bold text-sm">
                {idx + 1}
              </div>
              <p className="text-base md:text-lg text-slate-300 font-sans leading-relaxed pt-0.5">
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-xs text-slate-400">
        <div>
          <span>Keys: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">←</kbd> Prev | <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">→</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Space</kbd> Next | <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">Esc</kbd> Exit</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
            disabled={slide === 0}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={() => setSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={slide === slides.length - 1}
            className="flex items-center space-x-1 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
