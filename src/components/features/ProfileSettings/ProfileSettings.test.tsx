/**
 * Tests for ProfileSettings Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProfileSettings } from './ProfileSettings';
import { useUser } from '../../../contexts/UserContext';

// Mock the useUser hook
vi.mock('../../../contexts/UserContext', () => ({
    useUser: vi.fn(),
}));

describe('ProfileSettings', () => {
    const mockSetUserName = vi.fn();
    const mockOnClose = vi.fn();

    const defaultMockUser = {
        profile: {
            name: 'Test User',
            currentBelt: 'white',
            preferences: { theme: 'system' },
            email: 'test@example.com',
        },
        userName: 'Test User',
        isLoading: false,
        setUserName: mockSetUserName,
        updateProfile: vi.fn(),
        currentBelt: 'white' as const,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useUser as ReturnType<typeof vi.fn>).mockReturnValue(defaultMockUser);
    });

    describe('Rendering', () => {
        it('renders profile settings form', () => {
            render(<ProfileSettings />);
            expect(screen.getByText('Profile Settings')).toBeInTheDocument();
        });

        it('shows loading state when profile is loading', () => {
            (useUser as ReturnType<typeof vi.fn>).mockReturnValue({
                ...defaultMockUser,
                isLoading: true,
            });

            render(<ProfileSettings />);
            expect(screen.getByText('Loading profile...')).toBeInTheDocument();
        });

        it('displays current user name in input', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            expect(input).toHaveValue('Test User');
        });

        it('renders close button when onClose provided', () => {
            render(<ProfileSettings onClose={mockOnClose} />);
            expect(screen.getByLabelText('Close')).toBeInTheDocument();
        });

        it('does not render close button when onClose not provided', () => {
            render(<ProfileSettings />);
            expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
        });

        it('displays profile info when profile exists', () => {
            render(<ProfileSettings />);
            expect(screen.getByText('Current Belt')).toBeInTheDocument();
            expect(screen.getByText('white')).toBeInTheDocument();
            expect(screen.getByText('Theme')).toBeInTheDocument();
            expect(screen.getByText('system')).toBeInTheDocument();
        });

        it('displays form hint text', () => {
            render(<ProfileSettings />);
            expect(screen.getByText(/this name will appear on your certificates/i)).toBeInTheDocument();
        });
    });

    describe('Form Interactions', () => {
        it('updates name input when typing', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: 'New Name' } });
            
            expect(input).toHaveValue('New Name');
        });

        it('calls setUserName when save button clicked', async () => {
            mockSetUserName.mockResolvedValue(undefined);
            render(<ProfileSettings />);
            
            const input = screen.getByLabelText(/your name/i);
            fireEvent.change(input, { target: { value: 'New Name' } });
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(mockSetUserName).toHaveBeenCalledWith('New Name');
        });

        it('shows saving state while saving', async () => {
            mockSetUserName.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            render(<ProfileSettings />);
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(screen.getByText('Saving...')).toBeInTheDocument();
        });

        it('shows saved confirmation after successful save', async () => {
            mockSetUserName.mockResolvedValue(undefined);
            render(<ProfileSettings />);
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(screen.getByText('✓ Saved!')).toBeInTheDocument();
        });

        it('calls onClose when close button clicked', () => {
            render(<ProfileSettings onClose={mockOnClose} />);
            const closeButton = screen.getByLabelText('Close');
            
            fireEvent.click(closeButton);
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('calls onClose when secondary close button clicked', () => {
            render(<ProfileSettings onClose={mockOnClose} />);
            const closeButtons = screen.getAllByRole('button', { name: /close/i });
            
            fireEvent.click(closeButtons[1]!); // Second close button
            
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Validation', () => {
        it('shows error for empty name after blur', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            
            expect(screen.getByText('Name is required')).toBeInTheDocument();
        });

        it('shows error for name less than 2 characters', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: 'A' } });
            fireEvent.blur(input);
            
            expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
        });

        it('shows error for name with invalid characters', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: 'Test123' } });
            fireEvent.blur(input);
            
            expect(screen.getByText(/name can only contain letters/i)).toBeInTheDocument();
        });

        it('applies error class to input with invalid value', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            
            expect(input).toHaveClass('input-error');
        });

        it('sets aria-invalid on input with error', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });

        it('associates error message with input via aria-describedby', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '' } });
            fireEvent.blur(input);
            
            const errorId = input.getAttribute('aria-describedby');
            expect(errorId).toBe('name-error');
            expect(document.getElementById(errorId!)).toHaveTextContent('Name is required');
        });

        it('disables save button when name is empty', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '' } });
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            expect(saveButton).toBeDisabled();
        });

        it('disables save button when name is only whitespace', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: '   ' } });
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            expect(saveButton).toBeDisabled();
        });

        it('enables save button with valid name', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: 'Valid Name' } });
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            expect(saveButton).not.toBeDisabled();
        });

        it('does not call setUserName when validation fails', async () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: 'A' } });
            fireEvent.blur(input);
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(mockSetUserName).not.toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        it('trims whitespace from name before saving', async () => {
            mockSetUserName.mockResolvedValue(undefined);
            render(<ProfileSettings />);
            
            const input = screen.getByLabelText(/your name/i);
            fireEvent.change(input, { target: { value: '  John Doe  ' } });
            
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(mockSetUserName).toHaveBeenCalledWith('John Doe');
        });

        it('handles save error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockSetUserName.mockRejectedValue(new Error('Save failed'));
            
            render(<ProfileSettings />);
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(consoleSpy).toHaveBeenCalledWith('Failed to save profile:', expect.any(Error));
            consoleSpy.mockRestore();
        });

        it('resets saved state after 2 seconds', async () => {
            vi.useFakeTimers();
            mockSetUserName.mockResolvedValue(undefined);
            
            render(<ProfileSettings />);
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            
            await act(async () => {
                fireEvent.click(saveButton);
            });
            
            expect(screen.getByText('✓ Saved!')).toBeInTheDocument();
            
            act(() => {
                vi.advanceTimersByTime(2000);
            });
            
            expect(screen.queryByText('✓ Saved!')).not.toBeInTheDocument();
            vi.useRealTimers();
        });

        it('accepts names with hyphens and apostrophes', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            fireEvent.change(input, { target: { value: "Mary-Jane O'Connor" } });
            fireEvent.blur(input);
            
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('accepts names up to 100 characters', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            const longName = 'A'.repeat(100);
            
            fireEvent.change(input, { target: { value: longName } });
            fireEvent.blur(input);
            
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });

        it('shows error for names over 100 characters', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            const veryLongName = 'A'.repeat(101);
            
            fireEvent.change(input, { target: { value: veryLongName } });
            fireEvent.blur(input);
            
            expect(screen.getByText('Name must be less than 100 characters')).toBeInTheDocument();
        });

        it('respects maxLength attribute on input', () => {
            render(<ProfileSettings />);
            const input = screen.getByLabelText(/your name/i);
            
            expect(input).toHaveAttribute('maxLength', '100');
        });
    });
});
