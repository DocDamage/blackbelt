/**
 * Skills Gap Analysis Database Operations
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { SkillsMatrix, Subskill, DMAICPhase } from '../../utils/db.schema';

interface SkillsGapDBSchema extends DBSchema {
    skillsMatrix: {
        key: string;
        value: SkillsMatrix;
        indexes: {
            'by-user': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<SkillsGapDBSchema> | null = null;

export async function getSkillsDB(): Promise<IDBPDatabase<SkillsGapDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<SkillsGapDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('skillsMatrix')) {
                const store = db.createObjectStore('skillsMatrix', { keyPath: 'userId' });
                store.createIndex('by-user', 'userId');
            }
        },
    });

    return dbInstance;
}

// Default subskills for each DMAIC phase
export const DEFAULT_SUBSKILLS: Subskill[] = [
    // Define Phase
    {
        id: 'define-project-charter',
        name: 'Project Charter Development',
        description: 'Creating a clear problem statement, scope, and objectives',
        phase: 'define',
        beltRequirement: { white: true, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'define-sipoc',
        name: 'SIPOC Diagram',
        description: 'Mapping Suppliers, Inputs, Process, Outputs, Customers',
        phase: 'define',
        beltRequirement: { white: true, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'define-voc',
        name: 'Voice of Customer (VOC)',
        description: 'Gathering and translating customer requirements',
        phase: 'define',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'define-ctq',
        name: 'CTQ Tree',
        description: 'Critical to Quality characteristics decomposition',
        phase: 'define',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    
    // Measure Phase
    {
        id: 'measure-msa',
        name: 'Measurement System Analysis',
        description: 'Gage R&R, bias, linearity studies',
        phase: 'measure',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'measure-capability',
        name: 'Process Capability',
        description: 'Cp, Cpk, Pp, Ppk calculations and interpretation',
        phase: 'measure',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'measure-dpmo',
        name: 'DPMO & Sigma Level',
        description: 'Defects per million opportunities and sigma level calculations',
        phase: 'measure',
        beltRequirement: { white: true, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'measure-data-types',
        name: 'Data Types & Collection',
        description: 'Continuous, discrete, attribute data and sampling methods',
        phase: 'measure',
        beltRequirement: { white: true, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    
    // Analyze Phase
    {
        id: 'analyze-hypothesis',
        name: 'Hypothesis Testing',
        description: 't-tests, ANOVA, chi-square, proportions tests',
        phase: 'analyze',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'analyze-regression',
        name: 'Regression Analysis',
        description: 'Simple and multiple regression, correlation',
        phase: 'analyze',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'analyze-doe',
        name: 'Design of Experiments',
        description: 'Full factorial, fractional factorial, screening designs',
        phase: 'analyze',
        beltRequirement: { white: false, yellow: false, green: false, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'analyze-5whys',
        name: '5 Whys & Root Cause',
        description: 'Root cause analysis techniques',
        phase: 'analyze',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'analyze-fishbone',
        name: 'Fishbone Diagram',
        description: 'Ishikawa cause-and-effect diagram',
        phase: 'analyze',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    
    // Improve Phase
    {
        id: 'improve-brainstorming',
        name: 'Solution Brainstorming',
        description: 'Creative problem solving and solution generation',
        phase: 'improve',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'improve-pilot',
        name: 'Pilot Testing',
        description: 'Designing and executing pilot implementations',
        phase: 'improve',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'improve-fmea',
        name: 'FMEA',
        description: 'Failure Mode and Effects Analysis',
        phase: 'improve',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    
    // Control Phase
    {
        id: 'control-spc',
        name: 'Statistical Process Control',
        description: 'Control charts (X-bar, R, p, c, etc.)',
        phase: 'control',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'control-plan',
        name: 'Control Plan',
        description: 'Developing and implementing control plans',
        phase: 'control',
        beltRequirement: { white: false, yellow: false, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'control-poka-yoke',
        name: 'Poka-Yoke',
        description: 'Error proofing and mistake proofing',
        phase: 'control',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
    {
        id: 'control-standardization',
        name: 'Standardization',
        description: 'Documenting and standardizing improvements',
        phase: 'control',
        beltRequirement: { white: false, yellow: true, green: true, black: true, masterBlack: true },
        score: 0, maxScore: 100, lastAssessed: new Date(),
    },
];

// ============================================
// Skills Matrix Operations
// ============================================

export async function getSkillsMatrix(userId: string): Promise<SkillsMatrix | undefined> {
    const db = await getSkillsDB();
    return await db.get('skillsMatrix', userId);
}

export async function saveSkillsMatrix(matrix: SkillsMatrix): Promise<void> {
    const db = await getSkillsDB();
    await db.put('skillsMatrix', matrix);
}

export async function initializeSkillsMatrix(
    userId: string,
    targetBelt: SkillsMatrix['targetBelt'] = 'black'
): Promise<SkillsMatrix> {
    const phases: DMAICPhase[] = ['define', 'measure', 'analyze', 'improve', 'control'];
    
    const matrix: SkillsMatrix = {
        userId,
        updatedAt: new Date(),
        phases: {} as SkillsMatrix['phases'],
        overallScore: 0,
        targetBelt,
        readinessScore: 0,
    };
    
    phases.forEach(phase => {
        const phaseSkills = DEFAULT_SUBSKILLS.filter(s => s.phase === phase);
        const score = phaseSkills.reduce((sum, s) => sum + s.score, 0);
        const maxScore = phaseSkills.reduce((sum, s) => sum + s.maxScore, 0);
        
        matrix.phases[phase] = {
            score,
            maxScore,
            percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
            subskills: phaseSkills,
        };
    });
    
    // Calculate overall score
    const totalScore = Object.values(matrix.phases).reduce((sum, p) => sum + p.score, 0);
    const totalMax = Object.values(matrix.phases).reduce((sum, p) => sum + p.maxScore, 0);
    matrix.overallScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    matrix.readinessScore = matrix.overallScore;
    
    await saveSkillsMatrix(matrix);
    return matrix;
}

export async function updateSubskillScore(
    userId: string,
    subskillId: string,
    newScore: number
): Promise<SkillsMatrix> {
    let matrix = await getSkillsMatrix(userId);
    
    if (!matrix) {
        matrix = await initializeSkillsMatrix(userId);
    }
    
    // Find and update subskill
    for (const phase of Object.values(matrix.phases)) {
        const subskill = phase.subskills.find(s => s.id === subskillId);
        if (subskill) {
            subskill.score = Math.max(0, Math.min(100, newScore));
            subskill.lastAssessed = new Date();
            break;
        }
    }
    
    // Recalculate phase scores
    for (const phase of Object.values(matrix.phases)) {
        phase.score = phase.subskills.reduce((sum, s) => sum + s.score, 0);
        phase.percentage = phase.maxScore > 0 
            ? Math.round((phase.score / phase.maxScore) * 100) 
            : 0;
    }
    
    // Recalculate overall
    const totalScore = Object.values(matrix.phases).reduce((sum, p) => sum + p.score, 0);
    const totalMax = Object.values(matrix.phases).reduce((sum, p) => sum + p.maxScore, 0);
    matrix.overallScore = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
    matrix.readinessScore = matrix.overallScore;
    matrix.updatedAt = new Date();
    
    await saveSkillsMatrix(matrix);
    return matrix;
}

// ============================================
// Assessment Functions
// ============================================

export function assessSkillFromQuiz(
    currentScore: number,
    quizScore: number,  // 0-100
    quizWeight: number = 0.3
): number {
    // Weighted average favoring new performance
    return Math.round((currentScore * (1 - quizWeight)) + (quizScore * quizWeight));
}

export function getGapAnalysis(
    matrix: SkillsMatrix
): { phase: DMAICPhase; gap: number; prioritySubskills: Subskill[] }[] {
    return Object.entries(matrix.phases).map(([phase, data]) => {
        const gap = 100 - data.percentage;
        // Prioritize subskills with lowest scores
        const prioritySubskills = [...data.subskills]
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);
        
        return {
            phase: phase as DMAICPhase,
            gap,
            prioritySubskills,
        };
    }).sort((a, b) => b.gap - a.gap);
}

export function getRecommendedFocusAreas(matrix: SkillsMatrix): string[] {
    const gaps = getGapAnalysis(matrix);
    const recommendations: string[] = [];
    
    // Top 3 gap areas
    gaps.slice(0, 3).forEach(gap => {
        if (gap.gap > 20) {
            recommendations.push(
                `Improve ${gap.phase} phase: Focus on ${gap.prioritySubskills[0]?.name || 'fundamentals'}`
            );
        }
    });
    
    return recommendations;
}
