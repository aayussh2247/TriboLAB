import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTabId } from './components/Sidebar';
import { TribologyInputs, PredictionResult } from './types/tribology';
import { predictWearAI } from './utils/tribologyEngine';
import { apiService } from './services/api';
import { OverviewView } from './components/views/OverviewView';
import { WearSimulatorView } from './components/views/WearSimulatorView';
import { DatasetView } from './components/views/DatasetView';
import { ArchardsLawView } from './components/views/ArchardsLawView';
import { OptimizationView } from './components/views/OptimizationView';
import { ResearchPaperView } from './components/views/ResearchPaperView';
import { SettingsHardwareView } from './components/views/SettingsHardwareView';
import { ConclusionLetterheadView } from './components/views/ConclusionLetterheadView';
import { AIPredictionView } from './components/views/AIPredictionView';
import { PresentationMode } from './components/PresentationMode';
import { LearnModeModal } from './components/LearnModeModal';
import {
  WearMechanismView,
  ModelPerformanceView,
  WhatIfAnalysisView,
} from './components/views/AdditionalViews';
import { SHAPExplainabilityView } from './components/views/SHAPExplainabilityView';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

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

  // Fetch real ML XGBoost prediction from FastAPI backend whenever inputs change
  useEffect(() => {
    let isCancelled = false;
    
    // Immediate instant client prediction update for zero latency
    const localResult = predictWearAI(inputs);
    setPrediction(localResult);

    // Call real FastAPI backend with full XGBoost model & physics features
    apiService.predictWear({
      normal_load: inputs.normalLoad,
      sliding_speed: inputs.slidingSpeed,
      surface_roughness: inputs.surfaceRoughness,
      sliding_distance: inputs.slidingDistance,
      hardness: inputs.hardness,
      friction_coeff: inputs.frictionCoeff,
      temperature: inputs.temperature,
      lubrication: inputs.lubrication === 'Lubricated' ? 1 : 0,
      material_pair: inputs.materialPair.replace(/\s+/g, ''),
    }).then((res) => {
      if (!isCancelled && res && res.predicted_wear_volume_mm3 !== undefined) {
        setIsBackendConnected(true);
        const wearVol = Number(res.predicted_wear_volume_mm3.toFixed(4));
        const archardVol = Number(res.archard_theoretical_wear_mm3.toFixed(4));
        const trackW = Number((0.32 + (inputs.normalLoad / 1000) * 0.28).toFixed(2));
        const computedD = Math.max(0.5, Math.min(80, (wearVol * 1000) / (trackW * 4.5)));

        setPrediction({
          wearVolume: wearVol,
          wearRate: res.predicted_wear_rate_mm3_m,
          theoreticalArchardVolume: archardVol,
          theoreticalArchardRate: archardVol / Math.max(1, inputs.slidingDistance),
          confidenceScore: 0.965,
          riskLevel: res.wear_risk_category === 'Severe Wear' ? 'HIGH' : res.wear_risk_category === 'Mild Wear' ? 'LOW' : 'MEDIUM',
          maxWearDepth: Number(computedD.toFixed(1)),
          wearTrackWidth: trackW,
        });
      }
    }).catch(() => {
      if (!isCancelled) {
        setIsBackendConnected(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [inputs]);

  const handleInputChange = (key: keyof TribologyInputs, val: any) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
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
  };

  const handleApplyOptimized = (optInputs: Partial<TribologyInputs>) => {
    setInputs((prev) => ({ ...prev, ...optInputs }));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E293B] flex flex-col font-sans">
      {/* Top Banner Header */}
      <Header isBackendConnected={isBackendConnected} />

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

          {activeTab === 'ai-prediction' && (
            <AIPredictionView
              inputs={inputs}
              prediction={prediction}
              onInputChange={handleInputChange}
              onRunPredict={handleRunPredict}
              onReset={handleResetInputs}
            />
          )}

          {activeTab === 'learn-mode' && (
            <div className="max-w-4xl mx-auto py-2">
              <LearnModeModal />
            </div>
          )}

          {activeTab === 'model-performance' && <ModelPerformanceView />}

          {activeTab === 'shap-explainability' && (
            <SHAPExplainabilityView inputs={inputs} prediction={prediction} />
          )}

          {activeTab === 'what-if' && (
            <WhatIfAnalysisView inputs={inputs} prediction={prediction} />
          )}

          {activeTab === 'research-insights' && <ResearchPaperView />}

          {activeTab === 'conclusion' && <ConclusionLetterheadView />}

          {activeTab === 'presentation-mode' && (
            <PresentationMode onClose={() => setActiveTab('overview')} />
          )}

          {activeTab === 'settings' && <SettingsHardwareView />}
        </main>
      </div>
    </div>
  );
}

export default App;
