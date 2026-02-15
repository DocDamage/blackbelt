/**
 * Progress Dashboard Component
 * Visualizes user progress across all belt levels
 */

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../../../contexts/UserContext';
import './ProgressDashboard.css';

interface BeltProgress {
    belt: string;
    beltId: string;
    modulesCompleted: number;
    totalModules: number;
    quizzesPassed: boolean;
    bestScore: number | null;
}

interface ProgressDashboardProps {
    className?: string;
}

// Belt configuration
const BELT_CONFIG = [
    { id: 'white', name: 'White Belt', color: '#e8e8e8', modules: 4 },
    { id: 'yellow', name: 'Yellow Belt', color: '#ffd700', modules: 5 },
    { id: 'green', name: 'Green Belt', color: '#22c55e', modules: 6 },
    { id: 'black', name: 'Black Belt', color: '#1a1a1a', modules: 8 },
    { id: 'master', name: 'Master Black Belt', color: '#7c3aed', modules: 5 },
];

const STORAGE_KEY = 'sixsigma_progress';

export function ProgressDashboard({ className }: ProgressDashboardProps) {
    const { profile } = useUser();
    const [beltProgress, setBeltProgress] = useState<BeltProgress[]>([]);
    const [studyStreak, setStudyStreak] = useState(0);
    const [totalStudyTime, setTotalStudyTime] = useState(0);

    // Load progress from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setBeltProgress(data.beltProgress || getDefaultProgress());
                setStudyStreak(data.studyStreak || 0);
                setTotalStudyTime(data.totalStudyTime || 0);
            } catch {
                setBeltProgress(getDefaultProgress());
            }
        } else {
            setBeltProgress(getDefaultProgress());
        }
    }, []);

    // Calculate overall progress
    const overallProgress = useMemo(() => {
        const total = beltProgress.reduce((sum, b) => sum + b.totalModules, 0);
        const completed = beltProgress.reduce((sum, b) => sum + b.modulesCompleted, 0);
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }, [beltProgress]);

    // Calculate certificates earned
    const certificatesEarned = useMemo(() => {
        return beltProgress.filter(b => b.quizzesPassed).length;
    }, [beltProgress]);

    // Get current belt index
    const currentBeltIndex = useMemo(() => {
        const beltId = profile?.currentBelt || 'white';
        return BELT_CONFIG.findIndex(b => b.id === beltId);
    }, [profile?.currentBelt]);

    function getDefaultProgress(): BeltProgress[] {
        return BELT_CONFIG.map(belt => ({
            belt: belt.name,
            beltId: belt.id,
            modulesCompleted: 0,
            totalModules: belt.modules,
            quizzesPassed: false,
            bestScore: null,
        }));
    }

    return (
        <div className={`progress-dashboard ${className || ''}`}>
            <header className="dashboard-header">
                <h2>Your Progress</h2>
                <p className="dashboard-subtitle">Track your Six Sigma journey</p>
            </header>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <span className="stat-value">{overallProgress}%</span>
                        <span className="stat-label">Overall Progress</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-content">
                        <span className="stat-value">{certificatesEarned}</span>
                        <span className="stat-label">Certificates</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <span className="stat-value">{studyStreak}</span>
                        <span className="stat-label">Day Streak</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <span className="stat-value">{Math.round(totalStudyTime / 60)}m</span>
                        <span className="stat-label">Study Time</span>
                    </div>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="overall-progress-section">
                <h3>Journey to Master Black Belt</h3>
                <div className="overall-progress-bar">
                    <div
                        className="overall-progress-fill"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <div className="progress-milestones">
                    {BELT_CONFIG.map((belt, index) => (
                        <div
                            key={belt.id}
                            className={`milestone ${index <= currentBeltIndex ? 'achieved' : ''}`}
                            style={{ '--belt-color': belt.color } as React.CSSProperties}
                        >
                            <div className="milestone-dot" />
                            <span className="milestone-label">{belt.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Belt Progress Cards */}
            <div className="belt-progress-grid">
                {beltProgress.map((belt, index) => {
                    const config = BELT_CONFIG[index];
                    const progressPercent = (belt.modulesCompleted / belt.totalModules) * 100;

                    return (
                        <div
                            key={belt.beltId}
                            className={`belt-card ${belt.quizzesPassed ? 'completed' : ''}`}
                            style={{ '--belt-color': config?.color } as React.CSSProperties}
                        >
                            <div className="belt-card-header">
                                <span className="belt-icon" style={{ backgroundColor: config?.color }} />
                                <h4>{belt.belt}</h4>
                                {belt.quizzesPassed && <span className="badge">✓ Certified</span>}
                            </div>

                            <div className="belt-progress-bar">
                                <div
                                    className="belt-progress-fill"
                                    style={{
                                        width: `${progressPercent}%`,
                                        backgroundColor: config?.color
                                    }}
                                />
                            </div>

                            <div className="belt-card-footer">
                                <span>{belt.modulesCompleted}/{belt.totalModules} modules</span>
                                {belt.bestScore !== null && (
                                    <span className="best-score">Best: {belt.bestScore}%</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h3>Continue Learning</h3>
                <p>Current level: <strong>{profile?.currentBelt || 'White Belt'}</strong></p>
            </div>
        </div>
    );
}

export default ProgressDashboard;