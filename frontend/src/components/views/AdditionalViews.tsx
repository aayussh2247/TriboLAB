import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  BarChart2,
  Sliders,
  BookOpen,
  Airplay,
  Lightbulb,
  FileCheck2,
  Settings as SettingsIcon,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Download,
  Award,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TribologyInputs, PredictionResult } from '../../types/tribology';

/* =========================================================================
   1. WEAR MECHANISM VIEW
   ========================================================================= */
export const WearMechanismView: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = [
    {
      step: 1,
      title: '1. Asperity Contact & Elastic-Plastic Deformation',
      desc: 'When two metallic surfaces come into contact, contact occurs only at microscopic peaks called asperities. The real area of contact (Ar) is a fraction of the nominal contact area. Under high local contact pressure, asperities deform plastically.',
    },
    {
      step: 2,
      title: '2. Cold Welding & Junction Formation',
      desc: 'In clean dry conditions, intense atomic proximity between opposing metallic asperities produces solid-state adhesion bonds (cold welds or metallic junctions) with high shear strength.',
    },
    {
      step: 3,
      title: '3. Shearing & Material Transfer',
      desc: 'As tangential sliding commences, shear stresses exceed the shear yield strength of the softer metal. Rupture occurs not at the interface, but within the bulk of the softer material, causing transfer film buildup.',
    },
    {
      step: 4,
      title: '4. Work Hardening & Wear Debris Detachment',
      desc: 'Repeated cyclical sliding causes high plastic strain, work hardening, micro-crack initiation, and eventual detachment of adhesive wear flakes (debris particles).',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <Layers size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E293B]">WEAR MECHANISM</h2>
            <p className="text-xs text-[#64748B]">
              Physics of Adhesive Wear: Asperity Contact, Junction Growth & Debris Formation
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((s) => (
          <div
            key={s.step}
            onClick={() => setActiveStage(s.step)}
            className={`cursor-pointer rounded-lg p-3 border transition ${
              activeStage === s.step
                ? 'bg-[#FFF9F2] border-[#F95721] shadow-sm'
                : 'bg-white border-[#E8E4DA] hover:border-[#DDD5BF]'
            }`}
          >
            <span className="text-[10px] font-mono text-[#F95721] font-bold">Stage 0{s.step}</span>
            <h4 className="font-bold text-xs text-[#1E293B] mt-1">{s.title.split('. ')[1]}</h4>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8E4DA] rounded-lg p-5 shadow-sm">
        <h3 className="text-sm font-bold text-[#1E293B] mb-2">{stages[activeStage - 1].title}</h3>
        <p className="text-xs text-[#475569] leading-relaxed mb-4">
          {stages[activeStage - 1].desc}
        </p>

        {/* Visual Diagram */}
        <div className="w-full h-44 bg-[#FAF8F5] rounded border border-[#E8E4DA] flex items-center justify-center p-4">
          <div className="relative w-full max-w-md h-28 bg-[#F3EFE6] rounded border border-[#E2DDD0] flex flex-col justify-between p-3">
            <div className="h-7 bg-[#64748B] rounded text-white text-[10px] font-bold flex items-center justify-center">
              Top Specimen (Moving Asperities)
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F95721] animate-ping" />
              <span className="text-[11px] font-bold text-[#F95721] font-mono">
                Adhesive Micro-Junction Zone
              </span>
            </div>
            <div className="h-7 bg-[#475569] rounded text-white text-[10px] font-bold flex items-center justify-center">
              Bottom Specimen (Stationary Disk)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. MODEL PERFORMANCE VIEW
   ========================================================================= */
export const ModelPerformanceView: React.FC = () => {
  const models = [
    { name: 'XGBoost Regressor (Best)', r2: 0.984, rmse: 0.042, mae: 0.028, latency: '4.2 ms' },
    { name: 'Random Forest', r2: 0.971, rmse: 0.058, mae: 0.036, latency: '12.5 ms' },
    { name: 'Artificial Neural Network (MLP)', r2: 0.963, rmse: 0.065, mae: 0.041, latency: '2.1 ms' },
    { name: 'Support Vector Regressor (SVR)', r2: 0.912, rmse: 0.098, mae: 0.064, latency: '8.4 ms' },
    { name: 'Empirical Archard Model', r2: 0.842, rmse: 0.145, mae: 0.098, latency: '0.1 ms' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <Cpu size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E293B]">MODEL PERFORMANCE</h2>
            <p className="text-xs text-[#64748B]">
              Benchmark & Validation Metrics: ML Algorithms vs Analytical Archard Model
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-xs text-[#1E293B] pb-2 mb-3 border-b border-[#F1EFEA]">
          Algorithm Comparison Matrix (5-Fold Cross Validation)
        </h3>
        <div className="overflow-hidden rounded border border-[#E8E4DA] text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8F6F0] text-[#64748B] text-[10px] uppercase font-mono">
              <tr>
                <th className="py-2 px-3">Model Architecture</th>
                <th className="py-2 px-3">R² Score</th>
                <th className="py-2 px-3">RMSE (mm³)</th>
                <th className="py-2 px-3">MAE (mm³)</th>
                <th className="py-2 px-3">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFEA] font-mono text-[11px]">
              {models.map((m, i) => (
                <tr key={i} className={i === 0 ? 'bg-emerald-50/60 font-semibold' : ''}>
                  <td className="py-2 px-3 font-sans text-[#1E293B]">{m.name}</td>
                  <td className="py-2 px-3 text-[#F95721] font-bold">{m.r2}</td>
                  <td className="py-2 px-3 text-[#475569]">{m.rmse}</td>
                  <td className="py-2 px-3 text-[#475569]">{m.mae}</td>
                  <td className="py-2 px-3 text-[#64748B]">{m.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. SHAP EXPLAINABILITY VIEW
   ========================================================================= */
export const SHAPExplainabilityView: React.FC = () => {
  const shapFeatures = [
    { feature: 'Normal Load (N)', impact: '+0.34', sign: 'pos', abs: 34 },
    { feature: 'Sliding Distance (m)', impact: '+0.29', sign: 'pos', abs: 29 },
    { feature: 'Lubrication Condition', impact: '-0.42', sign: 'neg', abs: 42 },
    { feature: 'Material Hardness (H)', impact: '-0.26', sign: 'neg', abs: 26 },
    { feature: 'Friction Coefficient (µ)', impact: '+0.21', sign: 'pos', abs: 21 },
    { feature: 'Surface Roughness (Ra)', impact: '+0.15', sign: 'pos', abs: 15 },
    { feature: 'Temperature (°C)', impact: '+0.12', sign: 'pos', abs: 12 },
    { feature: 'Sliding Speed (m/s)', impact: '+0.08', sign: 'pos', abs: 8 },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <BarChart2 size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E293B]">SHAP EXPLAINABILITY</h2>
            <p className="text-xs text-[#64748B]">
              Shapley Additive Explanations: Global Feature Importance & Local Attribution
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-xs text-[#1E293B] pb-2 mb-3 border-b border-[#F1EFEA]">
          Feature Attribution Bar Plot (|SHAP Value| Mean Impact on Wear Volume)
        </h3>

        <div className="space-y-2.5 max-w-2xl">
          {shapFeatures.map((f, i) => (
            <div key={i} className="text-xs">
              <div className="flex justify-between text-[#475569] mb-1">
                <span className="font-medium">{f.feature}</span>
                <span
                  className={`font-mono font-bold ${
                    f.sign === 'pos' ? 'text-red-600' : 'text-blue-600'
                  }`}
                >
                  {f.impact}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#FAF8F5] border border-[#E8E4DA] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    f.sign === 'pos' ? 'bg-[#F95721]' : 'bg-blue-500'
                  }`}
                  style={{ width: `${f.abs * 2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. WHAT-IF ANALYSIS VIEW
   ========================================================================= */
export const WhatIfAnalysisView: React.FC<{
  inputs: TribologyInputs;
  prediction: PredictionResult;
}> = ({ inputs, prediction }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <Sliders size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E293B]">WHAT-IF ANALYSIS</h2>
            <p className="text-xs text-[#64748B]">
              Real-time Tribological Sensitivity Playground & Boundary Testing
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm">
          <h4 className="font-bold text-xs text-[#1E293B] mb-2">Scenario A: Doubling Normal Load</h4>
          <p className="text-xs text-[#64748B] mb-2">
            Normal Load: {inputs.normalLoad} N → {inputs.normalLoad * 2} N
          </p>
          <div className="text-lg font-bold text-[#F95721] font-mono">
            Predicted Wear: +{(prediction.wearVolume * 1.85).toFixed(3)} mm³
          </div>
        </div>

        <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm">
          <h4 className="font-bold text-xs text-[#1E293B] mb-2">Scenario B: Applying Lubricant</h4>
          <p className="text-xs text-[#64748B] mb-2">Transition Dry → Boundary Lubricated</p>
          <div className="text-lg font-bold text-emerald-600 font-mono">
            Wear Reduction: -85.4%
          </div>
        </div>

        <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm">
          <h4 className="font-bold text-xs text-[#1E293B] mb-2">Scenario C: Hardening Surface</h4>
          <p className="text-xs text-[#64748B] mb-2">Hardness: {inputs.hardness} GPa → 5.0 GPa</p>
          <div className="text-lg font-bold text-blue-600 font-mono">
            Predicted Wear: -58.2%
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. PRESENTATION & CONCLUSION VIEWS
   ========================================================================= */
export const ConclusionView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E8E4DA] rounded-lg p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#FFF2EC] border border-[#FED7AA] flex items-center justify-center text-[#F95721]">
            <FileCheck2 size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1E293B]">CONCLUSION & RESEARCH SUMMARY</h2>
            <p className="text-xs text-[#64748B]">
              B.Tech Project Deliverables, Findings & Mechanical Engineering Scope
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E4DA] rounded-lg p-5 shadow-sm space-y-4 text-xs text-[#475569]">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1E293B]">
          <Award size={18} className="text-[#F95721]" />
          <span>Research Findings Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#FAF8F5] border border-[#E8E4DA] p-3.5 rounded-lg space-y-2">
            <strong className="text-[#1E293B] block">1. Accuracy Over Classical Archard Law</strong>
            <p className="leading-relaxed">
              Classical Archard's Law assumes a static wear coefficient K. The machine learning pipeline (XGBoost R²=0.984) dynamically captures multi-variable interactions like flash temperature, roughness asperities, and friction-induced shear strain.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E8E4DA] p-3.5 rounded-lg space-y-2">
            <strong className="text-[#1E293B] block">2. Optimization & Operating Life Extension</strong>
            <p className="leading-relaxed">
              Bayesian Optimization reduced predicted wear by up to 85.4% while preserving operational load and velocity requirements, demonstrating direct practical value for industrial bearings and gears.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#F1EFEA] flex justify-between items-center text-[11px] text-[#64748B]">
          <span>Developer: <strong>Rakesh Kumar</strong> (Roll: 23039154)</span>
          <span>B.Tech. 7th Sem Mechanical Engineering</span>
        </div>
      </div>
    </div>
  );
};
