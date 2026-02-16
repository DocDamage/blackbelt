/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Implementation of the SuperMemo-2 algorithm for optimized learning.
 * Based on: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 * 
 * Quality ratings:
 * 0 - Complete blackout
 * 1 - Incorrect response, correct one remembered
 * 2 - Incorrect response, easy to recall correct
 * 3 - Correct response, recalled with serious difficulty
 * 4 - Correct response, after hesitation
 * 5 - Correct response, perfect recall
 */

import type { SpacedRepetitionCard, CardReview } from '../../utils/db.schema';

export interface SM2Result {
    interval: number;
    repetition: number;
    easinessFactor: number;
    nextReviewDate: Date;
}

/**
 * Calculate the next review parameters using SM-2 algorithm
 * 
 * @param quality - Quality of recall (0-5)
 * @param currentInterval - Current interval in days
 * @param repetition - Current repetition count
 * @param easinessFactor - Current easiness factor (EF)
 * @returns Updated SM-2 parameters
 */
export function calculateSM2(
    quality: number,
    currentInterval: number,
    repetition: number,
    easinessFactor: number
): SM2Result {
    // Validate inputs
    if (quality < 0 || quality > 5) {
        throw new Error('Quality must be between 0 and 5');
    }
    
    // Clamp easiness factor minimum to 1.3
    let newEF = easinessFactor;
    
    if (quality >= 3) {
        // Correct response
        if (repetition === 0) {
            newEF = 1;
        } else if (repetition === 1) {
            newEF = 6;
        } else {
            newEF = Math.round(currentInterval * easinessFactor);
        }
        repetition++;
    } else {
        // Incorrect response - reset repetition
        repetition = 0;
        newEF = 1;
    }
    
    // Update easiness factor
    let newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Clamp EF between 1.3 and 2.5
    newEasinessFactor = Math.max(1.3, Math.min(2.5, newEasinessFactor));
    
    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newEF);
    
    return {
        interval: newEF,
        repetition,
        easinessFactor: newEasinessFactor,
        nextReviewDate,
    };
}

/**
 * Initialize a new card with default SM-2 values
 */
export function initializeCard(
    question: string,
    answer: string,
    beltLevel: string,
    topic: string,
    lessonId?: string
): Omit<SpacedRepetitionCard, 'id' | 'userId' | 'createdAt'> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
        question,
        answer,
        beltLevel: beltLevel as SpacedRepetitionCard['beltLevel'],
        topic,
        lessonId,
        interval: 1,
        repetition: 0,
        easinessFactor: 2.5,
        nextReviewDate: tomorrow,
        totalReviews: 0,
        correctStreak: 0,
    };
}

/**
 * Process a card review and update its parameters
 */
export function processReview(
    card: SpacedRepetitionCard,
    quality: number,
    timeTaken: number
): { card: SpacedRepetitionCard; review: Omit<CardReview, 'id' | 'userId'> } {
    const sm2Result = calculateSM2(
        quality,
        card.interval,
        card.repetition,
        card.easinessFactor
    );
    
    const now = new Date();
    
    // Update card
    const updatedCard: SpacedRepetitionCard = {
        ...card,
        interval: sm2Result.interval,
        repetition: sm2Result.repetition,
        easinessFactor: sm2Result.easinessFactor,
        nextReviewDate: sm2Result.nextReviewDate,
        lastReviewedAt: now,
        totalReviews: card.totalReviews + 1,
        correctStreak: quality >= 3 ? card.correctStreak + 1 : 0,
    };
    
    // Create review record
    const review: Omit<CardReview, 'id' | 'userId'> = {
        cardId: card.id,
        quality,
        timeTaken,
        reviewedAt: now,
    };
    
    return { card: updatedCard, review };
}

/**
 * Get cards due for review today
 */
export function getDueCards(cards: SpacedRepetitionCard[]): SpacedRepetitionCard[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return cards
        .filter((card): card is SpacedRepetitionCard => card !== undefined)
        .filter(card => {
            const reviewDate = new Date(card.nextReviewDate);
            reviewDate.setHours(0, 0, 0, 0);
            return reviewDate <= now;
        })
        .sort((a, b) => {
            // Prioritize by: new cards first, then by due date, then by interval
            if (a.repetition === 0 && b.repetition !== 0) return -1;
            if (a.repetition !== 0 && b.repetition === 0) return 1;
            return a.nextReviewDate.getTime() - b.nextReviewDate.getTime();
        });
}

