/**
 * Tests for BeltPage
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BeltPage } from './BeltPage';
import { UserProvider } from '../../contexts/UserContext';

// Mock dependencies
vi.mock('../../components/features/VideoPlayer/VideoPlayer', () => ({
    VideoPlayer: () => <div data-testid="video-player">Video Player</div>,
}));

vi.mock('../../components/features/QuizEngine/QuizEngine', () => ({
    QuizEngine: ({ onComplete }: { onComplete: () => void }) => (
        <div data-testid="quiz-engine">
            <button onClick={onComplete}>Complete Quiz</button>
        </div>
    ),
}));

vi.mock('../../utils/db', () => ({
    getBeltProgress: vi.fn().mockResolvedValue([]),
    getCertificateByBelt: vi.fn().mockResolvedValue(null),
    getUserProfile: vi.fn().mockResolvedValue({ name: 'Test User', email: 'test@example.com' }),
    saveUserProfile: vi.fn().mockResolvedValue(undefined),
    getModuleProgress: vi.fn().mockResolvedValue([]),
}));

describe('BeltPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRouter = (beltLevel: 'white' | 'yellow' | 'green' | 'black' | 'master') => {
        return render(
            <UserProvider>
                <MemoryRouter>
                    <BeltPage belt={beltLevel} />
                </MemoryRouter>
            </UserProvider>
        );
    };

    it('renders white belt page', () => {
        renderWithRouter('white');
        expect(screen.getByText(/white belt/i)).toBeInTheDocument();
    });

    it('renders yellow belt page', () => {
        renderWithRouter('yellow');
        expect(screen.getByText(/yellow belt/i)).toBeInTheDocument();
    });

    it('renders green belt page', () => {
        renderWithRouter('green');
        expect(screen.getByText(/green belt/i)).toBeInTheDocument();
    });

    it('renders black belt page', () => {
        renderWithRouter('black');
        expect(screen.getByText(/black belt/i)).toBeInTheDocument();
    });

    it('renders master black belt page', () => {
        renderWithRouter('master');
        expect(screen.getByText(/master black belt/i)).toBeInTheDocument();
    });

    it('displays final exam button', async () => {
        renderWithRouter('white');
        await waitFor(() => {
            expect(screen.getByText(/final exam/i)).toBeInTheDocument();
        });
    });

    it('displays progress section', async () => {
        renderWithRouter('white');
        await waitFor(() => {
            expect(screen.getByText(/progress/i)).toBeInTheDocument();
        });
    });
});
