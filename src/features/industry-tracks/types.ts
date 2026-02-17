/**
 * Industry-Specific Tracks - Type Definitions
 * 
 * Types for industry-specific Six Sigma content and learning paths
 */

export type IndustryType = 'healthcare' | 'manufacturing' | 'service' | 'it-software' | 'finance';

export interface IndustryTrack {
  id: IndustryType;
  name: string;
  description: string;
  icon: string;
  color: string;
  challenges: string[];
  applications: string[];
  metrics: string[];
  caseStudies: CaseStudy[];
  tools: IndustryTool[];
  certificationPath: CertificationLevel[];
  statistics: IndustryStatistics;
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  challenge: string;
  approach: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  dmaicPhase: string;
  duration: string;
  teamSize: number;
  roi: string;
}

export interface IndustryTool {
  id: string;
  name: string;
  description: string;
  application: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  whenToUse: string[];
  examples: string[];
}

export interface CertificationLevel {
  level: 'white' | 'yellow' | 'green' | 'black';
  focus: string[];
  projects: string[];
  duration: string;
  prerequisites: string[];
  industrySpecificSkills: string[];
}

export interface IndustryStatistics {
  averageProjectDuration: string;
  typicalTeamSize: string;
  commonProjectTypes: string[];
  successRate: string;
  averageSavings: string;
}

// Learning module for each industry
export interface IndustryModule {
  id: string;
  industryId: IndustryType;
  title: string;
  description: string;
  lessons: IndustryLesson[];
  quiz: IndustryQuiz;
}

export interface IndustryLesson {
  id: string;
  title: string;
  content: string;
  examples: string[];
  exercises: Exercise[];
  duration: number; // minutes
}

export interface Exercise {
  id: string;
  type: 'scenario' | 'calculation' | 'case-study' | 'simulation';
  title: string;
  description: string;
  data?: Record<string, unknown>;
  solution?: string;
}

export interface IndustryQuiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit: number; // minutes
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'scenario';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  industryContext: string;
}

// User progress tracking
export interface IndustryProgress {
  industryId: IndustryType;
  startedAt: number;
  completedAt?: number;
  completedModules: string[];
  quizScores: Record<string, number>;
  certificatesEarned: string[];
}
