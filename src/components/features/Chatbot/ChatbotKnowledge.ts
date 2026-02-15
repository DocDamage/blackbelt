/**
 * Six Sigma Knowledge Base
 * Extracted from Chatbot for maintainability
 */

import { whiteBeltModules } from '../../../content/whiteBelt/modules';
import { yellowBeltModules } from '../../../content/yellowBelt/modules';
import { greenBeltModules } from '../../../content/greenBelt/modules';
import { blackBeltModules } from '../../../content/blackBelt/modules';
import { masterBlackBeltModules } from '../../../content/masterBlackBelt/modules';
import { searchEchaSubstances, getSubstanceStats } from '../../../content/compliance/echaData';

export interface KnowledgeItem {
    topic: string;
    belt: string;
    content: string;
    keywords: string[];
}

// Stop words for keyword extraction
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'and', 'or', 'but', 'if',
    'then', 'else', 'when', 'at', 'by', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over',
    'under', 'again', 'further', 'once', 'here', 'there', 'where', 'why',
    'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
    'just', 'of', 'this', 'that', 'these', 'those', 'it', 'its'
]);

export function extractKeywords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word))
        .filter((word, index, self) => self.indexOf(word) === index);
}

// REACH Compliance Knowledge
const complianceTopics: KnowledgeItem[] = [
    {
        topic: 'REACH Regulation Overview',
        belt: 'Compliance',
        content: 'REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals) is the European Union regulation concerning chemicals and their safe use. Key concepts: Registration (manufacturers/importers must register substances >1 tonne/year), Evaluation (ECHA evaluates registration dossiers), Authorisation (SVHC substances may require authorization), Restriction (conditions/bans on manufacture or use).',
        keywords: ['reach', 'regulation', 'echa', 'chemicals', 'registration', 'evaluation', 'authorisation', 'restriction', 'european', 'union']
    },
    {
        topic: 'SVHC Candidate List',
        belt: 'Compliance',
        content: 'Substances of Very High Concern (SVHC) are identified for serious effects on human health or environment. Categories: CMR (Carcinogenic, Mutagenic, Reprotoxic), PBT (Persistent, Bioaccumulative, Toxic), vPvB (Very Persistent, Very Bioaccumulative), Endocrine Disruptors. Key examples: Lead (7439-92-1), Cadmium (7440-43-9), DEHP (117-81-7), Bisphenol A (80-05-7). There are 235+ substances on the list as of 2024.',
        keywords: ['svhc', 'candidate', 'list', 'substances', 'concern', 'cmr', 'carcinogenic', 'mutagenic', 'reprotoxic', 'pbt', 'persistent', 'bioaccumulative', 'toxic', 'lead', 'cadmium', 'dehp', 'bisphenol', 'endocrine']
    },
    {
        topic: 'Annex XIV Authorization',
        belt: 'Compliance',
        content: 'Annex XIV lists substances requiring authorization for EU market. Requirements: Application to ECHA showing no alternatives, Risk Assessment demonstrating adequate control, Socio-Economic Analysis justifying benefits, Substitution Plan showing efforts to find alternatives. Key substances: HBCD (sunset 2019), DEHP (sunset 2015), Chromium trioxide (sunset 2017).',
        keywords: ['annex', 'xiv', 'authorization', 'authorisation', 'sunset', 'application', 'alternatives', 'hbcd', 'chromium', 'dehp']
    },
    {
        topic: 'Annex XVII Restrictions',
        belt: 'Compliance',
        content: 'Annex XVII restricts substances posing unacceptable risks. Key restrictions: Entry 23 Cadmium (banned in plastics, paints), Entry 27 Nickel (limited in jewelry), Entry 43 Azocolourants (banned in textiles), Entry 51 Phthalates (banned in toys >0.1%), Entry 63 Lead (limited in consumer products), Entry 72 CMR substances (restricted in consumer products).',
        keywords: ['annex', 'xvii', 'restrictions', 'restricted', 'banned', 'cadmium', 'nickel', 'phthalates', 'lead', 'toys', 'jewelry', 'textiles']
    },
    {
        topic: 'Plastics Compliance',
        belt: 'Compliance',
        content: 'Key concerns for plastics: Phthalate plasticizers (DEHP, DBP, BBP are SVHC), Brominated flame retardants (HBCD restricted), Heavy metal stabilizers (lead, cadmium restricted), BPA in polycarbonates (endocrine concerns), Microplastics (new restrictions). Compliance steps: Map supply chain, Check SVHC list quarterly, Article 33 obligations (inform customers if SVHC >0.1%), SCIP database notification, Alternative assessment.',
        keywords: ['plastics', 'plastic', 'phthalate', 'plasticizer', 'flame', 'retardant', 'bpa', 'polycarbonate', 'microplastics', 'dehp', 'dbp', 'article', 'scip']
    },
    {
        topic: 'CLP Regulation',
        belt: 'Compliance',
        content: 'CLP (Classification, Labelling and Packaging) implements UN GHS in EU. Hazard classes: Physical (explosives, flammables, oxidizers), Health (acute toxicity, CMR, sensitization, STOT), Environmental (aquatic toxicity, ozone). Signal words: DANGER (severe), WARNING (less severe). GHS Pictograms: GHS01-GHS09 for different hazard types.',
        keywords: ['clp', 'classification', 'labelling', 'packaging', 'ghs', 'hazard', 'pictogram', 'danger', 'warning', 'toxic', 'flammable', 'corrosive']
    }
];