/**
 * Calculate learning statistics
 */
export interface LearningStats {
    totalCards: number;
    dueToday: number;
    newCards: number;
    learning: number;      // repetition < 5
    mature: number;        // repetition >= 5
    review: number;        // due for review
    streak: number;
    totalReviews: number;
    averageRetention: number;
    cardsByBelt: Record<string, number>;
}

export function calculateStats(
    cards: SpacedRepetitionCard[],
    reviews: CardReview[]
): LearningStats {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const dueToday = getDueCards(cards);
    const newCards = cards.filter(c => c.repetition === 0);
    const learning = cards.filter(c => c.repetition > 0 && c.repetition < 5);
    const mature = cards.filter(c => c.repetition >= 5);
    
    // Calculate streak
    const streak = calculateStreak(reviews);
    
    // Calculate average retention (cards with quality >= 3 / total reviews today)
    const todayReviews = reviews.filter(r => {
        const reviewDate = new Date(r.reviewedAt);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === now.getTime();
    });
    
    const successfulReviews = todayReviews.filter(r => r.quality >= 3);
    const averageRetention = todayReviews.length > 0
        ? (successfulReviews.length / todayReviews.length) * 100
        : 0;
    
    // Cards by belt level
    const cardsByBelt = cards.reduce((acc, card) => {
        acc[card.beltLevel] = (acc[card.beltLevel] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    return {
        totalCards: cards.length,
        dueToday: dueToday.length,
        newCards: newCards.length,
        learning: learning.length,
        mature: mature.length,
        review: dueToday.length,
        streak,
        totalReviews: reviews.length,
        averageRetention: Math.round(averageRetention),
        cardsByBelt,
    };
}

/**
 * Calculate consecutive days of reviews streak
 */
function calculateStreak(reviews: CardReview[]): number {
    if (reviews.length === 0) return 0;
    
    // Get unique dates with reviews
    const reviewDates = new Set(
        reviews.map(r => {
            const date = new Date(r.reviewedAt);
            date.setHours(0, 0, 0, 0);
            return date.getTime();
        })
    );
    
    const sortedDates = Array.from(reviewDates).sort((a, b) => b - a);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();
    
    // Check if reviewed today or yesterday
    if (sortedDates[0] !== todayTime && sortedDates[0] !== yesterdayTime) {
        return 0;
    }
    
    // Count consecutive days
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = sortedDates[i - 1];
        const currDate = sortedDates[i];
        if (prevDate === undefined || currDate === undefined) break;
        
        const expectedDate = new Date(prevDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
        
        if (currDate === expectedDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

/**
 * Quality rating descriptions for UI
 */
export const QUALITY_RATINGS = [
    { value: 0, label: 'Complete blackout', description: 'I had no idea', color: '#ef4444' },
    { value: 1, label: 'Incorrect', description: 'I remembered the answer after seeing it', color: '#f87171' },
    { value: 2, label: 'Incorrect', description: 'I knew it was wrong but could not remember', color: '#fb923c' },
    { value: 3, label: 'Correct', description: 'I got it right with serious difficulty', color: '#fbbf24' },
    { value: 4, label: 'Correct', description: 'I got it right after some hesitation', color: '#a3e635' },
    { value: 5, label: 'Perfect', description: 'I knew it instantly', color: '#4ade80' },
];

/**
 * Get recommended new cards per day based on current workload
 */
export function getRecommendedNewCards(cards: SpacedRepetitionCard[]): number {
    const dueCards = getDueCards(cards);
    
    // Base recommendation
    let recommendation = 20;
    
    // Reduce if many cards due
    if (dueCards.length > 100) {
        recommendation = 10;
    } else if (dueCards.length > 50) {
        recommendation = 15;
    }
    
    // Don't exceed total cards available
    const newCardsAvailable = cards.filter(c => c.repetition === 0).length;
    return Math.min(recommendation, newCardsAvailable);
}
