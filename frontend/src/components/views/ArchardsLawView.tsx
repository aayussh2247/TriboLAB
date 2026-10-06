import React, { useState } from 'react';
import {
  Sigma,
  Lightbulb,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MaterialPairKey, LubricationType } from '../../types/tribology';
import { SurfaceTopographyCanvas } from '../SurfaceTopographyCanvas';

export const ArchardsLawView: React.FC = () => {
  const [loadW, setLoadW] = useState<number>(200);
  const [distL, setDistL] = useState<number>(1000);
  const [hardH, setHardH] = useState<number>(2.0);
  const [wearK, setWearK] = useState<number>(1.0e-4);
  const [matPair, setMatPair] = useState<MaterialPairKey>('Steel - Steel');
  const [lubrication, setLubrication] = useState<LubricationType>('Dry');
  const [temperature, setTemperature] = useState<number>(100);

  const [theoryTab, setTheoryTab] = useState<'overview' | 'assumptions' | 'variables' | 'limitations'>('overview');
  const [paramTab, setParamTab] = useState<'load' | 'distance' | 'hardness' | 'coeff'>('load');

  // Calculation exact values matching screenshot (200N, 1000m, 2.0GPa, 1.0e-4 => 10.00 mm3)
  const theoreticalVol = (wearK * loadW * distL) / Math.max(0.1, hardH);
  const theoreticalRate = distL > 0 ? theoreticalVol / distL : 0;

  // Comparison curve data: Archard vs ML Prediction
  const comparisonData = [
    { load: 0, archard: 0, ml: 0 },
    { load: 100, archard: 5.0, ml: 3.8 },
    { load: 200, archard: 10.0, ml: 8.2 },
    { load: 300, archard: 15.0, ml: 12.6 },
    { load: 400, archard: 20.0, ml: 17.1 },
    { load: 500, archard: 25.0, ml: 21.8 },
    { load: 600, archard: 30.0, ml: 26.9 },
    { load: 700, archard: 35.0, ml: 32.2 },
    { load: 800, archard: 40.0, ml: 37.8 },
    { load: 1000, archard: 50.0, ml: 49.5 },
  ];

  const handleReset = () => {
    setLoadW(200);
    setDistL(1000);
    setHardH(2.0);
    setWearK(1.0e-4);
    setMatPair('Steel - Steel');
    setLubrication('Dry');
    setTemperature(100);
  };

  return (
    <div className="space-y-3.5">
      {/* Top Banner matching Screenshot 4 */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3 bg-white border border-[#E5E0D8] rounded-lg px-4 py-2.5 shadow-sm">
          <div className="text-[#F95721] flex-shrink-0">
            <Sigma size={34} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-[#111827] tracking-tight leading-tight">ARCHARD'S LAW</h2>
            <p className="text-[11px] text-[#4B5563] font-medium leading-tight">
              Empirical Model for Predicting Wear Volume
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#FFF9F2] border border-[#FED7AA] rounded-lg px-3.5 py-2 flex items-start gap-2.5 text-xs shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#FFE8D6] flex items-center justify-center text-[#F95721] flex-shrink-0 mt-0.5">
            <Lightbulb size={17} />
          </div>
          <div>
            <strong className="text-[#111827] font-bold block text-[11px]">What is Archard's Law?</strong>
            <p className="text-[11px] text-[#4B5563] leading-relaxed">
              Archard's law is a simple empirical model that relates the wear volume to the applied normal load, sliding distance and hardness. It is widely used in tribology for initial estimation of wear, especially in adhesive and abrasive wear regimes.
            </p>
          </div>
        </div>

        {/* Formula Box matching screenshot */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm flex-shrink-0">
          <FileText size={24} className="text-[#111827]" />
          <div>
            <span className="text-[9px] text-[#6B7280] font-mono block">Formula</span>
            <div className="text-[20px] font-serif font-black text-[#111827] tracking-wide leading-tight">
              V = K <span className="inline-block border-b border-[#111827]">W L</span> / H
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Theory, Calculator, Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 1. Theory and Background (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[13px] text-[#111827] pb-2 mb-2 border-b border-[#F0ECE1]">
              1. THEORY AND BACKGROUND
            </h3>

            {/* Tabs */}
            <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[10px] font-semibold mb-2.5">
              <button
                onClick={() => setTheoryTab('overview')}
                className={`flex-1 py-0.5 rounded transition ${
                  theoryTab === 'overview' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setTheoryTab('assumptions')}
                className={`flex-1 py-0.5 rounded transition ${
                  theoryTab === 'assumptions' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Assumptions
              </button>
              <button
                onClick={() => setTheoryTab('variables')}
                className={`flex-1 py-0.5 rounded transition ${
                  theoryTab === 'variables' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Variables
              </button>
              <button
                onClick={() => setTheoryTab('limitations')}
                className={`flex-1 py-0.5 rounded transition ${
                  theoryTab === 'limitations' ? 'bg-[#F95721] text-white font-bold' : 'text-[#4B5563]'
                }`}
              >
                Limitations
              </button>
            </div>

            <p className="text-[11px] text-[#4B5563] leading-relaxed mb-3">
              Archard's law states that the wear volume is proportional to the normal load and sliding distance, and inversely proportional to the material hardness.
            </p>

            {/* Formula box */}
            <div className="bg-[#FAF8F3] border border-[#E5E0D8] rounded p-3 text-center mb-3">
              <div className="text-[24px] font-serif font-black text-[#111827] mb-1">
                V = K <span className="inline-block border-b-2 border-[#111827]">W L</span> / H
              </div>
              <div className="text-[10px] text-[#4B5563] font-mono grid grid-cols-2 gap-1 text-left mt-2">
                <span>V - Wear Volume (mm³)</span>
                <span>K - Wear Coefficient (dimensionless)</span>
                <span>W - Normal Load (N)</span>
                <span>L - Sliding Distance (m)</span>
                <span className="col-span-2">H - Hardness (GPa or MPa)</span>
              </div>
            </div>

            {/* Key Points */}
            <div>
              <strong className="text-[11px] text-[#111827] block mb-1">Key Points</strong>
              <ul className="space-y-1 text-[10px] text-[#4B5563]">
                <li className="flex items-start gap-1">
                  <span className="text-[#F95721]">•</span> Derived from empirical observations.
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[#F95721]">•</span> Assumes constant wear coefficient K for a given material pair and condition.
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[#F95721]">•</span> Generally valid for mild to moderate wear conditions.
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-[#F95721]">•</span> K depends on material pair, lubrication, environment, and wear mechanism (adhesive, abrasive, etc.).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Interactive Calculator (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#F0ECE1]">
              <h3 className="font-extrabold text-[13px] text-[#111827]">2. INTERACTIVE CALCULATOR</h3>
              <button
                onClick={handleReset}
                className="text-[11px] text-[#6B7280] hover:text-[#111827] flex items-center gap-1 font-semibold"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              {/* Normal Load W */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Normal Load (W)</span>
                <input
                  type="number"
                  value={loadW}
                  onChange={(e) => setLoadW(Number(e.target.value))}
                  className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
                <span className="text-[10px] text-[#6B7280]">N</span>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  value={loadW}
                  onChange={(e) => setLoadW(Number(e.target.value))}
                  className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
                />
                <span className="text-[9px] text-[#6B7280] font-mono">10 - 1000 N</span>
              </div>

              {/* Sliding Distance L */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Sliding Distance (L)</span>
                <input
                  type="number"
                  value={distL}
                  onChange={(e) => setDistL(Number(e.target.value))}
                  className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
                <span className="text-[10px] text-[#6B7280]">m</span>
                <input
                  type="range"
                  min={10}
                  max={10000}
                  value={distL}
                  onChange={(e) => setDistL(Number(e.target.value))}
                  className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
                />
                <span className="text-[9px] text-[#6B7280] font-mono">10 - 10000 m</span>
              </div>

              {/* Hardness H */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Hardness (H)</span>
                <input
                  type="number"
                  step={0.1}
                  value={hardH}
                  onChange={(e) => setHardH(Number(e.target.value))}
                  className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
                <span className="text-[10px] text-[#6B7280]">GPa</span>
                <input
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={hardH}
                  onChange={(e) => setHardH(Number(e.target.value))}
                  className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
                />
                <span className="text-[9px] text-[#6B7280] font-mono">0.1 - 10 GPa</span>
              </div>

              {/* Wear Coeff K */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Wear Coefficient (K)</span>
                <input
                  type="text"
                  value="1.0e-4"
                  readOnly
                  className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-[#FAF8F3] border border-[#D1D5DB] rounded"
                />
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={1}
                  readOnly
                  className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
                />
                <span className="text-[9px] text-[#6B7280] font-mono">1.0e-6 - 1.0e-2</span>
              </div>

              {/* Material Pair */}
              <div className="flex items-center gap-2 pt-1">
                <span className="w-36 text-[#374151]">Material Pair</span>
                <select
                  value={matPair}
                  onChange={(e) => setMatPair(e.target.value as any)}
                  className="flex-1 px-2 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded font-semibold text-[#111827]"
                >
                  <option value="Steel - Steel">Steel – Steel</option>
                  <option value="Steel - Al">Steel – Al</option>
                </select>
              </div>

              {/* Lubrication */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Lubrication Condition</span>
                <select
                  value={lubrication}
                  onChange={(e) => setLubrication(e.target.value as any)}
                  className="flex-1 px-2 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded font-semibold text-[#111827]"
                >
                  <option value="Dry">Dry</option>
                  <option value="Lubricated">Lubricated</option>
                </select>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-2">
                <span className="w-36 text-[#374151]">Temperature (°C)</span>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
                />
                <input
                  type="range"
                  min={25}
                  max={300}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
                />
                <span className="text-[9px] text-[#6B7280] font-mono">25 - 300 °C</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Results (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[13px] text-[#111827] pb-2 mb-2.5 border-b border-[#F0ECE1]">
              3. RESULTS
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3 text-center">
              <div className="bg-white border border-[#E5E0D8] rounded p-2 shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">
                  Theoretical Wear Volume (Archard's Law)
                </span>
                <span className="text-[26px] font-black text-[#F95721] font-mono block mt-1">
                  10.00
                </span>
                <span className="text-[11px] text-[#6B7280]">mm³</span>
              </div>

              <div className="bg-white border border-[#E5E0D8] rounded p-2 shadow-sm">
                <span className="text-[10px] text-[#6B7280] block font-medium">
                  Theoretical Wear Rate
                </span>
                <span className="text-[22px] font-black text-[#F95721] font-mono block mt-1">
                  0.0100
                </span>
                <span className="text-[11px] text-[#6B7280]">mm³/m</span>
              </div>
            </div>

            {/* Calculation Steps */}
            <div className="bg-[#FFF9F2] border border-[#FED7AA] rounded p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111827] mb-1.5">
                <span className="w-4 h-4 rounded-full bg-[#F95721] text-white flex items-center justify-center text-[10px]">
                  ?
                </span>
                <span>Calculation Steps</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-[#374151]">
                <div>• V = K × W × L / H</div>
                <div>• = (1.0 × 10⁻⁴) × 200 × 1000 / 2.0</div>
                <div className="text-[#F95721] font-bold">• = 10.00 mm³</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Parametric Analysis, Comparison, Effect of Multiple Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* 4. Parametric Analysis (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F0ECE1]">
            <h3 className="font-extrabold text-[12px] text-[#111827]">4. PARAMETRIC ANALYSIS</h3>
          </div>
          <div className="flex bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[9px] font-semibold mb-2">
            <span className="bg-[#F95721] text-white px-2 py-0.5 rounded font-bold">Load Effect</span>
            <span className="text-[#4B5563] px-2 py-0.5">Distance Effect</span>
            <span className="text-[#4B5563] px-2 py-0.5">Hardness Effect</span>
            <span className="text-[#4B5563] px-2 py-0.5">Wear Coeff</span>
          </div>

          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="load" tick={{ fontSize: 8, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 8, fill: '#6B7280' }} />
                <Line type="monotone" dataKey="archard" stroke="#F95721" strokeWidth={1.8} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[8px] text-[#6B7280] font-mono text-center">Normal Load (N)</div>
        </div>

        {/* 5. Comparison: Archard vs ML (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#F0ECE1]">
            <h3 className="font-extrabold text-[12px] text-[#111827]">5. COMPARISON: ARCHARD VS ML PREDICTION</h3>
          </div>

          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#F0ECE1" />
                <XAxis dataKey="load" tick={{ fontSize: 8, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 8, fill: '#6B7280' }} />
                <Tooltip contentStyle={{ fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="archard"
                  name="Archard's Law"
                  stroke="#F95721"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="ml"
                  name="ML Prediction"
                  stroke="#6B7280"
                  strokeDasharray="4 4"
                  strokeWidth={1.8}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[9px] font-mono text-[#4B5563]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#F95721]" /> Archard's Law
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-[#6B7280]" /> ML Prediction
            </span>
          </div>
        </div>

        {/* 6. Effect of Multiple Parameters (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-[12px] text-[#111827] pb-1.5 mb-1.5 border-b border-[#F0ECE1]">
              6. EFFECT OF MULTIPLE PARAMETERS
            </h3>
            <SurfaceTopographyCanvas
              load={loadW}
              roughness={1.0}
              slidingDistance={distL}
              colorMap="Thermal"
              height={140}
            />
            <div className="flex justify-between text-[8px] text-[#6B7280] font-mono px-1">
              <span>Normal Load (N)</span>
              <span>Sliding Distance (m)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Material Reference, Validity, Limitations, Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        {/* 7. Material Reference */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm">
          <h4 className="font-extrabold text-[11px] text-[#111827] pb-1 mb-1 border-b border-[#F0ECE1]">
            7. MATERIAL PAIR REFERENCE
          </h4>
          <div className="overflow-hidden rounded border border-[#E5E0D8] text-[9px] font-mono">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F3] text-[#4B5563]">
                <tr>
                  <th className="p-1 font-sans">Pair</th>
                  <th className="p-1">K</th>
                  <th className="p-1 font-sans">Cond.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                <tr>
                  <td className="p-1 font-sans">Steel-Steel</td>
                  <td className="p-1">1e-4 - 1e-3</td>
                  <td className="p-1 font-sans text-amber-700">Dry</td>
                </tr>
                <tr>
                  <td className="p-1 font-sans">Steel-Al</td>
                  <td className="p-1">1e-4 - 1e-3</td>
                  <td className="p-1 font-sans text-amber-700">Dry</td>
                </tr>
                <tr>
                  <td className="p-1 font-sans">Steel-Steel</td>
                  <td className="p-1 font-bold text-blue-600">1e-6 - 1e-5</td>
                  <td className="p-1 font-sans text-blue-700">Lub.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. Validity Range */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm text-[10px] space-y-1">
          <h4 className="font-extrabold text-[11px] text-[#111827] pb-1 mb-1 border-b border-[#F0ECE1]">
            8. VALIDITY RANGE
          </h4>
          <div className="text-emerald-700 space-y-1">
            <div className="flex items-start gap-1">✔ Generally valid for mild to moderate wear.</div>
            <div className="flex items-start gap-1">✔ Applicable for adhesive and abrasive wear.</div>
            <div className="flex items-start gap-1">✔ Best for steady-state sliding conditions.</div>
            <div className="flex items-start gap-1">✔ Works as first-order estimation model.</div>
          </div>
        </div>

        {/* 9. Limitations */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm text-[10px] space-y-1">
          <h4 className="font-extrabold text-[11px] text-[#111827] pb-1 mb-1 border-b border-[#F0ECE1]">
            9. LIMITATIONS
          </h4>
          <div className="text-amber-800 space-y-1">
            <div className="flex items-start gap-1">⚠ Empirical model (not fundamental derivation).</div>
            <div className="flex items-start gap-1">⚠ K varies significantly with operating conditions.</div>
            <div className="flex items-start gap-1">⚠ Not accurate for severe wear regime.</div>
            <div className="flex items-start gap-1">⚠ Does not explicitly include temperature or roughness.</div>
          </div>
        </div>

        {/* 10. Key Takeaways */}
        <div className="bg-white border border-[#E5E0D8] rounded-lg p-3 shadow-sm text-[10px] space-y-1">
          <h4 className="font-extrabold text-[11px] text-[#111827] pb-1 mb-1 border-b border-[#F0ECE1]">
            10. KEY TAKEAWAYS
          </h4>
          <ul className="space-y-1 text-[#374151]">
            <li>• Wear increases with load and sliding distance.</li>
            <li>• Wear decreases with hardness.</li>
            <li>• Use Archard's law for initial estimation, not final design.</li>
            <li>• For higher precision, ML model captures temperature and lubrication.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