// Lean methodologies
const leanTopics: KnowledgeItem[] = [
    {
        topic: '8 Wastes (DOWNTIME)',
        belt: 'Lean',
        content: 'The 8 wastes in Lean: Defects (errors requiring rework), Overproduction (making more than needed), Waiting (idle time), Non-utilized talent (underusing skills), Transportation (unnecessary material movement), Inventory (excess stock), Motion (unnecessary people movement), Extra processing (doing more than required). Also known as TIMWOOD.',
        keywords: ['waste', 'wastes', 'downtime', 'timwood', 'muda', 'defects', 'overproduction', 'waiting', 'transportation', 'inventory', 'motion', 'lean']
    },
    {
        topic: '5S Methodology',
        belt: 'Lean',
        content: '5S workplace organization: Seiri (Sort) - remove unnecessary items, Seiton (Set in Order) - organize remaining items, Seiso (Shine) - clean thoroughly, Seiketsu (Standardize) - create standards, Shitsuke (Sustain) - maintain discipline. 6S adds Safety as first step. Audit scoring 0-5 per area.',
        keywords: ['5s', '6s', 'sort', 'shine', 'standardize', 'sustain', 'seiri', 'seiton', 'seiso', 'seiketsu', 'shitsuke', 'workplace', 'organization', 'lean']
    },
    {
        topic: 'Value Stream Mapping (VSM)',
        belt: 'Lean',
        content: 'VSM documents material and information flow. Key metrics: Cycle Time (time per unit), Takt Time (available time / demand), Lead Time (total start to finish), Process Time (value-added only), % Value-Add (PT/LT). Steps: Select product family, map current state, calculate metrics, identify waste, design future state, implement.',
        keywords: ['vsm', 'value', 'stream', 'mapping', 'cycle', 'time', 'takt', 'lead', 'process', 'flow', 'lean']
    },
    {
        topic: 'Kaizen Events',
        belt: 'Lean',
        content: 'Kaizen: Continuous improvement events. Structure: 2-4 weeks prep, Day 1 training/observation, Day 2-3 root cause/brainstorm, Day 4 implement quick wins, Day 5 standardize/present, 30-day follow-up. Kaizen vs DMAIC: Kaizen is 3-5 days for quick wins, DMAIC is weeks/months for complex problems.',
        keywords: ['kaizen', 'continuous', 'improvement', 'event', 'rapid', 'blitz', 'gemba', 'lean']
    },
    {
        topic: 'Poka-Yoke (Error Proofing)',
        belt: 'Lean',
        content: 'Poka-yoke prevents errors. Types: Contact (physical shape prevents error), Fixed-value (correct quantity required), Motion-step (sequence enforced). Levels: Detection (finds after), Warning (alerts before), Prevention (makes impossible). Goal: Move to Level 3 Prevention.',
        keywords: ['poka', 'yoke', 'error', 'proofing', 'mistake', 'proofing', 'prevention', 'detection', 'lean']
    },
    {
        topic: 'Kanban System',
        belt: 'Lean',
        content: 'Kanban rules: Visualize workflow, Limit WIP, Manage flow, Make policies explicit, Implement feedback, Improve collaboratively. Formulas: WIP Limit = Throughput × Lead Time (Littles Law). Two-bin system: Active bin in use, Reserve bin ready to swap.',
        keywords: ['kanban', 'wip', 'pull', 'system', 'flow', 'board', 'cards', 'visual', 'lean']
    },
    {
        topic: 'SMED (Quick Changeover)',
        belt: 'Lean',
        content: 'SMED: Single Minute Exchange of Die. Target changeover in < 10 minutes. Steps: Observe current changeover, Separate internal vs external activities, Convert internal to external where possible, Streamline remaining internal, Standardize new procedure.',
        keywords: ['smed', 'changeover', 'setup', 'reduction', 'quick', 'internal', 'external', 'lean']
    }
];

