/**
 * Mock Exam Question Bank
 * 
 * ASQ CSSBB-style questions organized by DMAIC phase
 * Sources: ASQ Body of Knowledge, typical certification exam patterns
 */

import type { ExamQuestion } from '../../utils/db.schema';

export const MOCK_EXAM_QUESTIONS: Omit<ExamQuestion, 'id'>[] = [
    // ==================== DEFINE PHASE (12% = ~20 questions) ====================
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'define',
        question: 'Which of the following is NOT a primary component of a project charter?',
        options: [
            'Problem statement',
            'Project scope',
            'Detailed Gantt chart',
            'Business case',
        ],
        correctAnswer: 2,
        explanation: 'A project charter includes the problem statement, scope, business case, goals, and team members. Detailed Gantt charts are developed later in the project planning phase, not in the charter.',
        difficulty: 'easy',
        topic: 'Project Charter',
        reference: 'ASQ CSSBB BOK I.A.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'define',
        question: 'In a SIPOC diagram, which element represents the transformed inputs that exit the process?',
        options: [
            'Suppliers',
            'Inputs',
            'Process',
            'Outputs',
        ],
        correctAnswer: 3,
        explanation: 'Outputs are the products, services, or information that result from the process transformation of inputs. They are delivered to customers.',
        difficulty: 'easy',
        topic: 'SIPOC',
        reference: 'ASQ CSSBB BOK I.B.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'define',
        question: 'A CTQ tree is used to:',
        options: [
            'Identify root causes of defects',
            'Translate customer requirements into measurable specifications',
            'Determine statistical process control limits',
            'Calculate process capability indices',
        ],
        correctAnswer: 1,
        explanation: 'Critical to Quality (CTQ) trees help translate broad customer requirements (the "voice of the customer") into specific, measurable characteristics that can be tracked and improved.',
        difficulty: 'medium',
        topic: 'CTQ Tree',
        reference: 'ASQ CSSBB BOK I.C.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'define',
        question: 'Which financial metric represents the minimum acceptable return on investment for a project?',
        options: [
            'Net Present Value (NPV)',
            'Internal Rate of Return (IRR)',
            'Return on Investment (ROI)',
            'Hurdle rate',
        ],
        correctAnswer: 3,
        explanation: 'The hurdle rate is the minimum rate of return required by management to approve a project. Projects with returns below this rate are typically rejected.',
        difficulty: 'medium',
        topic: 'Financial Metrics',
        reference: 'ASQ CSSBB BOK I.D.3',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'define',
        question: 'A stakeholder analysis matrix typically plots stakeholders based on:',
        options: [
            'Age and experience level',
            'Power/influence and interest',
            'Department and job title',
            'Years with company and education',
        ],
        correctAnswer: 1,
        explanation: 'Stakeholder analysis matrices plot stakeholders on two axes: power/influence (ability to affect the project) and interest (level of concern about outcomes). This helps determine engagement strategies.',
        difficulty: 'easy',
        topic: 'Stakeholder Analysis',
        reference: 'ASQ CSSBB BOK I.E.2',
    },

    // ==================== MEASURE PHASE (20% = ~33 questions) ====================
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'In Measurement System Analysis, what does GRR stand for?',
        options: [
            'Gauge Reliability and Repeatability',
            'Gauge Repeatability and Reproducibility',
            'General Reliability Range',
            'Gauge R&R Ratio',
        ],
        correctAnswer: 1,
        explanation: 'GRR (Gauge Repeatability and Reproducibility) assesses measurement system variation. Repeatability is variation when the same operator measures the same part multiple times. Reproducibility is variation between different operators.',
        difficulty: 'easy',
        topic: 'MSA',
        reference: 'ASQ CSSBB BOK III.A.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'A process has USL = 110, LSL = 90, mean = 100, and standard deviation = 3. What is Cpk?',
        options: [
            '1.00',
            '1.11',
            '1.33',
            '2.00',
        ],
        correctAnswer: 1,
        explanation: 'Cpk = min[(USL-μ)/3σ, (μ-LSL)/3σ] = min[(110-100)/9, (100-90)/9] = min[1.11, 1.11] = 1.11',
        difficulty: 'medium',
        topic: 'Process Capability',
        reference: 'ASQ CSSBB BOK III.C.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'If a process produces 12 defects out of 500 units with 4 opportunities per unit, what is the DPMO?',
        options: [
            '4,800',
            '6,000',
            '24,000',
            '2,400',
        ],
        correctAnswer: 1,
        explanation: 'DPMO = (Defects / (Units × Opportunities per Unit)) × 1,000,000 = (12 / (500 × 4)) × 1,000,000 = 6,000',
        difficulty: 'medium',
        topic: 'DPMO',
        reference: 'ASQ CSSBB BOK III.B.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'Which sampling method divides the population into subgroups and randomly selects from each subgroup?',
        options: [
            'Simple random sampling',
            'Stratified sampling',
            'Systematic sampling',
            'Convenience sampling',
        ],
        correctAnswer: 1,
        explanation: 'Stratified sampling divides the population into homogeneous subgroups (strata) and takes random samples from each. This ensures representation across important subgroups.',
        difficulty: 'medium',
        topic: 'Sampling',
        reference: 'ASQ CSSBB BOK III.D.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'What is the primary purpose of a data collection plan?',
        options: [
            'To analyze root causes',
            'To ensure the right data is collected efficiently and accurately',
            'To develop control charts',
            'To calculate process capability',
        ],
        correctAnswer: 1,
        explanation: 'A data collection plan specifies what data to collect, how to measure it, who will collect it, when, and where. Its primary purpose is ensuring efficient, accurate data collection that supports project objectives.',
        difficulty: 'easy',
        topic: 'Data Collection',
        reference: 'ASQ CSSBB BOK III.D.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'measure',
        question: 'In a Gage R&R study, if the %Contribution of measurement system variation is 15%, the system is considered:',
        options: [
            'Acceptable',
            'Marginally acceptable',
            'Unacceptable',
            'World-class',
        ],
        correctAnswer: 1,
        explanation: 'Gage R&R acceptance criteria: <10% contribution is acceptable, 10-30% is marginally acceptable (may be acceptable depending on application), >30% is unacceptable.',
        difficulty: 'medium',
        topic: 'MSA',
        reference: 'ASQ CSSBB BOK III.A.3',
    },

    // ==================== ANALYZE PHASE (24% = ~40 questions) ====================
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'A hypothesis test yields a p-value of 0.03. At α = 0.05 significance level, you should:',
        options: [
            'Fail to reject the null hypothesis',
            'Reject the null hypothesis',
            'Increase the sample size',
            'Change the significance level',
        ],
        correctAnswer: 1,
        explanation: 'When p-value < α (0.03 < 0.05), we reject the null hypothesis. This indicates the observed result is statistically significant at the 95% confidence level.',
        difficulty: 'easy',
        topic: 'Hypothesis Testing',
        reference: 'ASQ CSSBB BOK IV.B.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'Which test is appropriate for comparing means of three or more groups?',
        options: [
            't-test',
            'Chi-square test',
            'ANOVA',
            'Mann-Whitney U test',
        ],
        correctAnswer: 2,
        explanation: 'ANOVA (Analysis of Variance) compares means across three or more groups. t-tests are for two groups. Chi-square tests categorical data. Mann-Whitney is non-parametric for two groups.',
        difficulty: 'easy',
        topic: 'ANOVA',
        reference: 'ASQ CSSBB BOK IV.B.3',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'In regression analysis, R² = 0.85 means:',
        options: [
            'The correlation is 0.85',
            '85% of variation in Y is explained by X',
            'The slope is 0.85',
            '85% of predictions will be correct',
        ],
        correctAnswer: 1,
        explanation: 'R² (coefficient of determination) represents the proportion of variance in the dependent variable predictable from independent variables. R² = 0.85 means 85% of Y variation is explained by the model.',
        difficulty: 'easy',
        topic: 'Regression',
        reference: 'ASQ CSSBB BOK IV.B.5',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'A Pareto chart is based on which principle?',
        options: [
            'Central Limit Theorem',
            '80/20 Rule (Pareto Principle)',
            'Law of Diminishing Returns',
            'Normal Distribution',
        ],
        correctAnswer: 1,
        explanation: 'The Pareto Principle (80/20 rule) states roughly 80% of effects come from 20% of causes. Pareto charts prioritize the "vital few" from the "trivial many."',
        difficulty: 'easy',
        topic: 'Pareto Analysis',
        reference: 'ASQ CSSBB BOK IV.A.3',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'Which root cause analysis tool is best for exploring cause-and-effect relationships in a structured, visual format?',
        options: [
            '5 Whys',
            'Fishbone (Ishikawa) Diagram',
            'Fault Tree Analysis',
            'FMEA',
        ],
        correctAnswer: 1,
        explanation: 'The Fishbone (Ishikawa) diagram organizes potential causes into categories (Man, Machine, Material, Method, Measurement, Environment) providing a structured visual for brainstorming.',
        difficulty: 'easy',
        topic: 'Root Cause Analysis',
        reference: 'ASQ CSSBB BOK IV.A.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'In a 2³ full factorial design, how many experimental runs are required?',
        options: [
            '6',
            '8',
            '9',
            '16',
        ],
        correctAnswer: 1,
        explanation: 'A 2³ design has 3 factors at 2 levels each. Number of runs = 2³ = 8. Full factorial designs test all combinations of factor levels.',
        difficulty: 'medium',
        topic: 'DOE',
        reference: 'ASQ CSSBB BOK IV.C.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'What does a correlation coefficient (r) of -0.85 indicate?',
        options: [
            'Strong positive linear relationship',
            'Strong negative linear relationship',
            'Weak linear relationship',
            'No linear relationship',
        ],
        correctAnswer: 1,
        explanation: 'r ranges from -1 to +1. Negative values indicate inverse relationships. |r| > 0.8 indicates strong correlation. r = -0.85 shows a strong negative linear relationship.',
        difficulty: 'easy',
        topic: 'Correlation',
        reference: 'ASQ CSSBB BOK IV.B.4',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'analyze',
        question: 'Type II error in hypothesis testing is:',
        options: [
            'Rejecting a true null hypothesis',
            'Failing to reject a false null hypothesis',
            'Setting alpha too high',
            'Using the wrong test statistic',
        ],
        correctAnswer: 1,
        explanation: 'Type II error (β) is failing to reject a false null hypothesis (false negative). Type I error is rejecting a true null (false positive). Power = 1 - β.',
        difficulty: 'medium',
        topic: 'Hypothesis Testing',
        reference: 'ASQ CSSBB BOK IV.B.2',
    },

    // ==================== IMPROVE PHASE (20% = ~33 questions) ====================
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'improve',
        question: 'Which tool is used to identify, evaluate, and prioritize potential failure modes?',
        options: [
            'Control Plan',
            'FMEA',
            'Gantt Chart',
            'SPC Chart',
        ],
        correctAnswer: 1,
        explanation: 'FMEA (Failure Mode and Effects Analysis) systematically identifies potential failure modes, their causes and effects, and prioritizes them by risk (RPN = Severity × Occurrence × Detection).',
        difficulty: 'easy',
        topic: 'FMEA',
        reference: 'ASQ CSSBB BOK V.B.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'improve',
        question: 'The primary goal of the Improve phase is to:',
        options: [
            'Identify root causes',
            'Implement and validate solutions',
            'Monitor process performance',
            'Define project scope',
        ],
        correctAnswer: 1,
        explanation: 'The Improve phase focuses on developing, testing, and implementing solutions that address root causes identified in Analyze. Solutions are validated before full implementation.',
        difficulty: 'easy',
        topic: 'DMAIC',
        reference: 'ASQ CSSBB BOK V.A.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'improve',
        question: 'In a designed experiment, a "main effect" represents:',
        options: [
            'The combined effect of all factors',
            'The effect of a single factor averaged across levels of other factors',
            'The error or noise in the system',
            'The interaction between two factors',
        ],
        correctAnswer: 1,
        explanation: 'Main effect is the effect of a single independent variable on the response, averaged across the levels of other factors. It shows the overall impact of changing that factor.',
        difficulty: 'medium',
        topic: 'DOE',
        reference: 'ASQ CSSBB BOK V.C.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'improve',
        question: 'A pilot implementation is conducted to:',
        options: [
            'Train all employees',
            'Test the solution on a small scale before full rollout',
            'Document the current process',
            'Calculate final ROI',
        ],
        correctAnswer: 1,
        explanation: 'Pilot implementations test solutions on a limited scale to validate effectiveness, identify issues, and refine the approach before committing to full-scale implementation.',
        difficulty: 'easy',
        topic: 'Pilot Testing',
        reference: 'ASQ CSSBB BOK V.A.3',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'improve',
        question: 'Which lean tool organizes the workplace for efficiency and visual management?',
        options: [
            'Kaizen',
            '5S',
            'Kanban',
            'Poka-Yoke',
        ],
        correctAnswer: 1,
        explanation: '5S (Sort, Set in Order, Shine, Standardize, Sustain) organizes the workplace for efficiency, safety, and visual management. It creates a clean, organized environment.',
        difficulty: 'easy',
        topic: 'Lean Tools',
        reference: 'ASQ CSSBB BOK V.D.2',
    },

    // ==================== CONTROL PHASE (24% = ~40 questions) ====================
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'Which control chart is appropriate for monitoring the proportion of defective items?',
        options: [
            'X-bar and R chart',
            'Individuals chart',
            'p-chart',
            'c-chart',
        ],
        correctAnswer: 2,
        explanation: 'p-charts monitor proportion defective (attribute data). X-bar/R charts monitor variable data. c-charts monitor count of defects. Individuals charts monitor single measurements.',
        difficulty: 'easy',
        topic: 'Control Charts',
        reference: 'ASQ CSSBB BOK VI.B.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'On a control chart, a point outside the control limits indicates:',
        options: [
            'The process is definitely out of specification',
            'A special cause of variation is likely present',
            'The process capability has decreased',
            'The measurement system is broken',
        ],
        correctAnswer: 1,
        explanation: 'Points outside control limits suggest special cause variation (assignable causes). Control limits represent expected process variation; exceeding them signals investigation is needed.',
        difficulty: 'easy',
        topic: 'SPC',
        reference: 'ASQ CSSBB BOK VI.B.2',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'A Control Plan should include all EXCEPT:',
        options: [
            'Key process characteristics to monitor',
            'Measurement methods and frequency',
            'Detailed employee salary information',
            'Reaction plan for out-of-control conditions',
        ],
        correctAnswer: 2,
        explanation: 'Control Plans document what to monitor, how to measure, when to measure, and response procedures. Employee compensation is not relevant to process control.',
        difficulty: 'easy',
        topic: 'Control Plan',
        reference: 'ASQ CSSBB BOK VI.A.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'Poka-Yoke refers to:',
        options: [
            'Statistical process control',
            'Mistake-proofing',
            'Visual management',
            'Standard work',
        ],
        correctAnswer: 1,
        explanation: 'Poka-Yoke (mistake-proofing) designs processes so mistakes are impossible or immediately detectable/correctable. It prevents defects at the source.',
        difficulty: 'easy',
        topic: 'Poka-Yoke',
        reference: 'ASQ CSSBB BOK VI.D.1',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'Western Electric rules are used to:',
        options: [
            'Calculate control limits',
            'Detect non-random patterns in control charts',
            'Determine sample size',
            'Calculate process capability',
        ],
        correctAnswer: 1,
        explanation: 'Western Electric rules identify non-random patterns (trends, runs, cycles) suggesting special causes. Examples: 2 of 3 points beyond 2σ, 4 of 5 beyond 1σ, 8 consecutive points on one side.',
        difficulty: 'medium',
        topic: 'SPC Rules',
        reference: 'ASQ CSSBB BOK VI.B.3',
    },
    {
        certificationBody: 'asq',
        beltLevel: 'black',
        phase: 'control',
        question: 'The purpose of standardization in the Control phase is to:',
        options: [
            'Reduce costs',
            'Ensure improvements are maintained over time',
            'Train new employees',
            'Eliminate all variation',
        ],
        correctAnswer: 1,
        explanation: 'Standardization documents and institutionalizes improvements through procedures, training, and visual controls to ensure gains are sustained long-term.',
        difficulty: 'easy',
        topic: 'Standardization',
        reference: 'ASQ CSSBB BOK VI.A.2',
    },
];

