/**
 * Tests for ThemeToggle Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider, useTheme } from '../../../contexts/ThemeContext';

// Mock the useTheme hook
vi.mock('../../../contexts/ThemeContext', async () => {
    const actual = await vi.importActual('../../../contexts/ThemeContext');
    return {
        ...actual,
        useTheme: vi.fn(),
    };
});

describe('ThemeToggle', () => {
    const mockToggleTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('renders theme toggle button', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays moon icon in light mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('displays sun icon in dark mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'dark',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    it('calls toggleTheme when clicked', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it('has correct aria-label for light mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has correct aria-label for dark mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'dark',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('has correct title for light mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute('title', 'Switch to dark mode');
    });

    it('has correct title for dark mode', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'dark',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveAttribute('title', 'Switch to light mode');
    });

    it('applies theme-toggle class', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        expect(screen.getByRole('button')).toHaveClass('theme-toggle');
    });

    it('renders theme icon with correct class', () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        const icon = document.querySelector('.theme-icon');
        expect(icon).toBeInTheDocument();
    });
});

describe('ThemeToggle Integration', () => {
    it('renders within ThemeProvider', () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>
        );
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has correct initial theme within ThemeProvider', () => {
        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>
        );
        
        const button = screen.getByRole('button');
        // Button should have an aria-label indicating the switch action
        expect(button).toHaveAttribute('aria-label');
        expect(button.getAttribute('aria-label')).toMatch(/switch to (light|dark) mode/i);
    });
});
