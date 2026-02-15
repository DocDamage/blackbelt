/**
 * Tests for CertificateSharing Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CertificateSharing } from './CertificateSharing';

describe('CertificateSharing', () => {
    const mockProps = {
        beltLevel: 'white',
        userName: 'John Doe',
        completionDate: '2024-01-15T10:00:00Z',
        certificateId: 'CERT-123-456',
    };

    // Store original window.location
    const originalLocation = window.location;

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock window.location
        Object.defineProperty(window, 'location', {
            value: { origin: 'https://example.com' },
            writable: true,
        });

        // Mock navigator.clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: vi.fn() },
            writable: true,
        });

        // Mock navigator.share as undefined (not available in jsdom/test environment)
        Object.defineProperty(navigator, 'share', {
            value: undefined,
            writable: true,
        });

        // Mock window.open
        window.open = vi.fn(() => ({
            document: { write: vi.fn(), close: vi.fn() },
        } as unknown as Window));
    });

    afterEach(() => {
        // Restore window.location
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
        });
    });

    describe('Rendering', () => {
        it('renders share button', () => {
            render(<CertificateSharing {...mockProps} />);
            expect(screen.getByText('📤 Share Certificate')).toBeInTheDocument();
        });

        it('does not show share menu by default', () => {
            render(<CertificateSharing {...mockProps} />);
            expect(screen.queryByText('Share Your Achievement')).not.toBeInTheDocument();
        });
    });

    describe('Share Menu', () => {
        it('opens share menu when share button clicked', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });

        it('shows LinkedIn share option', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('💼')).toBeInTheDocument();
            expect(screen.getByText('LinkedIn')).toBeInTheDocument();
        });

        it('shows Twitter share option', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('🐦')).toBeInTheDocument();
            expect(screen.getByText('Twitter')).toBeInTheDocument();
        });

        it('shows Facebook share option', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('📘')).toBeInTheDocument();
            expect(screen.getByText('Facebook')).toBeInTheDocument();
        });

        it('shows copy link option', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('🔗')).toBeInTheDocument();
            expect(screen.getByText('Copy Link')).toBeInTheDocument();
        });

        it('shows download option', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('📄')).toBeInTheDocument();
            expect(screen.getByText('Print/Download')).toBeInTheDocument();
        });

        it('closes share menu when toggled', () => {
            render(<CertificateSharing {...mockProps} />);
            const shareBtn = screen.getByText('📤 Share Certificate');
            
            fireEvent.click(shareBtn);
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
            
            fireEvent.click(shareBtn);
            expect(screen.queryByText('Share Your Achievement')).not.toBeInTheDocument();
        });
    });

    describe('Social Share Links', () => {
        it('generates correct LinkedIn URL', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const linkedInLink = screen.getByText('LinkedIn').closest('a');
            expect(linkedInLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));
            expect(linkedInLink).toHaveAttribute('target', '_blank');
            expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
        });

        it('generates correct Twitter URL', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const twitterLink = screen.getByText('Twitter').closest('a');
            expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
            expect(twitterLink).toHaveAttribute('target', '_blank');
        });

        it('generates correct Facebook URL', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const facebookLink = screen.getByText('Facebook').closest('a');
            expect(facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));
            expect(facebookLink).toHaveAttribute('target', '_blank');
        });

        it('includes certificate ID in share URLs', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const linkedInLink = screen.getByText('LinkedIn').closest('a');
            expect(linkedInLink).toHaveAttribute('href', expect.stringContaining('CERT-123-456'));
        });
    });

    describe('Copy Link', () => {
        it('copies link to clipboard when clicked', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            navigator.clipboard.writeText = mockWriteText;
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const copyBtn = screen.getByText('Copy Link').closest('button');
            await act(async () => {
                fireEvent.click(copyBtn!);
            });
            
            expect(mockWriteText).toHaveBeenCalledWith(
                'https://example.com/certificates/validate/CERT-123-456'
            );
        });

        it('shows copied confirmation after copying', async () => {
            navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
            vi.useFakeTimers();
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const copyBtn = screen.getByText('Copy Link').closest('button');
            await act(async () => {
                fireEvent.click(copyBtn!);
            });
            
            expect(screen.getByText('✓')).toBeInTheDocument();
            expect(screen.getByText('Copied!')).toBeInTheDocument();
            
            vi.useRealTimers();
        });

        it('resets copied state after 2 seconds', async () => {
            navigator.clipboard.writeText = vi.fn().mockResolvedValue(undefined);
            vi.useFakeTimers();
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const copyBtn = screen.getByText('Copy Link').closest('button');
            await act(async () => {
                fireEvent.click(copyBtn!);
            });
            
            expect(screen.getByText('Copied!')).toBeInTheDocument();
            
            act(() => {
                vi.advanceTimersByTime(2000);
            });
            
            expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
            vi.useRealTimers();
        });

        it('handles clipboard error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const copyBtn = screen.getByText('Copy Link').closest('button');
            await act(async () => {
                fireEvent.click(copyBtn!);
            });
            
            expect(consoleSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });

    describe('Native Share API', () => {
        it('shows menu when native share not available', () => {
            // navigator.share is undefined by default in our mock
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            // Menu should be visible
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });
    });

    describe('Print/Download', () => {
        it('opens print window when download clicked', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const downloadBtn = screen.getByText('Print/Download').closest('button');
            fireEvent.click(downloadBtn!);
            
            expect(window.open).toHaveBeenCalledWith('', '_blank');
        });

        it('writes certificate HTML to print window', () => {
            const mockWrite = vi.fn();
            const mockClose = vi.fn();
            (window.open as ReturnType<typeof vi.fn>).mockReturnValue({
                document: { write: mockWrite, close: mockClose },
            });
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const downloadBtn = screen.getByText('Print/Download').closest('button');
            fireEvent.click(downloadBtn!);
            
            expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining('Certificate of Completion'));
            expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining('John Doe'));
            expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining('White Belt'));
            expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining('CERT-123-456'));
            expect(mockClose).toHaveBeenCalled();
        });

        it('includes formatted date in certificate', () => {
            const mockWrite = vi.fn();
            (window.open as ReturnType<typeof vi.fn>).mockReturnValue({
                document: { write: mockWrite, close: vi.fn() },
            });
            
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            const downloadBtn = screen.getByText('Print/Download').closest('button');
            fireEvent.click(downloadBtn!);
            
            // Should include formatted date like "January 15, 2024"
            expect(mockWrite).toHaveBeenCalledWith(expect.stringContaining('2024'));
        });
    });

    describe('Belt Level Names', () => {
        it('displays correct belt name in share text for white belt', () => {
            render(<CertificateSharing {...mockProps} beltLevel="white" />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });

        it('displays correct belt name in share text for yellow belt', () => {
            render(<CertificateSharing {...mockProps} beltLevel="yellow" />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });

        it('displays correct belt name in share text for green belt', () => {
            render(<CertificateSharing {...mockProps} beltLevel="green" />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });

        it('displays correct belt name in share text for black belt', () => {
            render(<CertificateSharing {...mockProps} beltLevel="black" />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });

        it('displays correct belt name in share text for master black belt', () => {
            render(<CertificateSharing {...mockProps} beltLevel="master" />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(screen.getByText('Share Your Achievement')).toBeInTheDocument();
        });
    });

    describe('CSS Classes', () => {
        it('applies correct CSS classes', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(document.querySelector('.certificate-sharing')).toBeInTheDocument();
            expect(document.querySelector('.share-menu')).toBeInTheDocument();
            expect(document.querySelector('.share-options')).toBeInTheDocument();
        });

        it('applies platform-specific classes', () => {
            render(<CertificateSharing {...mockProps} />);
            fireEvent.click(screen.getByText('📤 Share Certificate'));
            
            expect(document.querySelector('.share-option.linkedin')).toBeInTheDocument();
            expect(document.querySelector('.share-option.twitter')).toBeInTheDocument();
            expect(document.querySelector('.share-option.facebook')).toBeInTheDocument();
            expect(document.querySelector('.share-option.copy')).toBeInTheDocument();
            expect(document.querySelector('.share-option.download')).toBeInTheDocument();
        });
    });
});
