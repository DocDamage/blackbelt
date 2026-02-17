/**
 * Statistical Software Integrations - Type Definitions
 * 
 * Types for exporting data and analyses to various statistical software
 */

export type SoftwareType = 'excel' | 'minitab' | 'python' | 'r' | 'spss' | 'jmp';

export interface SoftwareIntegration {
  id: SoftwareType;
  name: string;
  description: string;
  icon: string;
  fileExtensions: string[];
  capabilities: SoftwareCapability[];
}

export interface SoftwareCapability {
  feature: string;
  supported: boolean;
  notes?: string;
}

export interface ExportConfig {
  software: SoftwareType;
  dataFormat: 'raw' | 'summary' | 'analysis';
  includeCharts: boolean;
  includeFormulas: boolean;
  includeMacros: boolean;
  template?: string;
}

export interface Dataset {
  name: string;
  columns: Column[];
  rows: (number | string | null)[][];
  metadata: DatasetMetadata;
}

export interface Column {
  name: string;
  type: 'numeric' | 'text' | 'date' | 'categorical';
  description?: string;
  units?: string;
}

export interface DatasetMetadata {
  created: number;
  modified: number;
  author: string;
  description: string;
  source?: string;
}

export interface AnalysisExport {
  type: 'descriptive' | 'capability' | 'regression' | 'anova' | 'control-chart' | 'doe';
  title: string;
  dataset: Dataset;
  results: AnalysisResults;
  config: ExportConfig;
}

export interface AnalysisResults {
  statistics?: DescriptiveStatistics;
  capability?: CapabilityResults;
  regression?: RegressionResults;
  anova?: ANOVAResults;
  controlChart?: ControlChartResults;
  doe?: DOEResults;
}

export interface DescriptiveStatistics {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  skewness?: number;
  kurtosis?: number;
}

export interface CapabilityResults {
  cp: number;
  cpk: number;
  cpu: number;
  cpl: number;
  pp: number;
  ppk: number;
  sigmaLevel: number;
  dpmo: number;
  lsl?: number;
  usl?: number;
  target?: number;
}

export interface RegressionResults {
  rSquared: number;
  adjRSquared: number;
  coefficients: Array<{
    name: string;
    coefficient: number;
    stdError: number;
    tStat: number;
    pValue: number;
  }>;
  equation: string;
}

export interface ANOVAResults {
  sources: Array<{
    source: string;
    ss: number;
    df: number;
    ms: number;
    f: number;
    p: number;
  }>;
}

export interface ControlChartResults {
  chartType: string;
  centerLine: number;
  ucl: number;
  lcl: number;
  points: Array<{
    sample: number;
    value: number;
    outOfControl?: boolean;
  }>;
  violations: string[];
}

export interface DOEResults {
  designType: string;
  factors: string[];
  mainEffects: Record<string, number>;
  interactions: Array<{
    factors: string[];
    effect: number;
  }>;
}

export interface CodeTemplate {
  language: SoftwareType;
  name: string;
  description: string;
  code: string;
  parameters: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }>;
}

export interface ExportHistory {
  id: string;
  timestamp: number;
  software: SoftwareType;
  fileName: string;
  fileSize: number;
  analysisType: string;
}