// Project templates
const templateTopics: KnowledgeItem[] = [
    {
        topic: 'SIPOC Diagram',
        belt: 'Templates',
        content: 'SIPOC: Suppliers-Inputs-Process-Outputs-Customers. High-level process map identifying key elements. Used in Define phase before detailed mapping. Shows 5-7 major process steps, who provides inputs, what outputs are produced, and who receives them.',
        keywords: ['sipoc', 'suppliers', 'inputs', 'process', 'outputs', 'customers', 'diagram', 'map', 'define']
    },
    {
        topic: 'Project Charter',
        belt: 'Templates',
        content: 'Charter elements: Project Name, Problem Statement (What/When/Where/Magnitude), Goal Statement (SMART), Business Case (why it matters), Scope (in/out), Team roles, Timeline by phase, Primary and secondary Metrics. Problem Statement formula: What is wrong + When observed + Where occurs + Magnitude.',
        keywords: ['charter', 'project', 'problem', 'statement', 'goal', 'scope', 'business', 'case', 'smart', 'define']
    },
    {
        topic: 'FMEA (Failure Mode Effects Analysis)',
        belt: 'Templates',
        content: 'FMEA scales: Severity 1-10 (1=none, 10=safety issue), Occurrence 1-10 (1=remote, 10=very high), Detection 1-10 (1=certain detection, 10=no inspection). RPN = S × O × D. Action threshold: RPN > 100 or Severity ≥ 9. Used in Analyze phase to prioritize risks.',
        keywords: ['fmea', 'failure', 'mode', 'effects', 'analysis', 'severity', 'occurrence', 'detection', 'rpn', 'risk']
    },
    {
        topic: 'Control Plan',
        belt: 'Templates',
        content: 'Control Plan elements: Process Step, CTQ, Specification (LSL/Target/USL), Measurement method, Sample Size, Frequency, Control Method (SPC, checklist), Reaction Plan (what if OOC), Responsible owner. Used in Control phase to sustain improvements.',
        keywords: ['control', 'plan', 'monitoring', 'specification', 'reaction', 'sustain', 'spc']
    },
    {
        topic: 'A3 Problem Solving',
        belt: 'Templates',
        content: 'A3 sections (one page): 1. Background (why important), 2. Current Condition (data/metrics), 3. Goal/Target (measurable), 4. Root Cause Analysis (5 Whys, Fishbone), 5. Countermeasures (actions), 6. Implementation Plan (who/what/when), 7. Follow-up (how to check), 8. Results (before/after).',
        keywords: ['a3', 'problem', 'solving', 'one', 'page', 'toyota', 'thinking', 'template']
    },
    {
        topic: 'VOC (Voice of Customer)',
        belt: 'Templates',
        content: 'VOC collection: Surveys (quantitative, n>100), Interviews (deep understanding, 10-30), Focus Groups (exploring, 6-10), Observation (actual behavior), Complaints, Social Media. VOC to CTQ translation: Convert customer language to measurable specifications. Kano model: Must-Be, One-Dimensional, Delighter.',
        keywords: ['voc', 'voice', 'customer', 'ctq', 'kano', 'survey', 'interview', 'requirements']
    },
    {
        topic: 'Tollgate Checklist',
        belt: 'Templates',
        content: 'Tollgate reviews at each DMAIC phase. Define: Charter approved, SIPOC complete, scope defined. Measure: Data plan complete, MSA adequate, baseline calculated. Analyze: Root causes validated, statistical analysis complete. Improve: Solutions piloted, results validated. Control: Control plan in place, ownership transferred.',
        keywords: ['tollgate', 'checklist', 'review', 'gate', 'phase', 'approval', 'dmaic']
    }
];

