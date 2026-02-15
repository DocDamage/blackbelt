/**
 * Tests for ProgressDashboard Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressDashboard } from './ProgressDashboard';

// Mock UserContext
vi.mock('../../../contexts/UserContext', () => ({
    useUser: () => ({
        profile: {
            name: 'Test User',
            currentBelt: 'green',
        },
    }),
}));

describe('ProgressDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders dashboard header', () => {
        render(<ProgressDashboard />);
        expect(screen.getByText('Your Progress')).toBeInTheDocument();
        expect(screen.getByText(/track your six sigma journey/i)).toBeInTheDocument();
    });

    it('displays stats cards', () => {
        render(<ProgressDashboard />);
        expect(screen.getByText(/overall progress/i)).toBeInTheDocument();
        expect(screen.getByText(/certificates/i)).toBeInTheDocument();
        // Use getAllByText since these labels may appear multiple times
        const streakElements = screen.getAllByText(/day streak/i);
        expect(streakElements.length).toBeGreaterThan(0);
        const studyTimeElements = screen.getAllByText(/study time/i);
        expect(studyTimeElements.length).toBeGreaterThan(0);
    });

    it('shows journey progress section', () => {
        render(<ProgressDashboard />);
        expect(screen.getByText(/journey to master black belt/i)).toBeInTheDocument();
    });

    it('displays belt milestones', () => {
        render(<ProgressDashboard />);
        // Use getAllByText since belt names appear in both milestones and cards
        expect(screen.getAllByText('White Belt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Yellow Belt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Green Belt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Black Belt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Master Black Belt').length).toBeGreaterThan(0);
    });

    it('shows belt progress cards', () => {
        render(<ProgressDashboard />);
        // Belt names appear in both milestones and card sections
        const whiteBeltElements = screen.getAllByText(/white belt/i);
        expect(whiteBeltElements.length).toBeGreaterThan(0);
    });

    it('displays modules count for belts', () => {
        render(<ProgressDashboard />);
        // Should show module count format "X/Y modules"
        const moduleTexts = screen.getAllByText(/modules/i);
        expect(moduleTexts.length).toBeGreaterThan(0);
    });

    it('shows quick actions section', () => {
        render(<ProgressDashboard />);
        expect(screen.getByText(/continue learning/i)).toBeInTheDocument();
    });

    it('displays current level', () => {
        render(<ProgressDashboard />);
        expect(screen.getByText(/current level/i)).toBeInTheDocument();
    });

    it('initializes with default progress', () => {
        render(<ProgressDashboard />);
        // Overall progress should show 0% initially (no stored progress)
        const progressValue = screen.getByText('0%');
        expect(progressValue).toBeInTheDocument();
    });

    it('loads progress from localStorage', () => {
        const storedData = {
            beltProgress: [
                { belt: 'White Belt', beltId: 'white', modulesCompleted: 2, totalModules: 4, quizzesPassed: false, bestScore: null },
                { belt: 'Yellow Belt', beltId: 'yellow', modulesCompleted: 3, totalModules: 5, quizzesPassed: true, bestScore: 85 },
                { belt: 'Green Belt', beltId: 'green', modulesCompleted: 1, totalModules: 6, quizzesPassed: false, bestScore: null },
                { belt: 'Black Belt', beltId: 'black', modulesCompleted: 0, totalModules: 8, quizzesPassed: false, bestScore: null },
                { belt: 'Master Black Belt', beltId: 'master', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
            ],
            studyStreak: 5,
            totalStudyTime: 3600,
        };
        localStorage.setItem('sixsigma_progress', JSON.stringify(storedData));

        render(<ProgressDashboard />);

        // Should show 5 day streak
        expect(screen.getByText('5')).toBeInTheDocument();
        // Should show 60m study time (3600/60)
        expect(screen.getByText('60m')).toBeInTheDocument();
    });

    it('displays certificate count correctly', () => {
        const storedData = {
            beltProgress: [
                { belt: 'White Belt', beltId: 'white', modulesCompleted: 4, totalModules: 4, quizzesPassed: true, bestScore: 90 },
                { belt: 'Yellow Belt', beltId: 'yellow', modulesCompleted: 5, totalModules: 5, quizzesPassed: true, bestScore: 85 },
                { belt: 'Green Belt', beltId: 'green', modulesCompleted: 0, totalModules: 6, quizzesPassed: false, bestScore: null },
                { belt: 'Black Belt', beltId: 'black', modulesCompleted: 0, totalModules: 8, quizzesPassed: false, bestScore: null },
                { belt: 'Master Black Belt', beltId: 'master', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
            ],
            studyStreak: 0,
            totalStudyTime: 0,
        };
        localStorage.setItem('sixsigma_progress', JSON.stringify(storedData));

        render(<ProgressDashboard />);

        // Should show 2 certificates
        const certValue = screen.getByText('2');
        expect(certValue).toBeInTheDocument();
    });

    it('shows certified badge on completed belts', () => {
        const storedData = {
            beltProgress: [
                { belt: 'White Belt', beltId: 'white', modulesCompleted: 4, totalModules: 4, quizzesPassed: true, bestScore: 90 },
                { belt: 'Yellow Belt', beltId: 'yellow', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
                { belt: 'Green Belt', beltId: 'green', modulesCompleted: 0, totalModules: 6, quizzesPassed: false, bestScore: null },
                { belt: 'Black Belt', beltId: 'black', modulesCompleted: 0, totalModules: 8, quizzesPassed: false, bestScore: null },
                { belt: 'Master Black Belt', beltId: 'master', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
            ],
            studyStreak: 0,
            totalStudyTime: 0,
        };
        localStorage.setItem('sixsigma_progress', JSON.stringify(storedData));

        render(<ProgressDashboard />);

        expect(screen.getByText(/certified/i)).toBeInTheDocument();
    });

    it('shows best score when available', () => {
        const storedData = {
            beltProgress: [
                { belt: 'White Belt', beltId: 'white', modulesCompleted: 4, totalModules: 4, quizzesPassed: true, bestScore: 92 },
                { belt: 'Yellow Belt', beltId: 'yellow', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
                { belt: 'Green Belt', beltId: 'green', modulesCompleted: 0, totalModules: 6, quizzesPassed: false, bestScore: null },
                { belt: 'Black Belt', beltId: 'black', modulesCompleted: 0, totalModules: 8, quizzesPassed: false, bestScore: null },
                { belt: 'Master Black Belt', beltId: 'master', modulesCompleted: 0, totalModules: 5, quizzesPassed: false, bestScore: null },
            ],
            studyStreak: 0,
            totalStudyTime: 0,
        };
        localStorage.setItem('sixsigma_progress', JSON.stringify(storedData));

        render(<ProgressDashboard />);

        expect(screen.getByText(/best: 92%/i)).toBeInTheDocument();
    });

    it('handles invalid localStorage data gracefully', () => {
        localStorage.setItem('sixsigma_progress', 'invalid json');

        render(<ProgressDashboard />);

        // Should still render with default values
        expect(screen.getByText('Your Progress')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        render(<ProgressDashboard className="custom-class" />);
        const dashboard = document.querySelector('.progress-dashboard');
        expect(dashboard).toHaveClass('custom-class');
    });
});