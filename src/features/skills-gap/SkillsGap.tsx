/**
 * Skills Gap Analysis Component
 * 
 * Visualizes user competency across DMAIC phases with radar chart
 */

import { useState, useEffect, useCallback } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { SkillsMatrix, DMAICPhase } from '../../utils/db.schema';
import {
    getSkillsMatrix,
    initializeSkillsMatrix,
    getGapAnalysis,
    getRecommendedFocusAreas,
} from './skillsGap.db';
import { Loading } from '../../components/common/Loading/Loading';
import './SkillsGap.css';

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const USER_ID = 'current-user'; // TODO: Get from auth context



const PHASE_LABELS: Record<DMAICPhase, string> = {
    define: 'Define',
    measure: 'Measure',
    analyze: 'Analyze',
    improve: 'Improve',
    control: 'Control',
};

export function SkillsGap() {
    const [matrix, setMatrix] = useState<SkillsMatrix | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedPhase, setExpandedPhase] = useState<DMAICPhase | null>(null);

    const loadSkills = useCallback(async () => {
        setLoading(true);
        try {
            let skillsMatrix = await getSkillsMatrix(USER_ID);
            
            if (!skillsMatrix) {
                skillsMatrix = await initializeSkillsMatrix(USER_ID, 'black');
            }
            
            setMatrix(skillsMatrix);
        } catch (error) {
            console.error('Failed to load skills matrix:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSkills();
    }, [loadSkills]);

    const getRadarData = () => {
        if (!matrix) return null;

        const phases: DMAICPhase[] = ['define', 'measure', 'analyze', 'improve', 'control'];
        
        return {
            labels: phases.map(p => PHASE_LABELS[p]),
            datasets: [
                {
                    label: 'Your Skills',
                    data: phases.map(p => matrix.phases[p].percentage),
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3b82f6',
                },
                {
                    label: 'Target (Black Belt)',
                    data: [80, 80, 80, 80, 80],
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderColor: '#22c55e',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#fff',
                },
            ],
        };
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
            },
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const getScoreClass = (score: number): string => {
        if (score < 40) return 'low';
        if (score < 70) return 'medium';
        return 'high';
    };

    if (loading) {
        return <Loading message="Loading skills analysis..." />;
    }

    if (!matrix) {
        return <div>Failed to load skills matrix</div>;
    }

    const gapAnalysis = getGapAnalysis(matrix);
    const recommendations = getRecommendedFocusAreas(matrix);
    const radarData = getRadarData();

    return (
        <div className="skills-container">
            <div className="skills-header">
                <h1 className="skills-title">Skills Gap Analysis</h1>
                <p className="skills-subtitle">
                    Track your competency across DMAIC phases and identify focus areas
                </p>
            </div>

            {/* Overall Score */}
            <div className="skills-overall">
                <div className="skills-overall-score">{matrix.overallScore}%</div>
                <div className="skills-overall-label">Overall Competency</div>
                <div className="skills-readiness">
                    <div className="skills-readiness-label">Certification Readiness</div>
                    <div className="skills-readiness-score">
                        {matrix.readinessScore >= 80 ? '🟢' : matrix.readinessScore >= 60 ? '🟡' : '🔴'}
                        {' '}{matrix.readinessScore}%
                    </div>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="skills-radar">
                <h3 className="skills-radar-title">DMAIC Competency Radar</h3>
                <div className="skills-radar-chart">
                    {radarData ? (
                        <Radar data={radarData} options={radarOptions} />
                    ) : (
                        <div className="skills-radar-placeholder">
                            <p>No data available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Phase Breakdown */}
            <div className="skills-phases">
                {(Object.keys(matrix.phases) as DMAICPhase[]).map((phase) => {
                    const phaseData = matrix.phases[phase];
                    const isExpanded = expandedPhase === phase;
                    
                    return (
                        <div
                            key={phase}
                            className={`skills-phase-card ${phase}`}
                            onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="skills-phase-header">
                                <span className="skills-phase-name">{PHASE_LABELS[phase]}</span>
                                <span className="skills-phase-score">{phaseData.percentage}%</span>
                            </div>
                            <div className="skills-phase-bar">
                                <div
                                    className="skills-phase-fill"
                                    style={{ width: `${phaseData.percentage}%` }}
                                />
                            </div>
                            
                            {isExpanded && (
                                <div className="skills-phase-subskills">
                                    {phaseData.subskills
                                        .sort((a, b) => a.score - b.score)
                                        .map((subskill) => (
                                            <div key={subskill.id} className="skills-subskill">
                                                <span className="skills-subskill-name">
                                                    {subskill.name}
                                                </span>
                                                <span className={`skills-subskill-score ${getScoreClass(subskill.score)}`}>
                                                    {subskill.score}%
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            )}
                            
                            {!isExpanded && (
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                                    Click to see {phaseData.subskills.length} subskills
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="skills-recommendations">
                    <h3 className="skills-recommendations-title">💡 Recommended Focus Areas</h3>
                    <div className="skills-recommendations-list">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="skills-recommendation">
                                <span className="skills-recommendation-icon">🎯</span>
                                <span className="skills-recommendation-text">{rec}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gap Analysis Table */}
            <div className="skills-gap-table">
                <h3 className="skills-gap-table-title">Gap Analysis</h3>
                <div className="skills-gap-list">
                    {gapAnalysis.map((gap) => (
                        <div key={gap.phase} className="skills-gap-item">
                            <span className="skills-gap-phase">{PHASE_LABELS[gap.phase]}</span>
                            <div className="skills-gap-bar-container">
                                <div
                                    className="skills-gap-bar"
                                    style={{ width: `${100 - gap.gap}%` }}
                                />
                                <span className="skills-gap-value">{100 - gap.gap}%</span>
                            </div>
                            <span className="skills-gap-priority">
                                Priority: {gap.prioritySubskills[0]?.name || 'None'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SkillsGap;
