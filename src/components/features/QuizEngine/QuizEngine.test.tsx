/**
 * Tests for QuizEngine Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QuizEngine } from './QuizEngine';
import { Quiz } from '../../../types';

// Mock database utilities
vi.mock('../../../utils/db', () => ({
    saveQuizAttempt: vi.fn().mockResolvedValue(1),
    saveCertificate: vi.fn().mockResolvedValue(undefined),
    generateCertificateId: vi.fn().mockReturnValue('SS-TEST123'),
}));

// Mock console methods to reduce noise
const mockConsole = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

describe('QuizEngine', () => {
    const mockQuiz: Quiz = {
        id: 'test-quiz-1',
        title: 'Test Quiz',
        description: 'A test quiz',
        passingScore: 70,
        questions: [
            {
                id: 'q1',
                type: 'multiple-choice',
                question: 'What is 2+2?',
                options: ['3', '4', '5', '6'],
                correctAnswer: 1,
                explanation: 'Two plus two equals four.',
                points: 10,
            },
            {
                id: 'q2',
                type: 'multiple-choice',
                question: 'What is the capital of France?',
                options: ['London', 'Berlin', 'Paris', 'Madrid'],
                correctAnswer: 2,
                explanation: 'Paris is the capital of France.',
                points: 10,
            },
        ],
    };

    const mockOnComplete = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        mockConsole.log.mockClear();
        mockConsole.error.mockClear();
    });

    it('renders quiz header with title', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Test Quiz')).toBeInTheDocument();
        expect(screen.getByText(/← Exit Quiz/i)).toBeInTheDocument();
    });

    it('displays first question by default', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    });

    it('renders all answer options', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('shows progress information', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText(/Question 1 of 2/i)).toBeInTheDocument();
        expect(screen.getByText('0 answered')).toBeInTheDocument();
    });

    it('allows selecting an answer', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);

        expect(optionB).toHaveClass('selected');
    });

    it('enables Check Answer button after selecting an answer', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        const checkButton = screen.queryByText('Check Answer');
        expect(checkButton).not.toBeInTheDocument();

        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);

        expect(screen.getByText('Check Answer')).toBeInTheDocument();
    });

    it('shows explanation after checking answer', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);

        const checkButton = screen.getByText('Check Answer');
        fireEvent.click(checkButton);

        expect(screen.getByText('💡 Explanation')).toBeInTheDocument();
        expect(screen.getByText('Two plus two equals four.')).toBeInTheDocument();
    });

    it('disables answer selection after checking', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);

        const checkButton = screen.getByText('Check Answer');
        fireEvent.click(checkButton);

        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            expect(option).toHaveClass('disabled');
        });
    });

    it('navigates to next question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Select answer
        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);

        // Click next
        const nextButton = screen.getByText(/Next/i);
        fireEvent.click(nextButton);

        // Should show question 2
        expect(screen.getByText('Question 2')).toBeInTheDocument();
        expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    });

    it('previous button is disabled on first question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        const prevButton = screen.getByText(/Previous/i);
        expect(prevButton).toBeDisabled();
    });

    it('previous button is enabled on second question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Go to question 2
        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);
        const nextButton = screen.getByText(/Next/i);
        fireEvent.click(nextButton);

        const prevButton = screen.getByText(/Previous/i);
        expect(prevButton).not.toBeDisabled();
    });

    it('can navigate back to previous question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Go to question 2
        const optionB = screen.getByText('4').closest('.answer-option');
        fireEvent.click(optionB!);
        fireEvent.click(screen.getByText(/Next/i));

        // Go back
        fireEvent.click(screen.getByText(/Previous/i));

        // Should show question 1
        expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    });

    it('shows Submit Quiz button on last question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer question 1 and go to question 2
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));

        // Answer question 2
        fireEvent.click(screen.getByText('Paris').closest('.answer-option')!);

        expect(screen.getByText('Submit Quiz')).toBeInTheDocument();
    });

    it('submit button is disabled until all questions answered', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Go to last question without answering
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));

        const submitButton = screen.getByText('Submit Quiz');
        expect(submitButton).toBeDisabled();
    });

    it('shows results screen after submitting quiz', async () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer all questions
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('Paris').closest('.answer-option')!);

        // Submit
        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText(/Congratulations|Keep Learning/i)).toBeInTheDocument();
        });
    });

    it('calls onComplete with results after submission', async () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer all questions correctly
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('Paris').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledWith(true, 100);
        });
    });

    it('calculates partial scores correctly', async () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer one correctly, one incorrectly (50% - below 70% passing)
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('London').closest('.answer-option')!); // Wrong

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledWith(false, 50);
        });
    });

    it('shows failure message when score below passing', async () => {
        const lowPassingQuiz = { ...mockQuiz, passingScore: 80 };

        render(
            <QuizEngine
                quiz={lowPassingQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer one correctly, one incorrectly (50%)
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('London').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText(/Keep Learning/i)).toBeInTheDocument();
        });
    });

    it('calls onClose when back button clicked', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        fireEvent.click(screen.getByText(/← Exit Quiz/i));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows timer when time limit is set', () => {
        const timedQuiz = { ...mockQuiz, timeLimit: 30 };

        render(
            <QuizEngine
                quiz={timedQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText(/30:00/)).toBeInTheDocument();
    });

    it('shows Try Again button for failed quiz', async () => {
        const strictQuiz = { ...mockQuiz, passingScore: 90 };

        render(
            <QuizEngine
                quiz={strictQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer one correctly, one incorrectly (50%)
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('London').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });
    });

    it('resets quiz when Try Again clicked', async () => {
        const strictQuiz = { ...mockQuiz, passingScore: 90 };

        render(
            <QuizEngine
                quiz={strictQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Fail quiz
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('London').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });

        // Click try again
        fireEvent.click(screen.getByText('Try Again'));

        // Should be back to question 1
        expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
        expect(screen.getByText('0 answered')).toBeInTheDocument();
    });

    it('shows certificate button for passed final exam', async () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="green"
                isFinalExam={true}
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer all correctly
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('Paris').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText(/View Certificate/i)).toBeInTheDocument();
        });
    });

    it('includes final exam message when isFinalExam is true', async () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="green"
                isFinalExam={true}
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Answer all correctly
        fireEvent.click(screen.getByText('4').closest('.answer-option')!);
        fireEvent.click(screen.getByText(/Next/i));
        fireEvent.click(screen.getByText('Paris').closest('.answer-option')!);

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Quiz'));
        });

        await waitFor(() => {
            expect(screen.getByText(/Green Belt certification exam/i)).toBeInTheDocument();
        });
    });

    it('displays points for each question', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('(10 points)')).toBeInTheDocument();
    });

    it('shows correct/incorrect indicators after checking answer', () => {
        render(
            <QuizEngine
                quiz={mockQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        // Select wrong answer
        fireEvent.click(screen.getByText('3').closest('.answer-option')!);
        fireEvent.click(screen.getByText('Check Answer'));

        // Check for visual indicators (correct answer should have correct class)
        const options = document.querySelectorAll('.answer-option');
        const correctOption = Array.from(options).find(opt => opt.textContent?.includes('4'));
        expect(correctOption).toHaveClass('correct');
    });

    it('renders properly with empty quiz questions array', () => {
        const emptyQuiz = { ...mockQuiz, questions: [] };

        render(
            <QuizEngine
                quiz={emptyQuiz}
                beltLevel="white"
                onComplete={mockOnComplete}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText(/Loading question/i)).toBeInTheDocument();
    });
});
