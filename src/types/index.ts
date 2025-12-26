// Belt Levels
export type BeltLevel = 'white' | 'yellow' | 'green' | 'black' | 'master';

export interface BeltInfo {
    id: BeltLevel;
    name: string;
    fullName: string;
    color: string;
    hours: string;
    modules: number;
    description: string;
    prerequisites: BeltLevel[];
}

// Modules & Lessons
export interface Module {
    id: string;
    title: string;
    description: string;
    beltLevel: BeltLevel;
    order: number;
    lessons: Lesson[];
    quiz?: Quiz;
    estimatedMinutes: number;
}

export interface Lesson {
    id: string;
    title: string;
    content: string; // HTML content
    videoUrl?: string;
    videoTitle?: string;
    order: number;
    estimatedMinutes: number;
}

// Quizzes & Assessments
export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
    passingScore: number; // percentage
    timeLimit?: number; // minutes
}

export interface Question {
    id: string;
    type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'calculation';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
}

export interface QuizAttempt {
    quizId: string;
    answers: Record<string, string | number>;
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    completedAt: Date;
    timeSpent: number; // seconds
}

// Progress Tracking
export interface UserProgress {
    id?: number;
    lessonId: string;
    moduleId: string;
    beltLevel: BeltLevel;
    completed: boolean;
    completedAt?: Date;
    timeSpent: number; // seconds
}

export interface BeltProgress {
    beltLevel: BeltLevel;
    totalLessons: number;
    completedLessons: number;
    totalModules: number;
    completedModules: number;
    percentage: number;
    certified: boolean;
    certifiedAt?: Date;
    certificateId?: string;
}

export interface UserProfile {
    id?: number;
    name: string;
    email: string;
    createdAt: Date;
    currentBelt: BeltLevel;
    preferences: {
        theme: 'light' | 'dark';
        autoPlayVideos: boolean;
    };
}

// Certificate
export interface Certificate {
    id: string;
    beltLevel: BeltLevel;
    userName: string;
    issueDate: Date;
    score: number;
    verificationCode: string;
}

// Navigation
export interface NavItem {
    path: string;
    label: string;
    icon?: string;
    children?: NavItem[];
}
