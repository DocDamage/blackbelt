/**
 * Tests for ThemeContext
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import React from 'react';

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.style.colorScheme = '';
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
    );

    it('provides default theme values', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        expect(result.current.theme).toBeDefined();
        expect(result.current.resolvedTheme).toBeDefined();
        expect(typeof result.current.setTheme).toBe('function');
        expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('toggles theme between light and dark', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        const initialTheme = result.current.resolvedTheme;

        act(() => {
            result.current.toggleTheme();
        });

        expect(result.current.resolvedTheme).not.toBe(initialTheme);
        expect(['light', 'dark']).toContain(result.current.resolvedTheme);
    });

    it('sets theme directly', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setTheme('dark');
        });

        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
    });

    it('applies theme to document', () => {
        const { result } = renderHook(() => useTheme(), { wrapper });

        act(() => {
            result.current.setTheme('dark');
        });

        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('throws error when used outside provider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useTheme());
        }).toThrow('useTheme must be used within a ThemeProvider');

        consoleSpy.mockRestore();
    });
});
