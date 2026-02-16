/**
 * Spaced Repetition Component
 * 
 * Main study interface for flashcard reviews using SM-2 algorithm
 */

import { useState, useEffect, useRef } from 'react';
import { Loading } from '../../components/common/Loading/Loading';
import { SpacedRepetitionCard, SpacedRepetitionStats } from '../../utils/db.schema';
import { 
    getDueCardsForUser, 
    getNewCards, 
    saveCard, 
    saveReview,
    getLearningStats,
    getAllCards,
    generateDefaultCards
} from './spacedRepetition.db';
import { processReview, getRecommendedNewCards, QUALITY_RATINGS } from './sm2';
import './SpacedRepetition.css';

const USER_ID = 'current-user'; // TODO: Get from auth context

export function SpacedRepetition() {
    const [cards, setCards] = useState<SpacedRepetitionCard[]>([]);
    const [stats, setStats] = useState<SpacedRepetitionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [sessionActive, setSessionActive] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [sessionStats, setSessionStats] = useState({ reviewed: 0, newCards: 0, timeStarted: Date.now() });
    
    const cardStartTime = useRef<number>(0);

    // Load initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            let allCards = await getAllCards(USER_ID);
            
            // Initialize default cards if empty
            if (allCards.length === 0) {
                const defaultCards = generateDefaultCards();
                const now = new Date();
                for (const cardData of defaultCards) {
                    const card: SpacedRepetitionCard = {
                        ...cardData,
                        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        userId: USER_ID,
                        createdAt: now,
                    };
                    await saveCard(card);
                }
                allCards = await getAllCards(USER_ID);
            }
            
            setCards(allCards);
            const learningStats = await getLearningStats(USER_ID);
            setStats(learningStats);
        } catch (error) {
            console.error('Failed to load spaced repetition data:', error);
        } finally {
            setLoading(false);
        }
    };

    const startSession = async () => {
        const dueCards = await getDueCardsForUser(USER_ID);
        const recommendedNew = getRecommendedNewCards(cards);
        const newCards = await getNewCards(USER_ID, recommendedNew);
        
        const sessionCards = [...dueCards, ...newCards];
        
        if (sessionCards.length === 0) {
            // No cards due - show message
            return;
        }
        
        setCards(sessionCards);
        setSessionActive(true);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSessionComplete(false);
        setSessionStats({ reviewed: 0, newCards: newCards.length, timeStarted: Date.now() });
        cardStartTime.current = Date.now();
    };

    const handleFlip = () => {
        if (!showAnswer) {
            setShowAnswer(true);
        }
    };

    const handleRate = async (quality: number) => {
        const currentCard = cards[currentCardIndex];
        if (!currentCard) return;
        
        const timeTaken = Math.round((Date.now() - cardStartTime.current) / 1000);
        
        // Process the review
        const { card: updatedCard, review } = processReview(currentCard, quality, timeTaken);
        
        // Save to database
        await saveCard(updatedCard);
        await saveReview({
            ...review,
            id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: USER_ID,
        });
        
        // Update session stats
        setSessionStats(prev => ({
            ...prev,
            reviewed: prev.reviewed + 1,
        }));
        
        // Move to next card
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setShowAnswer(false);
            cardStartTime.current = Date.now();
        } else {
            setSessionComplete(true);
            // Reload stats
            const newStats = await getLearningStats(USER_ID);
            setStats(newStats);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <Loading message="Loading flashcards..." />;
    }

    // Session Complete Screen
    if (sessionComplete) {
        const duration = Math.round((Date.now() - sessionStats.timeStarted) / 1000);
        
        return (
            <div className="sr-container">
                <div className="sr-complete">
                    <div className="sr-complete-icon">🎉</div>
                    <h2 className="sr-complete-title">Session Complete!</h2>
                    <p>You&apos;ve reviewed {sessionStats.reviewed} cards in {formatTime(duration)}</p>
                    
                    <div className="sr-complete-stats">
                        <div className="sr-complete-stat">
                            <div className="sr-complete-stat-value">{sessionStats.reviewed}</div>
                            <div className="sr-complete-stat-label">Cards Reviewed</div>
                        </div>
                        <div className="sr-complete-stat">
                            <div className="sr-complete-stat-value">{sessionStats.newCards}</div>
                            <div className="sr-complete-stat-label">New Cards</div>
                        </div>
                        <div className="sr-complete-stat">
                            <div className="sr-complete-stat-value">{formatTime(duration)}</div>
                            <div className="sr-complete-stat-label">Time</div>
                        </div>
                    </div>
                    
                    <button className="sr-start-btn" onClick={() => setSessionActive(false)}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Study Session Screen
    if (sessionActive) {
        const currentCard = cards[currentCardIndex];
        if (!currentCard) {
            setSessionComplete(true);
            return null;
        }
        const progress = ((currentCardIndex) / cards.length) * 100;
        
        return (
            <div className="sr-container">
                <div className="sr-session">
                    <div className="sr-progress">
                        <div className="sr-progress-bar">
                            <div 
                                className="sr-progress-fill" 
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="sr-progress-text">
                            {currentCardIndex + 1} / {cards.length}
                        </div>
                    </div>
                    
                    <div 
                        className={`sr-card ${showAnswer ? 'flipped' : ''}`}
                        onClick={handleFlip}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === ' ' && handleFlip()}
                    >
                        <div className="sr-card-content">
                            {currentCard.question}
                        </div>
                        
                        {showAnswer && (
                            <div className="sr-card-answer">
                                {currentCard.answer}
                            </div>
                        )}
                        
                        {!showAnswer && (
                            <div className="sr-card-hint">
                                Click to reveal answer (or press Space)
                            </div>
                        )}
                    </div>
                    
                    {showAnswer && (
                        <div className="sr-ratings">
                            {QUALITY_RATINGS.map((rating) => (
                                <button
                                    key={rating.value}
                                    className={`sr-rating-btn quality-${rating.value}`}
                                    onClick={() => handleRate(rating.value)}
                                    title={rating.description}
                                >
                                    <span className="sr-rating-value">{rating.value}</span>
                                    <span className="sr-rating-label">{rating.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Dashboard Screen
    return (
        <div className="sr-container">
            <h1>Spaced Repetition</h1>
            <p>Master Six Sigma concepts with scientifically optimized review intervals</p>
            
            {stats && (
                <div className="sr-stats">
                    <div className="sr-stat-card due">
                        <div className="sr-stat-value">{stats.dueToday}</div>
                        <div className="sr-stat-label">Due Today</div>
                    </div>
                    <div className="sr-stat-card new">
                        <div className="sr-stat-value">{stats.newCards}</div>
                        <div className="sr-stat-label">New Cards</div>
                    </div>
                    <div className="sr-stat-card">
                        <div className="sr-stat-value">{stats.totalCards}</div>
                        <div className="sr-stat-label">Total Cards</div>
                    </div>
                    <div className="sr-stat-card streak">
                        <div className="sr-stat-value">{stats.streak}</div>
                        <div className="sr-stat-label">Day Streak</div>
                    </div>
                </div>
            )}
            
            <div className="sr-start">
                <h2 className="sr-start-title">Ready to Study?</h2>
                <p className="sr-start-description">
                    {stats && stats.dueToday > 0 
                        ? `You have ${stats.dueToday} cards ready for review`
                        : 'No cards due. Learn some new ones!'}
                </p>
                <button className="sr-start-btn" onClick={startSession}>
                    Start Study Session
                </button>
            </div>
        </div>
    );
}

export default SpacedRepetition;
