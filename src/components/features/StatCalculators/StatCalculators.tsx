/**
 * Statistical Calculators Component
 * Interactive tools for Cpk, DPMO, Sample Size, Control Charts
 */

import { useState, useMemo } from 'react';
import './StatCalculators.css';

type CalculatorType = 'cpk' | 'dpmo' | 'sampleSize' | 'controlChart';

interface CpkInputs {
    mean: number;
    stdDev: number;
    lsl: number;
    usl: number;
}

interface DpmoInputs {
    defects: number;
    units: number;
    opportunitiesPerUnit: number;
}

interface SampleSizeInputs {
    confidenceLevel: number;
    marginOfError: number;
    populationSize: number;
    estimatedProportion: number;
}

interface ControlChartInputs {
    data: string;
    chartType: 'xbar' | 'r' | 'p';
}

export function StatCalculators() {
    const [activeCalc, setActiveCalc] = useState<CalculatorType>('cpk');

    // Cpk Calculator State
    const [cpkInputs, setCpkInputs] = useState<CpkInputs>({
        mean: 100,
        stdDev: 2,
        lsl: 90,
        usl: 110
    });

    // DPMO Calculator State
    const [dpmoInputs, setDpmoInputs] = useState<DpmoInputs>({
        defects: 5,
        units: 1000,
        opportunitiesPerUnit: 10
    });

    // Sample Size Calculator State
    const [sampleSizeInputs, setSampleSizeInputs] = useState<SampleSizeInputs>({
        confidenceLevel: 95,
        marginOfError: 5,
        populationSize: 10000,
        estimatedProportion: 50
    });

    // Control Chart Calculator State
    const [controlChartInputs, setControlChartInputs] = useState<ControlChartInputs>({
        data: '25.1, 24.8, 25.3, 24.9, 25.2, 25.0, 24.7, 25.1, 25.4, 24.8',
        chartType: 'xbar'
    });

    // Cpk Calculations
    const cpkResults = useMemo(() => {
        const { mean, stdDev, lsl, usl } = cpkInputs;
        if (stdDev <= 0) return null;

        const cpu = (usl - mean) / (3 * stdDev);
        const cpl = (mean - lsl) / (3 * stdDev);
        const cpk = Math.min(cpu, cpl);
        const cp = (usl - lsl) / (6 * stdDev);

        // Sigma level approximation
        const sigmaLevel = cpk * 3;

        // Defect rate (one-sided)
        const defectRate = 0.5 * (1 + erf(-sigmaLevel / Math.sqrt(2)));
        const ppm = defectRate * 1000000;

        return { cpu, cpl, cpk, cp, sigmaLevel, ppm };
    }, [cpkInputs]);

    // DPMO Calculations
    const dpmoResults = useMemo(() => {
        const { defects, units, opportunitiesPerUnit } = dpmoInputs;
        if (units <= 0 || opportunitiesPerUnit <= 0) return null;

        const totalOpportunities = units * opportunitiesPerUnit;
        const dpmo = (defects / totalOpportunities) * 1000000;

        // Sigma level from DPMO
        let sigmaLevel = 0;
        if (dpmo > 0) {
            // Approximate sigma level
            sigmaLevel = 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));
        } else if (dpmo === 0) {
            sigmaLevel = 6;
        }

        // Yield
        const yieldPercent = ((totalOpportunities - defects) / totalOpportunities) * 100;

        return { dpmo, sigmaLevel, yieldPercent, totalOpportunities };
    }, [dpmoInputs]);

    // Sample Size Calculations
    const sampleSizeResults = useMemo(() => {
        const { confidenceLevel, marginOfError, populationSize, estimatedProportion } = sampleSizeInputs;

        // Z-score for confidence level
        const zScores: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 };
        const z = zScores[confidenceLevel] || 1.96;

        const p = estimatedProportion / 100;
        const e = marginOfError / 100;

        // Sample size for infinite population
        const n0 = (z * z * p * (1 - p)) / (e * e);

        // Adjusted for finite population
        const n = n0 / (1 + (n0 - 1) / populationSize);

        return {
            sampleSize: Math.ceil(n),
            infiniteSampleSize: Math.ceil(n0),
            zScore: z
        };
    }, [sampleSizeInputs]);

    // Control Chart Calculations
    const controlChartResults = useMemo(() => {
        try {
            const values = controlChartInputs.data
                .split(/[,\s]+/)
                .map(v => parseFloat(v.trim()))
                .filter(v => !isNaN(v));

            if (values.length < 2) return null;

            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const range = Math.max(...values) - Math.min(...values);

            // Estimate std dev from range (using d2 factor for n≈10)
            const d2 = 3.078;
            const stdDev = range / d2;

            // X-bar chart limits
            const a2 = 0.308; // For n=10
            const ucl = mean + a2 * range;
            const lcl = mean - a2 * range;

            // Identify out-of-control points
            const outOfControl = values.map((v, i) => ({
                index: i + 1,
                value: v,
                isOutOfControl: v > ucl || v < lcl
            })).filter(p => p.isOutOfControl);

            return {
                values,
                mean,
                range,
                stdDev,
                ucl,
                lcl,
                outOfControl
            };
        } catch {
            return null;
        }
    }, [controlChartInputs]);

    // Error function approximation for PPM calculation
    function erf(x: number): number {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    return (
        <div className="stat-calculators">
            <header className="calculators-header">
                <h2>📊 Statistical Calculators</h2>
                <p>Interactive tools for process capability and quality analysis</p>
            </header>

            {/* Calculator Tabs */}
            <div className="calculator-tabs">
                <button
                    className={`tab ${activeCalc === 'cpk' ? 'active' : ''}`}
                    onClick={() => setActiveCalc('cpk')}
                >
                    Cpk Calculator
                </button>
                <button
                    className={`tab ${activeCalc === 'dpmo' ? 'active' : ''}`}
                    onClick={() => setActiveCalc('dpmo')}
                >
                    DPMO / Sigma
                </button>
                <button
                    className={`tab ${activeCalc === 'sampleSize' ? 'active' : ''}`}
                    onClick={() => setActiveCalc('sampleSize')}
                >
                    Sample Size
                </button>
                <button
                    className={`tab ${activeCalc === 'controlChart' ? 'active' : ''}`}
                    onClick={() => setActiveCalc('controlChart')}
                >
                    Control Chart
                </button>
            </div>

            <div className="calculator-content">
                {/* Cpk Calculator */}
                {activeCalc === 'cpk' && (
                    <div className="calculator-panel">
                        <h3>Process Capability (Cpk) Calculator</h3>
                        <div className="calculator-grid">
                            <div className="input-group">
                                <label>Process Mean (μ)</label>
                                <input
                                    type="number"
                                    value={cpkInputs.mean}
                                    onChange={e => setCpkInputs(prev => ({ ...prev, mean: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Standard Deviation (σ)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={cpkInputs.stdDev}
                                    onChange={e => setCpkInputs(prev => ({ ...prev, stdDev: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Lower Spec Limit (LSL)</label>
                                <input
                                    type="number"
                                    value={cpkInputs.lsl}
                                    onChange={e => setCpkInputs(prev => ({ ...prev, lsl: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Upper Spec Limit (USL)</label>
                                <input
                                    type="number"
                                    value={cpkInputs.usl}
                                    onChange={e => setCpkInputs(prev => ({ ...prev, usl: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        {cpkResults && (
                            <div className="results-panel">
                                <h4>Results</h4>
                                <div className="results-grid">
                                    <div className="result-item">
                                        <span className="result-label">Cpk</span>
                                        <span className="result-value">{cpkResults.cpk.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Cp</span>
                                        <span className="result-value">{cpkResults.cp.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">CPL</span>
                                        <span className="result-value">{cpkResults.cpl.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">CPU</span>
                                        <span className="result-value">{cpkResults.cpu.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item highlight">
                                        <span className="result-label">Sigma Level</span>
                                        <span className="result-value">{cpkResults.sigmaLevel.toFixed(2)}σ</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">PPM (est.)</span>
                                        <span className="result-value">{cpkResults.ppm.toFixed(0)}</span>
                                    </div>
                                </div>
                                <div className={`capability-rating ${cpkResults.cpk >= 1.33 ? 'good' : cpkResults.cpk >= 1 ? 'acceptable' : 'poor'}`}>
                                    {cpkResults.cpk >= 1.33 ? '✓ Capable (Cpk ≥ 1.33)' :
                                        cpkResults.cpk >= 1 ? '⚠ Marginally Capable (Cpk 1.0-1.33)' :
                                            '✗ Not Capable (Cpk < 1.0)'}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* DPMO Calculator */}
                {activeCalc === 'dpmo' && (
                    <div className="calculator-panel">
                        <h3>DPMO & Sigma Level Calculator</h3>
                        <div className="calculator-grid">
                            <div className="input-group">
                                <label>Number of Defects</label>
                                <input
                                    type="number"
                                    value={dpmoInputs.defects}
                                    onChange={e => setDpmoInputs(prev => ({ ...prev, defects: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Number of Units</label>
                                <input
                                    type="number"
                                    value={dpmoInputs.units}
                                    onChange={e => setDpmoInputs(prev => ({ ...prev, units: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Opportunities per Unit</label>
                                <input
                                    type="number"
                                    value={dpmoInputs.opportunitiesPerUnit}
                                    onChange={e => setDpmoInputs(prev => ({ ...prev, opportunitiesPerUnit: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        {dpmoResults && (
                            <div className="results-panel">
                                <h4>Results</h4>
                                <div className="results-grid">
                                    <div className="result-item highlight">
                                        <span className="result-label">DPMO</span>
                                        <span className="result-value">{dpmoResults.dpmo.toFixed(2)}</span>
                                    </div>
                                    <div className="result-item highlight">
                                        <span className="result-label">Sigma Level</span>
                                        <span className="result-value">{dpmoResults.sigmaLevel.toFixed(2)}σ</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Yield</span>
                                        <span className="result-value">{dpmoResults.yieldPercent.toFixed(2)}%</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Total Opportunities</span>
                                        <span className="result-value">{dpmoResults.totalOpportunities.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Sample Size Calculator */}
                {activeCalc === 'sampleSize' && (
                    <div className="calculator-panel">
                        <h3>Sample Size Calculator</h3>
                        <div className="calculator-grid">
                            <div className="input-group">
                                <label>Confidence Level (%)</label>
                                <select
                                    value={sampleSizeInputs.confidenceLevel}
                                    onChange={e => setSampleSizeInputs(prev => ({ ...prev, confidenceLevel: parseFloat(e.target.value) }))}
                                >
                                    <option value={90}>90%</option>
                                    <option value={95}>95%</option>
                                    <option value={99}>99%</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Margin of Error (%)</label>
                                <input
                                    type="number"
                                    value={sampleSizeInputs.marginOfError}
                                    onChange={e => setSampleSizeInputs(prev => ({ ...prev, marginOfError: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Population Size</label>
                                <input
                                    type="number"
                                    value={sampleSizeInputs.populationSize}
                                    onChange={e => setSampleSizeInputs(prev => ({ ...prev, populationSize: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="input-group">
                                <label>Estimated Proportion (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={sampleSizeInputs.estimatedProportion}
                                    onChange={e => setSampleSizeInputs(prev => ({ ...prev, estimatedProportion: parseFloat(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        {sampleSizeResults && (
                            <div className="results-panel">
                                <h4>Results</h4>
                                <div className="results-grid">
                                    <div className="result-item highlight">
                                        <span className="result-label">Required Sample Size</span>
                                        <span className="result-value">{sampleSizeResults.sampleSize}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Infinite Population</span>
                                        <span className="result-value">{sampleSizeResults.infiniteSampleSize}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Z-Score</span>
                                        <span className="result-value">{sampleSizeResults.zScore}</span>
                                    </div>
                                </div>
                                <p className="result-note">
                                    Use this sample size to achieve {sampleSizeInputs.confidenceLevel}% confidence with ±{sampleSizeInputs.marginOfError}% margin of error.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Control Chart Calculator */}
                {activeCalc === 'controlChart' && (
                    <div className="calculator-panel">
                        <h3>Control Chart Analyzer</h3>
                        <div className="input-group full-width">
                            <label>Enter data points (comma or space separated)</label>
                            <textarea
                                value={controlChartInputs.data}
                                onChange={e => setControlChartInputs(prev => ({ ...prev, data: e.target.value }))}
                                placeholder="25.1, 24.8, 25.3, 24.9..."
                                rows={3}
                            />
                        </div>

                        {controlChartResults && (
                            <div className="results-panel">
                                <h4>Control Chart Statistics</h4>
                                <div className="results-grid">
                                    <div className="result-item">
                                        <span className="result-label">Mean (X̄)</span>
                                        <span className="result-value">{controlChartResults.mean.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Range (R)</span>
                                        <span className="result-value">{controlChartResults.range.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">UCL</span>
                                        <span className="result-value">{controlChartResults.ucl.toFixed(3)}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">LCL</span>
                                        <span className="result-value">{controlChartResults.lcl.toFixed(3)}</span>
                                    </div>
                                </div>

                                {controlChartResults.outOfControl.length > 0 ? (
                                    <div className="warning-panel">
                                        <h5>⚠️ Out of Control Points Detected</h5>
                                        <ul>
                                            {controlChartResults.outOfControl.map(p => (
                                                <li key={p.index}>Point {p.index}: {p.value.toFixed(2)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="success-panel">
                                        ✓ All points within control limits
                                    </div>
                                )}

                                {/* Simple Chart Visualization */}
                                <div className="chart-visualization">
                                    <div className="chart-line ucl" style={{ '--pos': '10%' } as React.CSSProperties}>
                                        <span className="label">UCL ({controlChartResults.ucl.toFixed(2)})</span>
                                    </div>
                                    <div className="chart-line mean" style={{ '--pos': '50%' } as React.CSSProperties}>
                                        <span className="label">Mean ({controlChartResults.mean.toFixed(2)})</span>
                                    </div>
                                    <div className="chart-line lcl" style={{ '--pos': '90%' } as React.CSSProperties}>
                                        <span className="label">LCL ({controlChartResults.lcl.toFixed(2)})</span>
                                    </div>
                                    <div className="data-points">
                                        {controlChartResults.values.map((v, i) => {
                                            const range = controlChartResults.ucl - controlChartResults.lcl;
                                            const pos = range > 0 ? ((v - controlChartResults.lcl) / range) * 80 + 10 : 50;
                                            const clampedPos = Math.max(5, Math.min(95, pos));
                                            return (
                                                <div
                                                    key={i}
                                                    className={`data-point ${v > controlChartResults.ucl || v < controlChartResults.lcl ? 'ooc' : ''}`}
                                                    style={{ '--pos': `${clampedPos}%` } as React.CSSProperties}
                                                    title={`Point ${i + 1}: ${v.toFixed(2)}`}
                                                >
                                                    {i + 1}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatCalculators;