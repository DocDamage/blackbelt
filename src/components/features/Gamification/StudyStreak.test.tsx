/**
 * Tests for StudyStreak Gamification Component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudyStreak } from './StudyStreak';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('StudyStreak', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('renders the study streak component', () => {
        render(<StudyStreak />);
        // Check for level badge which is always visible
        expect(screen.getByText('Level')).toBeInTheDocument();
    });

    it('displays current streak count', () => {
        render(<StudyStreak />);
        // Should show "day streak" label
        expect(screen.getByText(/day streak/i)).toBeInTheDocument();
    });

    it('displays XP information', () => {
        render(<StudyStreak />);
        expect(screen.getByText(/XP/i)).toBeInTheDocument();
    });

    it('displays achievements button', () => {
        render(<StudyStreak />);
        // Achievements is a toggle button
        expect(screen.getByRole('button', { name: /Achievements/i })).toBeInTheDocument();
    });

    it('toggles achievements panel on click', () => {
        render(<StudyStreak />);
        const toggleButton = screen.getByRole('button', { name: /Achievements/i });

        // Click to show achievements
        fireEvent.click(toggleButton);
        expect(screen.getByText('First Step')).toBeInTheDocument();

        // Click again to hide
        fireEvent.click(toggleButton);
        expect(screen.queryByText('First Step')).not.toBeInTheDocument();
    });

    it('loads saved data from localStorage', () => {
        // Pre-populate localStorage with the correct key
        const mockData = {
            currentStreak: 3,
            longestStreak: 5,
            totalMinutes: 500,
            totalModules: 10,
            totalQuizzes: 5,
            studyDays: [],
            achievements: [],
            level: 2,
            xp: 500
        };
        localStorageMock.setItem('sixsigma_study_streak', JSON.stringify(mockData));

        render(<StudyStreak />);

        // Should display saved XP value
        expect(screen.getByText('500 XP')).toBeInTheDocument();
    });

    it('displays session statistics', () => {
        render(<StudyStreak />);
        // Check for stats labels
        expect(screen.getByText('Minutes')).toBeInTheDocument();
        expect(screen.getByText('Modules')).toBeInTheDocument();
        expect(screen.getByText('Quizzes')).toBeInTheDocument();
        expect(screen.getByText('Best Streak')).toBeInTheDocument();
    });

    it('displays week calendar with days', () => {
        render(<StudyStreak />);
        // Check for day names (Mon, Tue, etc.)
        const dayElements = document.querySelectorAll('.day');
        expect(dayElements.length).toBe(7);
    });

    it('shows streak reminder when streak is pending', () => {
        // Set up data where yesterday was the last study date
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const mockData = {
            currentStreak: 2,
            longestStreak: 2,
            totalMinutes: 30,
            totalModules: 1,
            totalQuizzes: 0,
            studyDays: [{ date: yesterday, minutesStudied: 30, modulesCompleted: 1, quizzesPassed: 0 }],
            achievements: [],
            lastStudyDate: yesterday,
            level: 1,
            xp: 80
        };
        localStorageMock.setItem('sixsigma_study_streak', JSON.stringify(mockData));

        render(<StudyStreak />);

        expect(screen.getByText(/Keep your streak alive/i)).toBeInTheDocument();
    });
});