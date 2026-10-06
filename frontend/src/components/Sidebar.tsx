import React from 'react';
import {
  Home,
  Layers,
  Monitor,
  Sigma,
  TrendingUp,
  Cpu,
  BarChart2,
  Sliders,
  Target,
  BookOpen,
  Airplay,
  Database,
  Lightbulb,
  FileCheck2,
  Settings as SettingsIcon,
  LucideIcon,
} from 'lucide-react';
import { SidebarGearArt } from './TribologyGearArt';

export type NavTabId =
  | 'overview'
  | 'wear-mechanism'
  | 'wear-simulator'
  | 'archards-law'
  | 'ai-prediction'
  | 'model-performance'
  | 'shap-explainability'
  | 'what-if'
  | 'optimization'
  | 'learn-mode'
  | 'presentation-mode'
  | 'dataset'
  | 'research-insights'
  | 'conclusion'
  | 'settings';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
}

interface NavItem {
  id: NavTabId;
  label: string;
  icon: LucideIcon;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'wear-mechanism', label: 'Wear Mechanism', icon: Layers },
  { id: 'wear-simulator', label: 'Wear Simulator', icon: Monitor },
  { id: 'archards-law', label: "Archard's Law", icon: Sigma },
  { id: 'ai-prediction', label: 'AI Prediction', icon: TrendingUp },
  { id: 'model-performance', label: 'Model Performance', icon: Cpu },
  { id: 'shap-explainability', label: 'SHAP Explainability', icon: BarChart2 },
  { id: 'what-if', label: 'What-If Analysis', icon: Sliders },
  { id: 'optimization', label: 'Optimization', icon: Target },
  { id: 'learn-mode', label: 'Learn Mode', icon: BookOpen },
  { id: 'presentation-mode', label: 'Presentation Mode', icon: Airplay },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'research-insights', label: 'Research Insights', icon: Lightbulb },
  { id: 'conclusion', label: 'Conclusion', icon: FileCheck2 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-52 flex-shrink-0 bg-[#FAF8F3] border-r border-[#E5E0D8] min-h-[calc(100vh-62px)] flex flex-col justify-between py-2.5 px-2">
      <div className="space-y-0.5">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#F95721] text-white font-bold shadow-sm'
                  : 'text-[#374151] hover:bg-[#F0ECE1] hover:text-[#111827]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white stroke-[2.2]' : 'text-[#374151] stroke-[1.8]'} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="py-1 px-2">
          <div className="h-[1px] bg-[#E5E0D8]" />
        </div>

        {SECONDARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#F95721] text-white font-bold shadow-sm'
                  : 'text-[#374151] hover:bg-[#F0ECE1] hover:text-[#111827]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white stroke-[2.2]' : 'text-[#374151] stroke-[1.8]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Decorative Bottom Gear Illustration */}
      <div className="pt-2 flex flex-col items-center">
        <SidebarGearArt size={85} />
      </div>
    </aside>
  );
};
