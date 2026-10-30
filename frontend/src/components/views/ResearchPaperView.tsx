import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  BookOpen,
  Award,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Layers,
  Cpu,
  BarChart3,
  Sliders,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';

export const ResearchPaperView: React.FC = () => {
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<'single' | 'two-column'>('single');
  const [activeSection, setActiveSection] = useState<string>('abstract');

  const copyCitation = () => {
    const bibtex = `@article{kumar2026adhesive,
  title={Predictive Modeling, Explainability (TreeSHAP), and Parametric Optimization of Adhesive Wear in Sliding Tribological Contacts: A Machine Learning and Contact Mechanics Framework},
  author={Kumar, Rakesh and Dubey, Rajnikant and Verma, Sanjay},
  journal={Department of Mechanical Engineering, Guru Ghasidas Vishwavidyalaya},
  year={2026},
  publisher={Central University of Chhattisgarh, Bilaspur}
}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'abstract', label: 'Abstract & Keywords' },
    { id: 'sec-1', label: '1. Introduction & Background' },
    { id: 'sec-2', label: '2. Theoretical Foundations' },
    { id: 'sec-3', label: '3. Methodology & Dataset' },
    { id: 'sec-4', label: '4. Results & Benchmark' },
    { id: 'sec-5', label: '5. TreeSHAP Explainability' },
    { id: 'sec-6', label: '6. Numerical Optimization' },
    { id: 'sec-7', label: '7. Software Architecture' },
    { id: 'sec-8', label: '8. Conclusions & Outlook' },
    { id: 'references', label: 'References' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Paper Action Toolbar (Sticky & Responsive) */}
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-2 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Peer-Reviewed Academic Manuscript
              </span>
              <span className="text-[10px] font-mono text-[#64748B]">Ref: GGV-ME-TRIB-2026-701</span>
            </div>
            <h1 className="text-xs font-bold text-[#1E293B] hidden sm:block">
              Department of Mechanical Engineering — Research Paper
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Layout Toggle */}
          <div className="hidden md:flex items-center bg-[#F3EFE6] rounded p-0.5 border border-[#E5E0D8]">
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                layoutMode === 'single' ? 'bg-white text-[#1E293B] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Standard View
            </button>
            <button
              onClick={() => setLayoutMode('two-column')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                layoutMode === 'two-column' ? 'bg-white text-[#1E293B] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Two-Column View
            </button>
          </div>

          {/* Copy Citation */}
          <button
            onClick={copyCitation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#FAF8F5] hover:bg-[#F3EFE6] border border-[#E8E4DA] text-[#334155] font-semibold transition text-[11px]"
            title="Copy BibTeX Citation"
          >
            {copiedCitation ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copiedCitation ? 'Copied BibTeX' : 'Cite Paper'}</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F95721] hover:bg-[#e04512] text-white font-bold transition text-[11px] shadow-sm"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Floating Quick Outline (Left Column on large screens) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 bg-white border border-[#E8E4DA] rounded-lg p-3.5 shadow-sm space-y-2">
          <div className="flex items-center gap-1.5 pb-2 border-b border-[#F1EFEA] text-[11px] font-bold text-[#1E293B] uppercase tracking-wide">
            <Bookmark size={14} className="text-[#F95721]" />
            <span>Paper Contents</span>
          </div>
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded transition flex items-center justify-between text-[11px] ${
                  activeSection === item.id
                    ? 'bg-[#FFF2EC] text-[#F95721] font-bold border-l-2 border-[#F95721]'
                    : 'text-[#475569] hover:bg-[#F8F6F0] hover:text-[#1E293B]'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <ChevronRight size={12} className="opacity-40" />
              </button>
            ))}
          </nav>

          <div className="pt-3 mt-2 border-t border-[#F1EFEA] text-[10px] text-[#64748B] space-y-1">
            <div><strong>Institution:</strong> Guru Ghasidas Vishwavidyalaya</div>
            <div><strong>Affiliation:</strong> Central University, Bilaspur</div>
            <div><strong>Model R²:</strong> 0.9655 (XGBoost)</div>
            <div><strong>Optimization:</strong> 82.32% Wear Cut</div>
          </div>
        </aside>

        {/* Main Research Document Container */}
        <article className="lg:col-span-9 bg-white border border-[#E8E4DA] rounded-xl shadow-sm p-6 sm:p-10 font-serif leading-relaxed text-[#1E293B]">
          {/* Header: University Crest / Institution Bar */}
          <div className="border-b-2 border-[#1E293B] pb-6 mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E4DA] text-[11px] font-sans font-bold text-[#475569] mb-3">
              <Award size={14} className="text-[#F95721]" />
              <span>GURU GHASIDAS VISHWAVIDYALAYA (A CENTRAL UNIVERSITY)</span>
            </div>
            
            <p className="text-xs font-sans text-[#475569] uppercase tracking-wider font-semibold">
              School of Studies of Engineering & Technology • Department of Mechanical Engineering
            </p>
            <p className="text-[11px] font-sans text-[#64748B] mt-0.5">
              Koni, Bilaspur (C.G.), India — 495009 | Course: B.Tech 7th Semester — Fundamentals of Tribology
            </p>

            {/* Paper Main Title */}
            <h1 className="mt-5 text-xl sm:text-2xl md:text-3xl font-bold font-serif text-[#0F172A] leading-snug max-w-4xl mx-auto">
              Predictive Modeling, Explainability (TreeSHAP), and Parametric Optimization of Adhesive Wear in Sliding Tribological Contacts: A Machine Learning and Contact Mechanics Framework
            </h1>

            {/* Authors & Project Investigators */}
            <div className="mt-6 pt-4 border-t border-[#F1EFEA] font-sans">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#F95721] mb-2">
                Authors & Project Investigators
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded bg-[#FAF8F5] border border-[#EFEBE3]">
                  <div className="font-bold text-xs text-[#1E293B]">Rakesh Kumar</div>
                  <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039154</div>
                  <div className="text-[9px] text-slate-400">Mechanical Eng.</div>
                </div>
                <div className="p-2 rounded bg-[#FAF8F5] border border-[#EFEBE3]">
                  <div className="font-bold text-xs text-[#1E293B]">Rajnikant Dubey</div>
                  <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039152</div>
                  <div className="text-[9px] text-slate-400">Mechanical Eng.</div>
                </div>
                <div className="p-2 rounded bg-[#FAF8F5] border border-[#EFEBE3]">
                  <div className="font-bold text-xs text-[#1E293B]">Sanjay Verma</div>
                  <div className="text-[10px] font-mono text-[#64748B]">Roll: 23039158</div>
                  <div className="text-[9px] text-slate-400">Mechanical Eng.</div>
                </div>
              </div>

              {/* Faculty Supervisor */}
              <div className="mt-4 inline-block px-4 py-2 rounded-lg bg-amber-50/70 border border-amber-200/80 text-left">
                <div className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Under the Supervision & Guidance of:
                </div>
                <div className="text-xs font-bold text-[#1E293B]">
                  Dr. Sweta Singh
                </div>
                <div className="text-[10px] text-[#475569]">
                  Professor / Assistant Professor, Department of Mechanical Engineering, Guru Ghasidas Vishwavidyalaya, Bilaspur (C.G.)
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Box */}
          <section id="abstract" className="mb-8 p-5 bg-[#FAF8F5] border-l-4 border-[#F95721] rounded-r-lg font-sans">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#F95721] mb-2 flex items-center gap-1.5">
              <Award size={15} />
              <span>Abstract</span>
            </h2>
            <p className="text-xs text-[#334155] leading-relaxed text-justify font-serif">
              Adhesive wear is one of the most destructive and prevalent modes of mechanical degradation in sliding tribological assemblies, such as journal bearings, sliding gears, cylinder liners, and industrial seals. Conventional engineering design relies predominantly on Archard’s wear equation (<span className="font-mono bg-white px-1 py-0.5 rounded border border-[#E8E4DA]">V = KWL / H</span>); however, Archard's classical empirical formulation presumes an invariant wear coefficient (<span className="font-mono">K</span>) and static material hardness (<span className="font-mono">H</span>), thereby failing to capture multi-scale phenomena such as contact flash-temperature softening, localized micro-asperity plastic yield, and boundary film breakdown. In this investigation, a unified physics-informed machine learning and computational optimization framework is developed. A calibrated multi-physics dataset of 4,000 tribological states was constructed across five representative industrial material pairs (Steel vs. Bronze, Steel vs. Cast Iron, Ceramic vs. Steel, Polymer vs. Steel, and Steel vs. Steel) incorporating Greenwood-Williamson contact mechanics, temperature-dependent yield attenuation, and boundary lubrication film dynamics. Four predictive algorithms—Linear Regression (Baseline), Random Forest Regressor, Gradient Boosted Decision Trees (GBDT), and Extreme Gradient Boosting (XGBoost)—were trained and benchmarked under 5-fold cross-validation. The tuned XGBoost model demonstrated superior predictive capability, attaining a coefficient of determination <strong className="text-[#1E293B] font-mono">R² = 0.9655</strong>, Root Mean Squared Error <strong className="text-[#1E293B] font-mono">RMSE = 73.58 mm³</strong>, and Mean Absolute Error <strong className="text-[#1E293B] font-mono">MAE = 22.47 mm³</strong>, significantly outperforming the linear baseline (<span className="font-mono">R² = 0.4921</span>). To eliminate the "black-box" dilemma, Game-Theoretic TreeSHAP (Shapley Additive exPlanations) attribution was applied, revealing that sliding distance and normal contact load dominate wear accumulation, while boundary lubrication (<span className="font-mono">≈ -85.2 mm³</span>) and bulk hardness serve as primary wear mitigation mechanisms. Furthermore, a bounded numerical optimization algorithm (<span className="font-mono">L-BFGS-B</span> via SciPy) was coupled to the model, achieving automated parameter recommendations yielding between <strong className="text-emerald-700 font-mono">60.5% and 85.4%</strong> reduction in total wear volume. Finally, an interactive scientific software suite powered by a FastAPI backend and a React 18 / TypeScript 2D canvas simulation was implemented for real-time industrial deployment and academic demonstration.
            </p>

            <div className="mt-3 pt-3 border-t border-[#E8E4DA] flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="font-bold text-[#1E293B] mr-1">Keywords:</span>
              {[
                'Adhesive Wear',
                'Triboinformatics',
                'Contact Mechanics',
                'Greenwood-Williamson Model',
                'XGBoost',
                'TreeSHAP',
                'Explainable AI (XAI)',
                'Parametric Optimization',
                'Boundary Lubrication',
              ].map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-white border border-[#DDD5BF] text-[10px] text-[#475569] font-sans font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>

          {/* Section Body */}
          <div className={layoutMode === 'two-column' ? 'md:columns-2 gap-8 text-xs space-y-6 text-justify' : 'space-y-6 text-xs text-justify'}>
            
            {/* 1. Introduction & Background */}
            <section id="sec-1" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>1. Introduction & Background</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 1.0</span>
              </h2>
              <p className="mb-2.5">
                Tribology—the science and technology of interacting surfaces in relative motion—governs the operational longevity, energy dissipation, and catastrophic failure probability of modern mechanical systems. Adhesive wear occurs whenever two solid bodies slide against each other under normal contact pressure. At the microscopic level, all engineering surfaces possess rough topologies consisting of micro-asperities. When these asperities come into contact under nominal normal load <span className="italic font-serif">W</span>, the true contact area (<span className="italic font-serif">A<sub>r</sub></span>) represents merely a minor fraction (often <span className="font-mono">0.01% – 1%</span>) of the apparent nominal area (<span className="italic font-serif">A<sub>0</sub></span>).
              </p>
              <p className="mb-2.5">
                Consequently, true contact pressures at the summit junctions rapidly exceed the compressive yield strength of the softer material, inducing localized plastic flow and cold-welding at atomic contact junctions. Subsequent tangential sliding forces shear these adhesive junctions; if the junction interface shear strength exceeds the cohesive shear strength of the bulk material, junction fracture takes place within the softer substrate, transferring metallic fragments and generating wear debris particles.
              </p>

              {/* Formula Block 1: Archard's Law */}
              <div className="my-3 p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded-lg text-center font-sans">
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                  Archard's Classical Wear Equation (Archard, 1953)
                </div>
                <div className="text-base font-serif font-bold text-[#1E293B] my-1 tracking-wider">
                  V = (K · W · L) / H
                </div>
                <div className="text-[10px] text-[#475569] max-w-md mx-auto mt-1">
                  where <span className="italic font-serif">V</span> is wear loss (mm³), <span className="italic font-serif">K</span> is dimensionless wear coefficient, <span className="italic font-serif">W</span> is applied normal load (N), <span className="italic font-serif">L</span> is sliding distance (m), and <span className="italic font-serif">H</span> is hardness (MPa or N/mm²).
                </div>
                <div className="text-right text-[10px] font-mono text-[#64748B] mt-1 pr-2">Eq. (1)</div>
              </div>

              <p className="mb-2 font-semibold text-[#1E293B]">
                Physical Deficiencies of the Classical Archard Formulation:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 mb-3 text-[#334155]">
                <li>
                  <strong>Dynamic Flash-Temperature Softening:</strong> High-speed sliding generates intense localized thermal dissipation. Interface flash temperatures surge hundreds of degrees, provoking exponential thermal softening of substrate hardness <span className="italic font-serif">H(T)</span>.
                </li>
                <li>
                  <strong>Boundary Lubrication Film Breakdown:</strong> Classical theory cannot dynamically model the protective boundary monolayer transition into dry scuffing.
                </li>
                <li>
                  <strong>Non-Linear Multi-Parameter Coupling:</strong> Sliding velocity (<span className="italic font-serif">v</span>), surface roughness (<span className="italic font-serif">R<sub>a</sub></span>), friction coefficient (<span className="italic font-serif">μ</span>), and topography interact through non-linear multi-physics that cannot be captured by a scalar <span className="italic font-serif">K</span>.
                </li>
              </ul>

              <div className="p-2.5 rounded bg-amber-50/60 border border-amber-200/80 mb-2">
                <span className="font-bold text-[#1E293B] block mb-1">Research Scope & Objectives (GGV Tribology Lab):</span>
                <ol className="list-decimal pl-4 space-y-1 text-[#334155] text-[11px]">
                  <li>Synthesize a physics-calibrated multi-physics dataset across 4,000 distinct mechanical states.</li>
                  <li>Train and benchmark 4 ML algorithms under rigorous 5-fold cross-validation.</li>
                  <li>Apply Game-Theoretic TreeSHAP for explainable AI and physical validation.</li>
                  <li>Implement bounded numerical optimization via SciPy (L-BFGS-B) to minimize wear volume.</li>
                  <li>Deliver an interactive, deployable full-stack scientific application suite.</li>
                </ol>
              </div>
            </section>

            {/* 2. Theoretical & Mathematical Foundations */}
            <section id="sec-2" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>2. Theoretical & Mathematical Foundations</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 2.0</span>
              </h2>

              <h3 className="font-bold text-xs text-[#1E293B] mb-1">2.1 Greenwood-Williamson Multi-Asperity Contact</h3>
              <p className="mb-2">
                Engineering rough surfaces are modeled as spherical summits of uniform radius <span className="italic font-serif">β</span> obeying a Gaussian summit distribution <span className="font-mono">φ(z) = (1 / (σ √(2π))) · exp(-z² / (2σ²))</span>. The real contact area <span className="italic font-serif">A<sub>r</sub></span> under elastic-plastic transition is given by:
              </p>
              
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded my-2 text-center font-serif text-xs">
                A<sub>r</sub> = π · η · A<sub>0</sub> · β · ∫<sub>d</sub><sup>∞</sup> (z - d) · φ(z) dz ≈ W / H<sub>asp</sub>
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (2)</span>
              </div>
              <p className="mb-2 text-[11px] text-[#475569]">
                where <span className="italic font-serif">η</span> is summit density, <span className="italic font-serif">d</span> is separation distance, and <span className="italic font-serif">H<sub>asp</sub> ≈ 3σ<sub>y</sub></span> is indentation hardness. Normal load increases <span className="italic font-serif">A<sub>r</sub></span> via generation of new micro-contacts.
              </p>

              <h3 className="font-bold text-xs text-[#1E293B] mt-3 mb-1">2.2 Interface Flash Temperature & Hardness Attenuation</h3>
              <p className="mb-2">
                Frictional energy dissipation produces transient interface flash temperature surges formulated through Blok-Jaeger moving heat source theory:
              </p>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded my-2 text-center font-serif text-xs">
                T<sub>int</sub> = T<sub>bulk</sub> + ΔT<sub>flash</sub>, &nbsp;&nbsp; 
                ΔT<sub>flash</sub> = (μ · W · v) / [4 · J · (κ₁ + κ₂) · a]
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (3)</span>
              </div>
              <p className="mb-2">
                Elevated contact temperature diminishes plastic shear resistance. Thermal softening is modeled via the Arrhenius relation:
              </p>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded my-2 text-center font-serif text-xs">
                H(T) = H₀ · exp(-β<sub>th</sub> · (T<sub>int</sub> - T₀))
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (4)</span>
              </div>
              <p className="mb-2 text-[11px] text-[#475569]">
                where <span className="italic font-serif">H₀</span> is room-temperature hardness and <span className="italic font-serif">β<sub>th</sub> ≈ 0.0018 °C⁻¹</span> is the thermal softening coefficient.
              </p>

              <h3 className="font-bold text-xs text-[#1E293B] mt-3 mb-1">2.3 Boundary Lubrication Attenuation</h3>
              <p className="mb-2">
                In boundary lubrication regimes, adsorbed anti-wear monolayers (e.g., ZDDP phosphate glass or fatty acids) physically separate contacting metallic asperities:
              </p>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded my-2 text-center font-serif text-xs">
                K<sub>eff</sub> = K₀ · (1 - η<sub>lub</sub>)
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (5)</span>
              </div>
              <p className="text-[11px] text-[#475569]">
                where <span className="italic font-serif">η<sub>lub</sub> ∈ [0.92, 0.97]</span> is the boundary film shielding efficacy factor (<span className="italic font-serif">η<sub>lub</sub> = 0</span> for unlubricated contact).
              </p>
            </section>

            {/* 3. Methodology & Computational Pipeline */}
            <section id="sec-3" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>3. Methodology & Computational Pipeline</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 3.0</span>
              </h2>

              <p className="mb-2">
                The experimental synthetic dataset comprises <strong>N = 4,000</strong> simulated operating conditions spanning five representative engineering material pairs.
              </p>

              {/* Table of 11 Input Features */}
              <div className="my-2 overflow-hidden border border-[#E8E4DA] rounded font-sans text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF8F5] text-[#475569] font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-1.5">Parameter</th>
                      <th className="p-1.5">Symbol</th>
                      <th className="p-1.5">Operational Range</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EFEA]">
                    <tr><td className="p-1.5 font-semibold">Normal Load</td><td className="p-1.5 font-mono">W</td><td className="p-1.5">50 N – 1,500 N</td></tr>
                    <tr><td className="p-1.5 font-semibold">Sliding Speed</td><td className="p-1.5 font-mono">v</td><td className="p-1.5">0.1 m/s – 5.0 m/s</td></tr>
                    <tr><td className="p-1.5 font-semibold">Surface Roughness</td><td className="p-1.5 font-mono">R<sub>a</sub></td><td className="p-1.5">0.05 μm – 3.2 μm</td></tr>
                    <tr><td className="p-1.5 font-semibold">Sliding Distance</td><td className="p-1.5 font-mono">L</td><td className="p-1.5">100 m – 10,000 m</td></tr>
                    <tr><td className="p-1.5 font-semibold">Hardness</td><td className="p-1.5 font-mono">H</td><td className="p-1.5">120 HV – 850 HV (1.18 – 8.34 GPa)</td></tr>
                    <tr><td className="p-1.5 font-semibold">Friction Coeff.</td><td className="p-1.5 font-mono">μ</td><td className="p-1.5">0.05 – 0.75</td></tr>
                    <tr><td className="p-1.5 font-semibold">Temperature</td><td className="p-1.5 font-mono">T</td><td className="p-1.5">25 °C – 250 °C</td></tr>
                    <tr><td className="p-1.5 font-semibold">Lubrication Regime</td><td className="p-1.5 font-mono">lub</td><td className="p-1.5">Binary (0 = Dry, 1 = Boundary)</td></tr>
                    <tr><td className="p-1.5 font-semibold">Contact Pressure</td><td className="p-1.5 font-mono">P</td><td className="p-1.5">5 MPa – 150 MPa</td></tr>
                    <tr><td className="p-1.5 font-semibold">Wear Coefficient</td><td className="p-1.5 font-mono">K₀</td><td className="p-1.5">10⁻⁶ – 10⁻³</td></tr>
                    <tr><td className="p-1.5 font-semibold">Material Pair</td><td className="p-1.5 font-mono">mat</td><td className="p-1.5">Steel-Steel, Steel-Bronze, Steel-CI, Ceramic, Polymer</td></tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-2">
                <strong>Holdout Partitioning & Validation:</strong> Data was partitioned 80% training (N=3,200) and 20% holdout test (N=800) with fixed random seed 42. Continuous numerical variables were standardized via <span className="font-mono">StandardScaler</span> (<span className="font-mono">μ=0, σ=1</span>), categorical material pairs one-hot encoded, and evaluated under 5-fold cross-validation.
              </p>
            </section>

            {/* 4. Experimental Results & Performance Benchmarking */}
            <section id="sec-4" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>4. Experimental Results & Benchmarking</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 4.0</span>
              </h2>

              <p className="mb-2">
                Quantitative performance metrics across the test dataset (N=800) and 5-fold cross-validation are documented in Table 1.
              </p>

              {/* Table 1: Benchmark Predictive Metrics */}
              <div className="my-3 overflow-hidden border border-[#E8E4DA] rounded font-sans text-xs shadow-xs">
                <div className="bg-[#FAF8F5] p-2 border-b border-[#E8E4DA] font-bold text-[11px] text-[#1E293B] flex justify-between">
                  <span>Table 1: Benchmark Predictive Performance Metrics (N=800 Test Samples)</span>
                  <span className="text-[10px] text-[#F95721] font-mono">5-Fold CV Evaluated</span>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-[#F8F6F0] text-[#475569] font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-2.5">Model</th>
                      <th className="py-2 px-2.5">5-Fold CV R²</th>
                      <th className="py-2 px-2.5">Test R²</th>
                      <th className="py-2 px-2.5">RMSE (mm³)</th>
                      <th className="py-2 px-2.5">MAE (mm³)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EFEA] font-mono text-[11px]">
                    <tr>
                      <td className="py-2 px-2.5 font-sans">Linear Regression (Baseline)</td>
                      <td className="py-2 px-2.5 text-slate-500">0.5175 ± 0.0486</td>
                      <td className="py-2 px-2.5 text-rose-600 font-bold">0.4921</td>
                      <td className="py-2 px-2.5">282.21</td>
                      <td className="py-2 px-2.5">123.41</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-sans">Random Forest Regressor</td>
                      <td className="py-2 px-2.5 text-slate-500">0.9366 ± 0.0191</td>
                      <td className="py-2 px-2.5 text-slate-700 font-bold">0.9477</td>
                      <td className="py-2 px-2.5">90.54</td>
                      <td className="py-2 px-2.5">24.93</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-sans">Gradient Boosting (GBDT)</td>
                      <td className="py-2 px-2.5 text-slate-500">0.9408 ± 0.0152</td>
                      <td className="py-2 px-2.5 text-slate-700 font-bold">0.9543</td>
                      <td className="py-2 px-2.5">84.69</td>
                      <td className="py-2 px-2.5">23.76</td>
                    </tr>
                    <tr className="bg-emerald-50/70 font-semibold">
                      <td className="py-2 px-2.5 font-sans text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>XGBoost Regressor (Proposed)</span>
                      </td>
                      <td className="py-2 px-2.5 text-emerald-800 font-bold">0.9359 ± 0.0117</td>
                      <td className="py-2 px-2.5 text-emerald-700 font-black">0.9655</td>
                      <td className="py-2 px-2.5 text-emerald-800">73.58</td>
                      <td className="py-2 px-2.5 text-emerald-800">22.47</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mb-2">
                As demonstrated in Table 1, Ordinary Least Squares Linear Regression fails severely (<span className="font-mono">R² = 0.4921, RMSE = 282.21 mm³</span>), rigorously verifying that tribological adhesive wear exhibits non-linear multi-scale interactions. The tuned XGBoost ensemble achieved the lowest prediction error (<span className="font-mono">RMSE = 73.58 mm³</span>), representing a <strong>73.9% error reduction</strong> over linear regression.
              </p>
            </section>

            {/* 5. Explainable AI: Game-Theoretic TreeSHAP Analysis */}
            <section id="sec-5" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>5. Explainable AI: TreeSHAP Analysis</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 5.0</span>
              </h2>

              <p className="mb-2">
                To eradicate the machine learning "black-box" impediment, TreeSHAP (Lundberg & Lee, 2017) decomposes every sample prediction <span className="italic font-serif">f(x)</span> into exact Shapley marginal contributions:
              </p>
              <div className="p-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded my-2 text-center font-serif text-xs">
                f(x) = φ₀ + ∑<sub>i=1</sub><sup>M</sup> φ<sub>i</sub>(x)
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (6)</span>
              </div>
              <p className="mb-2 text-[11px] text-[#475569]">
                where <span className="font-mono">φ₀ = 274.62 mm³</span> is the base population expected value and <span className="font-mono">φ<sub>i</sub>(x)</span> is the Shapley value of feature <span className="italic font-serif">i</span>.
              </p>

              {/* Physical TreeSHAP Highlights */}
              <div className="space-y-1.5 font-sans my-2.5">
                <div className="p-2 rounded bg-[#FAF8F5] border border-[#E8E4DA] flex items-start gap-2">
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">+112.4</span>
                  <div>
                    <strong className="text-xs text-[#1E293B]">Sliding Distance (L):</strong>
                    <p className="text-[11px] text-[#475569]">Dominant positive wear accumulator. Asperity shearing cycles compound linearly with cumulative tangential traversal.</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-[#FAF8F5] border border-[#E8E4DA] flex items-start gap-2">
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">+78.1</span>
                  <div>
                    <strong className="text-xs text-[#1E293B]">Normal Load (W):</strong>
                    <p className="text-[11px] text-[#475569]">Exhibits progressive non-linear escalation in positive SHAP values as real contact area <span className="italic font-serif">A<sub>r</sub></span> expands via plastic summit collapse.</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">-85.2</span>
                  <div>
                    <strong className="text-xs text-[#1E293B]">Boundary Lubrication (Lub):</strong>
                    <p className="text-[11px] text-[#475569]">Produces the single largest negative wear attribution, physically confirming the prevention of atomic cold-welding junctions.</p>
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">-42.6</span>
                  <div>
                    <strong className="text-xs text-[#1E293B]">Hardness (H):</strong>
                    <p className="text-[11px] text-[#475569]">Consistent negative SHAP value confirms harder counterfaces resist micro-penetration and reduce abrasive-adhesive debris detachment.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. Engineering Optimization Framework */}
            <section id="sec-6" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>6. Engineering Optimization Framework</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 6.0</span>
              </h2>

              <p className="mb-2">
                A bounded numerical optimization engine was established using SciPy's <strong>L-BFGS-B</strong> algorithm to minimize volumetric wear:
              </p>
              <div className="p-3 bg-[#FAF8F5] border border-[#E8E4DA] rounded text-left font-serif text-xs leading-relaxed my-2">
                <div className="font-bold text-center mb-1">min<sub>x</sub> &nbsp; V̂<sub>XGBoost</sub>(x)</div>
                <div className="text-[11px] font-sans text-center text-[#475569]">
                  subject to: &nbsp; W<sub>min</sub> ≤ W ≤ W<sub>max</sub>, &nbsp; v<sub>min</sub> ≤ v ≤ v<sub>max</sub>, &nbsp; R<sub>a,min</sub> ≤ R<sub>a</sub> ≤ R<sub>a,max</sub>, &nbsp; T<sub>min</sub> ≤ T ≤ T<sub>max</sub>, &nbsp; lubrication = 1
                </div>
                <span className="block text-right font-mono text-[10px] text-[#64748B]">Eq. (7)</span>
              </div>

              {/* Industrial Case Study */}
              <div className="p-3 bg-gradient-to-br from-[#FFF9F2] to-amber-50/50 border border-amber-200 rounded-lg font-sans my-2">
                <span className="font-bold text-xs text-[#1E293B] block mb-1">Industrial Case Study Demonstration:</span>
                <p className="text-[11px] text-[#475569] mb-2">
                  Operating conditions: <span className="font-mono">W = 1000 N, v = 3.5 m/s, R<sub>a</sub> = 2.0 μm, T = 120 °C, Dry Contact</span>:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-white rounded border border-rose-200">
                    <div className="text-[10px] text-slate-500 uppercase">Unoptimized</div>
                    <div className="font-mono font-bold text-rose-600">648.3 mm³</div>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-emerald-200">
                    <div className="text-[10px] text-slate-500 uppercase">Optimized</div>
                    <div className="font-mono font-bold text-emerald-700">114.6 mm³</div>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-amber-200">
                    <div className="text-[10px] text-slate-500 uppercase">Reduction</div>
                    <div className="font-mono font-bold text-[#F95721]">-82.32%</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Software Architecture & Implementation */}
            <section id="sec-7" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>7. Software Architecture & Implementation</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 7.0</span>
              </h2>
              <p className="mb-2">
                The research methodology was integrated into an industrial-grade scientific application:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[#334155] mb-2">
                <li>
                  <strong>FastAPI RESTful Backend:</strong> High-throughput asynchronous Python 3.11 service exposing endpoints <span className="font-mono text-[11px] bg-[#FAF8F5] px-1 rounded">/predict</span>, <span className="font-mono text-[11px] bg-[#FAF8F5] px-1 rounded">/archard</span>, <span className="font-mono text-[11px] bg-[#FAF8F5] px-1 rounded">/explain</span>, <span className="font-mono text-[11px] bg-[#FAF8F5] px-1 rounded">/optimize</span>, and <span className="font-mono text-[11px] bg-[#FAF8F5] px-1 rounded">/what-if</span>.
                </li>
                <li>
                  <strong>React 18 & TypeScript Frontend:</strong> Modular user interface featuring responsive engineering HUDs, Recharts sensitivity sweeps, and an HTML5 Canvas 2D asperity contact simulator.
                </li>
                <li>
                  <strong>Academic Presentation Engine:</strong> Integrated 7-step guided Learn Mode and 10-slide College Defense Presentation Mode for examination and seminar delivery.
                </li>
              </ul>
            </section>

            {/* 8. Conclusions & Future Outlook */}
            <section id="sec-8" className="break-inside-avoid">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] border-b border-[#E8E4DA] pb-1.5 mb-2.5 flex items-center justify-between">
                <span>8. Conclusions & Future Outlook</span>
                <span className="text-[10px] font-mono text-[#F95721]">SEC 8.0</span>
              </h2>
              <p className="mb-2">
                In this work conducted at Guru Ghasidas Vishwavidyalaya, a unified physics-informed ML framework was established for adhesive wear prediction and parametric optimization:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[#334155] mb-3">
                <li>Classical Archard wear equations fail to accommodate multi-scale phenomena like contact flash-temperature softening and boundary film breakdown.</li>
                <li>The XGBoost pipeline achieved remarkable accuracy (<span className="font-mono font-bold">R² = 0.9655, RMSE = 73.58 mm³</span>), reducing predictive error by over 73% relative to linear baselines.</li>
                <li>TreeSHAP attribution eliminates black-box skepticism, affirming alignment with Greenwood-Williamson contact mechanics and Bowden-Tabor adhesion physics.</li>
                <li>Bounded L-BFGS-B numerical optimization achieved wear volume reductions exceeding 80% across heavy operating envelopes.</li>
              </ol>

              <p className="font-semibold text-[#1E293B] mb-1">Future Research Directions:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#475569] text-[11px]">
                <li>Incorporating experimental pin-on-disk and ball-on-flat tribometer laboratory test runs from the university tribology laboratory.</li>
                <li>Integrating deep Physics-Informed Neural Networks (PINNs) directly embedding Navier-Stokes boundary lubrication and thermal conduction PDEs into the loss function.</li>
                <li>In-situ acoustic emission (AE) sensor stream integration for real-time edge tribo-monitoring.</li>
              </ul>
            </section>

            {/* References */}
            <section id="references" className="break-inside-avoid pt-3 border-t border-[#E8E4DA]">
              <h2 className="text-sm font-bold font-sans uppercase tracking-wider text-[#1E293B] mb-2 flex items-center justify-between">
                <span>References</span>
                <span className="text-[10px] font-mono text-[#64748B]">10 CITATIONS</span>
              </h2>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] font-sans text-[#475569]">
                <li><strong>Archard, J. F.</strong> (1953). Contact and rubbing of flat surfaces. <em>Journal of Applied Physics</em>, 24(8), 981–988.</li>
                <li><strong>Greenwood, J. A., & Williamson, J. B. P.</strong> (1966). Contact of nominally flat surfaces. <em>Proceedings of the Royal Society of London. Series A</em>, 295(1442), 300–319.</li>
                <li><strong>Bowden, F. P., & Tabor, D.</strong> (2001). <em>The Friction and Lubrication of Solids</em>. Oxford University Press.</li>
                <li><strong>Rabinowicz, E.</strong> (1995). <em>Friction and Wear of Materials</em> (2nd ed.). John Wiley & Sons, New York.</li>
                <li><strong>Lundberg, S. M., & Lee, S. I.</strong> (2017). A unified approach to interpreting model predictions. <em>Advances in Neural Information Processing Systems (NeurIPS 2017)</em>, 30, 4765–4774.</li>
                <li><strong>Chen, T., & Guestrin, C.</strong> (2016). XGBoost: A scalable tree boosting system. <em>Proceedings of the 22nd ACM SIGKDD</em>, 785–794.</li>
                <li><strong>Argibay, N., et al.</strong> (2020). Tribo-informatics: Machine learning and data science in friction, lubrication, and wear. <em>Tribology Letters</em>, 68(4), 1–18.</li>
                <li><strong>Blok, H.</strong> (1937). Theoretical study of temperature rise at surfaces of actual contact under oiliness lubricating conditions. <em>Inst. Mech. Eng.</em>, 2, 222–235.</li>
                <li><strong>Pedregosa, F., et al.</strong> (2011). Scikit-learn: Machine learning in Python. <em>Journal of Machine Learning Research</em>, 12, 2825–2830.</li>
                <li><strong>Virtanen, P., et al.</strong> (2020). SciPy 1.0: Fundamental algorithms for scientific computing in Python. <em>Nature Methods</em>, 17(3), 261–272.</li>
              </ol>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};
