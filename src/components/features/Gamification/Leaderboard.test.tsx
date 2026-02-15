/**
 * Tests for Leaderboard Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Leaderboard } from './Leaderboard';

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

describe('Leaderboard', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    it('renders leaderboard header', () => {
        render(<Leaderboard />);
        expect(screen.getByText('🏆 Leaderboard')).toBeInTheDocument();
    });

    it('displays podium with top 3 users', () => {
        render(<Leaderboard />);
        expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
        expect(screen.getByText('Mike Johnson')).toBeInTheDocument();
        expect(screen.getByText('Emma Davis')).toBeInTheDocument();
    });

    it('shows medal icons for top 3', () => {
        render(<Leaderboard />);
        expect(screen.getByText('🥇')).toBeInTheDocument();
        expect(screen.getByText('🥈')).toBeInTheDocument();
        expect(screen.getByText('🥉')).toBeInTheDocument();
    });

    it('filters by metric - points', () => {
        render(<Leaderboard />);

        const pointsButton = screen.getByRole('button', { name: /points/i });
        fireEvent.click(pointsButton);

        expect(pointsButton).toHaveClass('active');
    });

    it('filters by metric - streak', () => {
        render(<Leaderboard />);

        const streakButton = screen.getByRole('button', { name: /streak/i });
        fireEvent.click(streakButton);

        expect(streakButton).toHaveClass('active');
    });

    it('filters by metric - badges', () => {
        render(<Leaderboard />);

        const badgesButton = screen.getByRole('button', { name: /badges/i });
        fireEvent.click(badgesButton);

        expect(badgesButton).toHaveClass('active');
    });

    it('changes timeframe selection', () => {
        render(<Leaderboard />);

        const timeframeSelect = screen.getByRole('combobox');
        fireEvent.change(timeframeSelect, { target: { value: 'week' } });

        expect(timeframeSelect).toHaveValue('week');
    });

    it('displays leaderboard list with remaining users', () => {
        render(<Leaderboard />);

        // Users ranked 4-10 should be in the list
        expect(screen.getByText('James Wilson')).toBeInTheDocument();
        expect(screen.getByText('Lisa Anderson')).toBeInTheDocument();
    });

    it('shows points/metric label', () => {
        render(<Leaderboard />);

        // Default metric is "score" which shows "Points"
        const pointsLabels = screen.getAllByText('Points');
        expect(pointsLabels.length).toBeGreaterThan(0);
    });

    it('shows streak count when streak metric selected', () => {
        render(<Leaderboard />);

        const streakButton = screen.getByRole('button', { name: /streak/i });
        fireEvent.click(streakButton);

        // Multiple instances of "Day Streak" appear (one per user)
        const streakLabels = screen.getAllByText('Day Streak');
        expect(streakLabels.length).toBeGreaterThan(0);
    });

    it('highlights current user', () => {
        render(<Leaderboard currentUserId="1" />);

        // Sarah Chen is user 1, should have current-user class
        const sarahElement = screen.getByText('Sarah Chen').closest('.podium-item');
        expect(sarahElement).toHaveClass('current-user');
    });

    it('shows user position when not in top 10', () => {
        render(<Leaderboard currentUserId="not-in-top-10" />);

        expect(screen.getByText(/your position/i)).toBeInTheDocument();
    });
});