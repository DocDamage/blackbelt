/**
 * Achievement Badges System
 * 
 * Gamification feature that rewards users with badges for accomplishments.
 */

import React, { useState, useEffect } from 'react';
import './AchievementBadges.css';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'learning' | 'quiz' | 'streak' | 'social' | 'special';
    earnedAt?: Date;
    progress?: number;
    maxProgress?: number;
}

interface AchievementBadgesProps {
    earnedBadges?: string[];
    showAll?: boolean;
}

const ALL_BADGES: Badge[] = [
    // Learning Badges
    {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first lesson',
        icon: '👣',
        category: 'learning',
        maxProgress: 1
    },
    {
        id: 'knowledge-seeker',
        name: 'Knowledge Seeker',
        description: 'Complete 10 lessons',
        icon: '📚',
        category: 'learning',
        maxProgress: 10
    },
    {
        id: 'scholar',
        name: 'Scholar',
        description: 'Complete 50 lessons',
        icon: '🎓',
        category: 'learning',
        maxProgress: 50
    },
    {
        id: 'sage',
        name: 'Sage',
        description: 'Complete 100 lessons',
        icon: '🧙',
        category: 'learning',
        maxProgress: 100
    },

    // Quiz Badges
    {
        id: 'quiz-novice',
        name: 'Quiz Novice',
        description: 'Complete your first quiz',
        icon: '✏️',
        category: 'quiz',
        maxProgress: 1
    },
    {
        id: 'perfect-score',
        name: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: '💯',
        category: 'quiz',
        maxProgress: 1
    },
    {
        id: 'quiz-master',
        name: 'Quiz Master',
        description: 'Pass 10 quizzes with 80%+',
        icon: '🏆',
        category: 'quiz',
        maxProgress: 10
    },
    {
        id: 'exam-champion',
        name: 'Exam Champion',
        description: 'Pass all belt exams',
        icon: '🥇',
        category: 'quiz',
        maxProgress: 5
    },

    // Streak Badges
    {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Study for 3 days in a row',
        icon: '🔥',
        category: 'streak',
        maxProgress: 3
    },
    {
        id: 'consistent',
        name: 'Consistent',
        description: 'Study for 7 days in a row',
        icon: '⚡',
        category: 'streak',
        maxProgress: 7
    },
    {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Study for 30 days in a row',
        icon: '🚀',
        category: 'streak',
        maxProgress: 30
    },
    {
        id: 'legendary',
        name: 'Legendary',
        description: 'Study for 100 days in a row',
        icon: '👑',
        category: 'streak',
        maxProgress: 100
    },

    // Social Badges
    {
        id: 'helper',
        name: 'Helper',
        description: 'Answer 5 community questions',
        icon: '🤝',
        category: 'social',
        maxProgress: 5
    },
    {
        id: 'mentor',
        name: 'Mentor',
        description: 'Help 10 other students',
        icon: '💡',
        category: 'social',
        maxProgress: 10
    },

    // Special Badges
    {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'Joined during beta period',
        icon: '⭐',
        category: 'special'
    },
    {
        id: 'certified-green',
        name: 'Green Belt Certified',
        description: 'Earn Green Belt certification',
        icon: '🟢',
        category: 'special'
    },
    {
        id: 'certified-black',
        name: 'Black Belt Certified',
        description: 'Earn Black Belt certification',
        icon: '⚫',
        category: 'special'
    },
    {
        id: 'certified-master',
        name: 'Master Black Belt',
        description: 'Earn Master Black Belt certification',
        icon: '💎',
        category: 'special'
    }
];

const BADGE_STORAGE_KEY = 'sixsigma-earned-badges';

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
    earnedBadges: propEarnedBadges,
    showAll = true
}) => {
    const [earnedBadgeIds] = useState<string[]>(() => {
        if (propEarnedBadges) return propEarnedBadges;
        const stored = localStorage.getItem(BADGE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(earnedBadgeIds));
    }, [earnedBadgeIds]);

    const categories = [
        { id: 'all', name: 'All', icon: '🎖️' },
        { id: 'learning', name: 'Learning', icon: '📚' },
        { id: 'quiz', name: 'Quiz', icon: '✏️' },
        { id: 'streak', name: 'Streak', icon: '🔥' },
        { id: 'social', name: 'Social', icon: '🤝' },
        { id: 'special', name: 'Special', icon: '⭐' }
    ];

    const filteredBadges = showAll
        ? ALL_BADGES.filter(
            (badge) => selectedCategory === 'all' || badge.category === selectedCategory
        )
        : ALL_BADGES.filter((badge) => earnedBadgeIds.includes(badge.id));

    const earnedCount = earnedBadgeIds.length;
    const totalCount = ALL_BADGES.length;

    return (
        <div className="achievement-badges">
            <div className="badges-header">
                <h2>🏆 Achievements</h2>
                <div className="badges-progress">
                    <span>{earnedCount} / {totalCount} earned</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(earnedCount / totalCount) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {showAll && (
                <div className="category-filter">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span className="cat-name">{cat.name}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="badges-grid">
                {filteredBadges.map((badge) => {
                    const isEarned = earnedBadgeIds.includes(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                            title={badge.description}
                        >
                            <div className="badge-icon">{badge.icon}</div>
                            <div className="badge-info">
                                <h3>{badge.name}</h3>
                                <p>{badge.description}</p>
                                {badge.maxProgress && !isEarned && (
                                    <div className="badge-progress">
                                        <div className="mini-progress-bar">
                                            <div
                                                className="mini-progress-fill"
                                                style={{
                                                    width: `${((badge.progress || 0) / badge.maxProgress) * 100}%`
                                                }}
                                            />
                                        </div>
                                        <span>{badge.progress || 0} / {badge.maxProgress}</span>
                                    </div>
                                )}
                            </div>
                            {isEarned && <div className="earned-check">✓</div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Hook for managing badges
export function useBadges() {
    const [earnedBadges, setEarnedBadges] = useState<string[]>(() => {
        const stored = localStorage.getItem(BADGE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const earnBadge = (badgeId: string) => {
        if (!earnedBadges.includes(badgeId)) {
            const newBadges = [...earnedBadges, badgeId];
            setEarnedBadges(newBadges);
            localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(newBadges));

            const badge = ALL_BADGES.find((b) => b.id === badgeId);
            if (badge) {
                // Could trigger a toast notification here
                console.log(`🎉 Badge earned: ${badge.name}`);
            }
        }
    };

    const updateProgress = (badgeId: string, progress: number) => {
        const badge = ALL_BADGES.find((b) => b.id === badgeId);
        if (badge && badge.maxProgress && progress >= badge.maxProgress) {
            earnBadge(badgeId);
        }
    };

    const hasBadge = (badgeId: string) => earnedBadges.includes(badgeId);

    return { earnedBadges, earnBadge, updateProgress, hasBadge, allBadges: ALL_BADGES };
}

export default AchievementBadges;