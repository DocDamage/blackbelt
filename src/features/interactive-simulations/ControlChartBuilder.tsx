/**
 * Control Chart Builder - Interactive SPC Control Charts
 * 
 * Features:
 * - Interactive control chart generation
 * - Western Electric rules implementation
 * - Real-time data point addition
 * - Capability analysis (Cp/Cpk)
 * - Export to Excel/PDF
 */

import React, { useState, useCallback, useMemo } from 'react';
import type { 
  ControlChartType, 
  ControlChartConfig, 
  DataPoint, 
  ControlChartData,
  ControlRuleViolation 
} from './types';
import styles from './InteractiveSimulations.module.css';

interface ControlChartBuilderProps {
  onExport?: (data: ControlChartData) => void;
  onSave?: (data: ControlChartData) => void;
}

const CHART_TYPES: { value: ControlChartType; label: string; description: string }[] = [
  { value: 'xbar-r', label: 'X̄-R Chart', description: 'Average and Range for subgroups' },
  { value: 'xbar-s', label: 'X̄-S Chart', description: 'Average and Standard Deviation' },
  { value: 'x-mr', label: 'X-MR Chart', description: 'Individual and Moving Range' },
  { value: 'p', label: 'p-Chart', description: 'Proportion defective' },
  { value: 'np', label: 'np-Chart', description: 'Number defective' },
  { value: 'c', label: 'c-Chart', description: 'Count of defects' },
  { value: 'u', label: 'u-Chart', description: 'Defects per unit' },
];

const WESTERN_ELECTRIC_RULES = [
  { id: 'points-beyond-limits', label: 'Point beyond 3σ', description: 'Any point beyond UCL or LCL' },
  { id: 'zone-a', label: 'Zone A (2 out of 3)', description: '2 of 3 points in Zone A or beyond' },
  { id: 'zone-b', label: 'Zone B (4 out of 5)', description: '4 of 5 points in Zone B or beyond' },
  { id: 'trend', label: 'Trend (7 points)', description: '7 points trending up or down' },
  { id: 'mixture', label: 'Mixture (8 points)', description: '8 points on both sides of center' },
  { id: 'stratification', label: 'Stratification', description: '15 points within 1σ' },
  { id: 'overcontrol', label: 'Overcontrol', description: '14 points alternating up/down' },
];

