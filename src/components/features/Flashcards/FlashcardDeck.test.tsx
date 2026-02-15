/**
 * Tests for FlashcardDeck Component
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlashcardDeck } from './FlashcardDeck';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockCards = [
    { id: '1', front: 'What is Six Sigma?', back: 'A methodology for process improvement', category: 'Basics', difficulty: 'easy' as const },
    { id: '2', front: 'What is DMAIC?', back: 'Define, Measure, Analyze, Improve, Control', category: 'Methodology', difficulty: 'medium' as const },
    { id: '3', front: 'What is DPMO?', back: 'Defects Per Million Opportunities', category: 'Metrics', difficulty: 'hard' as const },
];

describe('FlashcardDeck', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('renders flashcard deck with cards', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        expect(screen.getByText('Test Deck')).toBeInTheDocument();
        expect(screen.getByText('What is Six Sigma?')).toBeInTheDocument();
    });

    it('displays card counter', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('displays progress bar', () => {
        const { container } = render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        expect(container.querySelector('.progress-bar')).toBeInTheDocument();
        expect(container.querySelector('.progress-fill')).toBeInTheDocument();
    });

    it('flips card when clicked', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);

        expect(screen.getByText('A methodology for process improvement')).toBeInTheDocument();
    });

    it('shows rating buttons after flip', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);

        expect(screen.getByText('How well did you know this?')).toBeInTheDocument();
        expect(screen.getByText('Again')).toBeInTheDocument();
        expect(screen.getByText('Hard')).toBeInTheDocument();
        expect(screen.getByText('Good')).toBeInTheDocument();
        expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    it('advances to next card when rating clicked', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        // Flip card
        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);

        // Rate it
        const goodButton = screen.getByText('Good');
        fireEvent.click(goodButton);

        // Should show next card
        expect(screen.getByText('What is DMAIC?')).toBeInTheDocument();
    });

    it('updates stats when rating clicked', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        // Flip and rate
        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);
        fireEvent.click(screen.getByText('Good'));

        // Check stats updated (✓ should show 1)
        expect(screen.getByText(/✓.*1/)).toBeInTheDocument();
    });

    it('displays category on card front', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        expect(screen.getByText('Basics')).toBeInTheDocument();
    });

    it('displays difficulty on card back', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);

        expect(screen.getByText('easy')).toBeInTheDocument();
    });

    it('displays empty state when no cards', () => {
        render(<FlashcardDeck cards={[]} title="Empty Deck" />);

        expect(screen.getByText('No cards to review!')).toBeInTheDocument();
    });

    it('calls onComplete when all cards rated', () => {
        const onComplete = vi.fn();
        render(<FlashcardDeck cards={[mockCards[0]!]} title="Single Card" onComplete={onComplete} />);

        // Flip and rate the only card
        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);
        fireEvent.click(screen.getByText('Good'));

        expect(onComplete).toHaveBeenCalled();
    });

    it('saves progress to localStorage', () => {
        render(<FlashcardDeck cards={mockCards} title="Test Deck" />);

        const card = screen.getByText('What is Six Sigma?').closest('.flashcard');
        fireEvent.click(card!);
        fireEvent.click(screen.getByText('Good'));

        // Check localStorage was updated
        const stored = localStorageMock.getItem('sixsigma_flashcards');
        expect(stored).not.toBeNull();
    });
});

import { vi } from 'vitest';