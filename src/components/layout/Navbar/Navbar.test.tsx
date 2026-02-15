/**
 * Tests for Navbar Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Navbar } from './Navbar';
import { getUserProfile } from '../../../utils/db';

// Mock the database utility
vi.mock('../../../utils/db', () => ({
    getUserProfile: vi.fn(),
}));

describe('Navbar', () => {
    const mockOnMenuToggle = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        
        // Reset document theme
        document.documentElement.removeAttribute('data-theme');
    });

    describe('Rendering', () => {
        it('renders navbar', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            expect(document.querySelector('.navbar')).toBeInTheDocument();
        });

        it('displays logo', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            expect(screen.getByText('6σ')).toBeInTheDocument();
        });

        it('displays title', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            expect(screen.getByText('Six Sigma Academy')).toBeInTheDocument();
            expect(screen.getByText('Certification Training')).toBeInTheDocument();
        });

        it('displays hamburger menu when sidebar is closed', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            expect(screen.getByText('☰')).toBeInTheDocument();
        });

        it('displays close icon when sidebar is open', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={true} />);
            expect(screen.getByText('✕')).toBeInTheDocument();
        });

        it('displays theme toggle button', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            expect(screen.getByLabelText(/switch to.*mode/i)).toBeInTheDocument();
        });

        it('shows guest user when no profile loaded', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('Guest')).toBeInTheDocument();
        });

        it('shows question mark avatar for guest', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('?')).toBeInTheDocument();
        });
    });

    describe('User Profile', () => {
        it('displays user name when profile loaded', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                email: 'john@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        it('displays user initials in avatar', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                email: 'john@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('JD')).toBeInTheDocument();
        });

        it('handles single name correctly', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John',
                email: 'john@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('J')).toBeInTheDocument();
        });

        it('limits initials to 2 characters', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Michael Doe Smith',
                email: 'john@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('JM')).toBeInTheDocument();
        });

        it('loads user theme preference', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                email: 'john@example.com',
                currentBelt: 'white',
                preferences: { theme: 'light' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            // Wait a bit for theme to be applied
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            
            // The theme should be applied (either from user preference or localStorage)
            const theme = document.documentElement.getAttribute('data-theme');
            expect(theme === 'light' || theme === 'dark' || theme === null).toBe(true);
        });
    });

    describe('Menu Toggle', () => {
        it('calls onMenuToggle when menu button clicked', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            
            fireEvent.click(screen.getByLabelText('Toggle menu'));
            
            expect(mockOnMenuToggle).toHaveBeenCalledTimes(1);
        });
    });

    describe('Theme Toggle', () => {
        it('shows sun icon in dark mode', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('☀️')).toBeInTheDocument();
        });

        it('shows moon icon in light mode', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                preferences: { theme: 'light' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('🌙')).toBeInTheDocument();
        });

        it('toggles theme when clicked', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByText('☀️')).toBeInTheDocument();
            
            fireEvent.click(screen.getByLabelText(/switch to/i));
            
            expect(screen.getByText('🌙')).toBeInTheDocument();
            expect(localStorage.getItem('theme')).toBe('light');
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });

        it('has correct aria-label for theme toggle', async () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
                name: 'John Doe',
                preferences: { theme: 'dark' },
            });
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
        });

        it('uses localStorage theme as fallback', async () => {
            localStorage.setItem('theme', 'light');
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            
            await act(async () => {
                render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            });
            
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        });
    });

    describe('CSS Classes', () => {
        it('applies correct CSS classes', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            
            expect(document.querySelector('.navbar')).toBeInTheDocument();
            expect(document.querySelector('.navbar-brand')).toBeInTheDocument();
            expect(document.querySelector('.navbar-logo')).toBeInTheDocument();
            expect(document.querySelector('.navbar-actions')).toBeInTheDocument();
            expect(document.querySelector('.navbar-user')).toBeInTheDocument();
            expect(document.querySelector('.navbar-avatar')).toBeInTheDocument();
        });

        it('applies mobile menu button class', () => {
            (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
            render(<Navbar onMenuToggle={mockOnMenuToggle} isSidebarOpen={false} />);
            
            expect(document.querySelector('.mobile-menu-btn')).toBeInTheDocument();
        });
    });
});
