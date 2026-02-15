/**
 * Study Streak & Gamification System
 * Tracks daily study activity, streaks, and achievements
 */

import { useState, useEffect, useMemo } from 'react';
import './StudyStreak.css';

interface StudyDay {
    date: string;
    minutesStudied: number;
    modulesCompleted: number;
    quizzesPassed: number;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: number;
    progress?: number;
    target?: number;
}

interface StudyStreakData {
    currentStreak: number;
    longestStreak: number;
    totalMinutes: number;
    totalModules: number;
    totalQuizzes: number;
    studyDays: StudyDay[];
    achievements: Achievement[];
    lastStudyDate?: string;
    level: number;
    xp: number;
}

const STORAGE_KEY = 'sixsigma_study_streak';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
    { id: 'first_step', title: 'First Step', description: 'Complete your first module', icon: '👣', target: 1 },
    { id: 'week_warrior', title: 'Week Warrior', description: 'Study for 7 consecutive days', icon: '📅', target: 7 },
    { id: 'quiz_master', title: 'Quiz Master', description: 'Pass 10 quizzes', icon: '✅', target: 10 },
    { id: 'hour_power', title: 'Hour Power', description: 'Study for 60 minutes total', icon: '⏰', target: 60 },
    { id: 'century', title: 'Century', description: 'Study for 100 minutes total', icon: '💯', target: 100 },
    { id: 'streak_star', title: 'Streak Star', description: 'Reach a 14-day streak', icon: '⭐', target: 14 },
    { id: 'dedication', title: 'Dedication', description: 'Reach a 30-day streak', icon: '🏆', target: 30 },
    { id: 'green_belt_prep', title: 'Green Belt Prep', description: 'Complete all Yellow Belt modules', icon: '🥋', target: 5 },
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];

