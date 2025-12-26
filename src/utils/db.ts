import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { UserProgress, UserProfile, QuizAttempt, Certificate, BeltLevel } from '../types';

interface SixSigmaDB extends DBSchema {
    userProfile: {
        key: number;
        value: UserProfile;
    };
    progress: {
        key: number;
        value: UserProgress;
        indexes: {
            'by-lesson': string;
            'by-module': string;
            'by-belt': BeltLevel;
        };
    };
    quizAttempts: {
        key: number;
        value: QuizAttempt & { id?: number };
        indexes: {
            'by-quiz': string;
        };
    };
    certificates: {
        key: string;
        value: Certificate;
        indexes: {
            'by-belt': BeltLevel;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SixSigmaDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<SixSigmaDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<SixSigmaDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // User Profile Store
            if (!db.objectStoreNames.contains('userProfile')) {
                db.createObjectStore('userProfile', { keyPath: 'id', autoIncrement: true });
            }

            // Progress Store
            if (!db.objectStoreNames.contains('progress')) {
                const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
                progressStore.createIndex('by-lesson', 'lessonId');
                progressStore.createIndex('by-module', 'moduleId');
                progressStore.createIndex('by-belt', 'beltLevel');
            }

            // Quiz Attempts Store
            if (!db.objectStoreNames.contains('quizAttempts')) {
                const quizStore = db.createObjectStore('quizAttempts', { keyPath: 'id', autoIncrement: true });
                quizStore.createIndex('by-quiz', 'quizId');
            }

            // Certificates Store
            if (!db.objectStoreNames.contains('certificates')) {
                const certStore = db.createObjectStore('certificates', { keyPath: 'id' });
                certStore.createIndex('by-belt', 'beltLevel');
            }
        },
    });

    return dbInstance;
}

// User Profile Functions
export async function getUserProfile(): Promise<UserProfile | undefined> {
    const db = await getDB();
    const profiles = await db.getAll('userProfile');
    return profiles[0];
}

export async function saveUserProfile(profile: UserProfile): Promise<number> {
    const db = await getDB();
    const id = await db.put('userProfile', profile);
    return id;
}

export async function createDefaultProfile(name: string): Promise<UserProfile> {
    const profile: UserProfile = {
        name,
        email: '',
        createdAt: new Date(),
        currentBelt: 'white',
        preferences: {
            theme: 'dark',
            autoPlayVideos: true,
        },
    };
    const id = await saveUserProfile(profile);
    return { ...profile, id };
}

// Progress Functions
export async function getLessonProgress(lessonId: string): Promise<UserProgress | undefined> {
    const db = await getDB();
    const results = await db.getAllFromIndex('progress', 'by-lesson', lessonId);
    return results[0];
}

export async function getModuleProgress(moduleId: string): Promise<UserProgress[]> {
    const db = await getDB();
    return db.getAllFromIndex('progress', 'by-module', moduleId);
}

export async function getBeltProgress(beltLevel: BeltLevel): Promise<UserProgress[]> {
    const db = await getDB();
    return db.getAllFromIndex('progress', 'by-belt', beltLevel);
}

export async function markLessonComplete(
    lessonId: string,
    moduleId: string,
    beltLevel: BeltLevel,
    timeSpent: number
): Promise<void> {
    const db = await getDB();
    const existing = await getLessonProgress(lessonId);

    if (existing) {
        await db.put('progress', {
            ...existing,
            completed: true,
            completedAt: new Date(),
            timeSpent: existing.timeSpent + timeSpent,
        });
    } else {
        await db.add('progress', {
            lessonId,
            moduleId,
            beltLevel,
            completed: true,
            completedAt: new Date(),
            timeSpent,
        });
    }
}

export async function updateLessonTime(
    lessonId: string,
    moduleId: string,
    beltLevel: BeltLevel,
    timeSpent: number
): Promise<void> {
    const db = await getDB();
    const existing = await getLessonProgress(lessonId);

    if (existing) {
        await db.put('progress', {
            ...existing,
            timeSpent: existing.timeSpent + timeSpent,
        });
    } else {
        await db.add('progress', {
            lessonId,
            moduleId,
            beltLevel,
            completed: false,
            timeSpent,
        });
    }
}

// Quiz Functions
export async function saveQuizAttempt(attempt: QuizAttempt): Promise<number> {
    const db = await getDB();
    return db.add('quizAttempts', attempt as QuizAttempt & { id?: number });
}

export async function getQuizAttempts(quizId: string): Promise<QuizAttempt[]> {
    const db = await getDB();
    return db.getAllFromIndex('quizAttempts', 'by-quiz', quizId);
}

export async function getBestQuizAttempt(quizId: string): Promise<QuizAttempt | undefined> {
    const attempts = await getQuizAttempts(quizId);
    if (attempts.length === 0) return undefined;
    return attempts.reduce((best, current) =>
        current.percentage > best.percentage ? current : best
    );
}

// Certificate Functions
export async function saveCertificate(certificate: Certificate): Promise<void> {
    const db = await getDB();
    await db.put('certificates', certificate);
}

export async function getCertificate(id: string): Promise<Certificate | undefined> {
    const db = await getDB();
    return db.get('certificates', id);
}

export async function getCertificateByBelt(beltLevel: BeltLevel): Promise<Certificate | undefined> {
    const db = await getDB();
    const certs = await db.getAllFromIndex('certificates', 'by-belt', beltLevel);
    return certs[0];
}

export async function getAllCertificates(): Promise<Certificate[]> {
    const db = await getDB();
    return db.getAll('certificates');
}

// Utility Functions
export function generateCertificateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'SS-';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

export async function clearAllData(): Promise<void> {
    const db = await getDB();
    await db.clear('userProfile');
    await db.clear('progress');
    await db.clear('quizAttempts');
    await db.clear('certificates');
}
