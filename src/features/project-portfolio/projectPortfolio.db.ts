/**
 * Project Portfolio Database Operations
 * 
 * DMAIC project tracking with phase management
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DMAICProject, ProjectTool } from '../../utils/db.schema';

type DMAICPhase = 'define' | 'measure' | 'analyze' | 'improve' | 'control';

interface ProjectPortfolioDBSchema extends DBSchema {
    projects: {
        key: string;
        value: DMAICProject;
        indexes: {
            'by-user': string;
            'by-status': string;
        };
    };
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<ProjectPortfolioDBSchema> | null = null;

export async function getProjectsDB(): Promise<IDBPDatabase<ProjectPortfolioDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<ProjectPortfolioDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('projects')) {
                const store = db.createObjectStore('projects', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
                store.createIndex('by-status', 'status');
            }
        },
    });

    return dbInstance;
}

// Default checklist items for each phase
const DEFAULT_CHECKLISTS: Record<DMAICPhase, string[]> = {
    define: [
        'Develop project charter with problem statement',
        'Identify project scope and boundaries',
        'Map high-level process (SIPOC)',
        'Identify customers and their requirements',
        'Develop CTQ tree for critical requirements',
        'Define project goals and metrics',
        'Identify team members and roles',
        'Complete stakeholder analysis',
    ],
    measure: [
        'Create detailed process map',
        'Develop data collection plan',
        'Validate measurement system (MSA)',
        'Collect baseline data',
        'Calculate current process capability',
        'Calculate current DPMO/sigma level',
        'Identify stratification factors',
        'Assess data normality',
    ],
    analyze: [
        'Perform root cause analysis',
        'Create cause-and-effect diagram',
        'Prioritize potential causes',
        'Verify root causes with data',
        'Perform hypothesis tests',
        'Conduct regression analysis if needed',
        'Identify sources of variation',
        'Validate critical X variables',
    ],
    improve: [
        'Brainstorm potential solutions',
        'Evaluate and select solutions',
        'Develop implementation plan',
        'Assess risks with FMEA',
        'Design pilot test',
        'Execute pilot and collect data',
        'Validate improvement statistically',
        'Calculate new process capability',
    ],
    control: [
        'Develop control plan',
        'Implement statistical process control',
        'Create visual controls',
        'Standardize procedures',
        'Document lessons learned',
        'Transfer ownership to process owner',
        'Calculate final financial benefits',
        'Close project and celebrate!',
    ],
};

function createDefaultPhaseData(): DMAICProject['phases'] {
    const phases: Partial<DMAICProject['phases']> = {};
    
    (Object.keys(DEFAULT_CHECKLISTS) as DMAICPhase[]).forEach(phase => {
        phases[phase] = {
            status: 'not-started',
            checklist: DEFAULT_CHECKLISTS[phase].map((text, index) => ({
                id: `check-${phase}-${index}`,
                text,
                completed: false,
            })),
            documents: [],
            notes: '',
        };
    });
    
    return phases as DMAICProject['phases'];
}

// ============================================
// Project Operations
// ============================================

export async function createProject(
    userId: string,
    data: {
        title: string;
        description: string;
        industry: string;
        organization?: string;
    }
): Promise<DMAICProject> {
    const db = await getProjectsDB();
    
    const project: DMAICProject = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title: data.title,
        description: data.description,
        industry: data.industry,
        organization: data.organization,
        startDate: new Date(),
        currentPhase: 'define',
        status: 'active',
        phases: createDefaultPhaseData(),
        tools: [],
        teamMembers: [],
        metrics: [],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    await db.put('projects', project);
    return project;
}

export async function getProject(projectId: string): Promise<DMAICProject | undefined> {
    const db = await getProjectsDB();
    return await db.get('projects', projectId);
}

export async function updateProject(project: DMAICProject): Promise<void> {
    const db = await getProjectsDB();
    project.updatedAt = new Date();
    await db.put('projects', project);
}

export async function deleteProject(projectId: string): Promise<void> {
    const db = await getProjectsDB();
    await db.delete('projects', projectId);
}

export async function getUserProjects(userId: string): Promise<DMAICProject[]> {
    const db = await getProjectsDB();
    const index = db.transaction('projects').store.index('by-user');
    return await index.getAll(userId);
}

// ============================================
// Phase Management
// ============================================

export async function updateChecklistItem(
    projectId: string,
    phase: DMAICPhase,
    itemId: string,
    completed: boolean
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    const checklistItem = project.phases[phase].checklist.find(i => i.id === itemId);
    if (!checklistItem) throw new Error('Checklist item not found');
    
    checklistItem.completed = completed;
    if (completed && !checklistItem.completedAt) {
        checklistItem.completedAt = new Date();
    }
    
    // Update phase status
    const phaseData = project.phases[phase];
    const completedCount = phaseData.checklist.filter(i => i.completed).length;
    
    if (completedCount === 0) {
        phaseData.status = 'not-started';
    } else if (completedCount === phaseData.checklist.length) {
        phaseData.status = 'completed';
        phaseData.completedAt = new Date();
    } else {
        phaseData.status = 'in-progress';
        if (!phaseData.startedAt) {
            phaseData.startedAt = new Date();
        }
    }
    
    await updateProject(project);
    return project;
}

export async function setCurrentPhase(
    projectId: string,
    phase: DMAICPhase
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    project.currentPhase = phase;
    
    // Mark phase as started
    if (!project.phases[phase].startedAt) {
        project.phases[phase].startedAt = new Date();
        project.phases[phase].status = 'in-progress';
    }
    
    await updateProject(project);
    return project;
}

export async function updatePhaseNotes(
    projectId: string,
    phase: DMAICPhase,
    notes: string
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    project.phases[phase].notes = notes;
    await updateProject(project);
    return project;
}

// ============================================
// Tools Management
// ============================================

export async function addTool(
    projectId: string,
    tool: Omit<ProjectTool, 'id' | 'createdAt' | 'updatedAt'>
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    const newTool: ProjectTool = {
        ...tool,
        id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    
    project.tools.push(newTool);
    await updateProject(project);
    return project;
}

export async function updateTool(
    projectId: string,
    toolId: string,
    data: Partial<ProjectTool>
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    const tool = project.tools.find(t => t.id === toolId);
    if (!tool) throw new Error('Tool not found');
    
    Object.assign(tool, data, { updatedAt: new Date() });
    await updateProject(project);
    return project;
}

// ============================================
// Metrics
// ============================================

export async function addMetric(
    projectId: string,
    metric: {
        name: string;
        unit: string;
        baseline: number;
        target: number;
    }
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    project.metrics.push({
        id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...metric,
    });
    
    await updateProject(project);
    return project;
}

export async function updateMetricActual(
    projectId: string,
    metricId: string,
    actual: number
): Promise<DMAICProject> {
    const project = await getProject(projectId);
    if (!project) throw new Error('Project not found');
    
    const metric = project.metrics.find(m => m.id === metricId);
    if (!metric) throw new Error('Metric not found');
    
    metric.actual = actual;
    await updateProject(project);
    return project;
}

// ============================================
// Statistics
// ============================================

export async function getProjectStatistics(userId: string): Promise<{
    total: number;
    active: number;
    completed: number;
    byPhase: Record<string, number>;
}> {
    const projects = await getUserProjects(userId);
    
    return {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        byPhase: projects.reduce((acc, p) => {
            acc[p.currentPhase] = (acc[p.currentPhase] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
    };
}
