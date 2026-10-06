import React, { useState } from 'react';
import {
  Box,
  Lightbulb,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TribologyInputs, PredictionResult } from '../../types/tribology';
import { InputParametersPanel } from '../InputParametersPanel';
import { SurfaceTopographyCanvas } from '../SurfaceTopographyCanvas';

interface SimulatorProps {
  inputs: TribologyInputs;
  prediction: PredictionResult;
  onInputChange: (key: keyof TribologyInputs, val: any) => void;
  onRunSimulation: () => void;
  onReset: () => void;
}

export const WearSimulatorView: React.FC<SimulatorProps> = ({
  inputs,
  prediction,
  onInputChange,
  onRunSimulation,
  onReset,
}) => {
  const [visTab, setVisTab] = useState<'topography' | 'depth' | 'material' | 'animation'>('topography');
  const [viewMode, setViewMode] = useState<'3D View' | 'Top View' | 'Side View'>('3D View');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [realisticTexture, setRealisticTexture] = useState<boolean>(false);
  const [evolutionTab, setEvolutionTab] = useState<'volume' | 'depth' | 'friction' | 'temp'>('volume');
  const [paramToVary, setParamToVary] = useState<string>('Normal Load (N)');

  // Cross section data (U-shaped wear scar dipping down to -12.6 um)
  const crossSectionData = [];
  const trackCenter = 1.0; // mm
  const trackWidth = 0.48; // mm
  const maxDepth = 12.6; // µm

  for (let x = 0; x <= 2.0; x += 0.05) {
    const dist = Math.abs(x - trackCenter);
    let depth = 0;
    if (dist < trackWidth * 1.25) {
      const u = dist / (trackWidth * 0.7);
      depth = -maxDepth * Math.exp(-2.2 * u * u);
      // Pileup ridge at shoulder
      depth += (maxDepth * 0.18) * Math.exp(-5.5 * Math.pow(u - 1.15, 2));
    }
    // Asperity roughness
    depth += (Math.sin(x * 35) * 0.4);
    crossSectionData.push({
      position: Number(x.toFixed(2)),
      depth: Number(depth.toFixed(2)),
    });
  }

  // Wear evolution with sliding distance (0 to 10000 m)
  const evolutionData = [
    { distance: 0, volume: 0.001 },
    { distance: 500, volume: 0.007 },
    { distance: 1000, volume: 0.015 },
    { distance: 2000, volume: 0.032 },
    { distance: 3000, volume: 0.048 },
    { distance: 4000, volume: 0.065 },
    { distance: 5000, volume: 0.082 },
    { distance: 7000, volume: 0.115 },
    { distance: 8500, volume: 0.145 },
    { distance: 10000, volume: 0.185 },
  ];

  // Parameter study data (Normal Load vs Wear Volume & Wear Rate)
  const paramStudyData = [
    { load: 100, volume: 0.006, rate: 0.000012 },
    { load: 200, volume: 0.015, rate: 0.000025 },
    { load: 300, volume: 0.028, rate: 0.000042 },
    { load: 400, volume: 0.048, rate: 0.000062 },
    { load: 500, volume: 0.082, rate: 0.000082 },
    { load: 600, volume: 0.125, rate: 0.000105 },
    { load: 700, volume: 0.178, rate: 0.000135 },
    { load: 800, volume: 0.245, rate: 0.000170 },
    { load: 900, volume: 0.320, rate: 0.000215 },
    { load: 1000, volume: 0.420, rate: 0.000275 },
  ];

  return (
    <div className="space-y-3.5">
      {/* Top Banner matching Screenshot 2 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 bg-white border border-[#E5E0D8] rounded-lg px-4 py-2.5 shadow-sm">
          <div className="text-[#F95721] flex-shrink-0">
            <Box size={34} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-[#111827] tracking-tight leading-tight">WEAR SIMULATION</h2>
            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
              Simulate adhesive wear behaviour under different operating conditions
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#FFF9F2] border border-[#FED7AA] rounded-lg px-3.5 py-2 flex items-start gap-3 text-xs shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#F95721] flex-shrink-0 mt-0.5">
            <Lightbulb size={17} />
          </div>
          <div>
            <strong className="text-[#111827] font-bold block text-[11px]">What is Wear Simulation?</strong>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              Wear simulation estimates the material loss, wear depth and surface evolution under given operating conditions using Archard's law and physics-informed models. It helps visualize how load, speed, roughness, lubrication and material properties affect wear.
            </p>
          </div>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Col 1: 1. Input Parameters (Width: 4 cols) */}
        <div className="lg:col-span-4">
          <InputParametersPanel
            inputs={inputs}
            onChange={onInputChange}
            onRun={onRunSimulation}
            onReset={onReset}
            runLabel="Run Simulation"
          />
        </div>

        {/* Col 2: 2. 3D Wear Track Visualization (Width: 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-[#F0ECE1] gap-2">
              <h3 className="font-extrabold text-[13px] text-[#111827]">2. 3D Wear Track Visualization</h3>
              {/* Tab Pills */}
              <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[10px] font-semibold">
                <button
                  onClick={() => setVisTab('topography')}
                  className={`px-2 py-0.5 rounded transition ${
                    visTab === 'topography' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  Surface Topography
                </button>
                <button
                  onClick={() => setVisTab('depth')}
                  className={`px-2 py-0.5 rounded transition ${
                    visTab === 'depth' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  Wear Depth
                </button>
                <button
                  onClick={() => setVisTab('material')}
                  className={`px-2 py-0.5 rounded transition ${
                    visTab === 'material' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  Material Removal
                </button>
                <button
                  onClick={() => setVisTab('animation')}
                  className={`px-2 py-0.5 rounded transition ${
                    visTab === 'animation' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  Animation
                </button>
              </div>
            </div>

            <SurfaceTopographyCanvas
              load={inputs.normalLoad}
              roughness={inputs.surfaceRoughness}
              slidingDistance={inputs.slidingDistance}
              viewMode={viewMode}
              showGrid={showGrid}
              realisticTexture={realisticTexture}
              height={225}
            />

            {/* Bottom Controls */}
            <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-[#F0ECE1]">
              <div className="flex items-center gap-1.5">
                {(['3D View', 'Top View', 'Side View'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      viewMode === mode
                        ? 'bg-[#F95721] text-white border-[#F95721]'
                        : 'bg-[#FAF8F3] text-[#4B5563] border-[#E5E0D8] hover:bg-[#F0ECE1]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#374151] text-[11px]">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded accent-[#F95721]"
                  />
                  <span>Show Grid</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[#374151] text-[11px]">
                  <input
                    type="checkbox"
                    checked={realisticTexture}
                    onChange={(e) => setRealisticTexture(e.target.checked)}
                    className="rounded accent-[#F95721]"
                  />
                  <span>Realistic Texture</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: 3. Simulation Results & Cross-section (Width: 3 cols) */}
        <div className="lg:col-span-3 space-y-3.5">
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
            <h3 className="font-extrabold text-[13px] text-[#111827] pb-2 mb-2 border-b border-[#F0ECE1]">
              3. Simulation Results
            </h3>

            <div className="grid grid-cols-2 gap-2 text-center mb-2">
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Wear Volume</span>
                <span className="text-[17px] font-extrabold text-[#F95721] font-mono block">
                  0.082 <span className="text-[10px] font-normal text-[#4B5563]">mm³</span>
                </span>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Wear Rate</span>
                <span className="text-[12px] font-extrabold text-[#F95721] font-mono block mt-0.5">
                  8.20 × 10⁻⁵ <span className="text-[9px] font-normal text-[#4B5563] block">mm³/m</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Wear Depth (Max)</span>
                <span className="text-[15px] font-extrabold text-[#F95721] font-mono block">
                  12.6 <span className="text-[10px] font-normal text-[#4B5563]">µm</span>
                </span>
              </div>
              <div className="bg-white border border-[#E5E0D8] p-2 rounded shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">Wear Track Width</span>
                <span className="text-[15px] font-extrabold text-[#111827] font-mono block">
                  0.48 <span className="text-[10px] font-normal text-[#4B5563]">mm</span>
                </span>
              </div>
            </div>
          </div>

          {/* Surface Profile (Cross-section) */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
            <h4 className="font-extrabold text-[12px] text-[#111827] mb-1">
              Surface Profile (Cross-section)
            </h4>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={crossSectionData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                  <XAxis dataKey="position" tick={{ fontSize: 8, fill: '#6B7280' }} />
                  <YAxis domain={[-15, 5]} tick={{ fontSize: 8, fill: '#6B7280' }} />
                  <Tooltip contentStyle={{ fontSize: '10px' }} formatter={(v: any) => [`${v} µm`, 'Depth']} />
                  <Area
                    type="monotone"
                    dataKey="depth"
                    stroke="#F95721"
                    fill="#FFEDD5"
                    strokeWidth={1.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between text-[9px] text-[#6B7280] font-mono px-1">
              <span>Depth (µm)</span>
              <span>Position (mm)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 4. Wear Evolution with Sliding Distance (Width: 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">4. Wear Evolution with Sliding Distance</h3>
            </div>
            {/* Tabs */}
            <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[9px] font-semibold mb-2">
              <button
                onClick={() => setEvolutionTab('volume')}
                className={`flex-1 py-0.5 rounded transition ${
                  evolutionTab === 'volume' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Wear Volume
              </button>
              <button
                onClick={() => setEvolutionTab('depth')}
                className={`flex-1 py-0.5 rounded transition ${
                  evolutionTab === 'depth' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Wear Depth
              </button>
              <button
                onClick={() => setEvolutionTab('friction')}
                className={`flex-1 py-0.5 rounded transition ${
                  evolutionTab === 'friction' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Friction Coefficient
              </button>
              <button
                onClick={() => setEvolutionTab('temp')}
                className={`flex-1 py-0.5 rounded transition ${
                  evolutionTab === 'temp' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Temperature Rise
              </button>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                  <XAxis dataKey="distance" tick={{ fontSize: 8, fill: '#6B7280' }} />
                  <YAxis
                    scale="log"
                    domain={[0.001, 1]}
                    tick={{ fontSize: 8, fill: '#6B7280' }}
                    tickFormatter={(v) => {
                      if (v === 0.001) return '10⁻³';
                      if (v === 0.01) return '10⁻²';
                      if (v === 0.1) return '10⁻¹';
                      if (v === 1) return '10⁰';
                      return '';
                    }}
                  />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#F95721"
                    strokeWidth={1.8}
                    dot={{ fill: '#F95721', r: 2.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[#FFF9F2] border border-[#FED7AA] rounded p-1 text-[10px] text-[#4B5563] font-mono text-center mt-1">
              W = <strong>0.082 mm³</strong> at 1000 m
            </div>
          </div>
        </div>

        {/* 5. Surface Morphology (Width: 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">5. Surface Morphology</h3>
              <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[10px] font-semibold">
                <span className="bg-[#F95721] text-white px-2 py-0.5 rounded font-bold">Simulated Surface</span>
                <span className="text-[#4B5563] px-2 py-0.5">Cross-section View</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1.5">
              {/* Micrograph: Before Sliding */}
              <div className="flex flex-col items-center">
                <div className="w-full h-28 bg-[#475569] rounded border border-[#334155] relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        'radial-gradient(#CBD5E1 1px, transparent 1px), radial-gradient(#94A3B8 1px, #475569 1px)',
                      backgroundSize: '6px 6px',
                      backgroundPosition: '0 0, 3px 3px',
                    }}
                  />
                  <div className="absolute bottom-1 right-2 bg-black/85 px-1 py-0.5 text-[8px] font-mono text-white font-bold">
                    200 µm
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#374151] mt-1">Before Sliding</span>
              </div>

              {/* Micrograph: After Sliding */}
              <div className="flex flex-col items-center">
                <div className="w-full h-28 bg-[#334155] rounded border border-[#1E293B] relative overflow-hidden flex items-center justify-center shadow-inner">
                  <div className="absolute inset-0 flex flex-col justify-around opacity-60">
                    <div className="h-1.5 bg-[#94A3B8]" />
                    <div className="h-3 bg-[#64748B]" />
                    <div className="h-2 bg-[#94A3B8]" />
                    <div className="h-4 bg-[#64748B]" />
                    <div className="h-2 bg-[#94A3B8]" />
                  </div>
                  <div className="absolute bottom-1 right-2 bg-black/85 px-1 py-0.5 text-[8px] font-mono text-white font-bold">
                    200 µm
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#374151] mt-1">
                  After Sliding (Simulated)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Parameter Study (Width: 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[12px] text-[#111827]">6. Parameter Study (Quick Comparison)</h3>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#4B5563] mb-1.5">
              <span>Parameter to Vary:</span>
              <div className="flex items-center gap-1.5">
                <select
                  value={paramToVary}
                  onChange={(e) => setParamToVary(e.target.value)}
                  className="text-[10px] bg-white border border-[#D1D5DB] rounded px-1.5 py-0.5 font-medium text-[#111827]"
                >
                  <option value="Normal Load (N)">Normal Load (N)</option>
                  <option value="Sliding Speed (m/s)">Sliding Speed (m/s)</option>
                </select>
                <button className="bg-[#F95721] hover:bg-[#E04410] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                  Run Study
                </button>
              </div>
            </div>

            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paramStudyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                  <XAxis dataKey="load" tick={{ fontSize: 8, fill: '#6B7280' }} />
                  <YAxis
                    scale="log"
                    domain={[0.001, 1]}
                    tick={{ fontSize: 8, fill: '#6B7280' }}
                    tickFormatter={(v) => {
                      if (v === 0.001) return '10⁻³';
                      if (v === 0.01) return '10⁻²';
                      if (v === 0.1) return '10⁻¹';
                      if (v === 1) return '10⁰';
                      return '';
                    }}
                  />
                  <Tooltip contentStyle={{ fontSize: '10px' }} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#F95721"
                    strokeWidth={1.8}
                    dot={{ fill: '#F95721', r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#0284C7"
                    strokeWidth={1.8}
                    dot={{ fill: '#0284C7', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] text-[#4B5563] mt-1 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#F95721]" /> Wear Volume
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-[#0284C7]" /> Wear Rate
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
