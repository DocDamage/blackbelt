/**
 * AI Learning Path Database Operations
 * 
 * Tracks user performance and generates personalized recommendations
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface LearningPathDBSchema extends DBSchema {
    learningPatterns: {
        key: string;
        value: {
            userId: string;
            weakTopics: string[];
            strongTopics: string[];
            recommendedSequence: string[];
            lastUpdated: Date;
        };
    };
    quizPerformance: {
        key: string;
        value: {
            id: string;
            userId: string;
            topic: string;
            score: number;
            timestamp: Date;
        };
        indexes: {
            'by-user': string;
            'by-topic': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<LearningPathDBSchema> | null = null;

export async function getLearningPathDB(): Promise<IDBPDatabase<LearningPathDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<LearningPathDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('learningPatterns')) {
                db.createObjectStore('learningPatterns', { keyPath: 'userId' });
            }
            if (!db.objectStoreNames.contains('quizPerformance')) {
                const store = db.createObjectStore('quizPerformance', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
                store.createIndex('by-topic', 'topic');
            }
        },
    });

    return dbInstance;
}

// ============================================
// Quiz Performance Tracking
// ============================================

export async function recordQuizPerformance(
    userId: string,
    topic: string,
    score: number
): Promise<void> {
    const db = await getLearningPathDB();
    const record = {
        id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        topic,
        score,
        timestamp: new Date(),
    };
    await db.put('quizPerformance', record);
}

export async function getPerformanceHistory(
    userId: string,
    topic?: string
): Promise<{ topic: string; score: number; timestamp: Date }[]> {
    const db = await getLearningPathDB();
    const index = db.transaction('quizPerformance').store.index('by-user');
    const records = await index.getAll(userId);
    
    const filtered = topic 
        ? records.filter(r => r.topic === topic)
        : records;
    
    return filtered.map(r => ({
        topic: r.topic,
        score: r.score,
        timestamp: r.timestamp,
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// ============================================
// Learning Pattern Analysis
// ============================================

export interface LearningRecommendation {
    id: string;
    type: 'video' | 'reading' | 'quiz' | 'practice';
    topic: string;
    title: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
    completed: boolean;
}

export interface LearningPath {
    userId: string;
    recommendations: LearningRecommendation[];
    weakTopics: string[];
    strongTopics: string[];
    overallProgress: number;
    lastUpdated: Date;
}

const ALL_TOPICS = [
    'DMAIC Overview',
    'Project Charter',
    'SIPOC',
    'Voice of Customer',
    'Measurement System Analysis',
    'Process Capability',
    'Hypothesis Testing',
    'Regression Analysis',
    'Design of Experiments',
    'Root Cause Analysis',
    'FMEA',
    'Statistical Process Control',
    'Control Plans',
];

export async function analyzeLearningPattern(userId: string): Promise<LearningPath> {
    const db = await getLearningPathDB();
    
    // Get all performance data
    const history = await getPerformanceHistory(userId);
    
    // Calculate average scores by topic
    const topicScores: Record<string, { total: number; count: number }> = {};
    
    history.forEach(record => {
        let scoreData = topicScores[record.topic];
        if (!scoreData) {
            scoreData = { total: 0, count: 0 };
            topicScores[record.topic] = scoreData;
        }
        scoreData.total += record.score;
        scoreData.count++;
    });
    
    // Calculate averages
    const averages: Record<string, number> = {};
    Object.entries(topicScores).forEach(([topic, data]) => {
        averages[topic] = Math.round(data.total / data.count);
    });
    
    // Identify weak and strong topics
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];
    
    Object.entries(averages).forEach(([topic, avg]) => {
        if (avg !== undefined && avg < 60) weakTopics.push(topic);
        else if (avg !== undefined && avg >= 80) strongTopics.push(topic);
    });
    
    // Generate recommendations
    const recommendations: LearningRecommendation[] = [];
    
    // Priority 1: Weak topics that haven't been studied recently
    weakTopics.forEach((topic, index) => {
        recommendations.push({
            id: `rec-${Date.now()}-${index}`,
            type: 'video',
            topic,
            title: `${topic} - Core Concepts`,
            reason: `Your average score in this area is ${averages[topic]}%. Focus here to improve your overall competency.`,
            priority: 'high',
            estimatedTime: 30,
            completed: false,
        });
        
        recommendations.push({
            id: `rec-${Date.now()}-${index}-practice`,
            type: 'practice',
            topic,
            title: `${topic} - Practice Problems`,
            reason: 'Reinforce learning with hands-on practice.',
            priority: 'high',
            estimatedTime: 20,
            completed: false,
        });
    });
    
    // Priority 2: Unstudied topics
    const studiedTopics = Object.keys(averages);
    const unstudiedTopics = ALL_TOPICS.filter(t => !studiedTopics.includes(t));
    
    unstudiedTopics.slice(0, 3).forEach((topic, index) => {
        recommendations.push({
            id: `rec-new-${Date.now()}-${index}`,
            type: 'reading',
            topic,
            title: `${topic} - Introduction`,
            reason: 'New topic to expand your knowledge base.',
            priority: 'medium',
            estimatedTime: 25,
            completed: false,
        });
    });
    
    // Priority 3: Review strong topics (spaced repetition)
    strongTopics.slice(0, 2).forEach((topic, index) => {
        recommendations.push({
            id: `rec-review-${Date.now()}-${index}`,
            type: 'quiz',
            topic,
            title: `${topic} - Knowledge Check`,
            reason: 'Quick review to maintain your strong performance.',
            priority: 'low',
            estimatedTime: 10,
            completed: false,
        });
    });
    
    // Calculate overall progress
    const totalTopics = ALL_TOPICS.length;
    const masteredTopics = strongTopics.length;
    const overallProgress = Math.round((masteredTopics / totalTopics) * 100);
    
    const learningPath: LearningPath = {
        userId,
        recommendations: recommendations.slice(0, 10),
        weakTopics,
        strongTopics,
        overallProgress,
        lastUpdated: new Date(),
    };
    
    // Save pattern
    await db.put('learningPatterns', {
        userId,
        weakTopics,
        strongTopics,
        recommendedSequence: recommendations.map(r => r.topic),
        lastUpdated: new Date(),
    });
    
    return learningPath;
}

export async function getLearningPath(userId: string): Promise<LearningPath | undefined> {
    const db = await getLearningPathDB();
    const pattern = await db.get('learningPatterns', userId);
    
    if (!pattern) return undefined;
    
    return analyzeLearningPattern(userId);
}

export async function markRecommendationComplete(
    userId: string,
    _recommendationId: string
): Promise<void> {
    // In a full implementation, this would update the specific recommendation
    // For now, we'll just record that something was completed
    await recordQuizPerformance(userId, 'completed-recommendation', 100);
}

// ============================================
// Progress Tracking
// ============================================

export interface TopicProgress {
    topic: string;
    averageScore: number;
    attempts: number;
    lastStudied: Date | null;
    status: 'not-started' | 'learning' | 'proficient' | 'mastered';
}

export async function getDetailedProgress(userId: string): Promise<TopicProgress[]> {
    const history = await getPerformanceHistory(userId);
    
    const progressMap: Record<string, {
        scores: number[];
        lastStudied: Date | null;
    }> = {};
    
    // Initialize all topics
    ALL_TOPICS.forEach(topic => {
        progressMap[topic] = { scores: [], lastStudied: null };
    });
    
    // Populate with actual data
    history.forEach(record => {
        const topicData = progressMap[record.topic];
        if (topicData) {
            topicData.scores.push(record.score);
            const currentLastStudied = topicData.lastStudied;
            if (!currentLastStudied || record.timestamp > currentLastStudied) {
                topicData.lastStudied = record.timestamp;
            }
        }
    });
    
    // Calculate progress for each topic
    return ALL_TOPICS.map(topic => {
        const topicData = progressMap[topic];
        const scores = topicData?.scores ?? [];
        const lastStudied = topicData?.lastStudied ?? null;
        
        const avgScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;
        
        let status: TopicProgress['status'] = 'not-started';
        if (avgScore >= 90) status = 'mastered';
        else if (avgScore >= 75) status = 'proficient';
        else if (avgScore > 0) status = 'learning';
        
        return {
            topic,
            averageScore: avgScore,
            attempts: scores.length,
            lastStudied,
            status,
        };
    });
}
