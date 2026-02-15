/**
 * Tests for Database Utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    getDB,
    getUserProfile,
    saveUserProfile,
    createDefaultProfile,
    getLessonProgress,
    getModuleProgress,
    getBeltProgress,
    markLessonComplete,
    updateLessonTime,
    saveQuizAttempt,
    getQuizAttempts,
    getBestQuizAttempt,
    saveCertificate,
    getCertificate,
    getCertificateByBelt,
    getAllCertificates,
    generateCertificateId,
    clearAllData,
} from './db';
import { UserProfile, UserProgress, QuizAttempt, Certificate } from '../types';

// Mock idb
vi.mock('idb', () => ({
    openDB: vi.fn(),
}));

import { openDB } from 'idb';

describe('Database Utilities', () => {
    const mockDB = {
        getAll: vi.fn(),
        getAllFromIndex: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        add: vi.fn(),
        clear: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (openDB as ReturnType<typeof vi.fn>).mockResolvedValue(mockDB);
    });

    afterEach(() => {
        vi.resetModules();
    });

    describe('getDB', () => {
        it('returns database instance', async () => {
            const db = await getDB();
            expect(db).toBe(mockDB);
            expect(openDB).toHaveBeenCalledWith('six-sigma-training', 1, expect.any(Object));
        });

        it('returns same database instance on multiple calls', async () => {
            const db1 = await getDB();
            const db2 = await getDB();
            expect(db1).toBe(db2);
        });
    });

    describe('User Profile', () => {
        it('gets user profile', async () => {
            const mockProfile: UserProfile = {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark', autoPlayVideos: true },
                createdAt: new Date(),
            };
            mockDB.getAll.mockResolvedValue([mockProfile]);

            const result = await getUserProfile();
            expect(result).toEqual(mockProfile);
        });

        it('returns undefined when no profile exists', async () => {
            mockDB.getAll.mockResolvedValue([]);

            const result = await getUserProfile();
            expect(result).toBeUndefined();
        });

        it('saves user profile', async () => {
            const profile: UserProfile = {
                name: 'Test User',
                email: 'test@example.com',
                currentBelt: 'white',
                preferences: { theme: 'dark', autoPlayVideos: true },
                createdAt: new Date(),
            };
            mockDB.put.mockResolvedValue(1);

            const result = await saveUserProfile(profile);
            expect(result).toBe(1);
            expect(mockDB.put).toHaveBeenCalledWith('userProfile', profile);
        });

        it('creates default profile', async () => {
            mockDB.put.mockResolvedValue(1);

            const result = await createDefaultProfile('Test User');
            expect(result.name).toBe('Test User');
            expect(result.currentBelt).toBe('white');
            expect(result.preferences.theme).toBe('dark');
        });
    });

    describe('Progress Functions', () => {
        it('gets lesson progress', async () => {
            const mockProgress: UserProgress = {
                id: 1,
                lessonId: 'lesson-1',
                moduleId: 'module-1',
                beltLevel: 'white',
                completed: true,
                timeSpent: 300,
            };
            mockDB.getAllFromIndex.mockResolvedValue([mockProgress]);

            const result = await getLessonProgress('lesson-1');
            expect(result).toEqual(mockProgress);
        });

        it('gets module progress', async () => {
            const mockProgress: UserProgress[] = [
                { id: 1, lessonId: 'lesson-1', moduleId: 'module-1', beltLevel: 'white', completed: true, timeSpent: 300 },
            ];
            mockDB.getAllFromIndex.mockResolvedValue(mockProgress);

            const result = await getModuleProgress('module-1');
            expect(result).toEqual(mockProgress);
        });

        it('gets belt progress', async () => {
            const mockProgress: UserProgress[] = [
                { id: 1, lessonId: 'lesson-1', moduleId: 'module-1', beltLevel: 'white', completed: true, timeSpent: 300 },
            ];
            mockDB.getAllFromIndex.mockResolvedValue(mockProgress);

            const result = await getBeltProgress('white');
            expect(result).toEqual(mockProgress);
        });

        it('marks lesson complete with existing progress', async () => {
            const existingProgress: UserProgress = {
                id: 1,
                lessonId: 'lesson-1',
                moduleId: 'module-1',
                beltLevel: 'white',
                completed: false,
                timeSpent: 100,
            };
            mockDB.getAllFromIndex.mockResolvedValue([existingProgress]);

            await markLessonComplete('lesson-1', 'module-1', 'white', 200);
            expect(mockDB.put).toHaveBeenCalledWith('progress', expect.objectContaining({
                completed: true,
                timeSpent: 300,
            }));
        });

        it('marks lesson complete without existing progress', async () => {
            mockDB.getAllFromIndex.mockResolvedValue([]);

            await markLessonComplete('lesson-1', 'module-1', 'white', 200);
            expect(mockDB.add).toHaveBeenCalledWith('progress', expect.objectContaining({
                lessonId: 'lesson-1',
                moduleId: 'module-1',
                beltLevel: 'white',
                completed: true,
                timeSpent: 200,
            }));
        });

        it('updates lesson time with existing progress', async () => {
            const existingProgress: UserProgress = {
                id: 1,
                lessonId: 'lesson-1',
                moduleId: 'module-1',
                beltLevel: 'white',
                completed: false,
                timeSpent: 100,
            };
            mockDB.getAllFromIndex.mockResolvedValue([existingProgress]);

            await updateLessonTime('lesson-1', 'module-1', 'white', 200);
            expect(mockDB.put).toHaveBeenCalledWith('progress', expect.objectContaining({
                timeSpent: 300,
            }));
        });

        it('updates lesson time without existing progress', async () => {
            mockDB.getAllFromIndex.mockResolvedValue([]);

            await updateLessonTime('lesson-1', 'module-1', 'white', 200);
            expect(mockDB.add).toHaveBeenCalledWith('progress', expect.objectContaining({
                lessonId: 'lesson-1',
                completed: false,
                timeSpent: 200,
            }));
        });
    });

    describe('Quiz Functions', () => {
        it('saves quiz attempt', async () => {
            const attempt: QuizAttempt = {
                quizId: 'quiz-1',
                score: 8,
                totalPoints: 10,
                percentage: 80,
                passed: true,
                completedAt: new Date(),
                answers: {},
                timeSpent: 120,
            };
            mockDB.add.mockResolvedValue(1);

            const result = await saveQuizAttempt(attempt);
            expect(result).toBe(1);
        });

        it('gets quiz attempts', async () => {
            const attempts: QuizAttempt[] = [
                { quizId: 'quiz-1', score: 8, totalPoints: 10, percentage: 80, passed: true, completedAt: new Date(), answers: {}, timeSpent: 120 },
            ];
            mockDB.getAllFromIndex.mockResolvedValue(attempts);

            const result = await getQuizAttempts('quiz-1');
            expect(result).toEqual(attempts);
        });

        it('gets best quiz attempt', async () => {
            const attempts: QuizAttempt[] = [
                { quizId: 'quiz-1', score: 6, totalPoints: 10, percentage: 60, passed: true, completedAt: new Date(), answers: {}, timeSpent: 120 },
                { quizId: 'quiz-1', score: 9, totalPoints: 10, percentage: 90, passed: true, completedAt: new Date(), answers: {}, timeSpent: 120 },
                { quizId: 'quiz-1', score: 7, totalPoints: 10, percentage: 70, passed: true, completedAt: new Date(), answers: {}, timeSpent: 120 },
            ];
            mockDB.getAllFromIndex.mockResolvedValue(attempts);

            const result = await getBestQuizAttempt('quiz-1');
            expect(result?.percentage).toBe(90);
        });

        it('returns undefined when no attempts exist', async () => {
            mockDB.getAllFromIndex.mockResolvedValue([]);

            const result = await getBestQuizAttempt('quiz-1');
            expect(result).toBeUndefined();
        });
    });

    describe('Certificate Functions', () => {
        it('saves certificate', async () => {
            const certificate: Certificate = {
                id: 'CERT-123',
                beltLevel: 'white',
                userName: 'Test User',
                issueDate: new Date(),
                score: 85,
                verificationCode: 'ABC123',
            };

            await saveCertificate(certificate);
            expect(mockDB.put).toHaveBeenCalledWith('certificates', certificate);
        });

        it('gets certificate by id', async () => {
            const certificate: Certificate = {
                id: 'CERT-123',
                beltLevel: 'white',
                userName: 'Test User',
                issueDate: new Date(),
                score: 85,
                verificationCode: 'ABC123',
            };
            mockDB.get.mockResolvedValue(certificate);

            const result = await getCertificate('CERT-123');
            expect(result).toEqual(certificate);
        });

        it('gets certificate by belt', async () => {
            const certificate: Certificate = {
                id: 'CERT-123',
                beltLevel: 'white',
                userName: 'Test User',
                issueDate: new Date(),
                score: 85,
                verificationCode: 'ABC123',
            };
            mockDB.getAllFromIndex.mockResolvedValue([certificate]);

            const result = await getCertificateByBelt('white');
            expect(result).toEqual(certificate);
        });

        it('gets all certificates', async () => {
            const certificates: Certificate[] = [
                { id: 'CERT-1', beltLevel: 'white', userName: 'User 1', issueDate: new Date(), score: 85, verificationCode: 'ABC123' },
                { id: 'CERT-2', beltLevel: 'yellow', userName: 'User 1', issueDate: new Date(), score: 90, verificationCode: 'DEF456' },
            ];
            mockDB.getAll.mockResolvedValue(certificates);

            const result = await getAllCertificates();
            expect(result).toEqual(certificates);
        });
    });

    describe('Utility Functions', () => {
        it('generates certificate ID with correct format', () => {
            const id = generateCertificateId();
            expect(id).toMatch(/^SS-[A-Z0-9]{8}$/);
        });

        it('generates unique certificate IDs', () => {
            const ids = new Set();
            for (let i = 0; i < 100; i++) {
                ids.add(generateCertificateId());
            }
            expect(ids.size).toBe(100);
        });

        it('clears all data', async () => {
            await clearAllData();
            expect(mockDB.clear).toHaveBeenCalledWith('userProfile');
            expect(mockDB.clear).toHaveBeenCalledWith('progress');
            expect(mockDB.clear).toHaveBeenCalledWith('quizAttempts');
            expect(mockDB.clear).toHaveBeenCalledWith('certificates');
        });
    });
});
