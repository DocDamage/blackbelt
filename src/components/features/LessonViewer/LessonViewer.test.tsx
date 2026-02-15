/**
 * Tests for LessonViewer Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LessonViewer } from './LessonViewer';
import { markLessonComplete, updateLessonTime } from '../../../utils/db';

// Mock the database utilities
vi.mock('../../../utils/db', () => ({
    markLessonComplete: vi.fn(),
    updateLessonTime: vi.fn(),
}));

describe('LessonViewer', () => {
    const mockLesson = {
        id: 'lesson-1',
        title: 'Introduction to Six Sigma',
        content: '<p>This is lesson content</p>',
        estimatedMinutes: 15,
        videoUrl: 'https://youtube.com/embed/abc123',
        videoTitle: 'Six Sigma Intro Video',
        order: 1,
    };

    const mockProps = {
        lesson: mockLesson,
        moduleId: 'module-1',
        beltLevel: 'white' as const,
        isCompleted: false,
        onComplete: vi.fn(),
        onClose: vi.fn(),
        onNext: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Rendering', () => {
        it('renders lesson viewer', () => {
            render(<LessonViewer {...mockProps} />);
            // Check for h1 title specifically
            const title = document.querySelector('.lesson-main-title');
            expect(title).toHaveTextContent('Introduction to Six Sigma');
        });

        it('displays lesson title in header', () => {
            render(<LessonViewer {...mockProps} />);
            expect(screen.getAllByText('Introduction to Six Sigma').length).toBeGreaterThan(0);
        });

        it('displays estimated time badge', () => {
            render(<LessonViewer {...mockProps} />);
            expect(screen.getByText(/15 minutes/)).toBeInTheDocument();
        });

        it('renders back button', () => {
            render(<LessonViewer {...mockProps} />);
            // Check for the header back button specifically
            const backButton = document.querySelector('.lesson-back-btn');
            expect(backButton).toBeInTheDocument();
            expect(backButton).toHaveTextContent(/back to modules/i);
        });

        it('renders video iframe when videoUrl provided', () => {
            render(<LessonViewer {...mockProps} />);
            const iframe = document.querySelector('iframe');
            expect(iframe).toBeInTheDocument();
            expect(iframe?.getAttribute('src')).toBe('https://youtube.com/embed/abc123');
        });

        it('displays video title when provided', () => {
            render(<LessonViewer {...mockProps} />);
            expect(screen.getByText(/six sigma intro video/i)).toBeInTheDocument();
        });

        it('does not render video section when no videoUrl', () => {
            const propsWithoutVideo = {
                ...mockProps,
                lesson: { ...mockLesson, videoUrl: undefined },
            };
            render(<LessonViewer {...propsWithoutVideo} />);
            expect(document.querySelector('.lesson-video')).not.toBeInTheDocument();
        });

        it('renders lesson content with dangerouslySetInnerHTML', () => {
            render(<LessonViewer {...mockProps} />);
            expect(screen.getByText('This is lesson content')).toBeInTheDocument();
        });

        it('shows mark complete button when not completed', () => {
            render(<LessonViewer {...mockProps} isCompleted={false} />);
            expect(screen.getByText(/mark as complete/i)).toBeInTheDocument();
        });

        it('shows completed badge when lesson is completed', () => {
            render(<LessonViewer {...mockProps} isCompleted={true} />);
            expect(screen.getByText(/lesson completed/i)).toBeInTheDocument();
        });

        it('shows completed badge in header when completed', () => {
            render(<LessonViewer {...mockProps} isCompleted={true} />);
            const badges = screen.getAllByText(/completed/i);
            expect(badges.length).toBeGreaterThan(0);
        });
    });

    describe('Interactions', () => {
        it('calls onClose when back button clicked', () => {
            render(<LessonViewer {...mockProps} />);
            const backButton = document.querySelector('.lesson-back-btn');
            
            fireEvent.click(backButton!);
            
            expect(mockProps.onClose).toHaveBeenCalledTimes(1);
        });

        it('marks lesson complete when mark complete clicked', async () => {
            (markLessonComplete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            render(<LessonViewer {...mockProps} />);
            const markCompleteBtn = screen.getByText(/mark as complete/i);
            
            await act(async () => {
                fireEvent.click(markCompleteBtn);
            });
            
            expect(markLessonComplete).toHaveBeenCalledWith(
                'lesson-1',
                'module-1',
                'white',
                expect.any(Number)
            );
        });

        it('calls onComplete callback when marked complete', async () => {
            (markLessonComplete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            render(<LessonViewer {...mockProps} />);
            const markCompleteBtn = screen.getByText(/mark as complete/i);
            
            await act(async () => {
                fireEvent.click(markCompleteBtn);
            });
            
            expect(mockProps.onComplete).toHaveBeenCalledWith('lesson-1');
        });

        it('shows continue button when not completed', () => {
            render(<LessonViewer {...mockProps} isCompleted={false} />);
            expect(screen.getByText(/complete & continue/i)).toBeInTheDocument();
        });

        it('calls onNext when continue button clicked', () => {
            render(<LessonViewer {...mockProps} />);
            const continueButton = screen.getByText(/continue/i);
            
            fireEvent.click(continueButton);
            
            expect(mockProps.onNext).toHaveBeenCalledTimes(1);
        });

        it('marks complete and goes next when lesson not completed', async () => {
            (markLessonComplete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            render(<LessonViewer {...mockProps} isCompleted={false} />);
            const nextButton = screen.getByText(/complete & continue/i);
            
            await act(async () => {
                fireEvent.click(nextButton);
            });
            
            expect(markLessonComplete).toHaveBeenCalled();
            expect(mockProps.onNext).toHaveBeenCalledTimes(1);
        });

        it('just goes next when lesson already completed', async () => {
            render(<LessonViewer {...mockProps} isCompleted={true} />);
            const nextButton = screen.getByText(/next lesson/i);
            
            await act(async () => {
                fireEvent.click(nextButton);
            });
            
            expect(markLessonComplete).not.toHaveBeenCalled();
            expect(mockProps.onNext).toHaveBeenCalledTimes(1);
        });
    });

    describe('Time Tracking', () => {
        it('updates lesson time on unmount', () => {
            (updateLessonTime as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            const { unmount } = render(<LessonViewer {...mockProps} />);
            
            // Advance time by 5 seconds
            act(() => {
                vi.advanceTimersByTime(5000);
            });
            
            unmount();
            
            expect(updateLessonTime).toHaveBeenCalledWith(
                'lesson-1',
                'module-1',
                'white',
                5
            );
        });

        it('calculates time spent correctly', () => {
            (updateLessonTime as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            const { unmount } = render(<LessonViewer {...mockProps} />);
            
            // Advance time by 60 seconds
            act(() => {
                vi.advanceTimersByTime(60000);
            });
            
            unmount();
            
            expect(updateLessonTime).toHaveBeenCalledWith(
                'lesson-1',
                'module-1',
                'white',
                60
            );
        });

        it('includes time in markLessonComplete call', async () => {
            (markLessonComplete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
            
            render(<LessonViewer {...mockProps} />);
            
            // Advance time by 30 seconds
            act(() => {
                vi.advanceTimersByTime(30000);
            });
            
            const markCompleteBtn = screen.getByText(/mark as complete/i);
            
            await act(async () => {
                fireEvent.click(markCompleteBtn);
            });
            
            expect(markLessonComplete).toHaveBeenCalledWith(
                'lesson-1',
                'module-1',
                'white',
                30
            );
        });
    });

    describe('Accessibility', () => {
        it('iframe has title attribute', () => {
            render(<LessonViewer {...mockProps} />);
            const iframe = document.querySelector('iframe');
            expect(iframe).toHaveAttribute('title', 'Six Sigma Intro Video');
        });

        it('iframe uses lesson title as fallback when no videoTitle', () => {
            const propsWithoutVideoTitle = {
                ...mockProps,
                lesson: { ...mockLesson, videoTitle: undefined },
            };
            render(<LessonViewer {...propsWithoutVideoTitle} />);
            const iframe = document.querySelector('iframe');
            expect(iframe).toHaveAttribute('title', 'Introduction to Six Sigma');
        });

        it('iframe has allowFullScreen attribute', () => {
            render(<LessonViewer {...mockProps} />);
            const iframe = document.querySelector('iframe');
            expect(iframe).toHaveAttribute('allowFullScreen');
        });
    });

    describe('Edge Cases', () => {
        it('handles missing video title gracefully', () => {
            const propsWithoutVideoTitle = {
                ...mockProps,
                lesson: { ...mockLesson, videoTitle: undefined },
            };
            render(<LessonViewer {...propsWithoutVideoTitle} />);
            // Should not throw error - check h1 title
            const title = document.querySelector('.lesson-main-title');
            expect(title).toBeInTheDocument();
        });

        it('handles empty lesson content', () => {
            const propsWithEmptyContent = {
                ...mockProps,
                lesson: { ...mockLesson, content: '' },
            };
            render(<LessonViewer {...propsWithEmptyContent} />);
            const title = document.querySelector('.lesson-main-title');
            expect(title).toBeInTheDocument();
        });

        it('handles HTML content in lesson', () => {
            const propsWithHtmlContent = {
                ...mockProps,
                lesson: { 
                    ...mockLesson, 
                    content: '<div><h2>Section</h2><p>Paragraph</p></div>' 
                },
            };
            render(<LessonViewer {...propsWithHtmlContent} />);
            expect(screen.getByText('Section')).toBeInTheDocument();
            expect(screen.getByText('Paragraph')).toBeInTheDocument();
        });

        it('works with different belt levels', () => {
            const yellowBeltProps = {
                ...mockProps,
                beltLevel: 'yellow' as const,
            };
            render(<LessonViewer {...yellowBeltProps} />);
            const title = document.querySelector('.lesson-main-title');
            expect(title).toHaveTextContent('Introduction to Six Sigma');
        });
    });
});
