/**
 * Statistical Software Integrations
 * 
 * Export Six Sigma analyses to popular statistical software:
 * - Microsoft Excel
 * - Minitab
 * - Python (pandas, scipy, statsmodels)
 * - R (base, ggplot2)
 */

import React, { useState } from 'react';
import type { 
  SoftwareType, 
  SoftwareIntegration, 
  ExportConfig, 
  Dataset, 
  AnalysisExport,
  AnalysisResults 
} from './types';
import styles from './SoftwareIntegrations.module.css';

interface SoftwareIntegrationsProps {
  dataset?: Dataset;
  analysisResults?: AnalysisResults;
  analysisType?: 'descriptive' | 'capability' | 'regression' | 'anova' | 'control-chart' | 'doe';
  onExport?: (exportData: AnalysisExport, fileContent: string) => void;
}

const SOFTWARE_OPTIONS: SoftwareIntegration[] = [
  {
    id: 'excel',
    name: 'Microsoft Excel',
    description: 'Export to Excel with formulas, charts, and templates',
    icon: '📊',
    fileExtensions: ['.xlsx', '.xlsm'],
    capabilities: [
      { feature: 'Formulas', supported: true },
      { feature: 'Charts', supported: true },
      { feature: 'Pivot Tables', supported: true },
      { feature: 'VBA Macros', supported: true },
      { feature: 'Data Validation', supported: true },
    ],
  },
  {
    id: 'minitab',
    name: 'Minitab',
    description: 'Native Minitab project files with statistical output',
    icon: '📈',
    fileExtensions: ['.mpj', '.mtw'],
    capabilities: [
      { feature: 'Native Format', supported: true },
      { feature: 'Session Commands', supported: true },
      { feature: 'Graphs', supported: true },
      { feature: 'Macros', supported: true, notes: 'Session commands only' },
    ],
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Python code with pandas, scipy, and matplotlib',
    icon: '🐍',
    fileExtensions: ['.py', '.ipynb'],
    capabilities: [
      { feature: 'Jupyter Notebook', supported: true },
      { feature: 'Pandas DataFrames', supported: true },
      { feature: 'Matplotlib/Seaborn', supported: true },
      { feature: 'Statsmodels', supported: true },
      { feature: 'SciPy', supported: true },
    ],
  },
  {
    id: 'r',
    name: 'R',
    description: 'R code with tidyverse and ggplot2',
    icon: '📐',
    fileExtensions: ['.r', '.rmd'],
    capabilities: [
      { feature: 'R Markdown', supported: true },
      { feature: 'Tidyverse', supported: true },
      { feature: 'ggplot2', supported: true },
      { feature: 'Base Graphics', supported: true },
      { feature: 'R Scripts', supported: true },
    ],
  },
  {
    id: 'spss',
    name: 'SPSS',
    description: 'SPSS syntax and data files',
    icon: '📉',
    fileExtensions: ['.sav', '.sps'],
    capabilities: [
      { feature: 'Data File', supported: true },
      { feature: 'Syntax Commands', supported: true },
      { feature: 'Output', supported: false, notes: 'Data and syntax only' },
    ],
  },
  {
    id: 'jmp',
    name: 'JMP',
    description: 'JMP scripts and data tables',
    icon: '📋',
    fileExtensions: ['.jmp', '.jsl'],
    capabilities: [
      { feature: 'Data Table', supported: true },
      { feature: 'JSL Scripts', supported: true },
      { feature: 'Journals', supported: false },
    ],
  },
];

