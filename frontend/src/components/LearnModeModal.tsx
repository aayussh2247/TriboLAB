import React, { useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface LearnModeProps {
  onStageChange?: (stageIndex: number) => void;
}

export const LearnModeModal: React.FC<LearnModeProps> = ({ onStageChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const stages = [
    {
      title: "Step 1: Asperity Contact",
      simple: "Surfaces that appear completely flat under the naked eye are actually covered in microscopic peaks (asperities) and valleys.",
      engineering: "Contact occurs only at discrete micro-asperities. The true contact area A_r is a minuscule fraction (often < 1%) of the nominal apparent area A_0. Consequently, local contact pressures (P = W / A_r) readily exceed the yield stress of the softer material.",
      visualTarget: "Upper and lower roughness profiles approaching and initial peak contact."
    },
    {
      title: "Step 2: Adhesive Junction Formation",
      simple: "When clean microscopic peaks touch under heavy pressure, atomic forces weld them together at the contact spots.",
      engineering: "Under intense local normal stresses, surface contaminant films rupture. True metallic contact triggers interatomic adhesion and micro-welding across the interface, forming adhesive junctions governed by surface energy and atomic cohesion.",
      visualTarget: "High-stress red contact highlights at asperity junctions."
    },
    {
      title: "Step 3: Sliding Motion & Tangential Shear",
      simple: "As the top part slides across the bottom part, it drags these welded junctions along with it.",
      engineering: "Imposing tangential sliding velocity introduces severe shear strain across the welded junctions. Friction force F = A_r * tau_shear must overcome the shear strength of either the junction interface or the bulk asperity.",
      visualTarget: "Horizontal velocity vector v and tangential shear arrows."
    },
    {
      title: "Step 4: Junction Shearing & Asperity Fracture",
      simple: "The junction breaks! If the weld is stronger than the softer metal underneath, the metal itself tears apart.",
      engineering: "If interfacial adhesive shear strength tau_junction exceeds the shear strength of the bulk weaker substrate tau_bulk, fracture propagates sub-surface within the weaker material rather than along the original interface.",
      visualTarget: "Sheared asperity fragments separating from substrate."
    },
    {
      title: "Step 5: Material Transfer (Adhesive Smearing)",
      simple: "Fragments of the softer metal stick to the harder metal and are carried away.",
      engineering: "Torn material adheres onto the opposing counterface, forming an adherent transfer film. This transfer modifies the tribo-system from metal A vs metal B to metal A vs transferred metal A, altering the effective friction coefficient.",
      visualTarget: "Transferred material clinging to moving upper counterface."
    },
    {
      title: "Step 6: Wear Debris Generation",
      simple: "Repeated rubbing knocks loose fragments free, turning them into loose wear particles and debris.",
      engineering: "Cyclic shearing and surface fatigue cause transferred fragments to work-harden and detach from the counterface as loose, oxidized wear debris. These particles escape the contact zone or act as third-body abrasives.",
      visualTarget: "Loose particulate debris scattering between contact interface."
    },
    {
      title: "Step 7: Progressive Material Loss",
      simple: "Over time, billions of these tiny torn fragments add up to measurable wear volume loss.",
      engineering: "Cumulative detachment of asperity junctions produces macroscopic wear volume V. Classic empirical Archard's Law models this as V = (K * W * L) / H, while our Machine Learning model captures higher-order non-linearities including thermal softening and lubrication breakdown.",
      visualTarget: "Long-term cumulative volume loss and wear track formation."
    }
  ];

  const handleNext = () => {
    if (currentStep < stages.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (onStageChange) onStageChange(next);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      if (onStageChange) onStageChange(prev);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    if (onStageChange) onStageChange(0);
  };

  return (
    <div className="rounded-xl border border-cyan-800/60 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="font-mono text-base font-bold text-slate-100 uppercase tracking-wider">
            LEARN MODE: Step-by-Step Adhesive Wear Mechanism
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <span>STAGE {currentStep + 1} OF {stages.length}</span>
        </div>
      </div>

      <div className="py-4">
        <h4 className="text-lg font-bold text-cyan-300 font-mono mb-2">
          {stages[currentStep].title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3.5">
            <div className="text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              Intuitive Explanation:
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {stages[currentStep].simple}
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3.5">
            <div className="text-xs font-mono font-semibold uppercase text-cyan-400 mb-1">
              Tribology Engineering Principles:
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {stages[currentStep].engineering}
            </p>
          </div>
        </div>

        <div className="mt-3 px-3 py-2 bg-slate-800/40 border border-slate-700/50 rounded-md text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-semibold">Active Simulation Focus: </span>
          {stages[currentStep].visualTarget}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs font-mono transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === stages.length - 1}
            className="flex items-center space-x-1 px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-semibold transition"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
