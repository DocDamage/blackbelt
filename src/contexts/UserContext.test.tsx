/**
 * Tests for UserContext
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { UserProvider, useUser, useUserName } from './UserContext';
import React from 'react';

// Mock db
vi.mock('../utils/db', () => ({
    getUserProfile: vi.fn(),
    saveUserProfile: vi.fn(),
    createDefaultProfile: vi.fn(),
}));

import { getUserProfile, saveUserProfile, createDefaultProfile } from '../utils/db';

describe('UserContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <UserProvider>{children}</UserProvider>
    );

    it('provides default user values', async () => {
        (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(null);
        (createDefaultProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: 1,
            name: 'Six Sigma Student',
            email: '',
            currentBelt: 'white',
            preferences: { theme: 'dark' },
        });

        const { result } = renderHook(() => useUser(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.userName).toBe('Six Sigma Student');
        expect(result.current.currentBelt).toBe('white');
    });

    it('loads existing profile', async () => {
        (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            currentBelt: 'yellow',
            preferences: { theme: 'light' },
        });

        const { result } = renderHook(() => useUser(), { wrapper });

        await waitFor(() => {
            expect(result.current.userName).toBe('John Doe');
        });

        expect(result.current.currentBelt).toBe('yellow');
    });

    it('updates user name', async () => {
        (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: 1,
            name: 'Old Name',
            email: '',
            currentBelt: 'white',
            preferences: { theme: 'dark' },
        });
        (saveUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

        const { result } = renderHook(() => useUser(), { wrapper });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        await act(async () => {
            await result.current.setUserName('New Name');
        });

        expect(saveUserProfile).toHaveBeenCalled();
    });

    it('useUserName returns user name', async () => {
        (getUserProfile as ReturnType<typeof vi.fn>).mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: '',
            currentBelt: 'white',
            preferences: { theme: 'dark' },
        });

        const { result } = renderHook(() => useUserName(), { wrapper });

        await waitFor(() => {
            expect(result.current).toBe('Test User');
        });
    });

    it('throws error when used outside provider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useUser());
        }).toThrow('useUser must be used within a UserProvider');

        consoleSpy.mockRestore();
    });
});
