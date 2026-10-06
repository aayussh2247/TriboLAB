import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { TribologyInputs, PredictionResult } from './types/tribology';
import { predictWearAI } from './utils/tribologyEngine';
import { OverviewView } from './components/views/OverviewView';
import { WearSimulatorView } from './components/views/WearSimulatorView';
import { DatasetView } from './components/views/DatasetView';
import { ArchardsLawView } from './components/views/ArchardsLawView';
import { OptimizationView } from './components/views/OptimizationView';
import {
  WearMechanismView,
  ModelPerformanceView,
  SHAPExplainabilityView,
  WhatIfAnalysisView,
  ConclusionView,
} from './components/views/AdditionalViews';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');

  // Tribology State calibrated to exact screenshot defaults
  const [inputs, setInputs] = useState<TribologyInputs>({
    normalLoad: 500,
    slidingSpeed: 1.0,
    slidingDistance: 5000,
    surfaceRoughness: 1.0,
    hardness: 2.0,
    frictionCoeff: 0.3,
    temperature: 100,
    lubrication: 'Dry',
    materialPair: 'Steel - Steel',
  });

  const [prediction, setPrediction] = useState<PredictionResult>(() =>
    predictWearAI({
      normalLoad: 500,
      slidingSpeed: 1.0,
      slidingDistance: 5000,
      surfaceRoughness: 1.0,
      hardness: 2.0,
      frictionCoeff: 0.3,
      temperature: 100,
      lubrication: 'Dry',
      materialPair: 'Steel - Steel',
    })
  );

  const handleInputChange = (key: keyof TribologyInputs, val: any) => {
    setInputs((prev) => {
      const next = { ...prev, [key]: val };
      // Real-time automatic prediction update
      setPrediction(predictWearAI(next));
      return next;
    });
  };

  const handleRunPredict = () => {
    setPrediction(predictWearAI(inputs));
  };

  const handleResetInputs = () => {
    const defaults: TribologyInputs = {
      normalLoad: 500,
      slidingSpeed: 1.0,
      slidingDistance: 5000,
      surfaceRoughness: 1.0,
      hardness: 2.0,
      frictionCoeff: 0.3,
      temperature: 100,
      lubrication: 'Dry',
      materialPair: 'Steel - Steel',
    };
    setInputs(defaults);
    setPrediction(predictWearAI(defaults));
  };

  const handleApplyOptimized = (optInputs: Partial<TribologyInputs>) => {
    setInputs((prev) => {
      const updated = { ...prev, ...optInputs };
      setPrediction(predictWearAI(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col font-sans">
      {/* Top Banner Header */}
      <Header />

      {/* Main App Body: Sidebar + Dynamic Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px]">
          {activeTab === 'overview' && (
            <OverviewView
              inputs={inputs}
              prediction={prediction}
              onInputChange={handleInputChange}
              onRunPredict={handleRunPredict}
              onReset={handleResetInputs}
              onNavigateToSimulator={() => setActiveTab('wear-simulator')}
            />
          )}

          {activeTab === 'wear-simulator' && (
            <WearSimulatorView
              inputs={inputs}
              prediction={prediction}
              onInputChange={handleInputChange}
              onRunSimulation={handleRunPredict}
              onReset={handleResetInputs}
            />
          )}

          {activeTab === 'archards-law' && <ArchardsLawView />}

          {activeTab === 'dataset' && <DatasetView />}

          {activeTab === 'optimization' && (
            <OptimizationView
              inputs={inputs}
              prediction={prediction}
              onApplyOptimized={handleApplyOptimized}
            />
          )}

          {activeTab === 'wear-mechanism' && <WearMechanismView />}

          {(activeTab === 'ai-prediction' || activeTab === 'learn-mode') && (
            <OverviewView
              inputs={inputs}
              prediction={prediction}
              onInputChange={handleInputChange}
              onRunPredict={handleRunPredict}
              onReset={handleResetInputs}
              onNavigateToSimulator={() => setActiveTab('wear-simulator')}
            />
          )}

          {(activeTab === 'model-performance' || activeTab === 'research-insights') && (
            <ModelPerformanceView />
          )}

          {activeTab === 'shap-explainability' && <SHAPExplainabilityView />}

          {activeTab === 'what-if' && (
            <WhatIfAnalysisView inputs={inputs} prediction={prediction} />
          )}

          {(activeTab === 'conclusion' || activeTab === 'presentation-mode') && (
            <ConclusionView />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white border border-[#E8E4DA] rounded-lg p-6 shadow-sm max-w-2xl space-y-4">
              <h3 className="font-bold text-base text-[#1E293B]">System & Project Settings</h3>
              <div className="space-y-3 text-xs text-[#475569]">
                <div className="flex items-center justify-between py-2 border-b border-[#F1EFEA]">
                  <span>Measurement Units</span>
                  <strong className="font-mono text-[#1E293B]">Metric (SI: N, m, mm³, µm, GPa)</strong>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F1EFEA]">
                  <span>AI Inference Backend</span>
                  <strong className="font-mono text-[#F95721]">XGBoost v2.0 + Physics-Informed Engine</strong>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F1EFEA]">
                  <span>Researcher Name</span>
                  <strong className="font-mono text-[#1E293B]">Rakesh Kumar (Roll No. 23039154)</strong>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Target Discipline</span>
                  <strong className="font-mono text-[#1E293B]">Mechanical Engineering (Tribology)</strong>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
