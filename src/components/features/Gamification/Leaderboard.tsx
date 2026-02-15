/**
 * Leaderboard Component
 * 
 * Displays user rankings based on various metrics.
 */

import React, { useState } from 'react';
import './Leaderboard.css';

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    userName: string;
    avatar?: string;
    score: number;
    belt?: string;
    streak?: number;
    badges?: number;
}

interface LeaderboardProps {
    entries?: LeaderboardEntry[];
    currentUserId?: string;
    metric?: 'score' | 'streak' | 'badges';
}

// Demo data
const DEMO_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, userId: '1', userName: 'Sarah Chen', score: 12500, belt: 'black', streak: 45, badges: 12 },
    { rank: 2, userId: '2', userName: 'Mike Johnson', score: 11200, belt: 'black', streak: 32, badges: 10 },
    { rank: 3, userId: '3', userName: 'Emma Davis', score: 10800, belt: 'green', streak: 28, badges: 8 },
    { rank: 4, userId: '4', userName: 'James Wilson', score: 9500, belt: 'green', streak: 15, badges: 7 },
    { rank: 5, userId: '5', userName: 'Lisa Anderson', score: 8900, belt: 'green', streak: 12, badges: 6 },
    { rank: 6, userId: '6', userName: 'David Brown', score: 7800, belt: 'yellow', streak: 8, badges: 5 },
    { rank: 7, userId: '7', userName: 'Amy Taylor', score: 7200, belt: 'yellow', streak: 5, badges: 4 },
    { rank: 8, userId: '8', userName: 'John Smith', score: 6500, belt: 'yellow', streak: 3, badges: 3 },
    { rank: 9, userId: '9', userName: 'Kate Martinez', score: 5800, belt: 'white', streak: 2, badges: 2 },
    { rank: 10, userId: '10', userName: 'Chris Lee', score: 5200, belt: 'white', streak: 1, badges: 1 },
];

const BELT_COLORS: Record<string, string> = {
    white: '#f5f5f5',
    yellow: '#ffd700',
    green: '#28a745',
    black: '#1a1a1a',
    master: '#4a0080'
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
    entries = DEMO_LEADERBOARD,
    currentUserId,
    metric = 'score'
}) => {
    const [selectedMetric, setSelectedMetric] = useState<'score' | 'streak' | 'badges'>(metric);
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');

    const getMetricValue = (entry: LeaderboardEntry): number => {
        switch (selectedMetric) {
            case 'streak':
                return entry.streak || 0;
            case 'badges':
                return entry.badges || 0;
            default:
                return entry.score;
        }
    };

    const getMetricLabel = (): string => {
        switch (selectedMetric) {
            case 'streak':
                return 'Day Streak';
            case 'badges':
                return 'Badges';
            default:
                return 'Points';
        }
    };

    const sortedEntries = [...entries].sort((a, b) => getMetricValue(b) - getMetricValue(a));

    const getRankIcon = (rank: number): string => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `#${rank}`;
        }
    };

    return (
        <div className="leaderboard">
            <div className="leaderboard-header">
                <h2>🏆 Leaderboard</h2>
                <div className="leaderboard-filters">
                    <div className="metric-filter">
                        <button
                            className={`filter-btn ${selectedMetric === 'score' ? 'active' : ''}`}
                            onClick={() => setSelectedMetric('score')}
                        >
                            Points
                        </button>
                        <button
                            className={`filter-btn ${selectedMetric === 'streak' ? 'active' : ''}`}
                            onClick={() => setSelectedMetric('streak')}
                        >
                            Streak
                        </button>
                        <button
                            className={`filter-btn ${selectedMetric === 'badges' ? 'active' : ''}`}
                            onClick={() => setSelectedMetric('badges')}
                        >
                            Badges
                        </button>
                    </div>
                    <select
                        className="timeframe-select"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value as 'week' | 'month' | 'all')}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                </div>
            </div>

            {/* Top 3 Podium */}
            <div className="podium">
                {sortedEntries.slice(0, 3).map((entry, index) => (
                    <div
                        key={entry.userId}
                        className={`podium-item position-${index + 1} ${entry.userId === currentUserId ? 'current-user' : ''}`}
                    >
                        <div className="podium-avatar">
                            <span className="avatar-placeholder">
                                {entry.userName.charAt(0).toUpperCase()}
                            </span>
                            {entry.belt && (
                                <span
                                    className="belt-indicator"
                                    style={{ backgroundColor: BELT_COLORS[entry.belt] }}
                                />
                            )}
                        </div>
                        <div className="podium-name">{entry.userName}</div>
                        <div className="podium-score">
                            {getMetricValue(entry)} <span className="metric-label">{getMetricLabel()}</span>
                        </div>
                        <div className="podium-rank">{getRankIcon(index + 1)}</div>
                    </div>
                ))}
            </div>

            {/* Rest of the leaderboard */}
            <div className="leaderboard-list">
                {sortedEntries.slice(3).map((entry) => (
                    <div
                        key={entry.userId}
                        className={`leaderboard-row ${entry.userId === currentUserId ? 'current-user' : ''}`}
                    >
                        <div className="rank-cell">{entry.rank}</div>
                        <div className="user-cell">
                            <span className="avatar-small">
                                {entry.userName.charAt(0).toUpperCase()}
                            </span>
                            <span className="user-name">{entry.userName}</span>
                            {entry.belt && (
                                <span
                                    className="belt-badge"
                                    style={{ backgroundColor: BELT_COLORS[entry.belt] }}
                                />
                            )}
                        </div>
                        <div className="score-cell">
                            {getMetricValue(entry)} <span className="metric-label">{getMetricLabel()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current user position (if not in top 10) */}
            {currentUserId && !sortedEntries.slice(0, 10).find((e) => e.userId === currentUserId) && (
                <div className="current-user-position">
                    <span>Your position: #15</span>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;