export const SoftwareIntegrations: React.FC<SoftwareIntegrationsProps> = ({
  dataset,
  analysisResults,
  analysisType = 'descriptive',
  onExport,
}) => {
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareType>('excel');
  const [config, setConfig] = useState<ExportConfig>({
    software: 'excel',
    dataFormat: 'analysis',
    includeCharts: true,
    includeFormulas: true,
    includeMacros: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const selectedSoftwareData = SOFTWARE_OPTIONS.find(s => s.id === selectedSoftware);

  const handleSoftwareChange = (software: SoftwareType) => {
    setSelectedSoftware(software);
    setConfig({ ...config, software });
    setPreview(null);
  };

  const generateExport = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const exportData: AnalysisExport = {
        type: analysisType,
        title: `Six Sigma ${analysisType} Analysis`,
        dataset: dataset || generateSampleDataset(),
        results: analysisResults || generateSampleResults(analysisType),
        config,
      };

      const fileContent = generateFileContent(exportData);
      setPreview(fileContent);
      setIsGenerating(false);
      onExport?.(exportData, fileContent);
    }, 1000);
  };

  const generateFileContent = (exportData: AnalysisExport): string => {
    switch (config.software) {
      case 'excel':
        return generateExcelExport(exportData);
      case 'python':
        return generatePythonExport(exportData);
      case 'r':
        return generateRExport(exportData);
      case 'minitab':
        return generateMinitabExport(exportData);
      default:
        return `# ${exportData.title}\n\nGenerated for ${config.software}\n\n`;
    }
  };

  const generateExcelExport = (data: AnalysisExport): string => {
    return `# Excel Export - ${data.title}

## Workbook Structure
- Sheet 1: Raw Data
- Sheet 2: Summary Statistics
- Sheet 3: Analysis Results
- Sheet 4: Charts

## Excel Formulas Included
${data.config.includeFormulas ? generateExcelFormulas(data) : 'Formulas disabled'}

## Data Preview
${generateDataPreview(data.dataset)}

## Instructions
1. Open in Excel 2016 or later
2. Enable macros if prompted
3. Refresh data connections if needed

File: ${data.title.replace(/\s+/g, '_')}.xlsx`;
  };

  const generatePythonExport = (data: AnalysisExport): string => {
    return `# ${data.title}
# Generated for Python

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
import seaborn as sns

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

# Load data
data = pd.DataFrame(${JSON.stringify(data.dataset.rows)}, 
                   columns=${JSON.stringify(data.dataset.columns.map(c => c.name))})

# Summary statistics
print("Descriptive Statistics:")
print(data.describe())

${data.results.capability ? generatePythonCapability(data.results.capability) : ''}
${data.results.regression ? generatePythonRegression(data.results.regression) : ''}

# Save results
data.to_csv('${data.title.replace(/\s+/g, '_')}_data.csv', index=False)`;
  };

  const generateRExport = (data: AnalysisExport): string => {
    return `# ${data.title}
# Generated for R

library(tidyverse)
library(ggplot2)

# Load data
data <- data.frame(
  ${data.dataset.columns.map((col, i) => 
    `${col.name} = c(${data.dataset.rows.slice(0, 5).map(r => r[i]).join(', ')}, ...)`
  ).join(',\n  ')}
)

# Summary statistics
summary(data)

${data.results.capability ? generateRCapability(data.results.capability) : ''}
${data.results.regression ? generateRRegression(data.results.regression) : ''}

# Save data
write.csv(data, "${data.title.replace(/\s+/g, '_')}_data.csv", row.names = FALSE)`;
  };

  const generateMinitabExport = (data: AnalysisExport): string => {
    return `# Minitab Session Commands
# ${data.title}

# Set worksheet
Worksheet 1

# Enter data
${data.dataset.columns.map((_col, i) => 
      `Set C${i + 1}
  ${data.dataset.rows.slice(0, 10).map(r => r[i]).join(' ')}
End`
    ).join('\n')}

# Name columns
${data.dataset.columns.map((col, i) => `Name C${i + 1} "${col.name}"`).join('\n')}

# Descriptive Statistics
Describe C1-C${data.dataset.columns.length};
  Statistics All.

${data.results.capability ? generateMinitabCapability(data.results.capability) : ''}

# Save project
Save "${data.title.replace(/\s+/g, '_')}.mpj"`;
  };

  const generateExcelFormulas = (data: AnalysisExport): string => {
    if (data.results.capability) {
      return `
- Cp: =(USL-LSL)/(6*STDEV.S(data_range))
- Cpk: =MIN((USL-AVERAGE(data_range))/(3*STDEV.S(data_range)), (AVERAGE(data_range)-LSL)/(3*STDEV.S(data_range)))
- DPMO: =NORM.DIST(LSL,AVERAGE(data_range),STDEV.S(data_range),TRUE)*1000000 + (1-NORM.DIST(USL,AVERAGE(data_range),STDEV.S(data_range),TRUE))*1000000
`;
    }
    return '- Basic statistics: AVERAGE, STDEV.S, MIN, MAX, MEDIAN';
  };

  const generatePythonCapability = (cap: AnalysisResults['capability']): string => {
    if (!cap) return '';
    return `
# Process Capability Analysis
usl = ${cap.usl || 100}
lsl = ${cap.lsl || 0}
target = ${cap.target || 50}

# Calculate Cp and Cpk
sigma = data.std().iloc[0]
mean = data.mean().iloc[0]

Cp = (usl - lsl) / (6 * sigma)
Cpk = min((usl - mean) / (3 * sigma), (mean - lsl) / (3 * sigma))

print(f"Cp: {Cp:.3f}")
print(f"Cpk: {Cpk:.3f}")
print(f"Sigma Level: {Cpk * 3:.2f}")

# Capability plot
fig, ax = plt.subplots()
ax.hist(data.iloc[:, 0], bins=30, alpha=0.7, density=True)
ax.axvline(usl, color='r', linestyle='--', label=f'USL = {usl}')
ax.axvline(lsl, color='r', linestyle='--', label=f'LSL = {lsl}')
ax.axvline(mean, color='g', linestyle='-', label=f'Mean = {mean:.2f}')
ax.legend()
plt.title('Process Capability Analysis')
plt.savefig('capability_plot.png')
plt.show()`;
  };

  const generatePythonRegression = (reg: AnalysisResults['regression']): string => {
    if (!reg) return '';
    return `
# Regression Analysis
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Fit model
X = data.iloc[:, :-1]
y = data.iloc[:, -1]
model = LinearRegression().fit(X, y)

print(f"R²: {model.score(X, y):.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print("Coefficients:", model.coef_)

# Plot
plt.scatter(X.iloc[:, 0], y, alpha=0.5)
plt.plot(X.iloc[:, 0], model.predict(X), color='red')
plt.xlabel('X')
plt.ylabel('Y')
plt.title('Regression Analysis')
plt.savefig('regression_plot.png')
plt.show()`;
  };

  const generateRCapability = (cap: AnalysisResults['capability']): string => {
    if (!cap) return '';
    return `
# Process Capability Analysis
library(qualityTools)

usl <- ${cap.usl || 100}
lsl <- ${cap.lsl || 0}

# Calculate capability
cp <- (usl - lsl) / (6 * sd(data[[1]]))
cpk <- min((usl - mean(data[[1]])) / (3 * sd(data[[1]])), 
           (mean(data[[1]]) - lsl) / (3 * sd(data[[1]])))

cat("Cp:", round(cp, 3), "\\n")
cat("Cpk:", round(cpk, 3), "\\n")

# Histogram with specs
ggplot(data, aes(x = .data[[names(data)[1]]])) +
  geom_histogram(aes(y = ..density..), bins = 30, fill = "lightblue") +
  geom_vline(xintercept = c(lsl, usl), color = "red", linetype = "dashed") +
  geom_vline(xintercept = mean(data[[1]]), color = "green") +
  theme_minimal() +
  labs(title = "Process Capability")`;
  };

  const generateRRegression = (reg: AnalysisResults['regression']): string => {
    if (!reg) return '';
    return `
# Regression Analysis
model <- lm(${reg.equation}, data = data)

# Summary
summary(model)

# R-squared
r_squared <- summary(model)$r.squared
adj_r_squared <- summary(model)$adj.r.squared

cat("R²:", round(r_squared, 4), "\\n")
cat("Adjusted R²:", round(adj_r_squared, 4), "\\n")

# Plot
ggplot(data, aes(x = .data[[names(data)[1]]], y = .data[[names(data)[2]]])) +
  geom_point(alpha = 0.5) +
  geom_smooth(method = "lm", color = "red") +
  theme_minimal() +
  labs(title = "Regression Analysis")`;
  };

  const generateMinitabCapability = (cap: AnalysisResults['capability']): string => {
    if (!cap) return '';
    return `
# Capability Analysis
Capa C1;
  USL ${cap.usl || 100};
  LSL ${cap.lsl || 0};
  Target ${cap.target || 50};
  PPM;
  Within;
  Overall.`;
  };

  const generateSampleDataset = (): Dataset => ({
    name: 'Sample Dataset',
    columns: [
      { name: 'Measurement', type: 'numeric', description: 'Process measurement', units: 'mm' },
      { name: 'Batch', type: 'categorical', description: 'Batch number' },
      { name: 'Operator', type: 'categorical', description: 'Operator ID' },
    ],
    rows: Array.from({ length: 50 }, (_, i) => [
      50 + Math.random() * 10 - 5,
      `Batch ${Math.floor(i / 10) + 1}`,
      `Op ${(i % 3) + 1}`,
    ]),
    metadata: {
      created: Date.now(),
      modified: Date.now(),
      author: 'Six Sigma Training Platform',
      description: 'Sample process data for analysis',
    },
  });

  const generateSampleResults = (type: string): AnalysisResults => {
    switch (type) {
      case 'capability':
        return {
          capability: {
            cp: 1.45,
            cpk: 1.32,
            cpu: 1.42,
            cpl: 1.32,
            pp: 1.48,
            ppk: 1.35,
            sigmaLevel: 3.96,
            dpmo: 1840,
            lsl: 40,
            usl: 60,
            target: 50,
          },
        };
      case 'regression':
        return {
          regression: {
            rSquared: 0.847,
            adjRSquared: 0.842,
            coefficients: [
              { name: 'Intercept', coefficient: 12.5, stdError: 1.2, tStat: 10.4, pValue: 0.000 },
              { name: 'X1', coefficient: 0.85, stdError: 0.08, tStat: 10.6, pValue: 0.000 },
            ],
            equation: 'Y = 12.5 + 0.85*X1',
          },
        };
      default:
        return {
          statistics: {
            count: 50,
            mean: 50.2,
            median: 50.1,
            stdDev: 2.1,
            min: 44.2,
            max: 56.8,
            q1: 48.8,
            q3: 51.5,
          },
        };
    }
  };

  const generateDataPreview = (data: Dataset): string => {
    const preview = data.rows.slice(0, 5).map(row => 
      row.map(cell => String(cell).substring(0, 15)).join('\t')
    ).join('\n');
    return `${data.columns.map(c => c.name).join('\t')}\n${preview}\n... (${data.rows.length} rows total)`;
  };

  const downloadFile = () => {
    if (!preview) return;
    
    const extension = selectedSoftwareData?.fileExtensions[0] || '.txt';
    const fileName = `six_sigma_analysis_${analysisType}${extension}`;
    const blob = new Blob([preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Statistical Software Integrations</h1>
        <p>Export your Six Sigma analyses to popular statistical software</p>
      </header>

      <div className={styles.softwareGrid}>
        {SOFTWARE_OPTIONS.map(software => (
          <button
            key={software.id}
            className={`${styles.softwareCard} ${selectedSoftware === software.id ? styles.selected : ''}`}
            onClick={() => handleSoftwareChange(software.id)}
          >
            <span className={styles.softwareIcon}>{software.icon}</span>
            <h3>{software.name}</h3>
            <p>{software.description}</p>
            <div className={styles.fileFormats}>
              {software.fileExtensions.join(', ')}
            </div>
          </button>
        ))}
      </div>

      {selectedSoftwareData && (
        <div className={styles.configSection}>
          <h2>Export Configuration</h2>
          
          <div className={styles.capabilities}>
            <h3>Capabilities</h3>
            <div className={styles.capabilityGrid}>
              {selectedSoftwareData.capabilities.map((cap, idx) => (
                <div key={idx} className={`${styles.capability} ${cap.supported ? styles.supported : styles.unsupported}`}>
                  <span className={styles.capabilityIcon}>{cap.supported ? '✓' : '✗'}</span>
                  <span>{cap.feature}</span>
                  {cap.notes && <small>{cap.notes}</small>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.options}>
            <h3>Export Options</h3>
            
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={config.includeCharts}
                onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
              />
              <span>Include Charts/Graphs</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={config.includeFormulas}
                onChange={(e) => setConfig({ ...config, includeFormulas: e.target.checked })}
              />
              <span>Include Formulas/Equations</span>
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={config.includeMacros}
                onChange={(e) => setConfig({ ...config, includeMacros: e.target.checked })}
              />
              <span>Include Macros/Scripts</span>
            </label>

            <div className={styles.selectGroup}>
              <label>Data Format</label>
              <select
                value={config.dataFormat}
                onChange={(e) => setConfig({ ...config, dataFormat: e.target.value as ExportConfig['dataFormat'] })}
              >
                <option value="raw">Raw Data Only</option>
                <option value="summary">Summary Statistics</option>
                <option value="analysis">Full Analysis</option>
              </select>
            </div>
          </div>

          <button 
            className={styles.generateButton}
            onClick={generateExport}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Export'}
          </button>
        </div>
      )}

      {preview && (
        <div className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h3>Export Preview</h3>
            <button onClick={downloadFile} className={styles.downloadButton}>
              Download File
            </button>
          </div>
          <pre className={styles.preview}>{preview}</pre>
        </div>
      )}
    </div>
  );
};