/**
 * Get questions for a specific exam configuration
 */
export function getExamQuestions(
    certificationBody: 'asq' | 'iassc' = 'asq',
    beltLevel: 'black' = 'black',
    count: number = 165
): ExamQuestion[] {
    const filtered = MOCK_EXAM_QUESTIONS.filter(
        q => q.certificationBody === certificationBody && q.beltLevel === beltLevel
    );

    // Shuffle and select
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Add IDs
    return selected.map((q, index) => ({
        ...q,
        id: `q-${certificationBody}-${beltLevel}-${index}`,
    }));
}

/**
 * Get questions by phase for practice exams
 */
export function getQuestionsByPhase(
    phase: string,
    count: number = 20
): ExamQuestion[] {
    const filtered = MOCK_EXAM_QUESTIONS.filter(q => q.phase === phase);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, index) => ({
        ...q,
        id: `q-${phase}-${index}`,
    }));
}

/**
 * Calculate exam statistics
 */
export interface ExamAnalysis {
    totalQuestions: number;
    byPhase: Record<string, number>;
    byDifficulty: Record<string, number>;
    byTopic: Record<string, number>;
}

export function analyzeExam(questions: ExamQuestion[]): ExamAnalysis {
    const byPhase: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};
    const byTopic: Record<string, number> = {};

    questions.forEach(q => {
        byPhase[q.phase] = (byPhase[q.phase] || 0) + 1;
        byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] || 0) + 1;
        byTopic[q.topic] = (byTopic[q.topic] || 0) + 1;
    });

    return {
        totalQuestions: questions.length,
        byPhase,
        byDifficulty,
        byTopic,
    };
}
