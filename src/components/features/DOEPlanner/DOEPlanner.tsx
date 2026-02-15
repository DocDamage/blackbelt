/**
 * DOE (Design of Experiments) Planner
 * Helps users plan factorial experiments
 */

import { useState, useMemo } from 'react';
import './DOEPlanner.css';

interface Factor {
    id: string;
    name: string;
    lowLevel: string;
    highLevel: string;
}

interface Run {
    runNumber: number;
    factors: Record<string, number>;
    isCenterPoint?: boolean;
}

type DesignType = 'full' | 'fractional';
type ResolutionLevel = 'III' | 'IV' | 'V';

export function DOEPlanner() {
    const [designType, setDesignType] = useState<DesignType>('full');
    const [numFactors, setNumFactors] = useState(3);
    const [resolution, setResolution] = useState<ResolutionLevel>('IV');
    const [factors, setFactors] = useState<Factor[]>([
        { id: 'A', name: 'Temperature', lowLevel: '100', highLevel: '200' },
        { id: 'B', name: 'Pressure', lowLevel: '50', highLevel: '100' },
        { id: 'C', name: 'Time', lowLevel: '10', highLevel: '30' }
    ]);
    const [includeCenterPoints, setIncludeCenterPoints] = useState(true);
    const [numReplicates, setNumReplicates] = useState(1);
    const [randomize, setRandomize] = useState(true);

    // Update factors when numFactors changes
    const handleNumFactorsChange = (n: number) => {
        setNumFactors(n);
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const newFactors: Factor[] = [];
        for (let i = 0; i < n; i++) {
            newFactors.push(factors[i] || {
                id: letters[i]!,
                name: `Factor ${letters[i]!}`,
                lowLevel: '-1',
                highLevel: '+1'
            });
        }
        setFactors(newFactors);
    };

    // Generate experimental runs
    const experimentDesign = useMemo(() => {
        const runs: Run[] = [];
        const totalRuns = Math.pow(2, numFactors);

        // Generate factorial runs (coded values -1 and +1)
        for (let i = 0; i < totalRuns; i++) {
            const factorValues: Record<string, number> = {};
            for (let j = 0; j < numFactors; j++) {
                // Convert run number to binary pattern for factors
                const factor = factors[j]!;
                factorValues[factor.id] = (i >> (numFactors - 1 - j)) & 1 ? 1 : -1;
            }
            runs.push({
                runNumber: i + 1,
                factors: factorValues
            });
        }

        // Add center points if selected
        if (includeCenterPoints) {
            const centerPoint: Run = {
                runNumber: totalRuns + 1,
                factors: Object.fromEntries(factors.map(f => [f.id, 0])),
                isCenterPoint: true
            };
            runs.push(centerPoint);
        }

        // Add replicates
        const replicatedRuns: Run[] = [];
        for (let rep = 0; rep < numReplicates; rep++) {
            const runsToAdd = runs.map((run, idx) => ({
                ...run,
                runNumber: rep * runs.length + idx + 1
            }));
            replicatedRuns.push(...runsToAdd);
        }

        // Randomize if selected
        if (randomize) {
            for (let i = replicatedRuns.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const tempI = replicatedRuns[i]!;
            const tempJ = replicatedRuns[j]!;
            replicatedRuns[i] = tempJ;
            replicatedRuns[j] = tempI;
            }
            // Re-number after randomization
            replicatedRuns.forEach((run, idx) => run.runNumber = idx + 1);
        }

        return replicatedRuns;
    }, [numFactors, factors, includeCenterPoints, numReplicates, randomize]);

    // Calculate design statistics
    const designStats = useMemo(() => {
        const baseRuns = Math.pow(2, numFactors);
        const centerPoints = includeCenterPoints ? 1 : 0;
        const totalRuns = (baseRuns + centerPoints) * numReplicates;

        // Calculate degrees of freedom
        const mainEffects = numFactors;
        const twoWayInteractions = (numFactors * (numFactors - 1)) / 2;
        const errorDf = totalRuns - 1 - mainEffects - twoWayInteractions;

        return {
            baseRuns,
            centerPoints,
            totalRuns,
            mainEffects,
            twoWayInteractions,
            errorDf
        };
    }, [numFactors, includeCenterPoints, numReplicates]);

    // Export to CSV
    const exportCSV = () => {
        const header = ['Run', ...factors.map(f => f.name)].join(',');
        const rows = experimentDesign.map(run => [
            run.runNumber,
            ...factors.map(f => run.factors[f.id])
        ].join(','));
        const csv = [header, ...rows].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'doe_design.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="doe-planner">
            <header className="doe-header">
                <h2>🔬 DOE Planner</h2>
                <p>Design factorial experiments for process optimization</p>
            </header>

            <div className="doe-grid">
                {/* Design Configuration */}
                <section className="config-section">
                    <h3>Design Configuration</h3>

                    <div className="config-row">
                        <label>Design Type</label>
                        <select
                            value={designType}
                            onChange={e => setDesignType(e.target.value as DesignType)}
                        >
                            <option value="full">Full Factorial</option>
                            <option value="fractional">Fractional Factorial</option>
                        </select>
                    </div>

                    <div className="config-row">
                        <label>Number of Factors</label>
                        <select
                            value={numFactors}
                            onChange={e => handleNumFactorsChange(parseInt(e.target.value))}
                        >
                            {[2, 3, 4, 5, 6, 7].map(n => (
                                <option key={n} value={n}>{n} Factors (2^{n} runs)</option>
                            ))}
                        </select>
                    </div>

                    {designType === 'fractional' && (
                        <div className="config-row">
                            <label>Resolution</label>
                            <select
                                value={resolution}
                                onChange={e => setResolution(e.target.value as ResolutionLevel)}
                            >
                                <option value="III">III - Screening</option>
                                <option value="IV">IV - Standard</option>
                                <option value="V">V - Detailed</option>
                            </select>
                            <p className="help-text">{{'III': 'Main effects aliased with 2-way interactions', 'IV': 'Main effects clear, 2-way aliased with 2-way', 'V': 'Main and 2-way interactions clear'}[resolution]}</p>
                        </div>
                    )}

                    <div className="config-row checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={includeCenterPoints}
                                onChange={e => setIncludeCenterPoints(e.target.checked)}
                            />
                            Include Center Points
                        </label>
                    </div>

                    <div className="config-row">
                        <label>Replicates</label>
                        <select
                            value={numReplicates}
                            onChange={e => setNumReplicates(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4].map(n => (
                                <option key={n} value={n}>{n}x</option>
                            ))}
                        </select>
                    </div>

                    <div className="config-row checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={randomize}
                                onChange={e => setRandomize(e.target.checked)}
                            />
                            Randomize Run Order
                        </label>
                    </div>
                </section>

                {/* Factor Configuration */}
                <section className="factors-section">
                    <h3>Factor Levels</h3>
                    <div className="factors-table">
                        <div className="factors-header">
                            <span>Factor</span>
                            <span>Name</span>
                            <span>Low (-1)</span>
                            <span>High (+1)</span>
                        </div>
                        {factors.map((factor, idx) => (
                            <div key={factor.id} className="factor-row">
                                <span className="factor-letter">{factor.id}</span>
                                <input
                                    type="text"
                                    value={factor.name}
                                    onChange={e => {
                                        const newFactors = [...factors];
                                        const f = newFactors[idx]!;
                                        f.name = e.target.value;
                                        setFactors(newFactors);
                                    }}
                                />
                                <input
                                    type="text"
                                    value={factor.lowLevel}
                                    onChange={e => {
                                        const newFactors = [...factors];
                                        const f = newFactors[idx]!;
                                        f.lowLevel = e.target.value;
                                        setFactors(newFactors);
                                    }}
                                />
                                <input
                                    type="text"
                                    value={factor.highLevel}
                                    onChange={e => {
                                        const newFactors = [...factors];
                                        const f = newFactors[idx]!;
                                        f.highLevel = e.target.value;
                                        setFactors(newFactors);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Design Statistics */}
            <section className="stats-section">
                <h3>Design Statistics</h3>
                <div className="stats-grid">
                    <div className="stat">
                        <span className="stat-value">{designStats.totalRuns}</span>
                        <span className="stat-label">Total Runs</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{designStats.mainEffects}</span>
                        <span className="stat-label">Main Effects</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{designStats.twoWayInteractions}</span>
                        <span className="stat-label">2-Way Interactions</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{designStats.errorDf}</span>
                        <span className="stat-label">Error df</span>
                    </div>
                </div>
            </section>

            {/* Run Table */}
            <section className="runs-section">
                <div className="runs-header">
                    <h3>Experimental Runs</h3>
                    <button className="export-btn" onClick={exportCSV}>
                        📥 Export CSV
                    </button>
                </div>
                <div className="runs-table-container">
                    <table className="runs-table">
                        <thead>
                            <tr>
                                <th>Run</th>
                                {factors.map(f => (
                                    <th key={f.id}>{f.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {experimentDesign.map(run => (
                                <tr
                                    key={run.runNumber}
                                    className={run.isCenterPoint ? 'center-point' : ''}
                                >
                                    <td>{run.runNumber}</td>
                                    {factors.map(f => (
                                        <td key={f.id}>
                                            {run.factors[f.id] === -1 ? '-' : run.factors[f.id] === 1 ? '+' : '0'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default DOEPlanner;