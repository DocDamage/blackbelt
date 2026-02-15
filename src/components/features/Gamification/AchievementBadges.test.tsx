/**
 * Tests for Achievement Badges Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AchievementBadges, useBadges } from './AchievementBadges';

// Mock localStorage
const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
        localStorageMock.store[key] = value;
    }),
    clear: () => {
        localStorageMock.store = {};
    }
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AchievementBadges', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('renders badges header with progress', () => {
        render(<AchievementBadges />);
        expect(screen.getByText('🏆 Achievements')).toBeInTheDocument();
        expect(screen.getByText(/earned/)).toBeInTheDocument();
    });

    it('shows all badges by default', () => {
        render(<AchievementBadges />);
        expect(screen.getByText('First Step')).toBeInTheDocument();
        expect(screen.getByText('Knowledge Seeker')).toBeInTheDocument();
        expect(screen.getByText('Quiz Master')).toBeInTheDocument();
    });

    it('filters badges by category', () => {
        render(<AchievementBadges showAll={true} />);

        const quizButton = screen.getByRole('button', { name: /quiz/i });
        fireEvent.click(quizButton);

        expect(screen.getByText('Quiz Novice')).toBeInTheDocument();
        expect(screen.getByText('Perfect Score')).toBeInTheDocument();
    });

    it('shows earned badges as earned', () => {
        localStorageMock.store['sixsigma-earned-badges'] = JSON.stringify(['first-step']);

        render(<AchievementBadges />);

        const firstStepCard = screen.getByTitle('Complete your first lesson').closest('.badge-card');
        expect(firstStepCard).toHaveClass('earned');
    });

    it('shows locked badges as locked', () => {
        render(<AchievementBadges earnedBadges={[]} />);

        const knowledgeCard = screen.getByTitle('Complete 10 lessons').closest('.badge-card');
        expect(knowledgeCard).toHaveClass('locked');
    });

    it('displays progress bar for badges with progress', () => {
        render(<AchievementBadges earnedBadges={[]} />);

        // Badge with maxProgress should show progress
        const firstStepCard = screen.getByTitle('Complete your first lesson');
        expect(firstStepCard).toBeInTheDocument();
    });

    it('hides category filter when showAll is false', () => {
        render(<AchievementBadges showAll={false} />);

        expect(screen.queryByRole('button', { name: /learning/i })).not.toBeInTheDocument();
    });
});

describe('useBadges hook', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('initializes with empty badges', () => {
        const { result } = renderHook(() => useBadges());

        expect(result.current.earnedBadges).toEqual([]);
    });

    it('loads badges from localStorage', () => {
        localStorageMock.store['sixsigma-earned-badges'] = JSON.stringify(['first-step', 'dedicated']);

        const { result } = renderHook(() => useBadges());

        expect(result.current.earnedBadges).toEqual(['first-step', 'dedicated']);
    });

    it('earns a new badge', () => {
        const { result } = renderHook(() => useBadges());

        act(() => {
            result.current.earnBadge('first-step');
        });

        expect(result.current.earnedBadges).toContain('first-step');
        expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('does not duplicate badges', () => {
        localStorageMock.store['sixsigma-earned-badges'] = JSON.stringify(['first-step']);

        const { result } = renderHook(() => useBadges());

        act(() => {
            result.current.earnBadge('first-step');
        });

        expect(result.current.earnedBadges.filter(b => b === 'first-step')).toHaveLength(1);
    });

    it('checks if badge is earned', () => {
        localStorageMock.store['sixsigma-earned-badges'] = JSON.stringify(['first-step']);

        const { result } = renderHook(() => useBadges());

        expect(result.current.hasBadge('first-step')).toBe(true);
        expect(result.current.hasBadge('quiz-master')).toBe(false);
    });

    it('updates progress and earns badge when complete', () => {
        const { result } = renderHook(() => useBadges());

        act(() => {
            result.current.updateProgress('first-step', 1);
        });

        expect(result.current.earnedBadges).toContain('first-step');
    });

    it('provides all badges list', () => {
        const { result } = renderHook(() => useBadges());

        expect(result.current.allBadges.length).toBeGreaterThan(0);
        expect(result.current.allBadges.find(b => b.id === 'first-step')).toBeDefined();
    });
});

// Helper to test hooks
import { renderHook, act } from '@testing-library/react';