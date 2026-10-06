import React from 'react';
import { Thermometer, Droplet, Activity } from 'lucide-react';
import { TribologyInputs, MaterialProperties } from '../types/tribology';

interface ContactDiagramProps {
  inputs: TribologyInputs;
  matProps: MaterialProperties;
}

export const ContactDiagram: React.FC<ContactDiagramProps> = ({ inputs, matProps }) => {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-lg p-3.5 shadow-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F0ECE1]">
          <h3 className="font-extrabold text-[13px] text-[#111827]">
            2. Material Pair & Operating Condition
          </h3>
        </div>

        {/* Technical Schematic Box */}
        <div className="relative w-full h-36 bg-[#F8F7F3] rounded border border-[#E5E0D8] overflow-hidden flex flex-col items-center justify-center p-2">
          {/* Normal Load Arrow & Label */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
            <span className="text-[10px] font-bold text-[#111827] font-sans">
              Normal Load (N)
            </span>
            <div className="w-[3px] h-3.5 bg-[#F95721] mt-0.5" />
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#F95721]" />
          </div>

          {/* Upper Metallic Block */}
          <div className="absolute top-9 left-12 right-36 h-10 rounded-sm shadow-sm border border-[#9CA3AF] bg-gradient-to-b from-[#E5E7EB] via-[#D1D5DB] to-[#9CA3AF] flex items-center justify-start px-4">
            <span className="text-[11px] font-extrabold text-[#1F2937]">
              {matProps.material1}
            </span>
          </div>

          {/* Contact Micro-asperities & Wear Debris */}
          <div className="absolute top-19 left-16 right-20 h-2 flex items-center justify-around overflow-hidden z-10">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#78350F] opacity-80"
                style={{ transform: `translateY(${(i % 2) * 2 - 1}px)` }}
              />
            ))}
          </div>

          {/* Lower Metallic Block */}
          <div className="absolute top-21 left-28 right-16 h-10 rounded-sm shadow-sm border border-[#6B7280] bg-gradient-to-b from-[#D1D5DB] via-[#9CA3AF] to-[#6B7280] flex items-center justify-end px-4">
            <span className="text-[11px] font-extrabold text-white drop-shadow-sm">
              {matProps.material2}
            </span>
          </div>

          {/* Sliding Direction Arrow */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            <span className="text-[10px] font-bold text-[#111827] font-sans">
              Sliding Direction
            </span>
            <div className="w-7 h-[2px] bg-[#111827]" />
            <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-[#111827]" />
          </div>
        </div>

        {/* Operating Condition summary row matching screenshot */}
        <div className="mt-3 bg-[#FAF8F3] border border-[#E5E0D8] rounded p-2 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[#374151]">
            <Thermometer size={14} className="text-[#F95721]" />
            <div>
              <span className="text-[9px] text-[#6B7280] block leading-none">Temperature</span>
              <strong className="text-[#111827] font-mono">{inputs.temperature} °C</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#374151]">
            <Droplet size={14} className="text-[#111827]" />
            <div>
              <span className="text-[9px] text-[#6B7280] block leading-none">Lubrication</span>
              <strong className="text-[#111827] font-mono">{inputs.lubrication}</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[#374151]">
            <Activity size={14} className="text-[#111827]" />
            <div>
              <span className="text-[9px] text-[#6B7280] block leading-none">Surface Roughness</span>
              <strong className="text-[#111827] font-mono">Ra = {inputs.surfaceRoughness} µm</strong>
            </div>
          </div>
        </div>

        {/* Material Properties (Selected Pair) Table */}
        <div className="mt-2.5">
          <span className="text-[11px] font-bold text-[#111827] block mb-1">
            Material Properties (Selected Pair)
          </span>
          <div className="overflow-hidden rounded border border-[#E5E0D8]">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-[#FAF8F3] text-[#4B5563] text-[10px] font-mono border-b border-[#E5E0D8]">
                <tr>
                  <th className="py-1 px-2.5 font-bold">Property</th>
                  <th className="py-1 px-2.5 font-bold">Material 1 ({matProps.material1})</th>
                  <th className="py-1 px-2.5 font-bold">Material 2 ({matProps.material2})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1] font-mono text-[11px]">
                <tr>
                  <td className="py-1.5 px-2.5 font-sans font-medium text-[#374151]">Young's Modulus (GPa)</td>
                  <td className="py-1.5 px-2.5 text-[#111827]">{matProps.youngsModulus1}</td>
                  <td className="py-1.5 px-2.5 text-[#111827]">{matProps.youngsModulus2}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 font-sans font-medium text-[#374151]">Hardness (GPa)</td>
                  <td className="py-1.5 px-2.5 text-[#111827]">{inputs.hardness}</td>
                  <td className="py-1.5 px-2.5 text-[#111827]">{matProps.hardness2}</td>
                </tr>
                <tr>
                  <td className="py-1.5 px-2.5 font-sans font-medium text-[#374151]">Wear Coefficient (K)</td>
                  <td className="py-1.5 px-2.5 text-[#111827] font-bold">
                    {inputs.lubrication === 'Lubricated'
                      ? matProps.lubricatedK.toExponential(1)
                      : matProps.wearCoefficient.toExponential(1)}
                  </td>
                  <td className="py-1.5 px-2.5 text-[#111827] font-bold">
                    {inputs.lubrication === 'Lubricated'
                      ? matProps.lubricatedK.toExponential(1)
                      : matProps.wearCoefficient.toExponential(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
