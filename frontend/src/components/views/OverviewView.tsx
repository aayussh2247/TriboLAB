import React, { useState, useMemo } from 'react';
import {
  Home,
  Lightbulb,
  HelpCircle,
  Box,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TribologyInputs, PredictionResult } from '../../types/tribology';
import { MATERIAL_PROPERTIES_MAP } from '../../utils/tribologyEngine';
import { InputParametersPanel } from '../InputParametersPanel';
import { ContactDiagram } from '../ContactDiagram';
import { SurfaceTopographyCanvas } from '../SurfaceTopographyCanvas';

interface OverviewProps {
  inputs: TribologyInputs;
  prediction: PredictionResult;
  onInputChange: (key: keyof TribologyInputs, val: any) => void;
  onRunPredict: () => void;
  onReset: () => void;
  onNavigateToSimulator: () => void;
}

export const OverviewView: React.FC<OverviewProps> = ({
  inputs,
  prediction,
  onInputChange,
  onRunPredict,
  onReset,
  onNavigateToSimulator,
}) => {
  const [curveType, setCurveType] = useState<'load' | 'distance' | 'speed'>('load');
  const [colorMap, setColorMap] = useState<'Viridis' | 'Rainbow' | 'Thermal'>('Viridis');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [realisticTexture, setRealisticTexture] = useState<boolean>(false);

  const matProps = MATERIAL_PROPERTIES_MAP[inputs.materialPair];

  // Dynamic curve data: Wear Volume vs Normal Load or Sliding Distance
  const chartData = useMemo(() => {
    const baseVol = prediction.wearVolume || 0.082;
    if (curveType === 'distance') {
      const distances = [0, 500, 1000, 2000, 3000, 4000, 5000, 7000, 8500, 10000];
      return distances.map((d) => ({
        xVal: d,
        volume: Number((baseVol * Math.pow(Math.max(0.001, d / Math.max(1, inputs.slidingDistance)), 0.96)).toFixed(4)),
      }));
    } else {
      const loads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      return loads.map((W) => ({
        xVal: W,
        volume: Number((baseVol * Math.pow(W / Math.max(1, inputs.normalLoad), 1.15)).toFixed(4)),
      }));
    }
  }, [curveType, prediction.wearVolume, inputs.slidingDistance, inputs.normalLoad]);

  return (
    <div className="space-y-3.5">
      {/* Top Banner / Hero Info matching Screenshot 1 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Section Header */}
        <div className="flex items-center gap-3 bg-white border border-[#E5E0D8] rounded-lg px-4 py-2.5 shadow-sm">
          <div className="text-[#F95721] flex-shrink-0">
            <Home size={34} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-[#111827] tracking-tight leading-tight">Overview</h2>
            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
              Predict, simulate and optimize adhesive wear using machine learning
            </p>
          </div>
        </div>

        {/* Middle Callout Card: What does this tool do? */}
        <div className="flex-1 bg-[#FFF9F2] border border-[#FED7AA] rounded-lg px-3.5 py-2 flex items-start gap-3 text-xs shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#F95721] flex-shrink-0 mt-0.5">
            <Lightbulb size={17} />
          </div>
          <div>
            <strong className="text-[#111827] font-bold block text-[11px]">What does this tool do?</strong>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              This application uses Archard's law and trained machine learning models to predict adhesive wear volume and wear rate, simulate wear behaviour, explain predictions (SHAP), and find optimal operating conditions.
            </p>
          </div>
        </div>

        {/* Right Quick Guide */}
        <div className="bg-[#FAF8F3] border border-[#E5E0D8] hover:border-[#F95721] cursor-pointer transition rounded-lg px-3.5 py-2 flex items-center gap-2.5 text-xs flex-shrink-0 shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#F95721] flex items-center justify-center text-white font-bold text-xs">
            ?
          </div>
          <div>
            <strong className="text-[#111827] block text-[11px]">Quick Guide</strong>
            <span className="text-[10px] text-[#6B7280]">Learn how to use this tool</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Col 1: 1. Input Parameters (Width: 4 cols) */}
        <div className="lg:col-span-4">
          <InputParametersPanel
            inputs={inputs}
            onChange={onInputChange}
            onRun={onRunPredict}
            onReset={onReset}
            runLabel="Predict Wear"
          />
        </div>

        {/* Col 2: 2. Material Pair & Operating Condition (Width: 4 cols) */}
        <div className="lg:col-span-4">
          <ContactDiagram inputs={inputs} matProps={matProps} />
        </div>

        {/* Col 3: 3. Prediction Results & 4. Quick Visualizations (Width: 4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          {/* 3. Prediction Results */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
            <h3 className="font-extrabold text-[13px] text-[#111827] pb-2 mb-2.5 border-b border-[#F0ECE1]">
              3. Prediction Results
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Wear Volume */}
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#4B5563] text-[11px] font-medium mb-0.5">
                  <Box size={15} className="text-[#F95721]" />
                  <span>Wear Volume (V)</span>
                </div>
                <div className="text-[22px] font-extrabold text-[#F95721] font-mono leading-tight">
                  {prediction.wearVolume}{' '}
                  <span className="text-xs font-normal text-[#4B5563]">mm³</span>
                </div>
              </div>

              {/* Wear Rate */}
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#4B5563] text-[11px] font-medium mb-0.5">
                  <TrendingUp size={15} className="text-[#F95721]" />
                  <span>Wear Rate (V/L)</span>
                </div>
                <div className="text-[14px] font-extrabold text-[#F95721] font-mono leading-tight mt-1">
                  8.20 × 10⁻⁵{' '}
                  <span className="text-[10px] font-normal text-[#4B5563] block">mm³/m</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Confidence Score */}
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[#4B5563] text-[11px] font-medium mb-0.5">
                    <ShieldCheck size={15} className="text-[#F95721]" />
                    <span>Confidence Score</span>
                  </div>
                  <div className="text-xl font-black text-[#111827] font-mono">
                    {prediction.confidenceScore}
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="w-full bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${prediction.confidenceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                    High Confidence
                  </span>
                </div>
              </div>

              {/* Wear Risk Level */}
              <div className="bg-white border border-[#E5E0D8] rounded-lg p-2.5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[#4B5563] text-[11px] font-medium mb-0.5">
                    <BarChart3 size={15} className="text-[#F95721]" />
                    <span>Wear Risk Level</span>
                  </div>
                  <span className="inline-block px-3 py-0.5 rounded text-[11px] font-extrabold tracking-wide bg-emerald-600 text-white">
                    LOW
                  </span>
                </div>
                <p className="text-[10px] text-[#6B7280] mt-1 leading-tight">
                  Operating conditions are within safe range.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Quick Visualizations */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-extrabold text-[12px] text-[#111827]">4. Quick Visualizations</h3>
              <select
                value={curveType}
                onChange={(e) => setCurveType(e.target.value as any)}
                className="text-[10px] bg-white border border-[#D1D5DB] rounded px-1.5 py-0.5 text-[#111827] font-medium"
              >
                <option value="load">Wear Volume vs Normal Load</option>
                <option value="distance">Wear Volume vs Sliding Distance</option>
              </select>
            </div>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                  <XAxis dataKey="xVal" tick={{ fontSize: 9, fill: '#6B7280' }} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 8, fill: '#6B7280' }}
                    tickFormatter={(v) => Number(v).toFixed(3)}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: '10px' }}
                    formatter={(v: any) => [`${Number(v).toFixed(4)} mm³`, 'Wear Volume']}
                    labelFormatter={(l) => curveType === 'distance' ? `Distance: ${l} m` : `Load: ${l} N`}
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
            <div className="text-[9px] text-[#6B7280] font-mono text-center mt-0.5">
              {curveType === 'distance' ? 'Sliding Distance (m)' : 'Normal Load (N)'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 5. 3D Wear Simulation Preview (Width: 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-[#F0ECE1] gap-2">
              <div>
                <h3 className="font-extrabold text-[13px] text-[#111827]">5. 3D Wear Simulation (Preview)</h3>
                <span className="text-[10px] text-[#4B5563] font-medium">Surface Topography (After Sliding)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#6B7280]">View Type:</span>
                <select className="text-[10px] bg-white border border-[#D1D5DB] rounded px-1.5 py-0.5">
                  <option>Surface Topography</option>
                </select>
                <span className="text-[10px] text-[#6B7280]">Color Map:</span>
                <select
                  value={colorMap}
                  onChange={(e) => setColorMap(e.target.value as any)}
                  className="text-[10px] bg-white border border-[#D1D5DB] rounded px-1.5 py-0.5"
                >
                  <option value="Viridis">Viridis</option>
                  <option value="Rainbow">Rainbow</option>
                  <option value="Thermal">Thermal</option>
                </select>
              </div>
            </div>

            <SurfaceTopographyCanvas
              load={inputs.normalLoad}
              roughness={inputs.surfaceRoughness}
              slidingDistance={inputs.slidingDistance}
              colorMap={colorMap}
              showGrid={showGrid}
              realisticTexture={realisticTexture}
              height={210}
            />

            {/* Canvas Controls matching screenshot */}
            <div className="flex items-center justify-between text-xs pt-2 mt-1 border-t border-[#F0ECE1]">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#374151] text-[11px]">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded text-[#F95721] accent-[#F95721]"
                  />
                  <span>Show Grid</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[#374151] text-[11px]">
                  <input
                    type="checkbox"
                    checked={realisticTexture}
                    onChange={(e) => setRealisticTexture(e.target.checked)}
                    className="rounded text-[#F95721] accent-[#F95721]"
                  />
                  <span>Realistic Texture</span>
                </label>
              </div>

              <button
                onClick={onNavigateToSimulator}
                className="text-[11px] font-bold text-[#F95721] border border-[#FED7AA] bg-[#FFF9F2] hover:bg-[#FFE8D6] px-2.5 py-1 rounded flex items-center gap-1 transition"
              >
                <ExternalLink size={12} />
                <span>Open Full Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. Summary of Current Case (Width: 3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[13px] text-[#111827] pb-2 mb-2 border-b border-[#F0ECE1]">
              6. Summary of Current Case
            </h3>
            <div className="overflow-hidden rounded border border-[#E5E0D8] text-[11px]">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#F0ECE1]">
                  <tr className="bg-[#FAF8F3]">
                    <td className="py-1 px-2.5 text-[#4B5563]">Normal Load (N)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.normalLoad}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 text-[#4B5563]">Sliding Speed (m/s)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.slidingSpeed.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F3]">
                    <td className="py-1 px-2.5 text-[#4B5563]">Sliding Distance (m)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.slidingDistance}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 text-[#4B5563]">Surface Roughness (µm)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.surfaceRoughness.toFixed(1)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F3]">
                    <td className="py-1 px-2.5 text-[#4B5563]">Hardness (GPa)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.hardness.toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 text-[#4B5563]">Friction Coefficient (µ)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.frictionCoeff.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F3]">
                    <td className="py-1 px-2.5 text-[#4B5563]">Temperature (°C)</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.temperature}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 px-2.5 text-[#4B5563]">Lubrication Condition</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.lubrication}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF8F3]">
                    <td className="py-1 px-2.5 text-[#4B5563]">Material Pair</td>
                    <td className="py-1 px-2.5 font-mono font-bold text-[#111827] text-right">
                      {inputs.materialPair}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 7. Key Insights (Width: 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2.5 border-b border-[#F0ECE1]">
              <Lightbulb size={16} className="text-[#F95721]" />
              <h3 className="font-extrabold text-[13px] text-[#111827]">7. Key Insights</h3>
            </div>

            <ul className="space-y-2 text-[11px] text-[#374151]">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 flex-shrink-0 mt-0.5" />
                <span>Predicted wear volume is low under current operating conditions.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 flex-shrink-0 mt-0.5" />
                <span>Increasing normal load or sliding distance will increase wear.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 flex-shrink-0 mt-0.5" />
                <span>Higher surface roughness and higher friction coefficient lead to higher wear.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 flex-shrink-0 mt-0.5" />
                <span>Using lubrication can significantly reduce wear.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-100 flex-shrink-0 mt-0.5" />
                <span>The model is most accurate within the training data range.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
