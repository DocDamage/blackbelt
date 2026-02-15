/**
 * Theme Toggle Component
 * 
 * A toggle button for switching between light/dark mode
 */

import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
    const { resolvedTheme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
        >
            {resolvedTheme === 'light' ? (
                <span className="theme-icon">🌙</span>
            ) : (
                <span className="theme-icon">☀️</span>
            )}
        </button>
    );
};

export default ThemeToggle;