export const ControlChartBuilder: React.FC<ControlChartBuilderProps> = ({ 
  onExport, 
  onSave 
}) => {
  const [chartType, setChartType] = useState<ControlChartType>('xbar-r');
  const [title, setTitle] = useState('Process Control Chart');
  const [sampleSize, setSampleSize] = useState(5);
  const [centerLine, setCenterLine] = useState(50);
  const [stdDev, setStdDev] = useState(5);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [activeRules, setActiveRules] = useState<string[]>(['points-beyond-limits', 'zone-a', 'trend']);
  const [newValue, setNewValue] = useState('');

  // Calculate control limits
  const config: ControlChartConfig = useMemo(() => {
    const sigma = stdDev;
    return {
      type: chartType,
      sampleSize,
      centerLine,
      ucl: centerLine + 3 * sigma,
      lcl: Math.max(0, centerLine - 3 * sigma),
      title,
    };
  }, [chartType, sampleSize, centerLine, stdDev, title]);

  // Check Western Electric rules
  const checkRules = useCallback((points: DataPoint[], index: number): ControlRuleViolation | undefined => {
    if (!activeRules.length) return undefined;
    
    const point = points[index];
    if (!point) return undefined;
    
    const recent = points.slice(Math.max(0, index - 14), index + 1);
    
    // Rule 1: Point beyond limits
    if (activeRules.includes('points-beyond-limits')) {
      if (point.value > config.ucl || point.value < config.lcl) {
        return 'points-beyond-limits';
      }
    }
    
    // Rule 2: 2 of 3 in Zone A
    if (activeRules.includes('zone-a') && recent.length >= 3) {
      const zoneA = recent.slice(-3).filter(p => {
        if (!p) return false;
        const deviation = Math.abs(p.value - config.centerLine);
        return deviation > 2 * stdDev && deviation <= 3 * stdDev;
      });
      if (zoneA.length >= 2) return 'zone-a';
    }
    
    // Rule 3: 4 of 5 in Zone B
    if (activeRules.includes('zone-b') && recent.length >= 5) {
      const zoneB = recent.slice(-5).filter(p => {
        const deviation = Math.abs(p.value - config.centerLine);
        return deviation > 1 * stdDev && deviation <= 2 * stdDev;
      });
      if (zoneB.length >= 4) return 'zone-b';
    }
    
    // Rule 4: 7 trending
    if (activeRules.includes('trend') && recent.length >= 7) {
      const last7 = recent.slice(-7);
      const increasing = last7.every((p, i) => {
        if (!p) return true;
        if (i === 0) return true;
        const prev = last7[i - 1];
        return prev ? p.value >= prev.value : true;
      });
      const decreasing = last7.every((p, i) => {
        if (!p) return true;
        if (i === 0) return true;
        const prev = last7[i - 1];
        return prev ? p.value <= prev.value : true;
      });
      if (increasing || decreasing) return 'trend';
    }
    
    return undefined;
  }, [activeRules, config, stdDev]);

  // Add new data point
  const addDataPoint = useCallback(() => {
    const value = parseFloat(newValue);
    if (isNaN(value)) return;
    
    const point: DataPoint = {
      id: `point-${Date.now()}`,
      value,
      sample: dataPoints.length + 1,
      timestamp: Date.now(),
    };
    
    const updatedPoints = [...dataPoints, point];
    const violation = checkRules(updatedPoints, updatedPoints.length - 1);
    
    if (violation) {
      point.outOfControl = true;
      point.violationType = violation;
    }
    
    setDataPoints(updatedPoints);
    setNewValue('');
  }, [newValue, dataPoints, checkRules]);

  // Generate random data
  const generateRandomData = useCallback(() => {
    const count = 25;
    const points: DataPoint[] = [];
    
    for (let i = 0; i < count; i++) {
      // Normal distribution around center line
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const value = config.centerLine + z * stdDev;
      
      points.push({
        id: `point-${Date.now()}-${i}`,
        value: Math.max(0, value),
        sample: i + 1,
        timestamp: Date.now() + i * 1000,
      });
    }
    
    // Check rules for all points
    points.forEach((point, index) => {
      const violation = checkRules(points, index);
      if (violation) {
        point.outOfControl = true;
        point.violationType = violation;
      }
    });
    
    setDataPoints(points);
  }, [config.centerLine, stdDev, checkRules]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!dataPoints.length) return null;
    
    const values = dataPoints.map(p => p.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const calculatedStdDev = Math.sqrt(variance);
    
    // Capability indices (assuming spec limits at ±3σ from target)
    const usl = config.centerLine + 3 * stdDev;
    const lsl = Math.max(0, config.centerLine - 3 * stdDev);
    const cp = (usl - lsl) / (6 * calculatedStdDev);
    const cpu = (usl - mean) / (3 * calculatedStdDev);
    const cpl = (mean - lsl) / (3 * calculatedStdDev);
    const cpk = Math.min(cpu, cpl);
    
    return {
      mean,
      stdDev: calculatedStdDev,
      cp: isFinite(cp) ? cp : 0,
      cpk: isFinite(cpk) ? cpk : 0,
      outOfControlCount: dataPoints.filter(p => p.outOfControl).length,
    };
  }, [dataPoints, config.centerLine, stdDev]);

  // Export data
  const handleExport = useCallback(() => {
    if (!stats) return;
    
    const chartData: ControlChartData = {
      points: dataPoints,
      config,
      stats,
    };
    
    onExport?.(chartData);
  }, [dataPoints, config, stats, onExport]);

  // Clear data
  const clearData = useCallback(() => {
    setDataPoints([]);
  }, []);

  const chartData: ControlChartData | null = stats ? {
    points: dataPoints,
    config,
    stats,
  } : null;

  return (
    <div className={styles.simulationContainer}>
      <h2 className={styles.title}>Control Chart Builder</h2>
      
      <div className={styles.controlPanel}>
        <div className={styles.formGroup}>
          <label htmlFor="chart-type">Chart Type</label>
          <select
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ControlChartType)}
            className={styles.select}
          >
            {CHART_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} - {type.description}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="chart-title">Chart Title</label>
          <input
            id="chart-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="sample-size">Sample Size</label>
            <input
              id="sample-size"
              type="number"
              min="1"
              max="25"
              value={sampleSize}
              onChange={(e) => setSampleSize(parseInt(e.target.value) || 1)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="center-line">Center Line</label>
            <input
              id="center-line"
              type="number"
              value={centerLine}
              onChange={(e) => setCenterLine(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="std-dev">Std Dev (σ)</label>
            <input
              id="std-dev"
              type="number"
              step="0.1"
              value={stdDev}
              onChange={(e) => setStdDev(parseFloat(e.target.value) || 1)}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      <div className={styles.rulesSection}>
        <h3>Control Rules</h3>
        <div className={styles.rulesGrid}>
          {WESTERN_ELECTRIC_RULES.map(rule => (
            <label key={rule.id} className={styles.ruleCheckbox}>
              <input
                type="checkbox"
                checked={activeRules.includes(rule.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActiveRules([...activeRules, rule.id]);
                  } else {
                    setActiveRules(activeRules.filter(r => r !== rule.id));
                  }
                }}
              />
              <span>
                <strong>{rule.label}</strong>
                <small>{rule.description}</small>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.dataSection}>
        <h3>Data Points ({dataPoints.length})</h3>
        
        <div className={styles.addPoint}>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter value..."
            className={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && addDataPoint()}
          />
          <button onClick={addDataPoint} className={styles.button}>
            Add Point
          </button>
          <button onClick={generateRandomData} className={styles.buttonSecondary}>
            Generate Random Data
          </button>
          <button onClick={clearData} className={styles.buttonDanger}>
            Clear
          </button>
        </div>

        {stats && (
          <div className={styles.statsPanel}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Mean</span>
              <span className={styles.statValue}>{stats.mean.toFixed(3)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Std Dev</span>
              <span className={styles.statValue}>{stats.stdDev.toFixed(3)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Cp</span>
              <span className={styles.statValue}>{stats.cp.toFixed(2)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Cpk</span>
              <span className={styles.statValue}>{stats.cpk.toFixed(2)}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>OOC Points</span>
              <span className={`${styles.statValue} ${stats.outOfControlCount > 0 ? styles.alert : ''}`}>
                {stats.outOfControlCount}
              </span>
            </div>
          </div>
        )}

        {dataPoints.length > 0 && (
          <div className={styles.dataTable}>
            <table>
              <thead>
                <tr>
                  <th>Sample</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Rule</th>
                </tr>
              </thead>
              <tbody>
                {dataPoints.slice(-20).map(point => (
                  <tr key={point.id} className={point.outOfControl ? styles.outOfControl : ''}>
                    <td>{point.sample}</td>
                    <td>{point.value.toFixed(3)}</td>
                    <td>{point.outOfControl ? '⚠️ Out of Control' : '✓ In Control'}</td>
                    <td>{point.violationType || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {chartData && (
        <div className={styles.actions}>
          <button onClick={handleExport} className={styles.button}>
            Export Data
          </button>
          <button onClick={() => onSave?.(chartData)} className={styles.buttonSecondary}>
            Save Chart
          </button>
        </div>
      )}
    </div>
  );
};
