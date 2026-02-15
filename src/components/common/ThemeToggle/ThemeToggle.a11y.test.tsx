/**
 * ThemeToggle Component Accessibility Tests
 * 
 * Validates WCAG compliance for the ThemeToggle component
 * @technical_debt Issue 53: Automated Accessibility Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../../../contexts/ThemeContext';

expect.extend(toHaveNoViolations);

// Mock the useTheme hook
vi.mock('../../../contexts/ThemeContext', async () => {
    const actual = await vi.importActual('../../../contexts/ThemeContext');
    return {
        ...actual,
        useTheme: vi.fn(),
    };
});

describe('ThemeToggle Accessibility', () => {
    const mockToggleTheme = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should have no accessibility violations in light mode', async () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        const { container } = render(<ThemeToggle />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have no accessibility violations in dark mode', async () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'dark',
            toggleTheme: mockToggleTheme,
        });

        const { container } = render(<ThemeToggle />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have accessible name describing the action', async () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label');
        // Should indicate what clicking will do (switch to the other theme)
        expect(button.getAttribute('aria-label')).toMatch(/switch to/i);
    });

    it('should have accessible name mentioning target theme', async () => {
        // Test light mode - should offer to switch to dark
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        const { unmount } = render(<ThemeToggle />);
        let button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
        
        unmount();

        // Test dark mode - should offer to switch to light
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'dark',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('should have title attribute matching aria-label', async () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        render(<ThemeToggle />);
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title');
        expect(button.getAttribute('title')).toBe(button.getAttribute('aria-label'));
    });

    it('should be a button element (not a div)', async () => {
        (useTheme as ReturnType<typeof vi.fn>).mockReturnValue({
            resolvedTheme: 'light',
            toggleTheme: mockToggleTheme,
        });

        const { container } = render(<ThemeToggle />);
        const button = container.querySelector('button.theme-toggle');
        expect(button).toBeInTheDocument();
        expect(button?.tagName).toBe('BUTTON');
    });
});
