/**
 * Tests for PracticeMode Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeMode } from './PracticeMode';

// Mock questions data matching the Question interface
const MOCK_QUESTIONS = [
    {
        id: 'q1',
        question: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        hint: 'Think of basic addition',
        explanation: '2 + 2 equals 4'
    },
    {
        id: 'q2',
        question: 'What is DMAIC?',
        options: [
            'A type of chart',
            'Define, Measure, Analyze, Improve, Control',
            'A statistical method',
            'A quality tool'
        ],
        correctAnswer: 1,
        hint: 'It is a Six Sigma methodology',
        explanation: 'DMAIC stands for Define, Measure, Analyze, Improve, Control - the Six Sigma methodology.'
    }
];

describe('PracticeMode', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders practice mode header', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);
        expect(screen.getByText('Practice Mode')).toBeInTheDocument();
    });

    it('shows first question', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);
        expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });

    it('displays all answer options', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('shows hint button', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);
        expect(screen.getByRole('button', { name: /show hint/i })).toBeInTheDocument();
    });

    it('displays hint when hint button clicked', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        const hintButton = screen.getByRole('button', { name: /show hint/i });
        fireEvent.click(hintButton);

        expect(screen.getByText('Think of basic addition')).toBeInTheDocument();
    });

    it('shows question counter', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);
        expect(screen.getByText(/question 1 of 2/i)).toBeInTheDocument();
    });

    it('selects an answer when clicked', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        const answerButton = screen.getByText('4').closest('button');
        fireEvent.click(answerButton!);

        expect(answerButton).toHaveClass('practice-option');
    });

    it('shows check answer button after selecting', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        fireEvent.click(screen.getByText('4').closest('button')!);

        expect(screen.getByRole('button', { name: /check answer/i })).toBeInTheDocument();
    });

    it('shows explanation after checking answer', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

        expect(screen.getByText(/2 \+ 2 equals 4/i)).toBeInTheDocument();
    });

    it('indicates correct answer', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        const correctAnswer = screen.getByText('4').closest('button');
        fireEvent.click(correctAnswer!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

        expect(correctAnswer).toHaveClass('correct');
    });

    it('indicates incorrect answer', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        const wrongAnswer = screen.getByText('3').closest('button');
        fireEvent.click(wrongAnswer!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

        expect(wrongAnswer).toHaveClass('incorrect');
    });

    it('shows next button after checking answer', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('moves to next question when next clicked', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        // Answer first question
        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));

        // Click next
        const nextButton = screen.getByRole('button', { name: /next/i });
        fireEvent.click(nextButton);

        // Second question should be visible
        expect(screen.getByText('What is DMAIC?')).toBeInTheDocument();
    });

    it('shows completion screen after all questions', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        // Answer first question
        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /next/i }));

        // Answer second question
        fireEvent.click(screen.getByText(/Define, Measure, Analyze, Improve, Control/).closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /finish/i }));

        // Completion screen
        expect(screen.getByText(/practice complete/i)).toBeInTheDocument();
    });

    it('calls onComplete callback when finished', () => {
        const onComplete = vi.fn();
        render(<PracticeMode questions={MOCK_QUESTIONS} onComplete={onComplete} />);

        // Answer first question correctly
        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /next/i }));

        // Answer second question correctly
        fireEvent.click(screen.getByText(/Define, Measure, Analyze, Improve, Control/).closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /finish/i }));

        expect(onComplete).toHaveBeenCalledWith(2, 2);
    });

    it('shows skip button before answering', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
    });

    it('allows navigating to previous question', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        // Answer first question
        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /next/i }));

        // Go back
        const prevButton = screen.getByRole('button', { name: /previous/i });
        fireEvent.click(prevButton);

        expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });

    it('shows restart button on completion', () => {
        render(<PracticeMode questions={MOCK_QUESTIONS} />);

        // Complete the quiz
        fireEvent.click(screen.getByText('4').closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
        fireEvent.click(screen.getByText(/Define, Measure, Analyze, Improve, Control/).closest('button')!);
        fireEvent.click(screen.getByRole('button', { name: /check answer/i }));
        fireEvent.click(screen.getByRole('button', { name: /finish/i }));

        expect(screen.getByRole('button', { name: /practice again/i })).toBeInTheDocument();
    });
});