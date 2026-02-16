/**
 * Spaced Repetition Database Operations
 * 
 * Uses the existing IndexedDB setup from db.ts
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { SpacedRepetitionCard, CardReview, SpacedRepetitionStats } from '../../utils/db.schema';
import { getDueCards, calculateStats } from './sm2';

// Extended DB schema for spaced repetition
interface SpacedRepetitionDBSchema extends DBSchema {
    cards: {
        key: string;
        value: SpacedRepetitionCard;
        indexes: {
            'by-user': string;
            'by-due-date': Date;
        };
    };
    cardReviews: {
        key: string;
        value: CardReview;
        indexes: {
            'by-user': string;
            'by-card': string;
            'by-date': Date;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2; // Increment version for new stores

let dbInstance: IDBPDatabase<SpacedRepetitionDBSchema> | null = null;

export async function getSRDB(): Promise<IDBPDatabase<SpacedRepetitionDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<SpacedRepetitionDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Cards store
            if (!db.objectStoreNames.contains('cards')) {
                const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
                cardStore.createIndex('by-user', 'userId');
            }

            // Card reviews store
            if (!db.objectStoreNames.contains('cardReviews')) {
                const reviewStore = db.createObjectStore('cardReviews', { keyPath: 'id' });
                reviewStore.createIndex('by-user', 'userId');
                reviewStore.createIndex('by-card', 'cardId');
                reviewStore.createIndex('by-date', 'reviewedAt');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Card Operations
// ============================================

export async function getAllCards(userId: string): Promise<SpacedRepetitionCard[]> {
    const db = await getSRDB();
    const index = db.transaction('cards').store.index('by-user');
    return await index.getAll(userId);
}

export async function getCard(cardId: string): Promise<SpacedRepetitionCard | undefined> {
    const db = await getSRDB();
    return await db.get('cards', cardId);
}

export async function saveCard(card: SpacedRepetitionCard): Promise<void> {
    const db = await getSRDB();
    await db.put('cards', card);
}

export async function deleteCard(cardId: string): Promise<void> {
    const db = await getSRDB();
    await db.delete('cards', cardId);
}

export async function getDueCardsForUser(userId: string): Promise<SpacedRepetitionCard[]> {
    const cards = await getAllCards(userId);
    return getDueCards(cards);
}

export async function getNewCards(userId: string, limit: number = 20): Promise<SpacedRepetitionCard[]> {
    const cards = await getAllCards(userId);
    return cards
        .filter(c => c.repetition === 0)
        .slice(0, limit);
}

// ============================================
// Review Operations
// ============================================

export async function saveReview(review: CardReview): Promise<void> {
    const db = await getSRDB();
    await db.put('cardReviews', review);
}

export async function getAllReviews(userId: string): Promise<CardReview[]> {
    const db = await getSRDB();
    const index = db.transaction('cardReviews').store.index('by-user');
    return await index.getAll(userId);
}

export async function getCardReviews(cardId: string): Promise<CardReview[]> {
    const db = await getSRDB();
    const index = db.transaction('cardReviews').store.index('by-card');
    return await index.getAll(cardId);
}

// ============================================
// Stats Operations
// ============================================

export async function getLearningStats(userId: string): Promise<SpacedRepetitionStats> {
    const cards = await getAllCards(userId);
    const reviews = await getAllReviews(userId);
    
    return calculateStats(cards, reviews);
}

export async function getDailyReviewCounts(
    userId: string,
    days: number = 365
): Promise<Record<string, number>> {
    const reviews = await getAllReviews(userId);
    const counts: Record<string, number> = {};
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    reviews.forEach(review => {
        const date = new Date(review.reviewedAt);
        if (date >= cutoff) {
            const dateKey = date.toISOString().split('T')[0];
            if (dateKey) {
                counts[dateKey] = (counts[dateKey] || 0) + 1;
            }
        }
    });
    
    return counts;
}

// ============================================
// Pre-built Card Decks
// ============================================

export function generateDefaultCards(): Omit<SpacedRepetitionCard, 'id' | 'userId' | 'createdAt'>[] {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return [
        {
            question: 'What does DMAIC stand for?',
            answer: 'Define, Measure, Analyze, Improve, Control',
            beltLevel: 'white',
            topic: 'DMAIC',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is a SIPOC diagram used for?',
            answer: 'To identify Suppliers, Inputs, Process, Outputs, and Customers at a high level',
            beltLevel: 'yellow',
            topic: 'Define',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is the formula for Defects Per Million Opportunities (DPMO)?',
            answer: 'DPMO = (Defects / (Units × Opportunities per Unit)) × 1,000,000',
            beltLevel: 'green',
            topic: 'Measure',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is Process Capability Index (Cpk)?',
            answer: 'Cpk measures how centered a process is within specification limits. Cpk = min[(USL-μ)/3σ, (μ-LSL)/3σ]',
            beltLevel: 'green',
            topic: 'Measure',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is the 5 Whys technique?',
            answer: 'A root cause analysis method where you ask "why" repeatedly (typically 5 times) to drill down to the root cause',
            beltLevel: 'yellow',
            topic: 'Analyze',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What does p-value < 0.05 indicate in hypothesis testing?',
            answer: 'There is less than 5% probability the observed difference occurred by chance; reject the null hypothesis',
            beltLevel: 'green',
            topic: 'Analyze',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is a Pareto Chart used for?',
            answer: 'To identify the "vital few" causes that contribute to most of the problems (80/20 rule)',
            beltLevel: 'green',
            topic: 'Analyze',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is the purpose of a Control Plan?',
            answer: 'To document how key process variables will be controlled to maintain improvements',
            beltLevel: 'black',
            topic: 'Control',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What does R² (R-squared) represent in regression?',
            answer: 'The proportion of variance in the dependent variable predictable from independent variables (0-1 or 0%-100%)',
            beltLevel: 'black',
            topic: 'Analyze',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
        {
            question: 'What is the Central Limit Theorem?',
            answer: 'The sampling distribution of the mean approaches normal distribution as sample size increases, regardless of population distribution',
            beltLevel: 'green',
            topic: 'Statistics',
            interval: 1,
            repetition: 0,
            easinessFactor: 2.5,
            nextReviewDate: tomorrow,
            totalReviews: 0,
            correctStreak: 0,
        },
    ];
}
