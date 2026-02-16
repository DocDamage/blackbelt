/**
 * AI Mentor Database Operations
 * 
 * Stores mentor conversations and project guidance
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AIMentorDBSchema extends DBSchema {
    mentorConversations: {
        key: string;
        value: {
            id: string;
            userId: string;
            projectId?: string;
            messages: MentorMessage[];
            createdAt: Date;
            updatedAt: Date;
        };
        indexes: {
            'by-user': string;
            'by-project': string;
        };
    };
    mentorContext: {
        key: string;
        value: {
            userId: string;
            projectPhase?: string;
            recentTopics: string[];
            guidanceHistory: string[];
            lastUpdated: Date;
        };
    };
}

export interface MentorMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    attachments?: string[];
}

const DB_NAME = 'six-sigma-training';
const DB_VERSION = 2;

let dbInstance: IDBPDatabase<AIMentorDBSchema> | null = null;

export async function getMentorDB(): Promise<IDBPDatabase<AIMentorDBSchema>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<AIMentorDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('mentorConversations')) {
                const store = db.createObjectStore('mentorConversations', { keyPath: 'id' });
                store.createIndex('by-user', 'userId');
                store.createIndex('by-project', 'projectId');
            }
            if (!db.objectStoreNames.contains('mentorContext')) {
                db.createObjectStore('mentorContext', { keyPath: 'userId' });
            }
        },
    });

    return dbInstance;
}

// ============================================
// Conversation Management
// ============================================

export async function createConversation(
    userId: string,
    projectId?: string
): Promise<string> {
    const db = await getMentorDB();
    const id = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await db.put('mentorConversations', {
        id,
        userId,
        projectId,
        messages: [{
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: getInitialGreeting(),
            timestamp: new Date(),
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    
    return id;
}

export async function getConversation(conversationId: string) {
    const db = await getMentorDB();
    return await db.get('mentorConversations', conversationId);
}

export async function addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<void> {
    const db = await getMentorDB();
    const conversation = await getConversation(conversationId);
    if (!conversation) return;
    
    conversation.messages.push({
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: new Date(),
    });
    conversation.updatedAt = new Date();
    
    await db.put('mentorConversations', conversation);
}

export async function getUserConversations(userId: string) {
    const db = await getMentorDB();
    const index = db.transaction('mentorConversations').store.index('by-user');
    return await index.getAll(userId);
}

// ============================================
// AI Response Generation (Simulated)
// ============================================

const KNOWLEDGE_BASE: Record<string, string[]> = {
    'project charter': [
        'A strong project charter should clearly define: (1) Problem statement - what pain are we solving? (2) Business case - why is this worth doing? (3) Scope - what\'s in and what\'s out? (4) Goals - what does success look like? (5) Timeline and resources.',
        'Common charter mistakes: (1) Vague problem statements like "improve quality" - be specific about the defect type and impact. (2) Unrealistic timelines - DMAIC projects typically take 3-6 months. (3) Missing stakeholder alignment - get sign-off before proceeding.',
    ],
    'sipoc': [
        'SIPOC helps you see the big picture before diving into details. Start with the Process (5-7 high-level steps), then identify Outputs, Customers, Inputs, and Suppliers. It should fit on one page.',
        'A good SIPOC boundary sets clear scope. Ask: Where does the process start? Where does it end? What\'s the trigger? What\'s the deliverable? This prevents scope creep later.',
    ],
    'measurement system analysis': [
        'Before trusting your data, validate your measurement system. Key questions: (1) Can different people get the same result? (Reproducibility) (2) Can the same person repeat the measurement? (Repeatability) (3) Is the measurement accurate?',
        'For continuous data, use Gage R&R. The goal: <10% variation from measurement system is ideal, 10-30% may be acceptable depending on application, >30% needs improvement before proceeding.',
    ],
    'process capability': [
        'Cp vs Cpk: Cp measures process potential (spread vs specs), Cpk measures actual performance (centering). A process can have good Cp but poor Cpk if it\'s off-center.',
        'Minimum recommended Cpk: 1.33 for existing processes, 1.67 for new processes, 2.0 for critical characteristics. Below 1.0 means more defects than acceptable.',
    ],
    'hypothesis testing': [
        'Hypothesis testing steps: (1) State null and alternative hypotheses (2) Choose significance level (α = 0.05 typical) (3) Calculate test statistic (4) Find p-value (5) Compare p to α - if p < α, reject null.',
        'Common test selection: Compare 2 means → t-test. Compare 3+ means → ANOVA. Compare proportions → Chi-square or proportions test. Test for normality → Anderson-Darling or Shapiro-Wilk.',
    ],
    'root cause analysis': [
        'The 5 Whys technique: Ask "why" repeatedly until you reach a root cause that\'s actionable. Typically 3-7 iterations. If you can\'t control it, keep digging.',
        'Fishbone (Ishikawa) categories: People, Process, Materials, Equipment, Environment, Measurement. Use data to validate which bones actually have meat on them.',
    ],
    'fmea': [
        'FMEA prioritizes risks using RPN = Severity × Occurrence × Detection (1-10 scale each). Focus on high RPN items first, but also consider high severity even with lower RPN.',
        'Detection rankings: 1 = Almost certain to detect before reaching customer, 10 = No detection method or impossible to detect. Lower is better for detection.',
    ],
    'control chart': [
        'Control chart selection: Variable data, subgroups → X-bar & R. Variable data, individuals → I-MR. Attribute, proportion defective → p-chart. Attribute, count of defects → c-chart.',
        'Common cause vs special cause: Points outside control limits = special cause. Trends, runs, cycles = special cause. Random variation within limits = common cause.',
    ],
    'sample size': [
        'Sample size depends on: (1) Desired confidence level (typically 95%) (2) Margin of error you can tolerate (3) Population variability (4) Population size (if finite).',
        'For attribute data with unknown proportion, use p = 0.5 for most conservative estimate. Smaller margins of error and higher confidence require larger samples.',
    ],
    'design of experiments': [
        'DOE principles: (1) Randomization - run trials in random order (2) Replication - repeat conditions to estimate error (3) Blocking - account for known nuisance factors.',
        'Full factorial vs fractional: Full gives all interactions but requires 2^k runs. Fractional (like 2^(k-1)) reduces runs but confounds some interactions. Use resolution IV or higher.',
    ],
    'default': [
        'I\'d be happy to help with that. Could you provide more specific details about your project phase and what you\'re trying to accomplish?',
        'That\'s a great question. In Six Sigma, context matters a lot. Can you share more about your specific situation, current data, and project phase?',
        'Let me help you think through this systematically. DMAIC provides a framework - which phase are you in, and what specific challenge are you facing?',
    ],
};

function getInitialGreeting(): string {
    return `Hello! I'm your AI Six Sigma Mentor. I can help you with:

📋 **Project Charter** development
📊 **Data analysis** and interpretation  
🔍 **Tool selection** for each DMAIC phase
🎯 **Problem-solving** approaches
📈 **Statistical methods** and when to use them

What would you like help with today? You can ask about specific tools, methodologies, or describe your current project challenge.`;
}

function findRelevantResponse(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Check for keyword matches
    for (const [topic, responses] of Object.entries(KNOWLEDGE_BASE)) {
        if (lowerQuery.includes(topic)) {
            const response = responses[Math.floor(Math.random() * responses.length)];
            const defaultResponse = KNOWLEDGE_BASE['default']?.[0];
            return response ?? defaultResponse ?? "I'm here to help! What would you like to know?";
        }
    }
    
    // Check for related terms
    const termMappings: Record<string, string> = {
        'charter': 'project charter',
        'scope': 'project charter',
        'problem statement': 'project charter',
        'msa': 'measurement system analysis',
        'gage': 'measurement system analysis',
        'capability': 'process capability',
        'cpk': 'process capability',
        'cp': 'process capability',
        'test': 'hypothesis testing',
        'p-value': 'hypothesis testing',
        'anova': 'hypothesis testing',
        't-test': 'hypothesis testing',
        '5 whys': 'root cause analysis',
        'fishbone': 'root cause analysis',
        'ishikawa': 'root cause analysis',
        'control': 'control chart',
        'spc': 'control chart',
        'doe': 'design of experiments',
        'factorial': 'design of experiments',
        'sample': 'sample size',
        'sample size': 'sample size',
    };
    
    for (const [term, topic] of Object.entries(termMappings)) {
        if (lowerQuery.includes(term) && KNOWLEDGE_BASE[topic]) {
            const responses = KNOWLEDGE_BASE[topic];
            const response = responses[Math.floor(Math.random() * responses.length)];
            const defaultResponse = KNOWLEDGE_BASE['default']?.[0];
            return response ?? defaultResponse ?? "I'm here to help! What would you like to know?";
        }
    }
    
    // Default response
    const defaults = KNOWLEDGE_BASE['default'];
    if (!defaults || defaults.length === 0) {
        return "I'm here to help with your Six Sigma questions. What would you like to know?";
    }
    const randomDefault = defaults[Math.floor(Math.random() * defaults.length)];
    return randomDefault ?? "I'm here to help with your Six Sigma questions. What would you like to know?";
}

export async function generateMentorResponse(
    conversationId: string,
    userMessage: string
): Promise<string> {
    // Add user message
    await addMessage(conversationId, 'user', userMessage);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate response based on query
    let response = findRelevantResponse(userMessage);
    
    // Add follow-up prompt for engagement
    if (!response.includes('?')) {
        response += '\n\nWhat specific aspect would you like to explore further, or do you have data you\'d like help analyzing?';
    }
    
    // Add assistant message
    await addMessage(conversationId, 'assistant', response);
    
    return response;
}

// ============================================
// Quick Guidance Templates
// ============================================

export interface QuickGuidance {
    id: string;
    category: string;
    question: string;
    answer: string;
}

export const QUICK_GUIDANCE: QuickGuidance[] = [
    {
        id: '1',
        category: 'Define',
        question: 'What makes a good project charter?',
        answer: 'A good charter has: (1) Specific problem statement with quantified impact (2) Clear scope boundaries (3) Measurable goals (4) Business case with projected savings (5) Defined team roles (6) Timeline with milestones.',
    },
    {
        id: '2',
        category: 'Measure',
        question: 'How do I know if my measurement system is adequate?',
        answer: 'Conduct Gage R&R study. Target: <10% measurement variation is excellent, 10-30% may be acceptable, >30% needs improvement. Check both repeatability (same operator) and reproducibility (different operators).',
    },
    {
        id: '3',
        category: 'Analyze',
        question: 'Which hypothesis test should I use?',
        answer: 'Compare 2 means → 2-sample t-test. Compare 3+ means → ANOVA. Compare proportions → Chi-square test. Paired data → Paired t-test. Non-normal data → Mann-Whitney or Kruskal-Wallis.',
    },
    {
        id: '4',
        category: 'Improve',
        question: 'How do I select the best solution?',
        answer: 'Use a decision matrix: (1) List criteria (cost, ease, impact, time) (2) Weight importance (3) Score each solution (4) Calculate weighted scores (5) Validate top choice with pilot test.',
    },
    {
        id: '5',
        category: 'Control',
        question: 'What goes in a Control Plan?',
        answer: 'Control Plan includes: (1) Key process variables (2) Measurement method (3) Sample size and frequency (4) Control method (SPC, checklists, etc.) (5) Reaction plan when out of control (6) Responsibility.',
    },
    {
        id: '6',
        category: 'Tools',
        question: 'When should I use a control chart vs capability study?',
        answer: 'Control charts monitor process stability over time - use during Control phase. Capability studies assess process potential vs specs - use in Measure (baseline) and Improve (verify). Both together give complete picture.',
    },
];

export async function getQuickGuidance(): Promise<QuickGuidance[]> {
    return QUICK_GUIDANCE;
}
