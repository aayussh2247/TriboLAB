export type MaterialPairKey =
  | 'Steel - Steel'
  | 'Steel - Al'
  | 'Steel - Brass'
  | 'Al - Al'
  | 'Steel - Cu'
  | 'Al - Steel';

export type LubricationType = 'Dry' | 'Lubricated';

export interface TribologyInputs {
  normalLoad: number; // N (10 - 1000)
  slidingSpeed: number; // m/s (0.01 - 10)
  slidingDistance: number; // m (10 - 10000)
  surfaceRoughness: number; // Ra (µm) (0.1 - 10)
  hardness: number; // H (GPa) (0.1 - 10)
  frictionCoeff: number; // µ (0.05 - 1.0)
  temperature: number; // °C (25 - 300)
  lubrication: LubricationType;
  materialPair: MaterialPairKey;
}

export interface MaterialProperties {
  material1: string;
  material2: string;
  youngsModulus1: number; // GPa
  youngsModulus2: number; // GPa
  hardness1: number; // GPa
  hardness2: number; // GPa
  wearCoefficient: number; // K
  lubricatedK: number;
}

export interface PredictionResult {
  wearVolume: number; // mm³
  wearRate: number; // mm³/m
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  maxWearDepth: number; // µm
  wearTrackWidth: number; // mm
  theoreticalArchardVolume: number; // mm³
  theoreticalArchardRate: number; // mm³/m
}

export interface DatasetRow {
  id: number;
  normal_load: number;
  sliding_speed: number;
  surface_roughness: number;
  sliding_distance: number;
  hardness: number;
  friction_coeff: number;
  temperature: number;
  lubrication: LubricationType;
  contact_pressure: number;
  wear_coefficient: number;
  material_pair: MaterialPairKey;
  wear_volume: number;
  wear_rate: number;
}