export function StudyStreak() {
    const [data, setData] = useState<StudyStreakData>(() => loadData());
    const [showAchievements, setShowAchievements] = useState(false);

    function loadData(): StudyStreakData {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load study streak data:', e);
        }
        return {
            currentStreak: 0,
            longestStreak: 0,
            totalMinutes: 0,
            totalModules: 0,
            totalQuizzes: 0,
            studyDays: [],
            achievements: DEFAULT_ACHIEVEMENTS,
            level: 1,
            xp: 0
        };
    }

    function saveData(newData: StudyStreakData) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        } catch (e) {
            console.error('Failed to save study streak data:', e);
        }
    }

    // Calculate level from XP
    const calculatedLevel = useMemo(() => {
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            const threshold = LEVEL_THRESHOLDS[i] ?? 0;
            if (data.xp >= threshold) {
                return i + 1;
            }
        }
        return 1;
    }, [data.xp]);

    // XP progress to next level
    const xpProgress = useMemo(() => {
        const currentThreshold = LEVEL_THRESHOLDS[calculatedLevel - 1] ?? 0;
        const nextThreshold = LEVEL_THRESHOLDS[calculatedLevel] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] ?? 0;
        if (nextThreshold === currentThreshold) return 100;
        const progress = ((data.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
        return Math.min(100, Math.max(0, progress));
    }, [data.xp, calculatedLevel]);

    // Check streak status
    const streakStatus = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (data.lastStudyDate === today) {
            return 'completed';
        } else if (data.lastStudyDate === yesterday) {
            return 'pending';
        } else if (data.currentStreak > 0) {
            return 'broken';
        }
        return 'none';
    }, [data.lastStudyDate, data.currentStreak]);

    // Get last 7 days for display
    const last7Days = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const dateStr = date.toISOString().split('T')[0] ?? '';
            const dayData = data.studyDays.find(d => d.date === dateStr);
            days.push({
                date: dateStr,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                active: !!dayData,
                minutes: dayData?.minutesStudied || 0
            });
        }
        return days;
    }, [data.studyDays]);

    // Unlocked achievements count
    const unlockedCount = data.achievements.filter(a => a.unlockedAt).length;

    // Record study session (can be called externally)
    function recordStudySession(minutes: number, modulesCompleted: number = 0, quizzesPassed: number = 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        setData(prev => {
            const existingDayIndex = prev.studyDays.findIndex(d => d.date === today);
            const newStudyDays = [...prev.studyDays];

            if (existingDayIndex >= 0) {
                const existingDay = newStudyDays[existingDayIndex]!;
                newStudyDays[existingDayIndex] = {
                    ...existingDay,
                    minutesStudied: existingDay.minutesStudied + minutes,
                    modulesCompleted: existingDay.modulesCompleted + modulesCompleted,
                    quizzesPassed: existingDay.quizzesPassed + quizzesPassed
                };
            } else {
                newStudyDays.push({
                    date: today ?? '',
                    minutesStudied: minutes,
                    modulesCompleted,
                    quizzesPassed
                });
            }

            // Calculate streak
            let newStreak = prev.currentStreak;
            if (prev.lastStudyDate === yesterday || prev.lastStudyDate === today) {
                if (prev.lastStudyDate !== today) {
                    newStreak = prev.currentStreak + 1;
                }
            } else if (!prev.lastStudyDate) {
                newStreak = 1;
            } else {
                newStreak = 1;
            }

            // Calculate XP (10 XP per minute, 50 XP per module, 100 XP per quiz)
            const xpGained = (minutes * 10) + (modulesCompleted * 50) + (quizzesPassed * 100);

            // Update achievements
            const newAchievements = prev.achievements.map(ach => {
                if (ach.unlockedAt) return ach;

                let progress = 0;
                switch (ach.id) {
                    case 'first_step':
                        progress = prev.totalModules + modulesCompleted;
                        break;
                    case 'week_warrior':
                    case 'streak_star':
                    case 'dedication':
                        progress = newStreak;
                        break;
                    case 'quiz_master':
                        progress = prev.totalQuizzes + quizzesPassed;
                        break;
                    case 'hour_power':
                    case 'century':
                        progress = prev.totalMinutes + minutes;
                        break;
                    default:
                        progress = ach.progress || 0;
                }

                const unlocked = progress >= (ach.target || 1);
                return {
                    ...ach,
                    progress,
                    unlockedAt: unlocked && !ach.unlockedAt ? Date.now() : ach.unlockedAt
                };
            });

            const newData = {
                ...prev,
                currentStreak: newStreak,
                longestStreak: Math.max(prev.longestStreak, newStreak),
                totalMinutes: prev.totalMinutes + minutes,
                totalModules: prev.totalModules + modulesCompleted,
                totalQuizzes: prev.totalQuizzes + quizzesPassed,
                studyDays: newStudyDays,
                achievements: newAchievements,
                lastStudyDate: today,
                xp: prev.xp + xpGained
            };

            saveData(newData);
            return newData;
        });
    }

    // Expose recordStudySession globally for other components
    useEffect(() => {
        (window as unknown as { recordStudySession: typeof recordStudySession }).recordStudySession = recordStudySession;
    }, []);

    return (
        <div className="study-streak">
            <div className="streak-header">
                <div className="level-badge">
                    <span className="level-number">{calculatedLevel}</span>
                    <span className="level-label">Level</span>
                </div>
                <div className="streak-info">
                    <div className="streak-flame">
                        {streakStatus === 'completed' ? '🔥' : streakStatus === 'pending' ? '⏳' : '💧'}
                    </div>
                    <div className="streak-count">
                        <span className="count">{data.currentStreak}</span>
                        <span className="label">day streak</span>
                    </div>
                </div>
            </div>

            <div className="xp-bar">
                <div className="xp-progress" style={{ width: `${xpProgress}%` }} />
                <span className="xp-text">{data.xp} XP</span>
            </div>

            <div className="week-calendar">
                {last7Days.map((day, i) => (
                    <div key={i} className={`day ${day.active ? 'active' : ''}`}>
                        <span className="day-name">{day.dayName}</span>
                        <div className="day-dot">
                            {day.active ? '✓' : ''}
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-grid">
                <div className="stat">
                    <span className="stat-value">{data.totalMinutes}</span>
                    <span className="stat-label">Minutes</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{data.totalModules}</span>
                    <span className="stat-label">Modules</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{data.totalQuizzes}</span>
                    <span className="stat-label">Quizzes</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{data.longestStreak}</span>
                    <span className="stat-label">Best Streak</span>
                </div>
            </div>

            <button
                className="achievements-toggle"
                onClick={() => setShowAchievements(!showAchievements)}
            >
                🏆 Achievements ({unlockedCount}/{data.achievements.length})
            </button>

            {showAchievements && (
                <div className="achievements-panel">
                    {data.achievements.map(ach => (
                        <div
                            key={ach.id}
                            className={`achievement ${ach.unlockedAt ? 'unlocked' : ''}`}
                        >
                            <span className="achievement-icon">{ach.icon}</span>
                            <div className="achievement-info">
                                <span className="achievement-title">{ach.title}</span>
                                <span className="achievement-desc">{ach.description}</span>
                                {ach.target && !ach.unlockedAt && (
                                    <div className="achievement-progress">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${((ach.progress || 0) / ach.target) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {streakStatus === 'pending' && (
                <div className="streak-reminder">
                    🔥 Keep your streak alive! Study today!
                </div>
            )}
        </div>
    );
}

export default StudyStreak;