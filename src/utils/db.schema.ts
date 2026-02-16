/**
 * Extended Database Schema for New Features
 * 
 * Defines types and interfaces for:
 * - Spaced Repetition
 * - Community Notes
 * - Skills Gap Analysis
 * - Mock Exams
 * - Project Portfolio
 */

import type { BeltLevel } from '../types';

// ============================================
// Spaced Repetition
// ============================================

export interface SpacedRepetitionCard {
    id: string;
    userId: string;
    question: string;
    answer: string;
    beltLevel: BeltLevel;
    topic: string;
    lessonId?: string;
    
    // SM-2 Algorithm fields
    interval: number;        // days until next review
    repetition: number;      // successful review count (0-5+)
    easinessFactor: number;  // 1.3-2.5, adjusts based on performance
    nextReviewDate: Date;
    
    // Metadata
    createdAt: Date;
    lastReviewedAt?: Date;
    totalReviews: number;
    correctStreak: number;
}

export interface CardReview {
    id: string;
    cardId: string;
    userId: string;
    quality: number;         // 0-5 (0=complete blackout, 5=perfect)
    timeTaken: number;       // seconds
    reviewedAt: Date;
}

export interface SpacedRepetitionStats {
    totalCards: number;
    dueToday: number;
    newCards: number;
    learning: number;
    review: number;
    streak: number;          // consecutive days of reviews
    totalReviews: number;
    averageRetention: number;
}

// ============================================
// Community Notes
// ============================================

export interface CommunityNote {
    id: string;
    lessonId: string;
    userId: string;
    userName: string;
    content: string;
    timestamp?: number;      // video timestamp if applicable
    votes: number;
    userVote?: 'up' | 'down' | null;
    isOfficial: boolean;     // instructor-verified
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NoteVote {
    id: string;
    noteId: string;
    userId: string;
    voteType: 'up' | 'down';
    createdAt: Date;
}

// ============================================
// Skills Gap Analysis
// ============================================

export type DMAICPhase = 'define' | 'measure' | 'analyze' | 'improve' | 'control';

export interface Subskill {
    id: string;
    name: string;
    description: string;
    phase: DMAICPhase;
    beltRequirement: {
        white: boolean;
        yellow: boolean;
        green: boolean;
        black: boolean;
        masterBlack: boolean;
    };
    score: number;           // 0-100
    maxScore: number;
    lastAssessed: Date;
}

export interface SkillsMatrix {
    userId: string;
    updatedAt: Date;
    phases: Record<DMAICPhase, {
        score: number;
        maxScore: number;
        percentage: number;
        subskills: Subskill[];
    }>;
    overallScore: number;
    targetBelt: BeltLevel;
    readinessScore: number;  // 0-100, exam readiness
}

// ============================================
// Mock Certification Exams
// ============================================

export type CertificationBody = 'asq' | 'iassc';

export interface MockExam {
    id: string;
    userId: string;
    certificationBody: CertificationBody;
    beltLevel: BeltLevel;
    startedAt: Date;
    completedAt?: Date;
    status: 'in-progress' | 'completed' | 'abandoned';
    
    // Configuration
    timeLimit: number;       // minutes
    questionCount: number;
    allowedCalculators: boolean;
    
    // Progress
    currentQuestion: number;
    answers: Record<string, number>;  // questionId -> optionIndex
    bookmarkedQuestions: string[];
    timeRemaining: number;   // seconds
    
    // Results (if completed)
    score?: number;
    passingScore?: number;
    passed?: boolean;
    domainScores?: Record<DMAICPhase, {
        correct: number;
        total: number;
        percentage: number;
    }>;
}

export interface ExamQuestion {
    id: string;
    certificationBody: CertificationBody;
    beltLevel: BeltLevel;
    phase: DMAICPhase;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    topic: string;
    reference?: string;
}

// ============================================
// Project Portfolio (DMAIC)
// ============================================

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';

export interface DMAICProject {
    id: string;
    userId: string;
    title: string;
    description: string;
    industry: string;
    organization?: string;
    startDate: Date;
    targetCompletionDate?: Date;
    completedDate?: Date;
    
    currentPhase: DMAICPhase;
    status: ProjectStatus;
    
    // Phase completion tracking
    phases: Record<DMAICPhase, ProjectPhase>;
    
    // Tools used
    tools: ProjectTool[];
    
    // Team & Mentorship
    teamMembers: TeamMember[];
    mentorId?: string;
    
    // Results
    metrics: ProjectMetric[];
    financialImpact?: number;
    
    // Sharing
    isPublic: boolean;
    shareUrl?: string;
    
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectPhase {
    status: 'not-started' | 'in-progress' | 'completed' | 'skipped';
    startedAt?: Date;
    completedAt?: Date;
    checklist: ChecklistItem[];
    documents: ProjectDocument[];
    notes: string;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
    completedAt?: Date;
}

export interface ProjectDocument {
    id: string;
    name: string;
    type: 'charter' | 'data' | 'analysis' | 'report' | 'other';
    content?: string;        // for embedded documents
    fileUrl?: string;        // for uploaded files
    uploadedAt: Date;
}

export interface ProjectTool {
    id: string;
    type: 'fishbone' | 'process-map' | 'control-chart' | 'histogram' | 
          'pareto' | 'scatter' | 'box-plot' | 'capability' | 'hypothesis-test' |
          'regression' | 'doe' | 'fmea' | 'qfd' | 'other';
    name: string;
    phase: DMAICPhase;
    data: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    beltLevel?: BeltLevel;
    email?: string;
}

export interface ProjectMetric {
    id: string;
    name: string;
    unit: string;
    baseline: number;
    target: number;
    actual?: number;
    measurementSystem?: string;
}

// ============================================
// Study Groups
// ============================================

export interface StudyGroup {
    id: string;
    name: string;
    description: string;
    maxMembers: number;
    createdBy: string;
    createdAt: Date;
    
    members: GroupMember[];
    sessions: GroupSession[];
    sharedResources: SharedResource[];
}

export interface GroupMember {
    id: string;
    userId: string;
    name: string;
    beltLevel: BeltLevel;
    role: 'admin' | 'member';
    joinedAt: Date;
    lastActive?: Date;
}

export interface GroupSession {
    id: string;
    lessonId: string;
    lessonTitle: string;
    startedAt: Date;
    endedAt?: Date;
    participants: string[];  // userIds
    videoPosition?: number;
    isSyncPlayback: boolean;
}

export interface SharedResource {
    id: string;
    type: 'flashcards' | 'notes' | 'quiz' | 'link';
    title: string;
    content: string;
    sharedBy: string;
    sharedAt: Date;
}

// ============================================
// Database Keys
// ============================================

export const DB_KEYS = {
    // Spaced Repetition
    SPACED_REPETITION_CARDS: 'spaced-repetition-cards',
    CARD_REVIEWS: 'card-reviews',
    SPACED_REPETITION_STATS: 'spaced-repetition-stats',
    
    // Community Notes
    COMMUNITY_NOTES: 'community-notes',
    NOTE_VOTES: 'note-votes',
    
    // Skills Gap
    SKILLS_MATRIX: 'skills-matrix',
    SUBSKILL_SCORES: 'subskill-scores',
    
    // Mock Exams
    MOCK_EXAMS: 'mock-exams',
    EXAM_QUESTIONS: 'exam-questions',
    
    // Projects
    PROJECTS: 'projects',
    PROJECT_DOCUMENTS: 'project-documents',
    
    // Study Groups
    STUDY_GROUPS: 'study-groups',
    GROUP_SESSIONS: 'group-sessions',
} as const;
