/**
 * Feature Modules Export
 * 
 * All new feature modules are exported from here
 */

// Phase 1: Quick Wins
export { SpacedRepetition } from './spaced-repetition/SpacedRepetition';
export * from './spaced-repetition/sm2';
export * from './spaced-repetition/spacedRepetition.db';

export { CommunityNotes } from './community-notes/CommunityNotes';
export * from './community-notes/communityNotes.db';

export { SkillsGap } from './skills-gap/SkillsGap';
export * from './skills-gap/skillsGap.db';

// Phase 2: Core Learning Features
export { MockExams } from './mock-exams/MockExams';
export * from './mock-exams/mockExams.db';
export * from './mock-exams/examQuestions';

export { ProjectPortfolio } from './project-portfolio/ProjectPortfolio';
export * from './project-portfolio/projectPortfolio.db';

export { SmartScheduler } from './smart-scheduler/SmartScheduler';

// Phase 3: AI Features
export { AILearningPath } from './ai-learning-path/AILearningPath';
export * from './ai-learning-path/aiLearningPath.db';

export { AIMentor } from './ai-mentor/AIMentor';
export * from './ai-mentor/aiMentor.db';

// Phase 4: Collaboration
export { StudyGroups } from './study-groups/StudyGroups';
export * from './study-groups/studyGroups.db';

export { Mentorship } from './mentorship/Mentorship';
export * from './mentorship/mentorship.db';

export { OfflinePWA } from './offline-pwa/OfflinePWA';
export * from './offline-pwa/offlineManager';
