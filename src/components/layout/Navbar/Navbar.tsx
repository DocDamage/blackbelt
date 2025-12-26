import { useState, useEffect } from 'react';
import { getUserProfile } from '../../../utils/db';
import { UserProfile } from '../../../types';
import './Navbar.css';

interface NavbarProps {
    onMenuToggle: () => void;
    isSidebarOpen: boolean;
}

export function Navbar({ onMenuToggle, isSidebarOpen }: NavbarProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Load user profile
        getUserProfile().then(profile => {
            if (profile) {
                setUser(profile);
                setTheme(profile.preferences.theme);
            }
        });

        // Check saved theme
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
                    {isSidebarOpen ? '✕' : '☰'}
                </button>
                <div className="navbar-logo">6σ</div>
                <div>
                    <div className="navbar-title">Six Sigma Academy</div>
                    <div className="navbar-subtitle">Certification Training</div>
                </div>
            </div>

            <div className="navbar-actions">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <div className="navbar-user">
                    <div className="navbar-avatar">
                        {user ? getInitials(user.name) : '?'}
                    </div>
                    <span className="navbar-user-name">
                        {user?.name || 'Guest'}
                    </span>
                </div>
            </div>
        </nav>
    );
}