// Industry standards
const industryTopics: KnowledgeItem[] = [
    {
        topic: 'IATF 16949 (Automotive)',
        belt: 'Industry',
        content: 'IATF 16949: Automotive QMS. Core Tools (AIAG): APQP (Advanced Product Quality Planning), PPAP (Production Part Approval Process), FMEA, MSA, SPC. PPAP Levels 1-5 based on documentation required. Automotive Cpk requirements: Safety-critical ≥1.67, Key ≥1.33, Standard ≥1.00.',
        keywords: ['iatf', '16949', 'automotive', 'apqp', 'ppap', 'aiag', 'core', 'tools', 'car', 'vehicle', 'oem']
    },
    {
        topic: 'ISO 13485 (Medical Devices)',
        belt: 'Industry',
        content: 'ISO 13485: Medical Device QMS. Key requirements: Design controls, Risk management (ISO 14971), Traceability, Process validation, Post-market surveillance. FDA 21 CFR Part 820 (QSR) covers similar requirements for US market.',
        keywords: ['iso', '13485', 'medical', 'device', 'fda', '820', 'qsr', 'healthcare', 'design', 'controls']
    },
    {
        topic: 'GMP Pharmaceutical',
        belt: 'Industry',
        content: 'GMP: Good Manufacturing Practice. 21 CFR Parts 210/211 for pharma. Process Validation stages: 1. Process Design, 2. Process Qualification, 3. Continued Verification. 21 CFR Part 11 for electronic records. Data Integrity ALCOA+: Attributable, Legible, Contemporaneous, Original, Accurate + Complete, Consistent, Enduring, Available.',
        keywords: ['gmp', 'pharmaceutical', 'pharma', 'fda', 'validation', 'alcoa', 'cfr', 'drug', 'medicine']
    },
    {
        topic: 'AS9100 (Aerospace)',
        belt: 'Industry',
        content: 'AS9100D: Aerospace QMS. Special requirements: Configuration management, Risk management, Counterfeit parts prevention, First Article Inspection (FAI) per AS9102. NADCAP accreditation for special processes: Heat treating, Welding, NDT, Chemical processing, Coatings.',
        keywords: ['as9100', 'aerospace', 'aviation', 'nadcap', 'fai', 'aircraft', 'defense', 'space']
    },
    {
        topic: 'RoHS/REACH Electronics',
        belt: 'Industry',
        content: 'RoHS restricts hazardous substances in electronics: Lead <0.1%, Mercury <0.1%, Cadmium <0.01%, Hex Chrome <0.1%, PBB/PBDE <0.1%, Phthalates <0.1%. IPC standards: IPC-A-610 (assembly acceptance), IPC-J-STD-001 (soldering). ESD control per ANSI/ESD S20.20.',
        keywords: ['rohs', 'electronics', 'pcb', 'ipc', 'esd', 'soldering', 'lead', 'free', 'weee']
    },
    {
        topic: 'HACCP Food Safety',
        belt: 'Industry',
        content: 'HACCP 7 Principles: 1. Hazard analysis, 2. Determine CCPs (Critical Control Points), 3. Establish critical limits, 4. Monitoring procedures, 5. Corrective actions, 6. Verification, 7. Documentation. FSSC 22000 and SQF are certification schemes.',
        keywords: ['haccp', 'food', 'safety', 'ccp', 'fssc', 'sqf', 'beverage', 'contamination']
    }
];

