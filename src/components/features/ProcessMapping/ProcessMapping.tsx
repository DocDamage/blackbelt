/**
 * Process Mapping Tool
 * 
 * Interactive tool for creating SIPOC diagrams, Value Stream Maps, and Fishbone diagrams.
 */

import React, { useState, useCallback } from 'react';
import './ProcessMapping.css';

type DiagramType = 'sipoc' | 'valueStream' | 'fishbone';

interface SipocRow {
    id: string;
    supplier: string;
    input: string;
    process: string;
    output: string;
    customer: string;
}

interface ValueStreamStep {
    id: string;
    name: string;
    type: 'process' | 'inventory' | 'info';
    leadTime: number;
    valueAddedTime: number;
    notes: string;
}

interface FishboneCategory {
    id: string;
    name: string;
    causes: string[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const ProcessMapping: React.FC = () => {
    const [diagramType, setDiagramType] = useState<DiagramType>('sipoc');

    // SIPOC State
    const [sipocRows, setSipocRows] = useState<SipocRow[]>([
        { id: generateId(), supplier: '', input: '', process: '', output: '', customer: '' }
    ]);

    // Value Stream State
    const [valueStreamSteps, setValueStreamSteps] = useState<ValueStreamStep[]>([
        { id: generateId(), name: '', type: 'process', leadTime: 0, valueAddedTime: 0, notes: '' }
    ]);

    // Fishbone State
    const [fishboneProblem, setFishboneProblem] = useState('');
    const [fishboneCategories, setFishboneCategories] = useState<FishboneCategory[]>([
        { id: generateId(), name: 'Manpower', causes: [] },
        { id: generateId(), name: 'Methods', causes: [] },
        { id: generateId(), name: 'Machines', causes: [] },
        { id: generateId(), name: 'Materials', causes: [] },
        { id: generateId(), name: 'Measurement', causes: [] },
        { id: generateId(), name: 'Environment', causes: [] },
    ]);

    // SIPOC Handlers
    const addSipocRow = () => {
        setSipocRows([...sipocRows, { id: generateId(), supplier: '', input: '', process: '', output: '', customer: '' }]);
    };

    const updateSipocRow = (id: string, field: keyof SipocRow, value: string) => {
        setSipocRows(rows => rows.map(row =>
            row.id === id ? { ...row, [field]: value } : row
        ));
    };

    const removeSipocRow = (id: string) => {
        if (sipocRows.length > 1) {
            setSipocRows(rows => rows.filter(row => row.id !== id));
        }
    };

    // Value Stream Handlers
    const addValueStreamStep = () => {
        setValueStreamSteps([...valueStreamSteps, {
            id: generateId(), name: '', type: 'process', leadTime: 0, valueAddedTime: 0, notes: ''
        }]);
    };

    const updateValueStreamStep = (id: string, field: keyof ValueStreamStep, value: string | number) => {
        setValueStreamSteps(steps => steps.map(step =>
            step.id === id ? { ...step, [field]: value } : step
        ));
    };

    const removeValueStreamStep = (id: string) => {
        if (valueStreamSteps.length > 1) {
            setValueStreamSteps(steps => steps.filter(step => step.id !== id));
        }
    };

    // Fishbone Handlers
    const addCause = (categoryId: string, cause: string) => {
        if (!cause.trim()) return;
        setFishboneCategories(categories => categories.map(cat =>
            cat.id === categoryId ? { ...cat, causes: [...cat.causes, cause] } : cat
        ));
    };

    const removeCause = (categoryId: string, causeIndex: number) => {
        setFishboneCategories(categories => categories.map(cat =>
            cat.id === categoryId
                ? { ...cat, causes: cat.causes.filter((_, i) => i !== causeIndex) }
                : cat
        ));
    };

    const updateCategoryName = (categoryId: string, name: string) => {
        setFishboneCategories(categories => categories.map(cat =>
            cat.id === categoryId ? { ...cat, name } : cat
        ));
    };

    // Calculate Value Stream Metrics
    const calculateValueStreamMetrics = useCallback(() => {
        const totalLeadTime = valueStreamSteps.reduce((sum, step) => sum + (step.leadTime || 0), 0);
        const totalValueAddedTime = valueStreamSteps.reduce((sum, step) => sum + (step.valueAddedTime || 0), 0);
        const processEfficiency = totalLeadTime > 0 ? ((totalValueAddedTime / totalLeadTime) * 100).toFixed(1) : '0';

        return { totalLeadTime, totalValueAddedTime, processEfficiency };
    }, [valueStreamSteps]);

    const metrics = calculateValueStreamMetrics();

    // Export handlers
    const exportToCsv = () => {
        let csv = '';

        if (diagramType === 'sipoc') {
            csv = 'Supplier,Input,Process,Output,Customer\n';
            csv += sipocRows.map(row =>
                `"${row.supplier}","${row.input}","${row.process}","${row.output}","${row.customer}"`
            ).join('\n');
        } else if (diagramType === 'valueStream') {
            csv = 'Step Name,Type,Lead Time (min),Value Added Time (min),Notes\n';
            csv += valueStreamSteps.map(step =>
                `"${step.name}","${step.type}","${step.leadTime}","${step.valueAddedTime}","${step.notes}"`
            ).join('\n');
        } else {
            csv = `Problem: ${fishboneProblem}\n\n`;
            fishboneCategories.forEach(cat => {
                csv += `${cat.name}\n`;
                cat.causes.forEach(cause => {
                    csv += `  - ${cause}\n`;
                });
            });
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${diagramType}_diagram.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="process-mapping">
            <div className="process-mapping-header">
                <h2>Process Mapping Tool</h2>
                <p>Create SIPOC diagrams, Value Stream Maps, and Fishbone (Ishikawa) diagrams</p>
            </div>

            <div className="diagram-type-selector">
                <button
                    className={`diagram-type-btn ${diagramType === 'sipoc' ? 'active' : ''}`}
                    onClick={() => setDiagramType('sipoc')}
                >
                    📊 SIPOC
                </button>
                <button
                    className={`diagram-type-btn ${diagramType === 'valueStream' ? 'active' : ''}`}
                    onClick={() => setDiagramType('valueStream')}
                >
                    🔄 Value Stream
                </button>
                <button
                    className={`diagram-type-btn ${diagramType === 'fishbone' ? 'active' : ''}`}
                    onClick={() => setDiagramType('fishbone')}
                >
                    🐟 Fishbone
                </button>
            </div>

            <div className="process-mapping-content">
                {/* SIPOC Diagram */}
                {diagramType === 'sipoc' && (
                    <div className="sipoc-container">
                        <div className="sipoc-info">
                            <h3>SIPOC Diagram</h3>
                            <p>Suppliers → Inputs → Process → Outputs → Customers</p>
                        </div>

                        <div className="sipoc-table-wrapper">
                            <table className="sipoc-table">
                                <thead>
                                    <tr>
                                        <th>Supplier</th>
                                        <th>Input</th>
                                        <th>Process</th>
                                        <th>Output</th>
                                        <th>Customer</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sipocRows.map(row => (
                                        <tr key={row.id}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.supplier}
                                                    onChange={(e) => updateSipocRow(row.id, 'supplier', e.target.value)}
                                                    placeholder="Who supplies the input?"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.input}
                                                    onChange={(e) => updateSipocRow(row.id, 'input', e.target.value)}
                                                    placeholder="What enters the process?"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.process}
                                                    onChange={(e) => updateSipocRow(row.id, 'process', e.target.value)}
                                                    placeholder="What is the process step?"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.output}
                                                    onChange={(e) => updateSipocRow(row.id, 'output', e.target.value)}
                                                    placeholder="What leaves the process?"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={row.customer}
                                                    onChange={(e) => updateSipocRow(row.id, 'customer', e.target.value)}
                                                    placeholder="Who receives the output?"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="remove-row-btn"
                                                    onClick={() => removeSipocRow(row.id)}
                                                    disabled={sipocRows.length <= 1}
                                                    title="Remove row"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="add-row-btn" onClick={addSipocRow}>
                            + Add Row
                        </button>
                    </div>
                )}

                {/* Value Stream Map */}
                {diagramType === 'valueStream' && (
                    <div className="value-stream-container">
                        <div className="value-stream-info">
                            <h3>Value Stream Map</h3>
                            <p>Map your process flow and identify waste</p>
                        </div>

                        <div className="value-stream-metrics">
                            <div className="metric-card">
                                <span className="metric-label">Total Lead Time</span>
                                <span className="metric-value">{metrics.totalLeadTime} min</span>
                            </div>
                            <div className="metric-card">
                                <span className="metric-label">Value Added Time</span>
                                <span className="metric-value">{metrics.totalValueAddedTime} min</span>
                            </div>
                            <div className="metric-card highlight">
                                <span className="metric-label">Process Efficiency</span>
                                <span className="metric-value">{metrics.processEfficiency}%</span>
                            </div>
                        </div>

                        <div className="value-stream-steps">
                            {valueStreamSteps.map((step, index) => (
                                <div key={step.id} className={`value-stream-step ${step.type}`}>
                                    <div className="step-header">
                                        <span className="step-number">{index + 1}</span>
                                        <select
                                            value={step.type}
                                            onChange={(e) => updateValueStreamStep(step.id, 'type', e.target.value)}
                                        >
                                            <option value="process">Process</option>
                                            <option value="inventory">Inventory</option>
                                            <option value="info">Info Flow</option>
                                        </select>
                                        <button
                                            className="remove-step-btn"
                                            onClick={() => removeValueStreamStep(step.id)}
                                            disabled={valueStreamSteps.length <= 1}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={step.name}
                                        onChange={(e) => updateValueStreamStep(step.id, 'name', e.target.value)}
                                        placeholder="Step name"
                                        className="step-name-input"
                                    />

                                    <div className="step-times">
                                        <div className="time-input">
                                            <label>Lead Time</label>
                                            <input
                                                type="number"
                                                value={step.leadTime || ''}
                                                onChange={(e) => updateValueStreamStep(step.id, 'leadTime', parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                            />
                                            <span>min</span>
                                        </div>
                                        <div className="time-input">
                                            <label>VA Time</label>
                                            <input
                                                type="number"
                                                value={step.valueAddedTime || ''}
                                                onChange={(e) => updateValueStreamStep(step.id, 'valueAddedTime', parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                            />
                                            <span>min</span>
                                        </div>
                                    </div>

                                    <textarea
                                        value={step.notes}
                                        onChange={(e) => updateValueStreamStep(step.id, 'notes', e.target.value)}
                                        placeholder="Notes..."
                                        className="step-notes"
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>

                        <button className="add-row-btn" onClick={addValueStreamStep}>
                            + Add Step
                        </button>
                    </div>
                )}

                {/* Fishbone Diagram */}
                {diagramType === 'fishbone' && (
                    <div className="fishbone-container">
                        <div className="fishbone-info">
                            <h3>Fishbone (Ishikawa) Diagram</h3>
                            <p>Identify root causes of a problem</p>
                        </div>

                        <div className="fishbone-problem">
                            <label>Problem Statement:</label>
                            <input
                                type="text"
                                value={fishboneProblem}
                                onChange={(e) => setFishboneProblem(e.target.value)}
                                placeholder="What problem are you trying to solve?"
                            />
                        </div>

                        <div className="fishbone-categories">
                            {fishboneCategories.map(category => (
                                <FishboneCategoryCard
                                    key={category.id}
                                    category={category}
                                    onAddCause={(cause) => addCause(category.id, cause)}
                                    onRemoveCause={(index) => removeCause(category.id, index)}
                                    onUpdateName={(name) => updateCategoryName(category.id, name)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="process-mapping-actions">
                <button className="export-btn" onClick={exportToCsv}>
                    📥 Export to CSV
                </button>
            </div>
        </div>
    );
};

// Fishbone Category Card Component
interface FishboneCategoryCardProps {
    category: FishboneCategory;
    onAddCause: (cause: string) => void;
    onRemoveCause: (index: number) => void;
    onUpdateName: (name: string) => void;
}

const FishboneCategoryCard: React.FC<FishboneCategoryCardProps> = ({
    category,
    onAddCause,
    onRemoveCause,
    onUpdateName
}) => {
    const [newCause, setNewCause] = useState('');

    const handleAddCause = () => {
        onAddCause(newCause);
        setNewCause('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddCause();
        }
    };

    return (
        <div className="fishbone-category">
            <input
                type="text"
                value={category.name}
                onChange={(e) => onUpdateName(e.target.value)}
                className="category-name-input"
            />

            <div className="causes-list">
                {category.causes.map((cause, index) => (
                    <div key={index} className="cause-item">
                        <span>{cause}</span>
                        <button onClick={() => onRemoveCause(index)}>✕</button>
                    </div>
                ))}
            </div>

            <div className="add-cause-input">
                <input
                    type="text"
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add cause..."
                />
                <button onClick={handleAddCause} disabled={!newCause.trim()}>+</button>
            </div>
        </div>
    );
};

export default ProcessMapping;