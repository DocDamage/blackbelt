/**
 * Tools Page - Statistical Calculators, DOE Planner, and Utilities
 */

import { useState } from 'react';
import { StatCalculators } from '../../components/features/StatCalculators';
import { DOEPlanner } from '../../components/features/DOEPlanner';
import './ToolsPage.css';

type ToolTab = 'calculators' | 'doe';

export function ToolsPage() {
    const [activeTab, setActiveTab] = useState<ToolTab>('calculators');

    return (
        <div className="tools-page">
            <header className="tools-header">
                <h1>Six Sigma Tools</h1>
                <p>Interactive calculators and planners for quality improvement</p>
            </header>

            <nav className="tools-tabs">
                <button
                    className={`tab-btn ${activeTab === 'calculators' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calculators')}
                >
                    📊 Statistical Calculators
                </button>
                <button
                    className={`tab-btn ${activeTab === 'doe' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doe')}
                >
                    🔬 DOE Planner
                </button>
            </nav>

            <div className="tools-content">
                {activeTab === 'calculators' && <StatCalculators />}
                {activeTab === 'doe' && <DOEPlanner />}
            </div>
        </div>
    );
}

export default ToolsPage;