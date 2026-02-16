/**
 * Mock Exams Database Operations
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { MockExam, ExamQuestion } from '../../utils/db.schema';
import { getExamQuestions } from './examQuestions';

interface MockExamsDBSchema extends DBSchema {
    mockExams: {
        key: string;
        value: MockExam;
        indexes: {
            'by-user': string;
            'by-status': string;
        };
    };
    examQuestions: {
        key: string;
        value: ExamQuestion;
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<MockExamsDBSchema> | null = null;

export async function getExamsDB(): Promise<IDBPDatabase<MockExamsDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<MockExamsDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('mockExams')) {
                const examStore = db.createObjectStore('mockExams', { keyPath: 'id' });
                examStore.createIndex('by-user', 'userId');
                examStore.createIndex('by-status', 'status');
            }
            
            if (!db.objectStoreNames.contains('examQuestions')) {
                db.createObjectStore('examQuestions', { keyPath: 'id' });
            }
        },
    });

    return dbInstance;
}

// ============================================
// Exam Operations
// ============================================

export async function createMockExam(
    userId: string,
    config: {
        certificationBody: 'asq' | 'iassc';
        beltLevel: 'black';
        questionCount?: number;
        timeLimit?: number;
    }
): Promise<MockExam> {
    const db = await getExamsDB();
    const questionCount = config.questionCount || 165;
    const timeLimit = config.timeLimit || 270; // 4.5 hours in minutes
    
    // Generate questions
    const questions = getExamQuestions(
        config.certificationBody,
        'black',
        questionCount
    );
    
    // Store questions
    const tx = db.transaction('examQuestions', 'readwrite');
    for (const question of questions) {
        await tx.store.put(question);
    }
    await tx.done;
    
    // Create exam
    const exam: MockExam = {
        id: `exam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        certificationBody: config.certificationBody,
        beltLevel: config.beltLevel,
        startedAt: new Date(),
        status: 'in-progress',
        timeLimit,
        questionCount,
        allowedCalculators: true,
        currentQuestion: 0,
        answers: {},
        bookmarkedQuestions: [],
        timeRemaining: timeLimit * 60, // Convert to seconds
    };
    
    await db.put('mockExams', exam);
    return exam;
}

export async function getExam(examId: string): Promise<MockExam | undefined> {
    const db = await getExamsDB();
    return await db.get('mockExams', examId);
}

export async function getExamQuestionsForExam(examId: string): Promise<ExamQuestion[]> {
    const exam = await getExam(examId);
    if (!exam) return [];
    
    // Get all questions - in real implementation, we'd store exam-question relationships
    // For now, return questions based on exam configuration
    return getExamQuestions(exam.certificationBody, 'black', exam.questionCount);
}

export async function updateExam(exam: MockExam): Promise<void> {
    const db = await getExamsDB();
    await db.put('mockExams', exam);
}

export async function saveAnswer(
    examId: string,
    questionId: string,
    answerIndex: number
): Promise<void> {
    const exam = await getExam(examId);
    if (!exam) return;
    
    exam.answers[questionId] = answerIndex;
    await updateExam(exam);
}

export async function toggleBookmark(examId: string, questionId: string): Promise<void> {
    const exam = await getExam(examId);
    if (!exam) return;
    
    const index = exam.bookmarkedQuestions.indexOf(questionId);
    if (index >= 0) {
        exam.bookmarkedQuestions.splice(index, 1);
    } else {
        exam.bookmarkedQuestions.push(questionId);
    }
    
    await updateExam(exam);
}

export async function submitExam(examId: string): Promise<MockExam> {
    const db = await getExamsDB();
    const exam = await getExam(examId);
    if (!exam) throw new Error('Exam not found');
    
    // Get questions to grade
    const questions = await getExamQuestionsForExam(examId);
    
    // Calculate score
    let correct = 0;
    const domainScores: Record<string, { correct: number; total: number; percentage: number }> = {};
    
    for (const question of questions) {
        const userAnswer = exam.answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) correct++;
        
        // Track by phase
        const phaseKey = question.phase ?? 'define';
        if (!domainScores[phaseKey]) {
            domainScores[phaseKey] = { correct: 0, total: 0, percentage: 0 };
        }
        domainScores[phaseKey].total++;
        if (isCorrect) domainScores[phaseKey].correct++;
    }
    
    // Calculate percentages
    for (const phase of Object.keys(domainScores)) {
        const data = domainScores[phase];
        if (data) {
            data.percentage = Math.round((data.correct / data.total) * 100);
        }
    }
    
    // Update exam with results
    const score = Math.round((correct / questions.length) * 100);
    const passingScore = 70; // ASQ passing score is typically 70%
    
    exam.status = 'completed';
    exam.completedAt = new Date();
    exam.score = score;
    exam.passingScore = passingScore;
    exam.passed = score >= passingScore;
    exam.domainScores = domainScores;
    
    await db.put('mockExams', exam);
    return exam;
}

export async function abandonExam(examId: string): Promise<void> {
    const exam = await getExam(examId);
    if (!exam) return;
    
    exam.status = 'abandoned';
    await updateExam(exam);
}

// ============================================
// Exam History
// ============================================

export async function getUserExams(userId: string): Promise<MockExam[]> {
    const db = await getExamsDB();
    const index = db.transaction('mockExams').store.index('by-user');
    return await index.getAll(userId);
}

export async function getCompletedExams(userId: string): Promise<MockExam[]> {
    const exams = await getUserExams(userId);
    return exams.filter(e => e.status === 'completed');
}

export async function getInProgressExam(userId: string): Promise<MockExam | undefined> {
    const db = await getExamsDB();
    const index = db.transaction('mockExams').store.index('by-user');
    const exams = await index.getAll(userId);
    return exams.find(e => e.status === 'in-progress');
}

// ============================================
// Statistics
// ============================================

export interface ExamStatistics {
    totalExams: number;
    passed: number;
    failed: number;
    averageScore: number;
    bestScore: number;
    byPhase: Record<string, { average: number; attempts: number }>;
    recentTrend: { improving: boolean; change: number };
}

export async function getExamStatistics(userId: string): Promise<ExamStatistics> {
    const exams = await getCompletedExams(userId);
    
    if (exams.length === 0) {
        return {
            totalExams: 0,
            passed: 0,
            failed: 0,
            averageScore: 0,
            bestScore: 0,
            byPhase: {},
            recentTrend: { improving: false, change: 0 },
        };
    }
    
    const passed = exams.filter(e => e.passed).length;
    const scores = exams.map(e => e.score || 0);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Calculate phase averages
    const byPhase: Record<string, { total: number; count: number }> = {};
    exams.forEach(exam => {
        if (exam.domainScores) {
            Object.entries(exam.domainScores).forEach(([phase, data]) => {
                if (!byPhase[phase]) byPhase[phase] = { total: 0, count: 0 };
                byPhase[phase].total += data.percentage;
                byPhase[phase].count++;
            });
        }
    });
    
    const phaseAverages: Record<string, { average: number; attempts: number }> = {};
    Object.entries(byPhase).forEach(([phase, data]) => {
        phaseAverages[phase] = {
            average: Math.round(data.total / data.count),
            attempts: data.count,
        };
    });
    
    // Calculate trend
    const sorted = [...exams].sort((a, b) => 
        new Date(a.completedAt!).getTime() - new Date(b.completedAt!).getTime()
    );
    
    let trend = { improving: false, change: 0 };
    if (sorted.length >= 2) {
        const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
        const secondHalf = sorted.slice(Math.floor(sorted.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, e) => sum + (e.score || 0), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, e) => sum + (e.score || 0), 0) / secondHalf.length;
        
        trend = {
            improving: secondAvg > firstAvg,
            change: Math.round(secondAvg - firstAvg),
        };
    }
    
    return {
        totalExams: exams.length,
        passed,
        failed: exams.length - passed,
        averageScore,
        bestScore: Math.max(...scores),
        byPhase: phaseAverages,
        recentTrend: trend,
    };
}
