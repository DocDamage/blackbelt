import { useState, useEffect } from 'react';
import { getModuleProgress } from '../../../utils/db';
import { UserProgress } from '../../../types';
import './ModuleStats.css';

interface ModuleStatsProps {
    moduleId: string;
    totalLessons: number;
    estimatedMinutes: number;
}

export function ModuleStats({ moduleId, totalLessons, estimatedMinutes }: ModuleStatsProps) {
    const [stats, setStats] = useState<{
        completedCount: number;
        totalTimeSpent: number;
        lastActive: Date | null;
    }>({
        completedCount: 0,
        totalTimeSpent: 0,
        lastActive: null
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const progressItems = await getModuleProgress(moduleId);

                let completedCount = 0;
                let totalTimeSpent = 0; // in seconds
                let lastActive: Date | null = null;

                progressItems.forEach(item => {
                    if (item.completed) completedCount++;
                    if (item.timeSpent) totalTimeSpent += item.timeSpent;

                    if (item.completedAt && (!lastActive || new Date(item.completedAt) > lastActive)) {
                        lastActive = new Date(item.completedAt);
                    }
                });

                setStats({
                    completedCount,
                    totalTimeSpent,
                    lastActive
                });
            } catch (err) {
                console.error('Failed to load module stats', err);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, [moduleId]);

    if (loading) return null;

    // Format time
    const timeSpentMinutes = Math.round(stats.totalTimeSpent / 60);
    const progressPercent = Math.round((stats.completedCount / totalLessons) * 100) || 0;

    // Determine status color based on pace
    // If time spent > estimated * 1.5, maybe they are struggling? Or thorough.
    // Let's just show the data.

    return (
        <div className="module-stats-bar">
            <div className="stat-item">
                <span className="stat-label">Progress</span>
                <span className="stat-value">{stats.completedCount}/{totalLessons} ({progressPercent}%)</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">Time Spent</span>
                <span className="stat-value">{timeSpentMinutes} min</span>
                <span className="stat-sub">(Est: {estimatedMinutes} min)</span>
            </div>
            {stats.lastActive && (
                <div className="stat-item">
                    <span className="stat-label">Last Active</span>
                    <span className="stat-value">{stats.lastActive.toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
}