// Advanced statistics
const advancedStats: KnowledgeItem[] = [
    {
        topic: 'Normality Testing',
        belt: 'Advanced Stats',
        content: 'Normality tests: Shapiro-Wilk (small samples n<50), Anderson-Darling (sensitive to tails), Kolmogorov-Smirnov (large samples). If p>0.05 assume normal. If not normal: Transform (log, sqrt, Box-Cox), Use non-parametric tests, or rely on Central Limit Theorem for n>30.',
        keywords: ['normality', 'normal', 'shapiro', 'wilk', 'anderson', 'darling', 'qq', 'plot', 'distribution', 'test']
    },
    {
        topic: 'Non-Parametric Tests',
        belt: 'Advanced Stats',
        content: 'Non-parametric alternatives: Mann-Whitney U (vs 2-sample t), Wilcoxon signed-rank (vs paired t), Kruskal-Wallis (vs ANOVA), Spearman correlation (vs Pearson). Use when data is not normal, ordinal, or has outliers.',
        keywords: ['nonparametric', 'non', 'parametric', 'mann', 'whitney', 'wilcoxon', 'kruskal', 'wallis', 'spearman']
    },
    {
        topic: 'Power Analysis',
        belt: 'Advanced Stats',
        content: 'Power = 1 - β = P(Reject H0 | H0 false). Target power: 80% or higher. Factors affecting power: Sample size (↑n = ↑power), Effect size (↑effect = ↑power), Alpha level (↑α = ↑power), Variability (↓σ = ↑power). Use to determine required sample size.',
        keywords: ['power', 'analysis', 'sample', 'size', 'beta', 'effect', 'calculation', 'planning']
    },
    {
        topic: 'Sample Size Calculation',
        belt: 'Advanced Stats',
        content: 'Sample size for means: n = (Zα/2 + Zβ)² × 2σ² / Δ². For proportions: n = p(1-p) × (Z/E)². Cohens d effect sizes: small=0.2, medium=0.5, large=0.8. Use power analysis tools in Minitab or statsmodels.',
        keywords: ['sample', 'size', 'calculation', 'power', 'effect', 'cohens', 'margin', 'error']
    },
    {
        topic: 'Box-Cox Transformation',
        belt: 'Advanced Stats',
        content: 'Box-Cox transforms non-normal data. Formula: y(λ) = (y^λ - 1)/λ. Common λ values: -1 (inverse), 0 (log), 0.5 (sqrt), 1 (no transform), 2 (square). Optimal λ found by maximum likelihood. Data must be positive.',
        keywords: ['box', 'cox', 'transformation', 'transform', 'lambda', 'normalize', 'power']
    },
    {
        topic: 'Weibull Reliability',
        belt: 'Advanced Stats',
        content: 'Weibull distribution for failure analysis. Parameters: β (shape), η (scale/characteristic life). Shape interpretation: β<1 decreasing failure rate (infant mortality), β=1 constant (exponential), β>1 increasing (wear-out). Calculate reliability R(t) at time t.',
        keywords: ['weibull', 'reliability', 'failure', 'mtbf', 'shape', 'scale', 'beta', 'eta', 'lifetime']
    }
];

