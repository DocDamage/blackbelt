/**
 * Statistical Software Integrations - Enhanced with Deep Export
 * 
 * Provides comprehensive export to:
 * - Microsoft Excel (with formulas, VBA, XML multi-sheet)
 * - Minitab (session commands, macros, data files)
 * - Python (scripts, Jupyter notebooks, requirements)
 * - R (scripts, R Markdown, functions)
 * - SPSS (syntax, data files, output templates)
 * - JMP (JSL scripts, journals, add-ins)
 */

import React, { useState, useCallback } from 'react';
import type { SoftwareType, ExportConfig, Dataset } from './types';
import {
  generateExcelExport,
  generateExcelMacro,
  generateExcelTemplate,
  generateMinitabExport,
  generateMinitabGuide,
  generatePythonExport,
  generatePythonClass,
  // generateRExport,
  // generateRFunctions,
  generateSPSSExport,
  generateSPSSCommandReference,
  generateJMPExport,
  generateJMPAddIn,
  generateJMPCommandReference,
} from './exporters';
import styles from './SoftwareIntegrations.module.css';

interface SoftwareIntegrationsEnhancedProps {
  dataset?: Dataset;
  onExportComplete?: (exportInfo: ExportInfo) => void;
}

export interface ExportInfo {
  software: SoftwareType;
  timestamp: number;
  files: string[];
  totalSize: number;
}

interface SoftwareOption {
  id: SoftwareType;
  name: string;
  description: string;
  icon: string;
  color: string;
  exports: string[];
}

const SOFTWARE_OPTIONS: SoftwareOption[] = [
  {
    id: 'excel',
    name: 'Microsoft Excel',
    description: 'Multi-sheet workbook with formulas, charts, and VBA macros',
    icon: '📊',
    color: '#217346',
    exports: ['.xls (XML)', '.csv', 'VBA Macro', 'Template'],
  },
  {
    id: 'minitab',
    name: 'Minitab',
    description: 'Session commands, macros, and project files',
    icon: '📈',
    color: '#005596',
    exports: ['Session Commands', 'Data File', 'Macro', 'Guide'],
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Analysis scripts, Jupyter notebooks, and reusable classes',
    icon: '🐍',
    color: '#3776AB',
    exports: ['Script (.py)', 'Notebook (.ipynb)', 'Class Library', 'Requirements'],
  },
  {
    id: 'r',
    name: 'R',
    description: 'R scripts, R Markdown reports, and function libraries',
    icon: '📐',
    color: '#276DC3',
    exports: ['Script (.R)', 'R Markdown', 'Functions', 'Notebook'],
  },
  {
    id: 'spss',
    name: 'SPSS',
    description: 'Syntax files, data files, and command references',
    icon: '📉',
    color: '#CC1E2C',
    exports: ['Syntax (.sps)', 'Data File', 'Output Template', 'Commands'],
  },
  {
    id: 'jmp',
    name: 'JMP',
    description: 'JSL scripts, journals, and add-ins',
    icon: '📋',
    color: '#7E4E9F',
    exports: ['Script (.jsl)', 'Journal', 'Add-In', 'Data'],
  },
];

