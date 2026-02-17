/**
 * Interactive Process Simulations - Main Component
 * 
 * Combines:
 * - Control Chart Builder
 * - DOE Planner
 * - Process Mapping Tool
 */

import React, { useState } from 'react';
import { ControlChartBuilder } from './ControlChartBuilder';
import { DOEPlanner } from './DOEPlanner';
import { ProcessMappingTool } from './ProcessMappingTool';
import type { ControlChartData, DOEConfig, DOEExperiment, ProcessMap } from './types';
import styles from './InteractiveSimulations.module.css';

type SimulationTab = 'control-chart' | 'doe' | 'process-map';

interface InteractiveSimulationsProps {
  defaultTab?: SimulationTab;
  onSaveControlChart?: (data: ControlChartData) => void;
  onSaveDOE?: (config: DOEConfig, experiments: DOEExperiment[]) => void;
  onSaveProcessMap?: (map: ProcessMap) => void;
}

const TABS: { id: SimulationTab; label: string; description: string }[] = [
  { 
    id: 'control-chart', 
    label: 'Control Charts', 
    description: 'Build SPC control charts with Western Electric rules' 
  },
  { 
    id: 'doe', 
    label: 'DOE Planner', 
    description: 'Design and analyze experiments' 
  },
  { 
    id: 'process-map', 
    label: 'Process Map', 
    description: 'Create value stream maps' 
  },
];

export const InteractiveSimulations: React.FC<InteractiveSimulationsProps> = ({
  defaultTab = 'control-chart',
  onSaveControlChart,
  onSaveDOE,
  onSaveProcessMap,
}) => {
  const [activeTab, setActiveTab] = useState<SimulationTab>(defaultTab);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Interactive Process Simulations</h1>
        <p>Practice Six Sigma tools with interactive simulations</p>
      </header>

      <nav className={styles.tabNav} role="tablist" aria-label="Simulation types">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
            <span className={styles.tabDescription}>{tab.description}</span>
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className={styles.tabPanel}
        >
          {activeTab === 'control-chart' && (
            <ControlChartBuilder 
              onSave={onSaveControlChart}
              onExport={(data) => {
                // Export to Excel
                console.log('Exporting control chart:', data);
              }}
            />
          )}
          
          {activeTab === 'doe' && (
            <DOEPlanner 
              onExport={onSaveDOE}
              onAnalyze={(analysis) => {
                console.log('DOE Analysis:', analysis);
              }}
            />
          )}
          
          {activeTab === 'process-map' && (
            <ProcessMappingTool 
              onSave={onSaveProcessMap}
              onExport={(map) => {
                console.log('Exporting process map:', map);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};