// Certification info
const certificationTopics: KnowledgeItem[] = [
    {
        topic: 'ASQ CSSBB Certification',
        belt: 'Certification',
        content: 'ASQ Certified Six Sigma Black Belt: 165 questions, 4.5 hours. BoK sections: Organization Planning (10%), Process Management (10%), Team Management (10%), Define (10%), Measure (20%), Analyze (20%), Improve (10%), Control (10%). Requires 3 years experience and 2 completed projects.',
        keywords: ['asq', 'cssbb', 'certification', 'exam', 'black', 'belt', 'certified', 'test']
    },
    {
        topic: 'IASSC Certification',
        belt: 'Certification',
        content: 'IASSC Black Belt: 150 questions, 4 hours. Content: Define (15%), Measure (25%), Analyze (25%), Improve (25%), Control (10%). No experience or project required. Passing: 580/875 (66.3%). Lower cost than ASQ, internationally recognized.',
        keywords: ['iassc', 'certification', 'exam', 'black', 'belt', 'lean', 'six', 'sigma']
    },
    {
        topic: 'Exam Preparation',
        belt: 'Certification',
        content: 'Must-know formulas: Mean, Std Dev, Cpk, DPMO, Z-score, t-test. Common traps: Cp vs Cpk (centering), α vs β error, σ vs s (population vs sample), Resolution III vs IV (aliasing). Strategies: Read carefully, eliminate wrong answers, flag and return to difficult questions.',
        keywords: ['exam', 'prep', 'preparation', 'study', 'formulas', 'tips', 'strategy', 'certification']
    }
];

// Build complete knowledge base
export function buildKnowledgeBase(): KnowledgeItem[] {
    const knowledge: KnowledgeItem[] = [];

    // Add module content from all belts
    const allModules = [
        { belt: 'White Belt', modules: whiteBeltModules },
        { belt: 'Yellow Belt', modules: yellowBeltModules },
        { belt: 'Green Belt', modules: greenBeltModules },
        { belt: 'Black Belt', modules: blackBeltModules },
        { belt: 'Master Black Belt', modules: masterBlackBeltModules },
    ];

    allModules.forEach(({ belt, modules }) => {
        modules.forEach(module => {
            module.lessons.forEach(lesson => {
                // Extract text content from HTML
                const textContent = lesson.content
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                // Extract keywords from content
                const keywords = extractKeywords(lesson.title + ' ' + textContent);

                knowledge.push({
                    topic: lesson.title,
                    belt,
                    content: textContent,
                    keywords
                });
            });
        });
    });

    // Add all static topics
    knowledge.push(...complianceTopics);
    knowledge.push(...leanTopics);
    knowledge.push(...templateTopics);
    knowledge.push(...industryTopics);
    knowledge.push(...advancedStats);
    knowledge.push(...certificationTopics);

    return knowledge;
}

// Search knowledge base
export function searchKnowledge(query: string, knowledge: KnowledgeItem[]): (KnowledgeItem & { score: number })[] {
    const queryWords = extractKeywords(query.toLowerCase());

    // Score each knowledge item based on keyword matches
    const scored = knowledge.map(item => {
        let score = 0;

        // Check topic match (high weight)
        queryWords.forEach(word => {
            if (item.topic.toLowerCase().includes(word)) {
                score += 10;
            }
        });

        // Check keyword match
        queryWords.forEach(word => {
            if (item.keywords.includes(word)) {
                score += 3;
            }
        });

        // Check content match
        queryWords.forEach(word => {
            if (item.content.toLowerCase().includes(word)) {
                score += 1;
            }
        });

        return { ...item, score };
    });

    // Return top matches
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
}

// Export helper functions for use in Chatbot
export { searchEchaSubstances, getSubstanceStats };