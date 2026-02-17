/**
 * Login Page
 * 
 * Allows users to create an account, log in, or continue as guest.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveUserProfile } from '../../utils/db';
import { UserProfile } from '../../types';
import './LoginPage.css';

interface LoginFormData {
    name: string;
    email: string;
    company?: string;
}

export function LoginPage() {
    const navigate = useNavigate();
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        name: '',
        email: '',
        company: ''
    });
    const [errors, setErrors] = useState<Partial<LoginFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginFormData> = {};
        
        if (!formData.name.trim() || formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const newUser: UserProfile = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            currentBelt: 'white',
            preferences: {
                theme: 'dark',
                autoPlayVideos: true
            },
            createdAt: new Date()
        };

        try {
            await saveUserProfile(newUser);
            navigate('/');
            window.location.reload(); // Refresh to update navbar
        } catch (error) {
            console.error('Failed to create account:', error);
            setErrors({ email: 'Failed to create account. Please try again.' });
        }
    };

    const handleContinueAsGuest = () => {
        // Create a temporary guest user
        const guestUser: UserProfile = {
            name: 'Guest User',
            email: `guest_${Date.now()}@localhost`,
            currentBelt: 'white',
            preferences: {
                theme: 'dark',
                autoPlayVideos: true
            },
            createdAt: new Date()
        };

        saveUserProfile(guestUser).then(() => {
            navigate('/');
            window.location.reload();
        });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo">6σ</div>
                    <h1 className="login-title">Welcome to Six Sigma Academy</h1>
                    <p className="login-subtitle">
                        {isCreatingAccount 
                            ? 'Create your account to track progress and earn certificates'
                            : 'Sign in to access your personalized learning experience'}
                    </p>
                </div>

                {isCreatingAccount ? (
                    <form className="login-form" onSubmit={handleCreateAccount}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your full name"
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="company">Company (Optional)</label>
                            <input
                                type="text"
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Enter your company name"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg btn-full">
                            Create Account
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary btn-lg btn-full"
                            onClick={() => setIsCreatingAccount(false)}
                        >
                            Back to Login Options
                        </button>
                    </form>
                ) : (
                    <div className="login-options">
                        <button
                            className="login-option-btn primary"
                            onClick={() => setIsCreatingAccount(true)}
                        >
                            <span className="option-icon">👤</span>
                            <div className="option-content">
                                <h3>Create Account</h3>
                                <p>Track your progress and earn certificates</p>
                            </div>
                        </button>

                        <button
                            className="login-option-btn secondary"
                            onClick={handleContinueAsGuest}
                        >
                            <span className="option-icon">👋</span>
                            <div className="option-content">
                                <h3>Continue as Guest</h3>
                                <p>Browse content without creating an account</p>
                            </div>
                        </button>

                        <div className="login-divider">
                            <span>Already have an account?</span>
                        </div>

                        <Link to="/" className="btn btn-outline btn-lg btn-full">
                            Return to Home
                        </Link>
                    </div>
                )}

                <div className="login-footer">
                    <p>
                        By using this platform, you agree to our{' '}
                        <Link to="/">Terms of Service</Link> and{' '}
                        <Link to="/">Privacy Policy</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
