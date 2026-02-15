/**
 * Tests for Home Page
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { UserProvider } from '../../contexts/UserContext';

// Mock dependencies
vi.mock('../../utils/db', () => ({
    getUserProfile: vi.fn().mockResolvedValue(null),
    saveUserProfile: vi.fn().mockResolvedValue(1),
    createDefaultProfile: vi.fn().mockReturnValue({
        id: 1,
        name: 'Test User',
        email: '',
        currentBelt: 'white',
        joinedAt: new Date().toISOString(),
        preferences: { theme: 'dark', notifications: true }
    }),
    getBeltProgress: vi.fn().mockResolvedValue([]),
}));

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <UserProvider>
            <MemoryRouter>
                {ui}
            </MemoryRouter>
        </UserProvider>
    );
};

const mockBeltProgress = {
    white: 50,
    yellow: 30,
    green: 0,
    black: 0,
    master: 0,
};

describe('Home', () => {
    it('renders without crashing', () => {
        const { container } = renderWithProviders(<Home beltProgress={mockBeltProgress} />);
        expect(container).toBeTruthy();
    });

    it('renders certification path section', () => {
        renderWithProviders(<Home beltProgress={mockBeltProgress} />);
        expect(screen.getByRole('heading', { name: /certification path/i })).toBeInTheDocument();
    });

    it('renders continue learning section', () => {
        renderWithProviders(<Home beltProgress={mockBeltProgress} />);
        expect(screen.getByText(/continue learning/i)).toBeInTheDocument();
    });

    it('renders belt progress indicators', () => {
        renderWithProviders(<Home beltProgress={mockBeltProgress} />);
        // Check for progress percentage display
        expect(screen.getAllByText(/50%/i).length).toBeGreaterThan(0);
    });

    it('renders home page container', () => {
        renderWithProviders(<Home beltProgress={mockBeltProgress} />);
        expect(document.querySelector('.home-page')).toBeInTheDocument();
    });
});
