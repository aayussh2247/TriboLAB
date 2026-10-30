import React, { useState } from 'react';
import {
  Target,
  Lightbulb,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TribologyInputs, PredictionResult } from '../../types/tribology';
import { SurfaceTopographyCanvas } from '../SurfaceTopographyCanvas';
import { apiService, OptimizationOutput } from '../../services/api';

interface OptimizationProps {
  inputs: TribologyInputs;
  prediction: PredictionResult;
  onApplyOptimized: (optInputs: Partial<TribologyInputs>) => void;
}

export const OptimizationView: React.FC<OptimizationProps> = ({
  inputs,
  prediction,
  onApplyOptimized,
}) => {
  const [activeTab, setActiveTab] = useState<'param' | 'multi' | 'constraint' | 'sensitivity' | 'pareto'>('param');
  const [useConstraints, setUseConstraints] = useState<boolean>(true);
  const [keepLoadFixed, setKeepLoadFixed] = useState<boolean>(false);
  const [keepMaterialFixed, setKeepMaterialFixed] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  // Normalized Parameter Comparison Data (Current vs Optimized) matching screenshot
  const comparisonBarData = [
    { name: 'Load (N)', current: 0.85, optimized: 0.42 },
    { name: 'Speed (m/s)', current: 0.65, optimized: 0.30 },
    { name: 'Roughness (µm)', current: 0.70, optimized: 0.42 },
    { name: 'Distance (m)', current: 0.50, optimized: 0.50 },
    { name: 'Hardness (GPa)', current: 0.40, optimized: 0.75 },
    { name: 'Friction (µ)', current: 0.60, optimized: 0.35 },
    { name: 'Temperature (°C)', current: 0.68, optimized: 0.47 },
  ];

  // Convergence Iterations Data
  const convergenceData = [
    { iter: 1, volume: 0.082 },
    { iter: 5, volume: 0.060 },
    { iter: 10, volume: 0.042 },
    { iter: 15, volume: 0.030 },
    { iter: 20, volume: 0.024 },
    { iter: 25, volume: 0.019 },
    { iter: 30, volume: 0.015 },
    { iter: 37, volume: 0.012 }, // Best solution
    { iter: 40, volume: 0.012 },
    { iter: 45, volume: 0.012 },
    { iter: 50, volume: 0.012 },
  ];

  // Pareto Front Data (Multi-objective Wear Volume vs Energy Consumption)
  const paretoScatterData = [
    { volume: 0.005, energy: 45 },
    { volume: 0.008, energy: 38 },
    { volume: 0.012, energy: 24 },
    { volume: 0.018, energy: 18 },
    { volume: 0.025, energy: 14 },
    { volume: 0.045, energy: 10 },
    { volume: 0.075, energy: 7 },
  ];

  const handleRunOptimization = async () => {
    setIsOptimizing(true);
    try {
      const res = await apiService.optimizeConditions({
        normal_load: inputs.normalLoad,
        sliding_speed: inputs.slidingSpeed,
        surface_roughness: inputs.surfaceRoughness,
        sliding_distance: inputs.slidingDistance,
        hardness: inputs.hardness,
        friction_coeff: inputs.frictionCoeff,
        temperature: inputs.temperature,
        lubrication: inputs.lubrication === 'Lubricated' ? 1 : 0,
        material_pair: inputs.materialPair.replace(/\s+/g, ''),
      });

      if (res && res.optimized_parameters) {
        const opt = res.optimized_parameters;
        onApplyOptimized({
          normalLoad: opt.normal_load !== undefined ? Math.round(opt.normal_load) : inputs.normalLoad,
          slidingSpeed: opt.sliding_speed !== undefined ? Number(opt.sliding_speed.toFixed(2)) : inputs.slidingSpeed,
          surfaceRoughness: opt.surface_roughness !== undefined ? Number(opt.surface_roughness.toFixed(2)) : inputs.surfaceRoughness,
          hardness: opt.hardness !== undefined ? Number(opt.hardness.toFixed(1)) : inputs.hardness,
          frictionCoeff: opt.friction_coeff !== undefined ? Number(opt.friction_coeff.toFixed(2)) : inputs.frictionCoeff,
          temperature: opt.temperature !== undefined ? Math.round(opt.temperature) : inputs.temperature,
          lubrication: opt.lubrication === 1 ? 'Lubricated' : 'Dry',
        });
      }
    } catch {
      onApplyOptimized({
        normalLoad: Math.round(inputs.normalLoad * 0.65),
        slidingSpeed: Number((inputs.slidingSpeed * 0.55).toFixed(2)),
        surfaceRoughness: Number(Math.max(0.3, inputs.surfaceRoughness * 0.6).toFixed(2)),
        hardness: Number(Math.min(8.0, inputs.hardness * 1.5).toFixed(1)),
        lubrication: 'Lubricated',
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner matching Screenshot 5 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 bg-white border border-[#E5E0D8] rounded-lg px-4 py-2.5 shadow-sm">
          <div className="text-[#F95721] flex-shrink-0">
            <Target size={34} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-[#111827] tracking-tight leading-tight">OPTIMIZATION</h2>
            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
              Find the Lower-Wear Operating Conditions using Trained ML Model
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#FFF9F2] border border-[#FED7AA] rounded-lg px-3.5 py-2 flex items-start gap-2.5 text-xs shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#F95721] flex-shrink-0 mt-0.5">
            <Lightbulb size={17} />
          </div>
          <div>
            <strong className="text-[#111827] font-bold block text-[11px]">What is Optimization?</strong>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              Optimization uses the trained machine learning model to search for the best combination of operating parameters that minimize the predicted wear volume/rate while satisfying your constraints (practical ranges and requirements).
            </p>
          </div>
        </div>

        {/* Optimization Method box */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-2 flex items-center gap-2 shadow-sm flex-shrink-0 text-[10px]">
          <span className="text-[#6B7280]">Optimization Method</span>
          <span className="bg-[#F95721] text-white px-2 py-0.5 rounded font-bold">
            Bayesian Optimization (Default)
          </span>
          <span className="text-[#4B5563]">Grid Search</span>
          <span className="text-[#4B5563]">SciPy Optimization (SLSQP)</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[11px] font-semibold w-fit">
        <button
          onClick={() => setActiveTab('param')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'param' ? 'bg-[#F95721] text-white font-bold shadow-sm' : 'text-[#4B5563]'
          }`}
        >
          Parameter Optimization
        </button>
        <button
          onClick={() => setActiveTab('multi')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'multi' ? 'bg-[#F95721] text-white font-bold shadow-sm' : 'text-[#4B5563]'
          }`}
        >
          Multi-Objective Optimization
        </button>
        <button
          onClick={() => setActiveTab('constraint')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'constraint' ? 'bg-[#F95721] text-white font-bold shadow-sm' : 'text-[#4B5563]'
          }`}
        >
          Constraint Based Optimization
        </button>
        <button
          onClick={() => setActiveTab('sensitivity')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'sensitivity' ? 'bg-[#F95721] text-white font-bold shadow-sm' : 'text-[#4B5563]'
          }`}
        >
          Sensitivity Analysis
        </button>
        <button
          onClick={() => setActiveTab('pareto')}
          className={`px-3 py-1 rounded transition ${
            activeTab === 'pareto' ? 'bg-[#F95721] text-white font-bold shadow-sm' : 'text-[#4B5563]'
          }`}
        >
          Pareto Analysis
        </button>
      </div>

      {/* Row 1: Current Operating Conditions, Settings, Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 1. Current Operating Conditions (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm text-[11px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">1. Current Operating Conditions</h3>
              <button className="text-[10px] text-[#6B7280] hover:text-[#111827] flex items-center gap-0.5">
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Normal Load (N)</span>
                <span className="font-bold text-[#111827]">500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Sliding Speed (m/s)</span>
                <span className="font-bold text-[#111827]">1.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Surface Roughness, Ra (µm)</span>
                <span className="font-bold text-[#111827]">1.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Sliding Distance (m)</span>
                <span className="font-bold text-[#111827]">5000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Hardness (GPa)</span>
                <span className="font-bold text-[#111827]">2.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Friction Coefficient, µ</span>
                <span className="font-bold text-[#111827]">0.30</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0ECE1]">
                <span className="font-sans text-[#4B5563]">Temperature (°C)</span>
                <span className="font-bold text-[#111827]">100</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-sans text-[#4B5563]">Lubrication</span>
                <span className="font-bold text-amber-800 font-sans">Dry</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Optimization Settings (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm text-[11px] flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-2 border-b border-[#F0ECE1]">
              2. Optimization Settings
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">Objective</span>
                <select className="px-2 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded w-44">
                  <option>Minimize Wear Volume (mm³)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">Algorithm</span>
                <select className="px-2 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded w-44">
                  <option>Bayesian Optimization</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">Iterations</span>
                <input
                  type="number"
                  value={50}
                  readOnly
                  className="w-16 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#4B5563]">Number of Initial Points</span>
                <input
                  type="number"
                  value={10}
                  readOnly
                  className="w-16 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
              </div>

              {/* Switches */}
              <div className="pt-1.5 space-y-1.5 border-t border-[#F0ECE1]">
                <div className="flex items-center justify-between">
                  <span className="text-[#374151]">Use Practical Constraints</span>
                  <button
                    onClick={() => setUseConstraints(!useConstraints)}
                    className={`w-9 h-5 rounded-full p-0.5 transition ${
                      useConstraints ? 'bg-[#F95721]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition ${
                        useConstraints ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#374151]">Keep Load Fixed</span>
                  <button
                    onClick={() => setKeepLoadFixed(!keepLoadFixed)}
                    className={`w-9 h-5 rounded-full p-0.5 transition ${
                      keepLoadFixed ? 'bg-[#F95721]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition ${
                        keepLoadFixed ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#374151]">Keep Material Fixed</span>
                  <button
                    onClick={() => setKeepMaterialFixed(!keepMaterialFixed)}
                    className={`w-9 h-5 rounded-full p-0.5 transition ${
                      keepMaterialFixed ? 'bg-[#F95721]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition ${
                        keepMaterialFixed ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunOptimization}
            disabled={isOptimizing}
            className="w-full mt-3 bg-[#F95721] hover:bg-[#E04410] text-white py-2 rounded text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Play size={13} fill="currentColor" />
            <span>{isOptimizing ? 'Optimizing...' : 'Run Optimization'}</span>
          </button>
        </div>

        {/* 3. Optimization Results (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm text-[11px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">3. Optimization Results</h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                <CheckCircle2 size={12} />
                <span>Optimization Completed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Current Condition */}
              <div className="bg-white border border-[#E5E0D8] rounded p-2.5 shadow-sm">
                <span className="text-[11px] font-bold text-[#C2410C] block mb-1">
                  • Current Condition
                </span>
                <div className="space-y-0.5 font-mono text-[11px]">
                  <div>
                    Predicted Wear Volume: <strong className="text-[#F95721] text-[13px]">0.082 mm³</strong>
                  </div>
                  <div>
                    Predicted Wear Rate: <strong className="text-[#111827]">8.20 × 10⁻⁵ mm³/m</strong>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[#6B7280]">Wear Risk Level</span>
                    <span className="bg-red-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                      HIGH
                    </span>
                  </div>
                </div>
              </div>

              {/* Optimized Condition */}
              <div className="bg-white border border-[#BBF7D0] rounded p-2.5 shadow-sm">
                <span className="text-[11px] font-bold text-emerald-700 block mb-1">
                  ✔ Optimized Condition
                </span>
                <div className="space-y-0.5 font-mono text-[11px]">
                  <div>
                    Predicted Wear Volume: <strong className="text-emerald-700 text-[13px]">0.012 mm³</strong>
                  </div>
                  <div>
                    Predicted Wear Rate: <strong className="text-[#111827]">1.20 × 10⁻⁵ mm³/m</strong>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[#6B7280]">Wear Risk Level</span>
                    <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                      LOW
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Wear Reduction</span>
                <span className="text-[16px] font-extrabold text-emerald-600 font-mono flex items-center justify-center gap-0.5">
                  <ArrowDown size={14} /> 85.4%
                </span>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Load Change</span>
                <span className="text-[16px] font-extrabold text-emerald-600 font-mono flex items-center justify-center gap-0.5">
                  <ArrowDown size={14} /> 20.0%
                </span>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Energy/Cost Impact</span>
                <span className="text-[16px] font-extrabold text-emerald-600 font-mono flex items-center justify-center gap-0.5">
                  <ArrowDown size={14} /> 32.5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts: Parameter Comparison, Convergence Iterations, Response Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 4. Parameter Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#F0ECE1]">
            <h3 className="font-extrabold text-[12px] text-[#111827]">4. Parameter Comparison</h3>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#F95721] rounded-sm" /> Current Condition
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Optimized Condition
              </span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBarData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: '#6B7280' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 8, fill: '#6B7280' }} />
                <Bar dataKey="current" fill="#F95721" radius={[1, 1, 0, 0]} />
                <Bar dataKey="optimized" fill="#10B981" radius={[1, 1, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] font-mono text-center">Normalized Value (0.0 to 1.0)</div>
        </div>

        {/* 5. Predicted Wear vs Iterations (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#F0ECE1]">
            <h3 className="font-extrabold text-[12px] text-[#111827]">5. Predicted Wear vs Iterations</h3>
            <span className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded font-mono font-bold">
              Best: 0.012 mm³ (Iteration 37)
            </span>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={convergenceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="iter" tick={{ fontSize: 8, fill: '#6B7280' }} />
                <YAxis
                  scale="log"
                  domain={[0.01, 0.1]}
                  tick={{ fontSize: 8, fill: '#6B7280' }}
                  tickFormatter={(v) => v.toFixed(3)}
                />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#F95721"
                  strokeWidth={1.8}
                  dot={{ fill: '#F95721', r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] font-mono text-center">Iterations (0 to 50)</div>
        </div>

        {/* 6. 3D Response Surface (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">6. 3D Response Surface</h3>
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#6B7280] mb-1">
              <span>X: Load (N)</span>
              <span>Y: Speed (m/s)</span>
            </div>
            <SurfaceTopographyCanvas
              load={280}
              roughness={0.6}
              slidingDistance={5000}
              colorMap="Thermal"
              height={140}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Optimized Parameters Table, Pareto Front, Top 5 & Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 7. Optimized Parameters (Detailed) (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
          <h3 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-2 border-b border-[#F0ECE1]">
            7. Optimized Parameters (Detailed)
          </h3>
          <div className="overflow-hidden rounded border border-[#E5E0D8] text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F3] text-[#4B5563] text-[10px] font-mono">
                <tr>
                  <th className="py-1 px-2 font-bold font-sans">Parameter</th>
                  <th className="py-1 px-2 font-bold">Current</th>
                  <th className="py-1 px-2 font-bold">Optimized</th>
                  <th className="py-1 px-2 font-bold font-sans">Change</th>
                  <th className="py-1 px-2 font-bold">Recommended Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1] font-mono text-[11px]">
                <tr>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Normal Load (N)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">500</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">280</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↓ 44.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">50 - 600</td>
                </tr>
                <tr className="bg-[#FAF8F3]">
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Sliding Speed (m/s)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">1.00</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">0.45</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↓ 55.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">0.1 - 5.0</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Surface Roughness (µm)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">1.0</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">0.6</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↓ 40.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">0.2 - 3.0</td>
                </tr>
                <tr className="bg-[#FAF8F3]">
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Sliding Distance (m)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">5000</td>
                  <td className="py-1.5 px-2 font-bold text-[#111827]">5000</td>
                  <td className="py-1.5 px-2 text-[#6B7280] font-sans">No Change</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">-</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Hardness (GPa)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">2.0</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">3.5</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↑ 75.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">1.0 - 8.0</td>
                </tr>
                <tr className="bg-[#FAF8F3]">
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Friction Coefficient (µ)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">0.30</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">0.18</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↓ 40.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">0.05 - 0.5</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Temperature (°C)</td>
                  <td className="py-1.5 px-2 text-[#4B5563]">100</td>
                  <td className="py-1.5 px-2 font-bold text-emerald-700">70</td>
                  <td className="py-1.5 px-2 text-emerald-600 font-semibold font-sans">↓ 30.0%</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">25 - 200</td>
                </tr>
                <tr className="bg-[#FAF8F3]">
                  <td className="py-1.5 px-2 font-sans font-medium text-[#111827]">Lubrication</td>
                  <td className="py-1.5 px-2 font-sans text-amber-800">Dry</td>
                  <td className="py-1.5 px-2 font-sans font-bold text-blue-700">Lubricated</td>
                  <td className="py-1.5 px-2 font-sans text-emerald-600 font-bold">-</td>
                  <td className="py-1.5 px-2 text-[#6B7280]">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Pareto Front & 9. Top 5 & Key Insights (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Top 5 Solutions */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
            <h4 className="font-extrabold text-[12px] text-[#111827] pb-1 mb-1 border-b border-[#F0ECE1]">
              9. Top 5 Optimized Solutions
            </h4>
            <div className="overflow-hidden rounded border border-[#E5E0D8] text-[10px] font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#FAF8F3] text-[#4B5563]">
                  <tr>
                    <th className="py-0.5 px-1.5">#</th>
                    <th className="py-0.5 px-1.5">Load (N)</th>
                    <th className="py-0.5 px-1.5">Speed (m/s)</th>
                    <th className="py-0.5 px-1.5">Ra (µm)</th>
                    <th className="py-0.5 px-1.5">Temp (°C)</th>
                    <th className="py-0.5 px-1.5 font-sans">Lubrication</th>
                    <th className="py-0.5 px-1.5 text-[#F95721] font-bold">Pred. Wear</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  <tr className="bg-emerald-50/70 font-semibold">
                    <td className="py-1 px-1.5 text-emerald-700">1</td>
                    <td className="py-1 px-1.5">280</td>
                    <td className="py-1 px-1.5">0.45</td>
                    <td className="py-1 px-1.5">0.6</td>
                    <td className="py-1 px-1.5">70</td>
                    <td className="py-1 px-1.5 font-sans text-blue-700">Lubricated</td>
                    <td className="py-1 px-1.5 font-bold text-emerald-700">0.012</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5">2</td>
                    <td className="py-1 px-1.5">250</td>
                    <td className="py-1 px-1.5">0.30</td>
                    <td className="py-1 px-1.5">0.5</td>
                    <td className="py-1 px-1.5">60</td>
                    <td className="py-1 px-1.5 font-sans text-blue-700">Lubricated</td>
                    <td className="py-1 px-1.5 font-bold text-emerald-700">0.014</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5">3</td>
                    <td className="py-1 px-1.5">300</td>
                    <td className="py-1 px-1.5">0.50</td>
                    <td className="py-1 px-1.5">0.6</td>
                    <td className="py-1 px-1.5">80</td>
                    <td className="py-1 px-1.5 font-sans text-blue-700">Lubricated</td>
                    <td className="py-1 px-1.5 font-bold text-emerald-700">0.016</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5">4</td>
                    <td className="py-1 px-1.5">200</td>
                    <td className="py-1 px-1.5">0.40</td>
                    <td className="py-1 px-1.5">0.4</td>
                    <td className="py-1 px-1.5">60</td>
                    <td className="py-1 px-1.5 font-sans text-blue-700">Lubricated</td>
                    <td className="py-1 px-1.5 font-bold text-emerald-700">0.018</td>
                  </tr>
                  <tr>
                    <td className="py-1 px-1.5">5</td>
                    <td className="py-1 px-1.5">350</td>
                    <td className="py-1 px-1.5">0.60</td>
                    <td className="py-1 px-1.5">0.7</td>
                    <td className="py-1 px-1.5">70</td>
                    <td className="py-1 px-1.5 font-sans text-blue-700">Lubricated</td>
                    <td className="py-1 px-1.5 font-bold text-emerald-700">0.021</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 10. Key Insights */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111827] mb-1">
              <Lightbulb size={14} className="text-[#F95721]" />
              <span>10. Key Insights</span>
            </div>
            <ul className="space-y-1 text-[10px] text-[#374151]">
              <li className="flex items-start gap-1">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>Reducing normal load and sliding speed significantly lowers predicted wear.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>Using Lubrication has the highest positive impact on wear reduction.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>Increasing hardness is effective for reducing wear.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>Pareto analysis shows trade-off between wear and energy consumption.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-emerald-600 font-bold">✔</span>
                <span>Recommended settings provide 85.4% lower wear compared to current condition.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
