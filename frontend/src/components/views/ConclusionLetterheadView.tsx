import React from 'react';
import {
  Construction,
  Clock,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface ConclusionProps {
  onNavigate?: (tab: string) => void;
}

export const ConclusionLetterheadView: React.FC<ConclusionProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-white border border-[#E5E0D8] rounded-2xl shadow-sm p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Top subtle decorative accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

        {/* Big Icon with amber glow */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-500 shadow-inner">
            <Construction size={48} className="stroke-[2.2] animate-bounce-slow" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
          </span>
        </div>

        {/* Badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle size={13} className="text-amber-700" />
            Under Development
          </span>
          <span className="text-xs font-semibold text-slate-400">•</span>
          <span className="text-xs font-semibold text-slate-500 font-mono">Phase: Work in Progress</span>
        </div>

        {/* Main Headings */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Conclusion Section Under Development
        </h1>
        <p className="text-sm text-slate-600 mt-2.5 max-w-xl mx-auto leading-relaxed">
          Yeh section abhi under active development hai. Final research conclusions, thesis defense summary, aur official academic sign-offs ko finalize kiya ja raha hai.
        </p>

        {/* In-Progress Modules Checklist */}
        <div className="mt-8 bg-[#FAF8F5] border border-[#E8E4DA] rounded-xl p-5 text-left max-w-lg mx-auto">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Modules In Development Pipeline</span>
            <span className="text-amber-600 font-semibold">Scheduled Release</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="text-amber-500 flex-shrink-0" />
              <span>Final B.Tech Thesis Conclusions & Wear Mechanism Synthesis</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="text-amber-500 flex-shrink-0" />
              <span>Official Departmental Defense Letterhead & Evaluation Rubric</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="text-amber-500 flex-shrink-0" />
              <span>External Examiner Digital Sign-off Verification Workflow</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={15} className="text-amber-500 flex-shrink-0" />
              <span>Comprehensive Tribological Recommendations & Industrial Scope</span>
            </li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-500" />
            <span>Guru Ghasidas Vishwavidyalaya • Mechanical Engineering Department</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Release: v1.1.0-wip</span>
        </div>
      </div>
    </div>
  );
};

export default ConclusionLetterheadView;
