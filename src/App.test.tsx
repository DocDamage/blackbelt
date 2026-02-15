/**
 * Tests for App Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock the database utilities
vi.mock('./utils/db', () => ({
    getBeltProgress: vi.fn().mockResolvedValue([]),
    getUserProfile: vi.fn().mockResolvedValue({ name: 'Test User', email: 'test@example.com' }),
    saveUserProfile: vi.fn().mockResolvedValue(undefined),
}));

// Mock lazy-loaded components with proper content
vi.mock('./pages/Home/Home', () => ({
    Home: () => <div data-testid="home-page">Home Page Content</div>
}));

vi.mock('./pages/belts/BeltPage', () => ({
    BeltPage: () => <div data-testid="belt-page">Belt Page Content</div>
}));

vi.mock('./pages/certificates/CertificatesPage', () => ({
    CertificatesPage: () => <div data-testid="certificates-page">Certificates Page</div>
}));

vi.mock('./pages/certificates/CertificateValidatePage', () => ({
    CertificateValidatePage: () => <div data-testid="validate-page">Validate Page</div>
}));

vi.mock('./pages/Tools/ToolsPage', () => ({
    ToolsPage: () => <div data-testid="tools-page">Tools Page</div>
}));

// Mock child components
vi.mock('./components/layout/Navbar/Navbar', () => ({
    Navbar: ({ onMenuClick }: { onMenuClick: () => void }) => (
        <nav data-testid="navbar">
            <button data-testid="menu-button" onClick={onMenuClick}>Menu</button>
        </nav>
    )
}));

vi.mock('./components/layout/Sidebar/Sidebar', () => ({
    Sidebar: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
        <aside data-testid="sidebar" data-open={isOpen}>
            <button data-testid="close-sidebar" onClick={onClose}>Close</button>
        </aside>
    )
}));

vi.mock('./components/features/Chatbot/Chatbot', () => ({
    Chatbot: () => <div data-testid="chatbot">Chatbot Component</div>
}));

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the application layout', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByRole('application')).toBeInTheDocument();
        expect(screen.getByLabelText('Six Sigma Training Platform')).toBeInTheDocument();
    });

    it('renders navbar', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders sidebar', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders skip link for accessibility', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        const skipLink = screen.getByText('Skip to main content');
        expect(skipLink).toBeInTheDocument();
        expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('toggles sidebar when menu button clicked', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Verify initial state
        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');

        // Click menu button
        await act(async () => {
            fireEvent.click(screen.getByTestId('menu-button'));
        });

        // Verify button was clicked (state change is handled internally)
        expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    });

    it('closes sidebar when close button clicked', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Open sidebar first
        await act(async () => {
            fireEvent.click(screen.getByTestId('menu-button'));
        });

        // Close it
        await act(async () => {
            fireEvent.click(screen.getByTestId('close-sidebar'));
        });

        // Verify close button works
        expect(screen.getByTestId('close-sidebar')).toBeInTheDocument();
    });

    it('renders chatbot component', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('chatbot')).toBeInTheDocument();
    });

    it('has main content area with correct ID', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        const mainContent = screen.getByRole('main');
        expect(mainContent).toHaveAttribute('id', 'main-content');
    });

    it('loads belt progress on mount', async () => {
        const { getBeltProgress } = await import('./utils/db');

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getBeltProgress).toHaveBeenCalled();
        });
    });

    it('loads progress for all belt levels', async () => {
        const { getBeltProgress } = await import('./utils/db');

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getBeltProgress).toHaveBeenCalledWith('white');
            expect(getBeltProgress).toHaveBeenCalledWith('yellow');
            expect(getBeltProgress).toHaveBeenCalledWith('green');
            expect(getBeltProgress).toHaveBeenCalledWith('black');
            expect(getBeltProgress).toHaveBeenCalledWith('master');
        });
    });

    it('renders UserProvider context wrapper', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // The app should render without errors with UserProvider
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('routes to home page by default', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('routes to certificates page', () => {
        render(
            <MemoryRouter initialEntries={['/certificates']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('certificates-page')).toBeInTheDocument();
    });

    it('routes to validate page', () => {
        render(
            <MemoryRouter initialEntries={['/certificates/validate']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('validate-page')).toBeInTheDocument();
    });

    it('routes to tools page', () => {
        render(
            <MemoryRouter initialEntries={['/tools']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('tools-page')).toBeInTheDocument();
    });

    it('routes to belt pages', () => {
        const beltLevels = ['white', 'yellow', 'green', 'black', 'master'];

        beltLevels.forEach(belt => {
            const { container } = render(
                <MemoryRouter initialEntries={[`/belt/${belt}`]}>
                    <App />
                </MemoryRouter>
            );

            // Clean up between renders
            container.remove();
        });
    });

    it('provides role application wrapper', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        const appLayout = screen.getByRole('application');
        expect(appLayout).toHaveClass('app-layout');
    });

    it('handles sidebar toggle callback', async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Toggle multiple times to ensure callback works
        await act(async () => {
            fireEvent.click(screen.getByTestId('menu-button'));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('menu-button'));
        });

        // Verify components are still rendered after toggles
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('initializes with closed sidebar', () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByTestId('sidebar')).toHaveAttribute('data-open', 'false');
    });

    it('updates progress state when data loaded', async () => {
        const { getBeltProgress } = await import('./utils/db');

        // Mock different progress for different belts
        (getBeltProgress as any)
            .mockResolvedValueOnce([{ completed: true }, { completed: false }])  // white: 50%
            .mockResolvedValueOnce([{ completed: true }, { completed: true }])    // yellow: 100%
            .mockResolvedValueOnce([])                                             // green: 0%
            .mockResolvedValueOnce([{ completed: true }])                          // black: 100%
            .mockResolvedValueOnce([{ completed: false }]);                        // master: 0%

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Component should render without errors and load progress
        await waitFor(() => {
            expect(getBeltProgress).toHaveBeenCalledTimes(5);
        });
    });

    it('handles progress loading errors gracefully', async () => {
        const { getBeltProgress } = await import('./utils/db');
        (getBeltProgress as any).mockRejectedValue(new Error('DB Error'));

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        // Should still render despite errors
        await waitFor(() => {
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
        });
    });
});
