import { useState, useMemo } from 'react';
import { useUser } from '../../../contexts/UserContext';
import './ProfileSettings.css';

interface ProfileSettingsProps {
    onClose?: () => void;
}

interface ValidationErrors {
    name?: string;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
    const { profile, userName, setUserName, isLoading } = useUser();
    const [editName, setEditName] = useState(userName);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [touched, setTouched] = useState(false);

    // Validation logic
    const validation = useMemo(() => {
        const errors: ValidationErrors = {};
        const trimmedName = editName.trim();

        if (!trimmedName) {
            errors.name = 'Name is required';
        } else if (trimmedName.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        } else if (trimmedName.length > 100) {
            errors.name = 'Name must be less than 100 characters';
        } else if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedName)) {
            errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }

        return {
            errors,
            isValid: Object.keys(errors).length === 0
        };
    }, [editName]);

    const handleSave = async () => {
        setTouched(true);
        if (!validation.isValid) return;

        setIsSaving(true);
        try {
            await setUserName(editName.trim());
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="profile-settings">
                <div className="profile-loading">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="profile-settings">
            <div className="profile-header">
                <h2>Profile Settings</h2>
                {onClose && (
                    <button className="close-btn" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                )}
            </div>

            <div className="profile-content">
                <div className="form-group">
                    <label htmlFor="userName">Your Name</label>
                    <input
                        id="userName"
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => setTouched(true)}
                        placeholder="Enter your name"
                        maxLength={100}
                        className={touched && validation.errors.name ? 'input-error' : ''}
                        aria-invalid={touched && !!validation.errors.name}
                        aria-describedby={validation.errors.name ? 'name-error' : undefined}
                    />
                    {touched && validation.errors.name && (
                        <p id="name-error" className="form-error" role="alert">
                            {validation.errors.name}
                        </p>
                    )}
                    <p className="form-hint">
                        This name will appear on your certificates
                    </p>
                </div>

                {profile && (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="info-label">Current Belt</span>
                            <span className="info-value belt-badge">{profile.currentBelt}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Theme</span>
                            <span className="info-value">{profile.preferences.theme}</span>
                        </div>
                    </div>
                )}

                <div className="profile-actions">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={isSaving || !editName.trim()}
                    >
                        {isSaving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
                    </button>
                    {onClose && (
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}