/**
 * Flashcard System with Spaced Repetition
 */

import { useState, useEffect, useCallback } from 'react';
import './FlashcardDeck.css';

interface Flashcard {
    id: string;
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    lastReviewed?: number;
    nextReview?: number;
    interval?: number;
    easeFactor?: number;
    repetitions?: number;
}

interface FlashcardDeckProps {
    cards: Flashcard[];
    title: string;
    onComplete?: (stats: ReviewStats) => void;
}

interface ReviewStats {
    total: number;
    correct: number;
    incorrect: number;
    averageEase: number;
}

const STORAGE_KEY = 'sixsigma_flashcards';

// SM-2 Algorithm for spaced repetition
function calculateNextReview(card: Flashcard, quality: number): Flashcard {
    let { easeFactor = 2.5, repetitions = 0, interval = 1 } = card;

    if (quality >= 3) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions++;
    } else {
        repetitions = 0;
        interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    return {
        ...card,
        easeFactor,
        repetitions,
        interval,
        lastReviewed: Date.now(),
        nextReview: Date.now() + interval * 24 * 60 * 60 * 1000
    };
}

export function FlashcardDeck({ cards, title, onComplete }: FlashcardDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
    const [dueCards, setDueCards] = useState<Flashcard[]>([]);

    useEffect(() => {
        const now = Date.now();
        const due = cards.filter(c => !c.nextReview || c.nextReview <= now);
        setDueCards(due.length > 0 ? due : cards);
    }, [cards]);

    const currentCard = dueCards[currentIndex];

    const handleRate = useCallback((quality: number) => {
        if (!currentCard) return;

        const updatedCard = calculateNextReview(currentCard, quality);

        if (quality >= 3) {
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        // Save to localStorage
        saveProgress(updatedCard);

        if (currentIndex < dueCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        } else {
            // Completed all cards
            onComplete?.({
                total: dueCards.length,
                correct: stats.correct + (quality >= 3 ? 1 : 0),
                incorrect: stats.incorrect + (quality < 3 ? 1 : 0),
                averageEase: 0
            });
        }
    }, [currentCard, currentIndex, dueCards.length, stats, onComplete]);

    function saveProgress(card: Flashcard) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const progress = stored ? JSON.parse(stored) : {};
            progress[card.id] = card;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save flashcard progress:', e);
        }
    }

    if (!currentCard) {
        return <div className="flashcard-deck"><p>No cards to review!</p></div>;
    }

    const progress = ((currentIndex + 1) / dueCards.length) * 100;

    return (
        <div className="flashcard-deck">
            <header className="deck-header">
                <h3>{title}</h3>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="card-counter">{currentIndex + 1} / {dueCards.length}</span>
            </header>

            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="card-inner">
                    <div className="card-front">
                        <span className="card-category">{currentCard.category}</span>
                        <p>{currentCard.front}</p>
                        <span className="flip-hint">Click to flip</span>
                    </div>
                    <div className="card-back">
                        <p>{currentCard.back}</p>
                        <span className="difficulty-badge">{currentCard.difficulty}</span>
                    </div>
                </div>
            </div>

            {isFlipped && (
                <div className="rating-buttons">
                    <p>How well did you know this?</p>
                    <div className="buttons">
                        <button className="rate-btn again" onClick={() => handleRate(1)}>Again</button>
                        <button className="rate-btn hard" onClick={() => handleRate(2)}>Hard</button>
                        <button className="rate-btn good" onClick={() => handleRate(4)}>Good</button>
                        <button className="rate-btn easy" onClick={() => handleRate(5)}>Easy</button>
                    </div>
                </div>
            )}

            <div className="session-stats">
                <span className="stat correct">✓ {stats.correct}</span>
                <span className="stat incorrect">✗ {stats.incorrect}</span>
            </div>
        </div>
    );
}

export default FlashcardDeck;