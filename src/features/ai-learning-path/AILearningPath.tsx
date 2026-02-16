/**
 * AI Learning Path Component
 * 
 * Personalized learning recommendations based on performance analysis
 */

import { useState, useEffect, useCallback } from 'react';
import { Loading } from '../../components/common/Loading/Loading';
import {
    analyzeLearningPattern,
    getLearningPath,
    getDetailedProgress,
    recordQuizPerformance,
    LearningRecommendation,
    TopicProgress,
} from './aiLearningPath.db';
import './AILearningPath.css';

const USER_ID = 'current-user';

const TYPE_ICONS: Record<string, string> = {
    video: '🎥',
    reading: '📖',
    quiz: '❓',
    practice: '✏️',
};

const STATUS_LABELS: Record<string, string> = {
    mastered: 'Mastered',
    proficient: 'Proficient',
    learning: 'Learning',
    'not-started': 'Not Started',
};

export function AILearningPath() {
    const [learningPath, setLearningPath] = useState<{
        recommendations: LearningRecommendation[];
        weakTopics: string[];
        strongTopics: string[];
        overallProgress: number;
    } | null>(null);
    const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const path = await getLearningPath(USER_ID);
            if (path) {
                setLearningPath({
                    recommendations: path.recommendations,
                    weakTopics: path.weakTopics,
                    strongTopics: path.strongTopics,
                    overallProgress: path.overallProgress,
                });
            } else {
                // Generate initial path
                const newPath = await analyzeLearningPattern(USER_ID);
                setLearningPath({
                    recommendations: newPath.recommendations,
                    weakTopics: newPath.weakTopics,
                    strongTopics: newPath.strongTopics,
                    overallProgress: newPath.overallProgress,
                });
            }
            
            const progress = await getDetailedProgress(USER_ID);
            setTopicProgress(progress);
        } catch (error) {
            console.error('Failed to load learning path:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleComplete = async (rec: LearningRecommendation) => {
        // Record completion
        await recordQuizPerformance(USER_ID, rec.topic, 85);
        // Reload data
        await loadData();
    };

    const handleSkip = async (_recId: string) => {
        // Just reload to refresh recommendations
        await loadData();
    };

    if (loading) {
        return <Loading message="Analyzing your learning patterns..." />;
    }

    if (!learningPath) {
        return (
            <div className="learning-path-container">
                <p>Unable to generate learning path. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="learning-path-container">
            <div className="learning-path-header">
                <h1 className="learning-path-title">🎯 AI Learning Path</h1>
                <p className="learning-path-subtitle">
                    Personalized recommendations based on your performance
                </p>
            </div>

            {/* Progress Overview */}
            <div className="learning-path-overview">
                <div className="learning-path-progress">
                    <div className="learning-path-progress-circle">
                        <span className="learning-path-progress-value">
                            {learningPath.overallProgress}%
                        </span>
                        <span className="learning-path-progress-label">Complete</span>
                    </div>
                    <div className="learning-path-stats">
                        <h3>Your Learning Profile</h3>
                        <div className="learning-path-stat-row">
                            <div className="learning-path-stat">
                                <span className="learning-path-stat-icon">💪</span>
                                <div>
                                    <div className="learning-path-stat-value">
                                        {learningPath.strongTopics.length}
                                    </div>
                                    <div className="learning-path-stat-label">Strong Areas</div>
                                </div>
                            </div>
                            <div className="learning-path-stat">
                                <span className="learning-path-stat-icon">📚</span>
                                <div>
                                    <div className="learning-path-stat-value">
                                        {learningPath.weakTopics.length}
                                    </div>
                                    <div className="learning-path-stat-label">Focus Areas</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Topic Strength Cards */}
            <div className="learning-path-topics">
                {learningPath.weakTopics.length > 0 && (
                    <div className="learning-path-topic-card">
                        <h3>⚠️ Areas Needing Attention</h3>
                        <div className="learning-path-topic-list">
                            {learningPath.weakTopics.map(topic => (
                                <div key={topic} className="learning-path-topic-item">
                                    <div className="learning-path-topic-indicator weak"></div>
                                    <span className="learning-path-topic-name">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {learningPath.strongTopics.length > 0 && (
                    <div className="learning-path-topic-card">
                        <h3>💪 Your Strengths</h3>
                        <div className="learning-path-topic-list">
                            {learningPath.strongTopics.map(topic => (
                                <div key={topic} className="learning-path-topic-item">
                                    <div className="learning-path-topic-indicator strong"></div>
                                    <span className="learning-path-topic-name">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="learning-path-recommendations">
                <h2>📋 Recommended Next Steps</h2>
                <div className="learning-path-rec-list">
                    {learningPath.recommendations.map((rec) => (
                        <div key={rec.id} className={`learning-path-rec-item ${rec.priority}`}>
                            <div className="learning-path-rec-icon">
                                {TYPE_ICONS[rec.type]}
                            </div>
                            <div className="learning-path-rec-content">
                                <div className="learning-path-rec-title">{rec.title}</div>
                                <div className="learning-path-rec-reason">{rec.reason}</div>
                                <div className="learning-path-rec-meta">
                                    <span className={`learning-path-rec-priority ${rec.priority}`}>
                                        {rec.priority} Priority
                                    </span>
                                    <span>⏱️ {rec.estimatedTime} min</span>
                                </div>
                            </div>
                            <div className="learning-path-rec-actions">
                                <button
                                    className="learning-path-rec-btn"
                                    onClick={() => handleComplete(rec)}
                                >
                                    Start
                                </button>
                                <button
                                    className="learning-path-rec-btn secondary"
                                    onClick={() => handleSkip(rec.id)}
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Progress */}
            <div className="learning-path-detailed">
                <h2>📊 All Topics Progress</h2>
                <div className="learning-path-grid">
                    {topicProgress.map((topic) => (
                        <div
                            key={topic.topic}
                            className={`learning-path-grid-item ${topic.status}`}
                        >
                            <div className="learning-path-grid-topic">{topic.topic}</div>
                            <div className="learning-path-grid-status">
                                <div className={`learning-path-grid-dot ${topic.status}`}></div>
                                <span>
                                    {topic.averageScore > 0 
                                        ? `${topic.averageScore}% - ` 
                                        : ''}
                                    {STATUS_LABELS[topic.status]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AILearningPath;
