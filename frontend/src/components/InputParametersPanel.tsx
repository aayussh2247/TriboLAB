import React from 'react';
import {
  Play,
  RotateCcw,
  SlidersHorizontal,
  Table,
  Bookmark,
  Info,
  Scale,
  Gauge,
  Route,
  Activity,
  Gem,
  Percent,
  Thermometer,
  Droplet,
  Layers,
} from 'lucide-react';
import { TribologyInputs, MaterialPairKey, LubricationType } from '../types/tribology';

interface InputPanelProps {
  inputs: TribologyInputs;
  onChange: (key: keyof TribologyInputs, val: any) => void;
  onRun: () => void;
  onReset: () => void;
  runLabel?: string;
}

export const InputParametersPanel: React.FC<InputPanelProps> = ({
  inputs,
  onChange,
  onRun,
  onReset,
  runLabel = 'Predict Wear',
}) => {
  const [activeTab, setActiveTab] = React.useState<'manual' | 'dataset' | 'example'>('manual');

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header with Title and Mode Tabs */}
        <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#F0ECE1]">
          <h3 className="font-extrabold text-[13px] text-[#111827]">1. Input Parameters</h3>
          <Info size={13} className="text-[#9CA3AF] cursor-help" />
        </div>

        {/* 3 Top Pills */}
        <div className="grid grid-cols-3 gap-1 mb-3 bg-[#FAF8F3] p-0.5 rounded border border-[#E5E0D8] text-[10px] font-semibold">
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center justify-center gap-1 py-1 rounded transition ${
              activeTab === 'manual'
                ? 'bg-[#F95721] text-white font-bold shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <SlidersHorizontal size={11} />
            <span>Manual Input</span>
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`flex items-center justify-center gap-1 py-1 rounded transition ${
              activeTab === 'dataset'
                ? 'bg-[#F95721] text-white font-bold shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Table size={11} />
            <span>Load from Dataset</span>
          </button>
          <button
            onClick={() => setActiveTab('example')}
            className={`flex items-center justify-center gap-1 py-1 rounded transition ${
              activeTab === 'example'
                ? 'bg-[#F95721] text-white font-bold shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <Bookmark size={11} />
            <span>Example Case</span>
          </button>
        </div>

        {/* Form Controls matching screenshot rows */}
        <div className="space-y-2.5 text-[11px]">
          {/* Normal Load */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Scale size={13} className="text-[#111827]" />
              <span>Normal Load (N)</span>
            </div>
            <input
              type="number"
              min={10}
              max={1000}
              value={inputs.normalLoad}
              onChange={(e) => onChange('normalLoad', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={inputs.normalLoad}
              onChange={(e) => onChange('normalLoad', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">10 - 1000</span>
          </div>

          {/* Sliding Speed */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Gauge size={13} className="text-[#111827]" />
              <span>Sliding Speed (m/s)</span>
            </div>
            <input
              type="number"
              step={0.01}
              min={0.01}
              max={10}
              value={inputs.slidingSpeed}
              onChange={(e) => onChange('slidingSpeed', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={0.01}
              max={10}
              step={0.1}
              value={inputs.slidingSpeed}
              onChange={(e) => onChange('slidingSpeed', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">0.01 - 10</span>
          </div>

          {/* Sliding Distance */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Route size={13} className="text-[#111827]" />
              <span>Sliding Distance (m)</span>
            </div>
            <input
              type="number"
              step={100}
              min={10}
              max={10000}
              value={inputs.slidingDistance}
              onChange={(e) => onChange('slidingDistance', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={10}
              max={10000}
              step={50}
              value={inputs.slidingDistance}
              onChange={(e) => onChange('slidingDistance', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">10 - 10000</span>
          </div>

          {/* Surface Roughness Ra */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Activity size={13} className="text-[#111827]" />
              <span>Surface Roughness, Ra (µm)</span>
            </div>
            <input
              type="number"
              step={0.1}
              min={0.1}
              max={10}
              value={inputs.surfaceRoughness}
              onChange={(e) => onChange('surfaceRoughness', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={inputs.surfaceRoughness}
              onChange={(e) => onChange('surfaceRoughness', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">0.1 - 10</span>
          </div>

          {/* Hardness H */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Gem size={13} className="text-[#111827]" />
              <span>Hardness, H (GPa)</span>
            </div>
            <input
              type="number"
              step={0.1}
              min={0.1}
              max={10}
              value={inputs.hardness}
              onChange={(e) => onChange('hardness', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={inputs.hardness}
              onChange={(e) => onChange('hardness', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">0.1 - 10</span>
          </div>

          {/* Friction Coefficient µ */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <span className="font-serif italic font-bold text-[13px] text-[#111827] w-3.5 text-center">µ</span>
              <span>Friction Coefficient, µ</span>
            </div>
            <input
              type="number"
              step={0.01}
              min={0.05}
              max={1.0}
              value={inputs.frictionCoeff}
              onChange={(e) => onChange('frictionCoeff', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.01}
              value={inputs.frictionCoeff}
              onChange={(e) => onChange('frictionCoeff', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">0.05 - 1.0</span>
          </div>

          {/* Temperature */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Thermometer size={13} className="text-[#111827]" />
              <span>Temperature (°C)</span>
            </div>
            <input
              type="number"
              step={5}
              min={25}
              max={300}
              value={inputs.temperature}
              onChange={(e) => onChange('temperature', Number(e.target.value))}
              className="w-14 px-1.5 py-0.5 text-center font-mono font-bold text-[11px] bg-white border border-[#D1D5DB] rounded"
            />
            <input
              type="range"
              min={25}
              max={300}
              step={5}
              value={inputs.temperature}
              onChange={(e) => onChange('temperature', Number(e.target.value))}
              className="flex-1 h-1 bg-[#E5E7EB] rounded cursor-pointer accent-[#F95721]"
            />
            <span className="text-[10px] text-[#6B7280] font-mono w-16 text-right">25 - 300</span>
          </div>

          {/* Lubrication Condition Dropdown */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Droplet size={13} className="text-[#111827]" />
              <span>Lubrication Condition</span>
            </div>
            <select
              value={inputs.lubrication}
              onChange={(e) => onChange('lubrication', e.target.value as LubricationType)}
              className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded font-semibold text-[#111827]"
            >
              <option value="Dry">Dry</option>
              <option value="Lubricated">Lubricated</option>
            </select>
          </div>

          {/* Material Pair Dropdown */}
          <div className="flex items-center gap-2">
            <div className="w-40 flex items-center gap-1.5 text-[#374151] font-medium flex-shrink-0">
              <Layers size={13} className="text-[#111827]" />
              <span>Material Pair</span>
            </div>
            <select
              value={inputs.materialPair}
              onChange={(e) => onChange('materialPair', e.target.value as MaterialPairKey)}
              className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-[#D1D5DB] rounded font-semibold text-[#111827]"
            >
              <option value="Steel - Steel">Steel – Steel</option>
              <option value="Steel - Al">Steel – Al</option>
              <option value="Steel - Brass">Steel – Brass</option>
              <option value="Al - Al">Al – Al</option>
              <option value="Steel - Cu">Steel – Cu</option>
              <option value="Al - Steel">Al – Steel</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[#F0ECE1]">
        <button
          onClick={onRun}
          className="flex-1 bg-[#F95721] hover:bg-[#E04410] active:scale-[0.99] text-white py-2 px-3 rounded text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Play size={13} fill="currentColor" />
          <span>{runLabel}</span>
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 rounded border border-[#E5E0D8] bg-[#FAF8F3] hover:bg-[#F0ECE1] text-[#4B5563] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw size={12} />
          <span>Reset Inputs</span>
        </button>
      </div>
    </div>
  );
};
