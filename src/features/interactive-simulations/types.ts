/**
 * Interactive Process Simulations - Type Definitions
 * 
 * Types for control charts, DOE planning, and process mapping tools
 */

// Control Chart Types
export type ControlChartType = 'xbar-r' | 'xbar-s' | 'x-mr' | 'p' | 'np' | 'c' | 'u';

export interface ControlChartConfig {
  type: ControlChartType;
  sampleSize: number;
  lcl: number;
  ucl: number;
  centerLine: number;
  title: string;
}

export interface DataPoint {
  id: string;
  value: number;
  sample: number;
  timestamp: number;
  outOfControl?: boolean;
  violationType?: ControlRuleViolation;
}

export type ControlRuleViolation = 
  | 'points-beyond-limits'
  | 'zone-a'
  | 'zone-b'
  | 'trend'
  | 'mixture'
  | 'stratification'
  | 'overcontrol';

export interface ControlChartData {
  points: DataPoint[];
  config: ControlChartConfig;
  stats: {
    mean: number;
    stdDev: number;
    cp?: number;
    cpk?: number;
    outOfControlCount: number;
  };
}

// DOE Types
export type DOEDesignType = 'full-factorial' | 'fractional-factorial' | 'response-surface' | 'taguchi';

export interface Factor {
  id: string;
  name: string;
  lowLevel: number | string;
  highLevel: number | string;
  units?: string;
  type: 'numeric' | 'categorical';
}

export interface DOEExperiment {
  id: string;
  runNumber: number;
  factorLevels: Record<string, number | string>;
  response?: number;
  replicates: number;
}

export interface DOEConfig {
  designType: DOEDesignType;
  factors: Factor[];
  responses: string[];
  replicates: number;
  centerPoints: number;
  resolution?: number; // For fractional factorial
}

export interface DOEAnalysis {
  mainEffects: Record<string, number>;
  interactions: Array<{
    factors: string[];
    effect: number;
    significant: boolean;
  }>;
  anova: {
    source: string;
    ss: number;
    df: number;
    ms: number;
    f: number;
    p: number;
  }[];
  model: {
    rSquared: number;
    adjRSquared: number;
    predictedRSquared: number;
  };
}

// Process Mapping Types
export type ProcessNodeType = 
  | 'start' 
  | 'end' 
  | 'process' 
  | 'decision' 
  | 'delay' 
  | 'document' 
  | 'data' 
  | 'subprocess';

export interface ProcessNode {
  id: string;
  type: ProcessNodeType;
  label: string;
  x: number;
  y: number;
  description?: string;
  cycleTime?: number;
  valueAdded: 'va' | 'nva' | 'bva'; // Value Added, Non-Value Added, Business Value Added
  owner?: string;
}

export interface ProcessEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  probability?: number; // For decision paths
}

export interface ProcessMap {
  id: string;
  name: string;
  nodes: ProcessNode[];
  edges: ProcessEdge[];
  metadata: {
    created: number;
    modified: number;
    author: string;
    version: string;
  };
}

// Feature State
export interface SimulationState {
  activeSimulation: 'control-chart' | 'doe' | 'process-map' | null;
  controlChart: ControlChartData | null;
  doe: {
    config: DOEConfig | null;
    experiments: DOEExperiment[];
    analysis: DOEAnalysis | null;
  } | null;
  processMap: ProcessMap | null;
}

// Export/Import
export interface SimulationExport {
  version: string;
  type: 'control-chart' | 'doe' | 'process-map';
  data: ControlChartData | { config: DOEConfig; experiments: DOEExperiment[] } | ProcessMap;
  exportedAt: number;
}
