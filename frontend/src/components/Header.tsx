import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { HeaderGearArt } from './TribologyGearArt';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#E5E0D8] px-5 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-50 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Left: Gear Illustration + Project Title */}
      <div className="flex items-center gap-3.5">
        <HeaderGearArt size={68} className="flex-shrink-0" />
        <div className="flex flex-col">
          <h1 className="text-[19px] md:text-[21px] font-black tracking-tight text-[#111827] leading-none uppercase font-sans">
            AI-DRIVEN PREDICTION, EXPLAINABILITY AND
            <span className="block mt-0.5">
              OPTIMIZATION OF <span className="text-[#F95721]">ADHESIVE WEAR</span>
            </span>
          </h1>
          <p className="text-[10px] font-bold tracking-[0.14em] text-[#6B7280] uppercase mt-1 font-mono">
            A RESEARCH PROJECT IN TRIBOLOGY AND MACHINE LEARNING
          </p>
        </div>
      </div>

      {/* Right: Author Badge + Gears Graphic + Date & Time */}
      <div className="flex items-center gap-5 ml-auto">
        {/* Author Card */}
        <div className="flex items-center gap-3 pr-2">
          <div className="w-10 h-10 rounded-full bg-[#F95721] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <User size={22} className="stroke-[2.5]" />
          </div>
          <div className="text-left text-xs leading-tight">
            <span className="text-[10px] text-[#6B7280] block font-medium">Developed By</span>
            <span className="font-extrabold text-[13px] text-[#F95721] block leading-tight">
              Rakesh Kumar
            </span>
            <div className="text-[10px] text-[#4B5563] mt-0.5 font-mono">
              Roll No. : <strong className="text-[#111827]">23039154</strong>
            </div>
            <div className="text-[10px] text-[#6B7280] leading-tight">
              B.Tech. (7th Semester)
            </div>
            <div className="text-[10px] text-[#6B7280] leading-tight">
              Mechanical Engineering
            </div>
          </div>
        </div>

        {/* Right Gears Technical Graphic */}
        <div className="hidden lg:block border-l border-[#E5E0D8] pl-3">
          <HeaderGearArt size={54} className="opacity-95" />
        </div>

        {/* Vertical divider */}
        <div className="h-10 w-[1px] bg-[#E5E0D8]" />

        {/* Date & Time Widget */}
        <div className="flex flex-col gap-1 text-[11px] text-[#374151] font-mono">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-[#111827]" />
            <span className="font-semibold text-[#111827]">Oct 06, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-[#111827]" />
            <span className="font-semibold text-[#111827]">02:35 PM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
