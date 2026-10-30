import React, { useEffect, useState, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Layers,
  Cpu,
  BarChart2,
  Sliders,
  Target,
  Award,
  BookOpen,
  Zap,
  CheckCircle2,
  Activity,
  ShieldCheck,
  FileText,
  LayoutGrid,
  TrendingDown,
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface PresentationModeProps {
  onClose: () => void;
}

interface SlideItem {
  id: number;
  tag: string;
  category: string;
  title: string;
  subtitle: string;
  renderContent: () => React.ReactNode;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ onClose }) => {
  const [slide, setSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // 20 Comprehensive Academic Slides (A to Z)
  const slides: SlideItem[] = [
    // Slide 1: Title Slide
    {
      id: 1,
      tag: "ACADEMIC DEFENSE • SESSION 2025–26",
      category: "COVER & AUTHORS",
      title: "Predictive Modeling, Explainability (TreeSHAP), & Parametric Optimization of Adhesive Wear",
      subtitle: "A Physics-Informed Machine Learning and Greenwood-Williamson Contact Mechanics Framework",
      renderContent: () => (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-[#F95721] font-sans">
              Guru Ghasidas Vishwavidyalaya (A Central University), Bilaspur (C.G.)
            </div>
            <div className="text-[11px] text-[#64748B] font-sans mt-0.5">
              School of Studies of Engineering & Technology • Department of Mechanical Engineering
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Course: B.Tech 7th & 8th Semester — Fundamentals of Tribology Capstone Project
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-white border border-[#E8E4DA] shadow-xs">
              <span className="text-[10px] font-mono text-[#F95721] font-bold">Investigator 01</span>
              <div className="font-bold text-xs text-[#1E293B] mt-1">Rakesh Kumar</div>
              <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039154</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E8E4DA] shadow-xs">
              <span className="text-[10px] font-mono text-[#F95721] font-bold">Investigator 02</span>
              <div className="font-bold text-xs text-[#1E293B] mt-1">Rajnikant Dubey</div>
              <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039152</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#E8E4DA] shadow-xs">
              <span className="text-[10px] font-mono text-[#F95721] font-bold">Investigator 03</span>
              <div className="font-bold text-xs text-[#1E293B] mt-1">Sanjay Verma</div>
              <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039158</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-center max-w-xl mx-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Under the Guidance & Supervision of
            </div>
            <div className="text-sm font-bold text-[#1E293B] mt-0.5">Dr. Sweta Singh</div>
            <div className="text-[10px] text-[#475569]">
              Professor / Assistant Professor, Department of Mechanical Engineering, GGV Bilaspur
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: Project Overview & Executive Summary
    {
      id: 2,
      tag: "PROJECT EXECUTIVE SUMMARY",
      category: "MOTIVATION",
      title: "The Industrial Problem: Catastrophic Adhesive Wear",
      subtitle: "Why mechanical assemblies fail and why empirical design is insufficient",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] space-y-3">
            <h3 className="font-bold text-xs text-[#1E293B] uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle size={15} className="text-[#F95721]" />
              <span>Industrial Mechanical Vulnerabilities</span>
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Adhesive wear accounts for over <strong>30% of mechanical failure modes</strong> in journal bearings, sliding gears, piston ring cylinder liners, and heavy industrial mechanical seals.
            </p>
            <div className="p-2.5 rounded bg-white border border-[#E8E4DA] text-[11px] text-[#334155]">
              <strong>Primary Consequence:</strong> Catastrophic metal-to-metal scuffing, seizure, thermal runaway, and unexpected machine downtime costing industries billions annually.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-3 shadow-xs">
            <h3 className="font-bold text-xs text-[#1E293B] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>Our Interdisciplinary Solution</span>
            </h3>
            <ul className="text-xs text-[#475569] space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span><strong>Physics + AI Synergy:</strong> Combine Greenwood-Williamson contact mechanics with high-precision XGBoost tree boosting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span><strong>Explainable AI:</strong> Implement TreeSHAP to eliminate black-box dilemma and prove scientific integrity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95721] mt-1.5 flex-shrink-0" />
                <span><strong>Parametric Optimization:</strong> SciPy L-BFGS-B bounded algorithm delivering up to 85.4% wear mitigation.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 3: Microscopic Reality: Rough Surface Contacts
    {
      id: 3,
      tag: "CONTACT MECHANICS",
      category: "SURFACE TOPOGRAPHY",
      title: "Rough Surface Topography & The Real Area of Contact",
      subtitle: "Apparent nominal contact area vs. microscopic asperity summit interactions",
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2.5">
              <h4 className="font-bold text-xs text-[#1E293B]">Apparent Area (A₀) vs. Real Area (Aᵣ)</h4>
              <p className="text-xs text-[#475569] leading-relaxed">
                All engineered surfaces possess microscopic roughness asperities. When two components touch under nominal load <span className="font-mono font-bold">W</span>, physical contact occurs only at discrete summit tips.
              </p>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs font-mono text-[#1E293B]">
                Aᵣ ≈ (0.01% – 1.0%) of A₀
              </div>
              <p className="text-[11px] text-[#64748B]">
                Because the real contact area is minuscule, localized contact pressures easily exceed the compressive yield strength: <span className="font-mono">P = W / Aᵣ &gt; σ_yield</span>.
              </p>
            </div>

            {/* High-Precision SVG Technical Diagram */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#F95721] uppercase tracking-wider font-mono">
                  Mechanical Asperity Contact Sketch (CAD Model)
                </span>
                <svg viewBox="0 0 420 130" className="w-full h-32 bg-white rounded-lg border border-[#E8E4DA] shadow-xs">
                  {/* Load vector W */}
                  <line x1="210" y1="8" x2="210" y2="28" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrow-red)" />
                  <text x="218" y="20" fill="#ef4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Normal Load W</text>

                  {/* Velocity vector v */}
                  <line x1="40" y1="20" x2="80" y2="20" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                  <text x="40" y="14" fill="#0284c7" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Velocity v →</text>

                  {/* Upper Moving Asperity Body */}
                  <path d="M 10 32 L 410 32 L 410 50 Q 350 50 330 68 Q 310 50 250 50 Q 230 50 210 70 Q 190 50 130 50 Q 110 50 90 68 Q 70 50 10 50 Z" fill="#e2e8f0" stroke="#64748B" strokeWidth="1.5" />
                  <text x="20" y="44" fill="#475569" fontSize="9" fontFamily="sans-serif">Upper Moving Body (A₀)</text>

                  {/* Contact Junctions (Micro-welds) */}
                  <circle cx="90" cy="68" r="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
                  <circle cx="210" cy="70" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
                  <circle cx="330" cy="68" r="4.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

                  {/* Lower Stationary Asperity Body */}
                  <path d="M 10 120 L 410 120 L 410 88 Q 350 88 330 68 Q 310 88 250 88 Q 230 88 210 70 Q 190 88 130 88 Q 110 88 90 68 Q 70 88 10 88 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                  <text x="20" y="112" fill="#334155" fontSize="9" fontFamily="sans-serif">Lower Stationary Substrate (Ar &lt;&lt; A₀)</text>

                  {/* Callout Arrow */}
                  <text x="222" y="72" fill="#b91c1c" fontSize="8" fontFamily="mono" fontWeight="bold">Cold Junction (Ar)</text>
                </svg>
              </div>
              <div className="text-[10px] text-[#64748B] text-center mt-2">
                Discrete micro-junctions bear full normal force; true pressure exceeds material yield stress.
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: Greenwood-Williamson Contact Mechanics
    {
      id: 4,
      tag: "THEORETICAL FOUNDATION",
      category: "MATHEMATICAL MODEL",
      title: "Greenwood-Williamson (GW) Statistical Multi-Asperity Contact",
      subtitle: "Gaussian summit height distribution and plastic transition equation",
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] space-y-3">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Greenwood-Williamson Real Contact Area Integral
              </span>
              <div className="text-sm font-serif font-bold text-[#1E293B]">
                Aᵣ = π · η · A₀ · β · ∫<sub>d</sub><sup>∞</sup> (z - d) · φ(z) dz ≈ W / H<sub>asp</sub>
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Asperity heights obey a Gaussian distribution: <span className="font-mono">φ(z) = (1 / σ√(2π)) exp(-z²/2σ²)</span>. Only summits with height <span className="font-mono">z &gt; d</span> penetrate into contact.
              </p>
              <div className="p-2.5 rounded bg-white border border-[#E8E4DA] text-[11px] text-[#1E293B]">
                <strong>Plastic Invariance:</strong> As load <span className="font-mono">W</span> rises, contact expands by generating <em>new micro-contacts</em> rather than enlarging existing ones.
              </div>
            </div>

            {/* SVG Gaussian Distribution Sketch */}
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">
                Gaussian Probability Density Function φ(z)
              </span>
              <svg viewBox="0 0 380 140" className="w-full h-32 bg-[#FAF8F5] rounded-lg border border-[#E8E4DA]">
                {/* Axes */}
                <line x1="30" y1="120" x2="360" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="190" y1="10" x2="190" y2="120" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                <text x="195" y="20" fill="#64748B" fontSize="9" fontFamily="sans-serif">Mean Plane (z=0)</text>

                {/* Shaded Area for z > d */}
                <path d="M 260 120 Q 280 110 300 95 Q 330 65 350 120 Z" fill="rgba(249, 115, 22, 0.35)" />
                <line x1="260" y1="20" x2="260" y2="120" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="264" y="32" fill="#c2410c" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Separation d</text>

                {/* Gaussian Bell Curve */}
                <path d="M 40 120 Q 120 118 150 70 Q 190 15 230 70 Q 260 118 340 120" fill="none" stroke="#0284c7" strokeWidth="2.5" />

                {/* Contacting Summits Label */}
                <text x="280" y="85" fill="#ea580c" fontSize="9" fontFamily="sans-serif" fontWeight="bold">∫ φ(z)dz (In Contact)</text>
              </svg>
              <div className="text-[10px] text-[#64748B] text-center mt-1">
                Only summits in the shaded orange tail (<span className="font-mono">z &gt; d</span>) participate in load bearing and cold welding.
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 5: The 4-Stage Adhesive Wear Mechanism
    {
      id: 5,
      tag: "WEAR DYNAMICS",
      category: "PHYSICAL MECHANISM",
      title: "The 4 Sequential Stages of Adhesive Junction Fracture",
      subtitle: "From atomic micro-welding to loose metallic wear debris formation",
      renderContent: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F95721]">STAGE 01</span>
              <h4 className="font-bold text-xs text-[#1E293B] mt-1 mb-1.5">Asperity Contact & Plastic Yield</h4>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Micro-asperities pierce surface oxide films. Compressive yield strength is exceeded, causing plastic flow at summit contacts.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#F1EFEA] text-[10px] font-mono text-[#64748B]">
              True contact P &gt; σ_yield
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F95721]">STAGE 02</span>
              <h4 className="font-bold text-xs text-[#1E293B] mt-1 mb-1.5">Cold Welding & Adhesion</h4>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Intense atomic proximity between clean metallic lattices forms high-strength solid-state interatomic metallic bonds (cold welds).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#F1EFEA] text-[10px] font-mono text-[#64748B]">
              Interfacial weld formed
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F95721]">STAGE 03</span>
              <h4 className="font-bold text-xs text-[#1E293B] mt-1 mb-1.5">Tangential Shearing & Transfer</h4>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Tangential sliding imposes shear stress. If junction interface bond strength &gt; substrate bulk strength, rupture occurs sub-surface in the softer material.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#F1EFEA] text-[10px] font-mono text-[#64748B]">
              Sub-surface fracture
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F95721]">STAGE 04</span>
              <h4 className="font-bold text-xs text-[#1E293B] mt-1 mb-1.5">Fatigue & Debris Detachment</h4>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Cyclic traversal causes work hardening, micro-crack coalescence, and final detachment of loose metallic wear flakes (debris).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#F1EFEA] text-[10px] font-mono text-[#64748B]">
              Volumetric material loss V
            </div>
          </div>
        </div>
      ),
    },

    // Slide 6: Classical Archard's Wear Law & Failure
    {
      id: 6,
      tag: "EMPIRICAL FORMULATION",
      category: "ARCHARD'S LAW",
      title: "Archard's Wear Law (1953) & Physical Deficiencies",
      subtitle: "The classical formula V = K·W·L / H and why it fails in real machinery",
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] text-center">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
              Archard's Wear Law (Archard, 1953)
            </span>
            <div className="text-xl font-serif font-black text-[#1E293B] my-1">
              V = (K · W · L) / H
            </div>
            <div className="text-[10px] font-mono text-[#64748B]">
              V: Wear Vol (mm³) | K: Wear Coeff | W: Load (N) | L: Distance (m) | H: Hardness (MPa)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
              <strong className="text-rose-900 block mb-1">1. Static K Fallacy</strong>
              <p className="text-[#475569] text-[11px]">
                Archard treats <span className="font-mono font-bold">K</span> as an invariant constant. In reality, <span className="font-mono">K</span> fluctuates by orders of magnitude (10⁻³ to 10⁻⁷) based on speed, temperature, and lubrication.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
              <strong className="text-rose-900 block mb-1">2. Ignored Flash Heat</strong>
              <p className="text-[#475569] text-[11px]">
                Omits localized frictional thermal dissipation. Asperity temperature surges provoke thermal softening of hardness <span className="font-mono">H(T)</span>.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200">
              <strong className="text-rose-900 block mb-1">3. Non-Linear Coupling</strong>
              <p className="text-[#475569] text-[11px]">
                Cannot model boundary monolayer breakdown into severe scuffing regimes. Linear regression yields only <span className="font-mono font-bold">R² = 0.4921</span>.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 7: Thermal Flash-Temperature & Arrhenius Softening
    {
      id: 7,
      tag: "THERMAL PHYSICS",
      category: "HEAT DISSIPATION",
      title: "Flash Temperature Spikes & Substrate Softening H(T)",
      subtitle: "Blok-Jaeger moving heat source theory and exponential thermal degradation",
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2">
              <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">Flash Temperature Equation</span>
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded text-center font-serif text-sm font-bold text-[#1E293B]">
                ΔT<sub>flash</sub> = (μ · W · v) / [4 · J · (κ₁ + κ₂) · a]
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Frictional power dissipation at sliding micro-contacts produces localized interface temperatures <span className="font-mono font-bold">T_int = T_bulk + ΔT_flash</span> hundreds of degrees above ambient.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2">
              <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">Arrhenius Thermal Softening</span>
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded text-center font-serif text-sm font-bold text-[#1E293B]">
                H(T) = H₀ · exp(-β<sub>th</sub> · (T<sub>int</sub> - T₀))
              </div>
              <p className="text-[11px] text-[#475569] leading-relaxed">
                Thermal softening coefficient <span className="font-mono">β_th ≈ 0.0018 °C⁻¹</span>. As contact temperature surges, surface shear resistance drops exponentially, triggering runaway wear.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 8: Boundary Lubrication & Film Dynamics
    {
      id: 8,
      tag: "TRIBOLOGICAL SHIELDING",
      category: "LUBRICATION DYNAMICS",
      title: "Boundary Lubrication Monolayer Attenuation",
      subtitle: "Anti-wear additive shielding (ZDDP) and interfacial shear decoupling",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
            <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wide">
              Boundary Film Shielding Factor (η_lub)
            </h4>
            <div className="p-3 bg-white border border-emerald-200 rounded text-center font-serif text-sm font-bold text-emerald-800">
              K<sub>eff</sub> = K₀ · (1 - η<sub>lub</sub>)
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              In boundary regimes, adsorbed anti-wear monolayers (e.g. ZDDP phosphate glass or fatty acids) physically isolate opposing metallic summits with <span className="font-mono font-bold">η_lub ∈ [0.92, 0.97]</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2.5">
            <h4 className="font-bold text-xs text-[#1E293B] uppercase tracking-wide">Physical Protective Effects</h4>
            <ul className="text-xs text-[#475569] space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>Prevents direct solid-state metallic atomic contact</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>Suppresses micro-welding cold junction generation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />
                <span>TreeSHAP verifies largest negative attribution: <strong className="font-mono text-emerald-700">-85.2 mm³</strong></span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 9: Dataset Architecture (N = 4,000)
    {
      id: 9,
      tag: "DATASET ENGINEERING",
      category: "DATA ARCHITECTURE",
      title: "Multi-Physics Dataset Architecture (N = 4,000 States)",
      subtitle: "Comprehensive 11-parameter input feature space spanning 5 material pairs",
      renderContent: () => (
        <div className="space-y-3">
          <div className="overflow-hidden border border-[#E8E4DA] rounded-lg text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F5] text-[#475569] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2">Feature</th>
                  <th className="p-2">Symbol</th>
                  <th className="p-2">Physical Bound</th>
                  <th className="p-2">Tribological Significance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] font-mono text-[11px]">
                <tr><td className="p-2 font-sans font-semibold">normal_load</td><td>W</td><td>50 – 1,500 N</td><td>Normal contact load driving summit yield</td></tr>
                <tr><td className="p-2 font-sans font-semibold">sliding_speed</td><td>v</td><td>0.1 – 5.0 m/s</td><td>Tangential velocity driving flash temperature</td></tr>
                <tr><td className="p-2 font-sans font-semibold">surface_roughness</td><td>Rₐ</td><td>0.05 – 3.2 μm</td><td>Initial summit height variance</td></tr>
                <tr><td className="p-2 font-sans font-semibold">sliding_distance</td><td>L</td><td>100 – 10,000 m</td><td>Cumulative cyclic shearing distance</td></tr>
                <tr><td className="p-2 font-sans font-semibold">hardness</td><td>H</td><td>120 – 850 HV</td><td>Plastic penetration resistance (1.18–8.34 GPa)</td></tr>
                <tr><td className="p-2 font-sans font-semibold">lubrication</td><td>lub</td><td>Binary (0 / 1)</td><td>Dry unlubricated vs Boundary protected</td></tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#64748B] font-mono">
            <span>Material Pairs: Steel-Steel, Steel-Bronze, Steel-CI, Ceramic-Steel, Polymer-Steel</span>
            <span>Heteroscedastic Experimental Noise: ~10% Incorporated</span>
          </div>
        </div>
      ),
    },

    // Slide 10: Machine Learning Pipeline & Cross-Validation
    {
      id: 10,
      tag: "MACHINE LEARNING",
      category: "MODEL PIPELINE",
      title: "Preprocessing, Pipeline Architecture & 5-Fold Cross-Validation",
      subtitle: "Preventing data leakage and establishing generalized decision boundaries",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">Step 1: Partitioning</span>
            <h4 className="font-bold text-xs text-[#1E293B]">80/20 Stratified Split</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              3,200 training instances and 800 holdout test instances with fixed random seed (42) to ensure strict isolation and zero validation leakage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">Step 2: ColumnTransformer</span>
            <h4 className="font-bold text-xs text-[#1E293B]">StandardScaler & OHE</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Numerical continuous features standardized to zero mean (<span className="font-mono">μ=0, σ=1</span>); categorical material pairs one-hot encoded; binary lubrication passed through.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-bold text-[#F95721] uppercase font-mono">Step 3: Validation</span>
            <h4 className="font-bold text-xs text-[#1E293B]">5-Fold Cross-Validation</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Every algorithm was trained and scored across 5 separate stratified folds, guaranteeing tree pruning stability without test overfitting.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 11: Benchmark Results Matrix (Table 1)
    {
      id: 11,
      tag: "EXPERIMENTAL BENCHMARK",
      category: "RESULTS MATRIX",
      title: "Comparative Benchmark: 4 Machine Learning Models",
      subtitle: "5-Fold CV and holdout test set performance evaluation across 4,000 runs",
      renderContent: () => (
        <div className="space-y-3">
          <div className="overflow-hidden border border-[#E8E4DA] rounded-xl shadow-xs text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F5] text-[#475569] font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Model Architecture</th>
                  <th className="p-2.5">5-Fold CV R²</th>
                  <th className="p-2.5">Test R² Score</th>
                  <th className="p-2.5">Test RMSE (mm³)</th>
                  <th className="p-2.5">Test MAE (mm³)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] font-mono text-[11px]">
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-slate-700">Linear Regression (Baseline)</td>
                  <td className="p-2.5 text-slate-500">0.5175 ± 0.0486</td>
                  <td className="p-2.5 text-rose-600 font-bold">0.4921</td>
                  <td className="p-2.5">282.21</td>
                  <td className="p-2.5">123.41</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-slate-700">Random Forest Regressor</td>
                  <td className="p-2.5 text-slate-500">0.9366 ± 0.0191</td>
                  <td className="p-2.5 text-slate-800 font-bold">0.9477</td>
                  <td className="p-2.5">90.54</td>
                  <td className="p-2.5">24.93</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-sans font-semibold text-slate-700">Gradient Boosting (GBDT)</td>
                  <td className="p-2.5 text-slate-500">0.9408 ± 0.0152</td>
                  <td className="p-2.5 text-slate-800 font-bold">0.9543</td>
                  <td className="p-2.5">84.69</td>
                  <td className="p-2.5">23.76</td>
                </tr>
                <tr className="bg-emerald-50/70 font-bold">
                  <td className="p-2.5 font-sans text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>XGBoost Regressor (Proposed)</span>
                  </td>
                  <td className="p-2.5 text-emerald-800">0.9359 ± 0.0117</td>
                  <td className="p-2.5 text-emerald-700 font-black">0.9655</td>
                  <td className="p-2.5 text-emerald-800">73.58</td>
                  <td className="p-2.5 text-emerald-800">22.47</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual R² & RMSE Benchmark Bar Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-white border border-[#E8E4DA] space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold text-[#475569] uppercase font-mono">Accuracy R² Comparison</span>
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex justify-between"><span>Linear Baseline:</span><span className="text-rose-600 font-bold">0.4921</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: '49.2%' }} /></div>

                <div className="flex justify-between"><span>Random Forest:</span><span className="text-slate-700 font-bold">0.9477</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-600" style={{ width: '94.8%' }} /></div>

                <div className="flex justify-between"><span>Gradient Boosting:</span><span className="text-slate-700 font-bold">0.9543</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-600" style={{ width: '95.4%' }} /></div>

                <div className="flex justify-between"><span className="text-emerald-900 font-bold">XGBoost (Proposed):</span><span className="text-emerald-700 font-bold">0.9655 (Highest)</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-600" style={{ width: '96.6%' }} /></div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white border border-[#E8E4DA] space-y-1.5 shadow-xs">
              <span className="text-[10px] font-bold text-[#475569] uppercase font-mono">Root Mean Squared Error (Lower is Better)</span>
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex justify-between"><span>Linear Baseline:</span><span className="text-rose-600 font-bold">282.2 mm³</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: '100%' }} /></div>

                <div className="flex justify-between"><span>Random Forest:</span><span className="text-slate-700 font-bold">90.5 mm³</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-600" style={{ width: '32.1%' }} /></div>

                <div className="flex justify-between"><span>Gradient Boosting:</span><span className="text-slate-700 font-bold">84.7 mm³</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-600" style={{ width: '30.0%' }} /></div>

                <div className="flex justify-between"><span className="text-emerald-900 font-bold">XGBoost (Proposed):</span><span className="text-emerald-700 font-bold">73.6 mm³ (-73.9%)</span></div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-600" style={{ width: '26.1%' }} /></div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg text-[11px] text-[#475569] flex justify-between">
            <span><strong>Conclusion:</strong> Linear regression is incapable of capturing non-linear adhesive wear (R² &lt; 0.50).</span>
            <span className="font-mono font-bold text-emerald-700">XGBoost reduces RMSE by 73.9%</span>
          </div>
        </div>
      ),
    },

    // Slide 12: XGBoost Architectural Superiority
    {
      id: 12,
      tag: "ALGORITHM DEEP-DIVE",
      category: "XGBOOST ARCHITECTURE",
      title: "Why XGBoost Surpasses All Alternative Regressors",
      subtitle: "Second-order Taylor expansion loss gradients and hardware histogram tree splitting",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2.5">
            <h4 className="font-bold text-xs text-[#1E293B]">1. Second-Order Gradient Splitting</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              XGBoost utilizes both first-order gradients (<span className="font-mono">g_i</span>) and second-order Hessian curvatures (<span className="font-mono">h_i</span>) in its objective loss function:
            </p>
            <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded text-center font-serif text-[11px] font-bold text-[#1E293B]">
              Obj = ∑ [ g_i · f_t(x_i) + ½ h_i · f_t²(x_i) ] + Ω(f_t)
            </div>
            <p className="text-[10px] text-[#64748B]">
              Ensures rapid convergence around severe wear inflection points that GBDT and RF miss.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2.5">
            <h4 className="font-bold text-xs text-[#1E293B]">2. GPU Histogram Acceleration</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Bins continuous features into discrete histograms (<span className="font-mono">tree_method='hist'</span>), enabling sub-millisecond real-time edge inference on NVIDIA RTX 4050 GPUs.
            </p>
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded text-center font-mono text-[11px] font-bold text-emerald-800">
              Inference Speed: &lt; 1.2 ms per state prediction
            </div>
          </div>
        </div>
      ),
    },

    // Slide 13: Explainable AI: Game-Theoretic TreeSHAP
    {
      id: 13,
      tag: "EXPLAINABLE AI",
      category: "TREESHAP THEORY",
      title: "Game-Theoretic TreeSHAP: Cracking The Black Box",
      subtitle: "Shapley Additive exPlanations decomposing wear predictions into exact feature attributions",
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] text-center">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
              Shapley Additive Decomposition (Lundberg & Lee, 2017)
            </span>
            <div className="text-lg font-serif font-black text-[#1E293B] my-1">
              f(x) = φ₀ + ∑<sub>i=1</sub><sup>M</sup> φ<sub>i</sub>(x)
            </div>
            <p className="text-[11px] text-[#475569]">
              Base expected wear value <span className="font-mono font-bold">φ₀ = 274.62 mm³</span> | <span className="font-mono">φ_i(x)</span> = Shapley attribution of parameter <span className="font-mono">i</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E8E4DA] rounded-lg">
              <strong className="text-[#1E293B] block mb-1">Mathematical Axioms Guaranteed</strong>
              <p className="text-[11px] text-[#64748B]">
                Efficiency, Symmetry, Dummy player, and Additivity axioms ensure feature attributions strictly sum to the true model prediction without approximations.
              </p>
            </div>
            <div className="p-3 bg-white border border-[#E8E4DA] rounded-lg">
              <strong className="text-[#1E293B] block mb-1">Physical Truth vs Statistical Noise</strong>
              <p className="text-[11px] text-[#64748B]">
                Allows tribologists to verify if decisions follow Greenwood-Williamson contact laws or erroneous statistical correlations.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 14: TreeSHAP Attribution Findings
    {
      id: 14,
      tag: "PHYSICAL INTERPRETABILITY",
      category: "SHAP ATTRIBUTIONS",
      title: "Empirical TreeSHAP Attribution Findings",
      subtitle: "Sliding distance, contact load, boundary lubrication, and hardness impacts",
      renderContent: () => (
        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-300">+112.4 mm³</span>
              <span className="font-bold text-[#1E293B]">Sliding Distance (L):</span>
              <span className="text-[11px] text-[#475569]">Strongest cumulative positive driver; linear escalation of micro-shearing cycles.</span>
            </div>
            <span className="text-[10px] font-mono text-rose-700 font-bold">WEAR ACCUMULATOR</span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-300">+78.1 mm³</span>
              <span className="font-bold text-[#1E293B]">Normal Contact Load (W):</span>
              <span className="text-[11px] text-[#475569]">Drives plastic flow at summit tips, rapidly expanding real contact area Aᵣ.</span>
            </div>
            <span className="text-[10px] font-mono text-rose-700 font-bold">CONTACT EXPANDER</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">-85.2 mm³</span>
              <span className="font-bold text-[#1E293B]">Boundary Lubrication (Lub):</span>
              <span className="text-[11px] text-[#475569]">Strongest negative mitigation; physically prevents atomic cold-welding.</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">COLD-WELD SHIELD</span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">-42.6 mm³</span>
              <span className="font-bold text-[#1E293B]">Material Hardness (H):</span>
              <span className="text-[11px] text-[#475569]">Higher yield resistance opposes plastic micro-penetration and debris flaking.</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">PENETRATION BARRIER</span>
          </div>

          {/* Graphical TreeSHAP Attribution Visualizer */}
          <div className="p-3 bg-white border border-[#E8E4DA] rounded-lg shadow-xs space-y-2 mt-2">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#475569]">
              <span>Feature Attribution Waterfall Vector (Relative Impact on Wear Volume mm³)</span>
              <span>Base Expectation φ₀ = 274.6 mm³</span>
            </div>
            <div className="space-y-1.5 text-[10px] font-mono">
              <div>
                <div className="flex justify-between mb-0.5"><span>Sliding Distance (+112.4 mm³):</span><span className="text-rose-600 font-bold">+40.9%</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-rose-500 rounded-full" style={{ width: '85%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5"><span>Normal Contact Load (+78.1 mm³):</span><span className="text-rose-600 font-bold">+28.4%</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-rose-500 rounded-full" style={{ width: '58%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5"><span>Boundary Lubrication (-85.2 mm³):</span><span className="text-emerald-700 font-bold">-31.0% (Mitigation)</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '64%' }} /></div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5"><span>Substrate Hardness (-42.6 mm³):</span><span className="text-emerald-700 font-bold">-15.5% (Resistance)</span></div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} /></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 15: Numerical Optimization Framework
    {
      id: 15,
      tag: "PARAMETRIC OPTIMIZATION",
      category: "SCIPY L-BFGS-B",
      title: "Bounded Numerical Optimization Engine (SciPy L-BFGS-B)",
      subtitle: "Automated search for minimum wear operating envelope within physical constraints",
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DA] text-center">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
              Optimization Mathematical Formulation
            </span>
            <div className="text-base font-serif font-black text-[#1E293B] my-2">
              min<sub>x</sub> &nbsp; V̂<sub>XGBoost</sub>(x)
            </div>
            <div className="p-2.5 bg-white border border-[#E8E4DA] rounded text-xs font-mono text-[#334155] max-w-lg mx-auto">
              subject to: &nbsp; W_min ≤ W ≤ W_max, &nbsp; v_min ≤ v ≤ v_max, &nbsp; R_a,min ≤ R_a ≤ R_a,max, &nbsp; lubrication = 1
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white border border-[#E8E4DA] rounded-lg">
              <strong className="text-[#1E293B] block mb-1">L-BFGS-B Algorithm</strong>
              <p className="text-[11px] text-[#475569]">
                Limited-memory Broyden–Fletcher–Goldfarb–Shanno algorithm handles box constraints gracefully, finding optimal operating points in &lt; 50 iterations.
              </p>
            </div>
            <div className="p-3 bg-white border border-[#E8E4DA] rounded-lg">
              <strong className="text-[#1E293B] block mb-1">Industrial Feasibility Guarantee</strong>
              <p className="text-[11px] text-[#475569]">
                Ensures normal load and sliding distance stay within allowable structural machine ratings, preventing unrealistic solutions.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 16: Industrial Case Study (82.32% Reduction)
    {
      id: 16,
      tag: "INDUSTRIAL CASE STUDY",
      category: "OPTIMIZATION CASE STUDY",
      title: "Case Study Demonstration: 82.32% Wear Volume Reduction",
      subtitle: "Severe unlubricated operating regime transformed into sustainable high-longevity state",
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
            <strong>Initial Unoptimized Conditions:</strong> Load = 1,000 N, Speed = 3.5 m/s, Roughness = 2.0 μm, Temp = 120 °C, Dry Contact.
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Unoptimized Wear</span>
              <div className="text-xl font-bold font-mono text-rose-600 mt-1">648.3 mm³</div>
              <div className="text-[10px] text-slate-400 mt-1">Severe Asperity Yield</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Optimized Wear</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">114.6 mm³</div>
              <div className="text-[10px] text-slate-400 mt-1">Mild Steady-State Regime</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Net Wear Reduction</span>
              <div className="text-xl font-black font-mono text-[#F95721] mt-1">-82.32%</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">Life Extended 5.6x</div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg text-xs text-[#475569]">
            <strong>Recommended Engineering Actions:</strong> Activate boundary lubrication monolayer, polish contacting counterfaces to fine honing finish (&lt; 0.6 μm), and regulate bulk thermal cooling.
          </div>
        </div>
      ),
    },

    // Slide 17: Full-Stack Software Architecture
    {
      id: 17,
      tag: "SOFTWARE ARCHITECTURE",
      category: "SYSTEM DESIGN",
      title: "End-to-End Scientific Web Platform Architecture",
      subtitle: "High-performance FastAPI asynchronous REST API + React 18 TypeScript Frontend",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">BACKEND</span>
            <h4 className="font-bold text-xs text-[#1E293B]">FastAPI (Python 3.11)</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Exposes high-speed RESTful endpoints: <span className="font-mono text-[10px]">/predict</span>, <span className="font-mono text-[10px]">/archard</span>, <span className="font-mono text-[10px]">/explain</span>, <span className="font-mono text-[10px]">/optimize</span>, <span className="font-mono text-[10px]">/what-if</span>, and <span className="font-mono text-[10px]">/hardware-status</span>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">FRONTEND</span>
            <h4 className="font-bold text-xs text-[#1E293B]">React 18 + TypeScript + Vite</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Single-page application featuring interactive parameter HUDs, Recharts sensitivity curves, and responsive Tailwind styling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">SIMULATION</span>
            <h4 className="font-bold text-xs text-[#1E293B]">HTML5 2D Contact Canvas</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Real-time 60 FPS asperity contact visualization showing upper moving counterface, cold weld micro-junctions, and debris detachment.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 18: Dedicated Hardware Acceleration (NVIDIA RTX 4050)
    {
      id: 18,
      tag: "COMPUTE ACCELERATION",
      category: "HARDWARE TELEMETRY",
      title: "Dedicated Compute: NVIDIA GeForce RTX 4050 Laptop GPU",
      subtitle: "CUDA 13.0, 6GB GDDR6 VRAM, and histogram tree acceleration",
      renderContent: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                <span className="text-xs font-mono font-bold text-emerald-400">NVIDIA CUDA ACCELERATION</span>
                <span className="text-[10px] font-mono text-slate-400">Active</span>
              </div>
              <div className="text-sm font-bold">NVIDIA GeForce RTX 4050 Laptop GPU</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Ada Lovelace • Compute Capability 8.9 • Driver v581.57 (CUDA 13.0)
              </div>
              <div className="p-2 bg-slate-800 rounded text-xs font-mono flex justify-between">
                <span>Dedicated VRAM:</span>
                <span className="text-emerald-400 font-bold">6,141 MiB (6.0 GB GDDR6)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] space-y-2.5 text-xs">
              <h4 className="font-bold text-xs text-[#1E293B]">Host CPU & Execution Environment</h4>
              <p className="text-[11px] text-[#475569]">
                <strong>Host Processor:</strong> Intel64 Family 6 Model 183 (16 Logical Threads, 10 Physical Cores)
              </p>
              <p className="text-[11px] text-[#475569]">
                <strong>System RAM:</strong> 16.0 GB High Speed Memory
              </p>
              <p className="text-[11px] text-[#475569]">
                <strong>Operating System:</strong> Windows 11 (64-bit Architecture)
              </p>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold">
                ✓ Full GPU Tensor Matrix Support & Live /hardware-status REST Monitoring
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 19: Future Research Roadmap (GGV Tribology Lab)
    {
      id: 19,
      tag: "FUTURE DIRECTIONS",
      category: "RESEARCH ROADMAP",
      title: "Future Scope & University Experimental Expansion",
      subtitle: "Transitioning from calibrated multi-physics simulation to in-situ experimental validation",
      renderContent: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">PHASE 1</span>
            <h4 className="font-bold text-xs text-[#1E293B]">Laboratory Pin-on-Disk Runs</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Integrate empirical wear loss data from university tribometer rigs at the GGV Mechanical Engineering Laboratory to establish transfer learning calibration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">PHASE 2</span>
            <h4 className="font-bold text-xs text-[#1E293B]">Physics-Informed NNs (PINNs)</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Embed Navier-Stokes boundary lubrication Reynolds equations and thermal conduction PDEs directly into the deep learning loss objective.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E8E4DA] shadow-xs space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#F95721]">PHASE 3</span>
            <h4 className="font-bold text-xs text-[#1E293B]">Acoustic Emission (AE) Sensors</h4>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Real-time high-frequency piezoelectric sensor streaming for in-situ edge detection of scuffing onset and junction fracture.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 20: Official Conclusion & Acknowledgments
    {
      id: 20,
      tag: "PROJECT DEFENSE CONCLUSION",
      category: "FINAL SIGN-OFF",
      title: "Project Conclusion & Acknowledgments",
      subtitle: "B.Tech Capstone Project Defense • Department of Mechanical Engineering, GGV",
      renderContent: () => (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
            <Award size={32} className="mx-auto text-emerald-700 mb-2" />
            <h3 className="font-black text-sm text-emerald-950 uppercase tracking-wide">
              Capstone Project Successfully Defended
            </h3>
            <p className="text-xs text-emerald-800 max-w-lg mx-auto mt-1">
              "Predictive Modeling, Explainability (TreeSHAP), and Parametric Optimization of Adhesive Wear in Sliding Tribological Contacts: A Machine Learning and Contact Mechanics Framework"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] space-y-1">
              <span className="font-bold text-[#1E293B] block">Investigator Team:</span>
              <div className="text-[11px] text-[#475569] font-mono space-y-0.5">
                <div>• Rakesh Kumar (Roll No. 23039154)</div>
                <div>• Rajnikant Dubey (Roll No. 23039152)</div>
                <div>• Sanjay Verma (Roll No. 23039158)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DA] space-y-1">
              <span className="font-bold text-[#1E293B] block">Academic Guidance & Institution:</span>
              <p className="text-[11px] text-[#475569]">
                <strong>Supervisor:</strong> Dr. Sweta Singh
              </p>
              <p className="text-[11px] text-[#475569]">
                <strong>Department:</strong> Mechanical Engineering, SoS, E&T
              </p>
              <p className="text-[11px] text-[#475569]">
                <strong>University:</strong> Guru Ghasidas Vishwavidyalaya, Bilaspur
              </p>
            </div>
          </div>

          <div className="text-center pt-2 text-xs font-bold text-[#F95721]">
            Thank You • Questions & Oral Examination Discussion Invited
          </div>
        </div>
      ),
    },
  ];

  // Keyboard navigation
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
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#FAF8F5] text-[#1E293B] flex flex-col justify-between overflow-hidden select-none font-sans"
    >
      {/* Top Slide Control Header */}
      <header className="bg-white border-b border-[#E8E4DA] px-6 py-3.5 flex items-center justify-between shadow-xs z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {current.category}
              </span>
              <span className="text-xs font-bold text-[#1E293B] hidden sm:inline">
                Guru Ghasidas Vishwavidyalaya • B.Tech Defense
              </span>
            </div>
          </div>
        </div>

        {/* Center: Slide Jump Pills & Progress */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-mono font-bold text-[#1E293B]">
            SLIDE <span className="text-[#F95721]">{slide + 1 < 10 ? `0${slide + 1}` : slide + 1}</span> / {slides.length}
          </span>

          <div className="hidden md:flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-lg border border-[#E8E4DA]">
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 rounded transition ${
                showThumbnails ? 'bg-[#F95721] text-white' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
              title="Show Slide Thumbnails"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded text-[#64748B] hover:text-[#1E293B] transition"
              title="Print Slides"
            >
              <Printer size={15} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded text-[#64748B] hover:text-[#1E293B] transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#64748B] hover:text-[#1E293B] border border-[#E8E4DA] transition"
            title="Exit Presentation Mode"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Slide Thumbnails Drawer (Modal/Drawer) */}
      {showThumbnails && (
        <div className="bg-white/95 backdrop-blur-md border-b border-[#E8E4DA] p-4 max-h-48 overflow-y-auto shadow-md z-20">
          <div className="text-[11px] font-bold text-[#64748B] uppercase font-mono mb-2">
            Jump Directly To Any Slide (1 - {slides.length}):
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setSlide(idx);
                  setShowThumbnails(false);
                }}
                className={`p-2 rounded border text-left transition text-[10px] truncate ${
                  slide === idx
                    ? 'bg-[#F95721] text-white border-[#F95721] font-bold'
                    : 'bg-[#FAF8F5] border-[#E8E4DA] text-[#475569] hover:bg-[#F3EFE6]'
                }`}
              >
                <span className="block font-mono text-[9px] opacity-75">#{idx + 1}</span>
                <span className="truncate block font-semibold">{s.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Slide Card Viewport (White Background, Clean PPT Aesthetics) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white border border-[#E8E4DA] rounded-2xl shadow-md p-6 sm:p-10 flex flex-col justify-between min-h-[540px] transition-all duration-300">
          {/* Slide Heading Area */}
          <div>
            <div className="inline-block px-2.5 py-1 rounded bg-[#FFF2EC] border border-[#FED7AA] text-[#F95721] font-mono text-[11px] font-bold tracking-wider mb-3">
              {current.tag}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif text-[#0F172A] tracking-tight leading-snug">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#64748B] mt-1 mb-6">
              {current.subtitle}
            </p>

            {/* Dynamic Slide Body Content */}
            <div className="mt-2 font-sans">
              {current.renderContent()}
            </div>
          </div>

          {/* Slide Progress Bar */}
          <div className="mt-8 pt-4 border-t border-[#F1EFEA] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F95721]" />
              <span>Tribology AI Research • Guru Ghasidas Vishwavidyalaya</span>
            </div>
            <div className="w-48 h-1.5 bg-[#F1EFEA] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F95721] rounded-full transition-all duration-300"
                style={{ width: `${((slide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Toolbar */}
      <footer className="bg-white border-t border-[#E8E4DA] px-6 py-3 flex items-center justify-between text-xs z-30">
        <div className="hidden sm:flex items-center gap-2 text-[#64748B] text-[11px] font-mono">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E4DA] text-[#1E293B]">← Prev</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E4DA] text-[#1E293B]">→ Next</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E4DA] text-[#1E293B]">Space</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E4DA] text-[#1E293B]">Esc Close</kbd>
        </div>

        {/* Carousel Thumbnail Dots */}
        <div className="hidden lg:flex items-center gap-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                slide === idx ? 'w-6 bg-[#F95721]' : 'w-2 bg-[#E8E4DA] hover:bg-[#DDD5BF]'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setSlide((prev) => Math.max(prev - 1, 0))}
            disabled={slide === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#F3EFE6] disabled:opacity-40 disabled:cursor-not-allowed border border-[#E8E4DA] text-[#1E293B] font-semibold transition"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <button
            onClick={() => setSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={slide === slides.length - 1}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#F95721] hover:bg-[#e04512] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition shadow-xs"
          >
            <span>{slide === slides.length - 1 ? 'End Defense' : 'Next Slide'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
};
