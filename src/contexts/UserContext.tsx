'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, BeltLevel } from '../types';
import { getUserProfile, saveUserProfile, createDefaultProfile } from '../utils/db';

interface UserContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    userName: string;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    setUserName: (name: string) => Promise<void>;
    currentBelt: BeltLevel;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER_NAME = 'Six Sigma Student';

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            setIsLoading(true);
            try {
                const existingProfile = await getUserProfile();
                if (existingProfile) {
                    setProfile(existingProfile);
                } else {
                    // Create a default profile on first visit
                    const newProfile = await createDefaultProfile(DEFAULT_USER_NAME);
                    setProfile(newProfile);
                }
            } catch (error) {
                console.error('Failed to load user profile:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadProfile();
    }, []);

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!profile) return;
        const updatedProfile = { ...profile, ...updates };
        await saveUserProfile(updatedProfile);
        setProfile(updatedProfile);
    };

    const setUserName = async (name: string) => {
        await updateProfile({ name });
    };

    const value: UserContextType = {
        profile,
        isLoading,
        userName: profile?.name || DEFAULT_USER_NAME,
        updateProfile,
        setUserName,
        currentBelt: profile?.currentBelt || 'white',
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

// Hook for just getting the user name (convenience)
export function useUserName(): string {
    const { userName } = useUser();
    return userName;
}