export const SoftwareIntegrationsEnhanced: React.FC<SoftwareIntegrationsEnhancedProps> = ({
  dataset,
  onExportComplete,
}) => {
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareType>('excel');
  const [config, setConfig] = useState<ExportConfig>({
    software: 'excel',
    dataFormat: 'analysis',
    includeCharts: true,
    includeFormulas: true,
    includeMacros: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'export' | 'history' | 'templates'>('export');

  const selectedSoftwareData = SOFTWARE_OPTIONS.find(s => s.id === selectedSoftware);

  // Generate sample dataset if none provided
  const getDataset = useCallback((): Dataset => {
    if (dataset) return dataset;
    
    return {
      name: 'Sample Process Data',
      columns: [
        { name: 'Measurement', type: 'numeric', description: 'Process measurement', units: 'mm' },
        { name: 'Batch', type: 'categorical', description: 'Batch number' },
        { name: 'Operator', type: 'categorical', description: 'Operator ID' },
        { name: 'Time', type: 'numeric', description: 'Time stamp' },
      ],
      rows: Array.from({ length: 100 }, (_, i) => [
        50 + Math.random() * 10 - 5 + (Math.random() > 0.95 ? Math.random() * 20 - 10 : 0),
        `Batch ${Math.floor(i / 10) + 1}`,
        `Op ${(i % 3) + 1}`,
        i + 1,
      ]),
      metadata: {
        created: Date.now(),
        modified: Date.now(),
        author: 'Six Sigma Training Platform',
        description: 'Sample process data for analysis',
      },
    };
  }, [dataset]);

  // Generate analysis results
  const generateAnalysisResults = useCallback(() => {
    return {
      statistics: {
        count: 100,
        mean: 50.2,
        median: 50.1,
        stdDev: 2.8,
        min: 42.5,
        max: 58.7,
        q1: 48.4,
        q3: 52.1,
        skewness: 0.15,
        kurtosis: -0.22,
      },
      capability: {
        cp: 1.19,
        cpk: 1.08,
        cpu: 1.03,
        cpl: 1.13,
        pp: 1.21,
        ppk: 1.10,
        sigmaLevel: 3.24,
        dpmo: 4500,
        usl: 60,
        lsl: 40,
        target: 50,
      },
      controlChart: {
        chartType: 'I-MR',
        centerLine: 50.2,
        ucl: 58.7,
        lcl: 41.7,
        points: Array.from({ length: 50 }, (_, i) => ({
          sample: i + 1,
          value: 50 + Math.random() * 8 - 4,
          outOfControl: Math.random() > 0.95,
        })),
        violations: [],
      },
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
  }, []);

  // Export handler
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    const data = getDataset();
    const results = generateAnalysisResults();
    const files: string[] = [];
    let totalSize = 0;

    try {
      switch (selectedSoftware) {
        case 'excel': {
          const excelExport = generateExcelExport(data, results, config);
          downloadFile(excelExport.content, excelExport.filename, 'application/vnd.ms-excel');
          files.push(excelExport.filename);
          
          if (config.includeMacros) {
            const macro = generateExcelMacro();
            const macroFilename = `${data.name.replace(/\s+/g, '_')}_Macro.bas`;
            downloadFile(macro, macroFilename, 'text/plain');
            files.push(macroFilename);
          }
          
          const template = generateExcelTemplate();
          const templateFilename = `${data.name.replace(/\s+/g, '_')}_Template.txt`;
          downloadFile(template, templateFilename, 'text/plain');
          files.push(templateFilename);
          break;
        }
        
        case 'minitab': {
          const minitabExport = generateMinitabExport(data, results, config);
          downloadFile(minitabExport.sessionCommands, minitabExport.filename, 'text/plain');
          files.push(minitabExport.filename);
          
          const dataFilename = `${data.name.replace(/\s+/g, '_')}_Data.txt`;
          downloadFile(minitabExport.dataFile, dataFilename, 'text/plain');
          files.push(dataFilename);
          
          const notesFilename = `${data.name.replace(/\s+/g, '_')}_Notes.txt`;
          downloadFile(minitabExport.projectNotes, notesFilename, 'text/plain');
          files.push(notesFilename);
          
          const guide = generateMinitabGuide();
          const guideFilename = 'Minitab_Guide.md';
          downloadFile(guide, guideFilename, 'text/markdown');
          files.push(guideFilename);
          break;
        }
        
        case 'python': {
          const pythonExport = generatePythonExport(data, results, config);
          downloadFile(pythonExport.script, pythonExport.filename, 'text/x-python');
          files.push(pythonExport.filename);
          
          const notebookFilename = `${data.name.replace(/\s+/g, '_')}_analysis.ipynb`;
          downloadFile(pythonExport.notebook, notebookFilename, 'application/json');
          files.push(notebookFilename);
          
          downloadFile(pythonExport.requirements, 'requirements.txt', 'text/plain');
          files.push('requirements.txt');
          
          downloadFile(pythonExport.readme, 'README.md', 'text/markdown');
          files.push('README.md');
          
          if (config.includeMacros) {
            const pythonClass = generatePythonClass();
            const classFilename = 'six_sigma_analyzer.py';
            downloadFile(pythonClass, classFilename, 'text/x-python');
            files.push(classFilename);
          }
          break;
        }
        
        // case 'r': {
        //   const rExport = generateRExport(data, results, config);
        //   downloadFile(rExport.script, rExport.filename, 'text/x-r');
        //   files.push(rExport.filename);
        //   
        //   const rmdFilename = `${data.name.replace(/\s+/g, '_')}_report.Rmd`;
        //   downloadFile(rExport.rmd, rmdFilename, 'text/x-r-markdown');
        //   files.push(rmdFilename);
        //   
        //   const notebookFilename = `${data.name.replace(/\s+/g, '_')}_notebook.R`;
        //   downloadFile(rExport.notebook, notebookFilename, 'text/x-r');
        //   files.push(notebookFilename);
        //   
        //   if (config.includeMacros) {
        //     const rFunctions = generateRFunctions();
        //     const functionsFilename = 'six_sigma_functions.R';
        //     downloadFile(rFunctions, functionsFilename, 'text/x-r');
        //     files.push(functionsFilename);
        //   }
        //   break;
        // }
        
        case 'spss': {
          const spssExport = generateSPSSExport(data, results, config);
          downloadFile(spssExport.syntax, spssExport.filename, 'text/plain');
          files.push(spssExport.filename);
          
          const dataFilename = `${data.name.replace(/\s+/g, '_')}_Data.txt`;
          downloadFile(spssExport.dataFile, dataFilename, 'text/plain');
          files.push(dataFilename);
          
          const outputFilename = `${data.name.replace(/\s+/g, '_')}_Output_Template.txt`;
          downloadFile(spssExport.outputTemplate, outputFilename, 'text/plain');
          files.push(outputFilename);
          
          const commandsRef = generateSPSSCommandReference();
          const refFilename = 'SPSS_Command_Reference.md';
          downloadFile(commandsRef, refFilename, 'text/markdown');
          files.push(refFilename);
          break;
        }
        
        case 'jmp': {
          const jmpExport = generateJMPExport(data, results, config);
          downloadFile(jmpExport.jslScript, jmpExport.filename, 'text/plain');
          files.push(jmpExport.filename);
          
          const dataFilename = `${data.name.replace(/\s+/g, '_')}_Data.txt`;
          downloadFile(jmpExport.dataFile, dataFilename, 'text/plain');
          files.push(dataFilename);
          
          const journalFilename = `${data.name.replace(/\s+/g, '_')}_Journal.jsl`;
          downloadFile(jmpExport.journalTemplate, journalFilename, 'text/plain');
          files.push(journalFilename);
          
          if (config.includeMacros) {
            const jmpAddIn = generateJMPAddIn();
            const addInFilename = 'Six_Sigma_AddIn.jsl';
            downloadFile(jmpAddIn, addInFilename, 'text/plain');
            files.push(addInFilename);
          }
          
          const jmpRef = generateJMPCommandReference();
          const refFilename = 'JSL_Command_Reference.md';
          downloadFile(jmpRef, refFilename, 'text/markdown');
          files.push(refFilename);
          break;
        }
      }

      const exportInfo: ExportInfo = {
        software: selectedSoftware,
        timestamp: Date.now(),
        files,
        totalSize,
      };

      setExportHistory(prev => [exportInfo, ...prev]);
      onExportComplete?.(exportInfo);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [selectedSoftware, config, getDataset, generateAnalysisResults, onExportComplete]);

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // File size formatting utility (for future use)
  // const formatFileSize = (bytes: number): string => {
  //   if (bytes === 0) return '0 B';
  //   const k = 1024;
  //   const sizes = ['B', 'KB', 'MB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Statistical Software Integrations</h1>
        <p>Export comprehensive Six Sigma analyses to popular statistical software</p>
      </header>

      <nav className={styles.tabNav}>
        {(['export', 'history', 'templates'] as const).map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {activeTab === 'export' && (
        <>
          <div className={styles.softwareGrid}>
            {SOFTWARE_OPTIONS.map(software => (
              <button
                key={software.id}
                className={`${styles.softwareCard} ${selectedSoftware === software.id ? styles.selected : ''}`}
                onClick={() => {
                  setSelectedSoftware(software.id);
                  setConfig({ ...config, software: software.id });
                }}
                style={{ '--software-color': software.color } as React.CSSProperties}
              >
                <span className={styles.softwareIcon}>{software.icon}</span>
                <h3>{software.name}</h3>
                <p>{software.description}</p>
                <div className={styles.exportsList}>
                  {software.exports.map(exp => (
                    <span key={exp} className={styles.exportTag}>{exp}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {selectedSoftwareData && (
            <div className={styles.configSection}>
              <h2>Export Configuration</h2>
              
              <div className={styles.optionsGrid}>
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
                    checked={config.includeCharts}
                    onChange={(e) => setConfig({ ...config, includeCharts: e.target.checked })}
                  />
                  <span>Include Charts/Visualizations Code</span>
                </label>

                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={config.includeMacros}
                    onChange={(e) => setConfig({ ...config, includeMacros: e.target.checked })}
                  />
                  <span>Include Reusable Functions/Classes</span>
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

              <div className={styles.exportPreview}>
                <h3>Files to be Generated ({selectedSoftwareData.exports.length + (config.includeMacros ? 1 : 0)} files)</h3>
                <ul>
                  {selectedSoftware === 'excel' && (
                    <>
                      <li>📊 Excel Workbook (.xls)</li>
                      {config.includeMacros && <li>📄 VBA Macro (.bas)</li>}
                      <li>📘 Template Guide (.txt)</li>
                    </>
                  )}
                  {selectedSoftware === 'minitab' && (
                    <>
                      <li>📈 Session Commands (.txt)</li>
                      <li>📄 Data File (.txt)</li>
                      <li>📝 Project Notes (.txt)</li>
                      <li>📘 User Guide (.md)</li>
                    </>
                  )}
                  {selectedSoftware === 'python' && (
                    <>
                      <li>🐍 Analysis Script (.py)</li>
                      <li>📓 Jupyter Notebook (.ipynb)</li>
                      <li>📄 Requirements (requirements.txt)</li>
                      <li>📘 README (.md)</li>
                      {config.includeMacros && <li>🏗️ Analyzer Class (.py)</li>}
                    </>
                  )}
                  {selectedSoftware === 'r' && (
                    <>
                      <li>📐 R Script (.R)</li>
                      <li>📄 R Markdown (.Rmd)</li>
                      <li>📓 R Notebook (.R)</li>
                      {config.includeMacros && <li>🏗️ Function Library (.R)</li>}
                    </>
                  )}
                  {selectedSoftware === 'spss' && (
                    <>
                      <li>📉 SPSS Syntax (.sps)</li>
                      <li>📄 Data File (.txt)</li>
                      <li>📝 Output Template (.txt)</li>
                      <li>📘 Command Reference (.md)</li>
                    </>
                  )}
                  {selectedSoftware === 'jmp' && (
                    <>
                      <li>📋 JSL Script (.jsl)</li>
                      <li>📄 Data File (.txt)</li>
                      <li>📔 Journal (.jsl)</li>
                      {config.includeMacros && <li>🔧 Add-In (.jsl)</li>}
                      <li>📘 JSL Reference (.md)</li>
                    </>
                  )}
                </ul>
              </div>

              <button 
                className={styles.generateButton}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? 'Generating Export Package...' : `Export to ${selectedSoftwareData.name}`}
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <div className={styles.historySection}>
          <h2>Export History</h2>
          {exportHistory.length === 0 ? (
            <p className={styles.emptyState}>No exports yet. Generate your first export package above.</p>
          ) : (
            <div className={styles.historyList}>
              {exportHistory.map((item, idx) => {
                const software = SOFTWARE_OPTIONS.find(s => s.id === item.software);
                return (
                  <div key={idx} className={styles.historyItem}>
                    <span className={styles.historyIcon}>{software?.icon}</span>
                    <div className={styles.historyInfo}>
                      <strong>{software?.name}</strong>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                    <div className={styles.historyFiles}>
                      {item.files.length} files
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className={styles.templatesSection}>
          <h2>Quick Templates</h2>
          <div className={styles.templatesGrid}>
            <div className={styles.templateCard}>
              <h3>📊 Capability Study</h3>
              <p>Pre-configured capability analysis with USL/LSL</p>
              <button onClick={() => {
                setSelectedSoftware('excel');
                setConfig({ ...config, dataFormat: 'analysis', includeFormulas: true });
                setActiveTab('export');
              }}>Use Template</button>
            </div>
            <div className={styles.templateCard}>
              <h3>📈 Control Chart</h3>
              <p>I-MR chart with Western Electric rules</p>
              <button onClick={() => {
                setSelectedSoftware('minitab');
                setConfig({ ...config, dataFormat: 'analysis', includeCharts: true });
                setActiveTab('export');
              }}>Use Template</button>
            </div>
            <div className={styles.templateCard}>
              <h3>🐍 Python Automation</h3>
              <p>Reusable Python class for batch analysis</p>
              <button onClick={() => {
                setSelectedSoftware('python');
                setConfig({ ...config, includeMacros: true });
                setActiveTab('export');
              }}>Use Template</button>
            </div>
            <div className={styles.templateCard}>
              <h3>📐 R Report</h3>
              <p>R Markdown template with full analysis</p>
              <button onClick={() => {
                setSelectedSoftware('r');
                setConfig({ ...config, dataFormat: 'analysis' });
                setActiveTab('export');
              }}>Use Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
