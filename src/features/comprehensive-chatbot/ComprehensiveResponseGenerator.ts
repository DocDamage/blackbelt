/**
 * Comprehensive Response Generator
 * 
 * Generates detailed responses to Six Sigma questions using the knowledge base.
 */

import dmaicKnowledge from './ComprehensiveKnowledgeBase';
import sixSigmaToolsKnowledge from './SixSigmaToolsKnowledge';

export interface ChatResponse {
  content: string;
  suggestions?: string[];
}

// Combine all knowledge bases
const allKnowledge = [...dmaicKnowledge, ...sixSigmaToolsKnowledge];

// Keywords mapping to topics
const keywordTopics: Record<string, string[]> = {
  'dmaic': ['dmaic', 'define', 'measure', 'analyze', 'improve', 'control'],
  'define': ['define phase', 'project charter', 'scope', 'problem statement', 'sipoc'],
  'measure': ['measure phase', 'data collection', 'msa', 'gage r&r', 'baseline', 'capability'],
  'analyze': ['analyze phase', 'root cause', '5 whys', 'fishbone', 'hypothesis test', 'regression'],
  'improve': ['improve phase', 'solution', 'doe', 'design of experiments', 'pilot'],
  'control': ['control phase', 'control chart', 'spc', 'standard work', 'control plan'],
  'statistics': ['statistics', 'mean', 'median', 'standard deviation', 'variance', 'normal distribution'],
  'capability': ['cpk', 'cp', 'process capability', 'sigma level', 'ppm', 'dpmo'],
  'certification': ['certification', 'belt', 'white belt', 'yellow belt', 'green belt', 'black belt', 'asq'],
  'tools': ['5s', 'kaizen', 'poka yoke', 'kanban', 'vsm', 'pareto', 'histogram']
};

function findRelevantKnowledge(query: string): typeof allKnowledge {
  const queryLower = query.toLowerCase();
  const queryKeywords = queryLower.split(/\s+/);
  
  return allKnowledge.filter(entry => {
    // Check if any keyword matches
    const matchesKeyword = entry.keywords.some((kw: string) => 
      queryKeywords.some(qk => qk.includes(kw) || kw.includes(qk))
    );
    
    // Check if topic is mentioned
    const matchesTopic = queryLower.includes(entry.topic.toLowerCase());
    
    // Check if content would be relevant
    const matchesContent = entry.keywords.some((kw: string) => queryLower.includes(kw));
    
    return matchesKeyword || matchesTopic || matchesContent;
  });
}

function extractTopic(query: string): string {
  const queryLower = query.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(keywordTopics)) {
    if (keywords.some((kw: string) => queryLower.includes(kw))) {
      return topic;
    }
  }
  
  return 'general';
}

// Statistical calculation helpers
function generateStatisticalHelp(_topic: string, query: string): string {
  if (query.includes('cpk') || query.includes('process capability')) {
    return `**Process Capability (Cpk) Calculation:**

Cpk measures how capable your process is of meeting specifications.

**Formula:**
Cpk = min[(USL - μ) / (3σ), (μ - LSL) / (3σ)]

Where:
• USL = Upper Specification Limit
• LSL = Lower Specification Limit
• μ (mu) = Process mean
• σ (sigma) = Process standard deviation

**Interpretation:**
• Cpk < 1.0: Process not capable (produces defects)
• Cpk = 1.0: Process barely capable (3 sigma)
• Cpk = 1.33: Process capable (4 sigma, minimum for most industries)
• Cpk = 1.67: Highly capable (5 sigma)
• Cpk = 2.0: Six Sigma level (3.4 DPMO)

**Example:**
If USL = 10.5, LSL = 9.5, Mean = 10.0, Std Dev = 0.1
Cpu = (10.5 - 10.0) / (3 × 0.1) = 1.67
Cpl = (10.0 - 9.5) / (3 × 0.1) = 1.67
Cpk = min(1.67, 1.67) = **1.67** (Highly capable)`;
  }
  
  if (query.includes('sample size')) {
    return `**Sample Size Calculation:**

For estimating a mean with confidence:

**Formula:**
n = (Z² × σ²) / E²

Where:
• Z = Z-score for confidence level (1.96 for 95%)
• σ = Estimated standard deviation
• E = Margin of error (acceptable error)

**Common Z-values:**
• 90% confidence: Z = 1.645
• 95% confidence: Z = 1.96
• 99% confidence: Z = 2.576

**Example:**
Want to estimate mean within ±0.5 units with 95% confidence.
Estimated σ = 2.0

n = (1.96² × 2.0²) / 0.5²
n = (3.84 × 4) / 0.25
n = 15.36 / 0.25
n = **61.4** → Round up to **62**

**Rule of Thumb:**
• Minimum: 30 samples
• Good: 50-100 samples
• High precision: 200+ samples`;
  }
  
  if (query.includes('control chart') || query.includes('which chart')) {
    return `**Control Chart Selection Guide:**

**Variable Data (Measurements):**
| Situation | Chart to Use |
|-----------|-------------|
| Single measurements, n=1 | I-MR (Individuals and Moving Range) |
| Subgroups 2-10 | X-bar & R (Average and Range) |
| Subgroups >10 | X-bar & S (Average and Standard Dev) |

**Attribute Data (Counts):**
| Situation | Chart to Use |
|-----------|-------------|
| Count of defects (variable area/opportunity) | c-chart |
| Defects per unit (constant area/opportunity) | u-chart |
| Proportion defective (constant sample size) | np-chart |
| Proportion defective (variable sample size) | p-chart |

**Decision Tree:**
1. Is your data variable (measurement) or attribute (count)?
   → Variable: Use X-bar, I-MR
   → Attribute: Go to step 2

2. Are you counting defects or defectives?
   → Defects (multiple per unit): c-chart or u-chart
   → Defectives (unit good/bad): p-chart or np-chart

3. Is sample size constant?
   → Constant: c-chart or np-chart
   → Variable: u-chart or p-chart`;
  }
  
  return '';
}

// Certification guidance
function generateCertificationHelp(query: string): string {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('white belt')) {
    return `**White Belt Certification:**

**Overview:**
Entry-level introduction to Six Sigma concepts.

**Requirements:**
• 4-8 hours of training
• Basic understanding of Six Sigma principles
• No project required
• No prerequisites

**Topics Covered:**
• What is Six Sigma?
• DMAIC overview
• Basic statistics
• 8 Wastes
• 5S methodology
• Process mapping basics

**Who Should Get It:**
• Anyone interested in learning Six Sigma
• Team members supporting projects
• Employees in any role

**Study Time:** 1-2 weeks
**Cost:** $0-100 (many free options available)`;
  }
  
  if (queryLower.includes('yellow belt')) {
    return `**Yellow Belt Certification:**

**Overview:**
Foundation level for participating in Six Sigma projects.

**Requirements:**
• 16-24 hours of training
• Understanding of DMAIC phases
• Can participate as team member
• No prerequisites

**Topics Covered:**
• All White Belt content
• DMAIC in detail
• Process mapping
• Data collection methods
• Basic statistical tools
• Root cause analysis (5 Whys, Fishbone)

**Who Should Get It:**
• Team members on Green/Black Belt projects
• Front-line supervisors
• Process owners

**Study Time:** 2-4 weeks
**Cost:** $100-300`;
  }
  
  if (queryLower.includes('green belt')) {
    return `**Green Belt Certification:**

**Overview:**
Leads smaller projects and supports Black Belts on complex projects.

**Requirements:**
• 40-80 hours of training
• Pass certification exam
• Complete 1 Six Sigma project
• Yellow Belt recommended

**Topics Covered:**
• All Yellow Belt content
• Advanced statistics
• Hypothesis testing
• Regression analysis
• Design of Experiments (DOE) basics
• Process capability studies
• Control charts
• Project management

**Who Should Get It:**
• Process engineers
• Quality engineers
• Project managers
• Department managers

**Study Time:** 2-3 months
**Project Duration:** 3-6 months
**Cost:** $2,000-5,000`;
  }
  
  if (queryLower.includes('black belt')) {
    return `**Black Belt Certification:**

**Overview:**
Expert level leading complex, cross-functional projects.

**Requirements:**
• 120-160 hours of training
• Pass rigorous certification exam
• Complete 2 Six Sigma projects
• Green Belt or equivalent experience
• 3+ years work experience recommended

**Topics Covered:**
• All Green Belt content
• Advanced DOE
• Statistical software (Minitab)
• Change management
• Team leadership
• Advanced statistical methods
• DFSS (Design for Six Sigma)
• Lean Enterprise

**Who Should Get It:**
• Full-time improvement professionals
• Senior engineers
• Quality managers
• Continuous improvement leaders

**Study Time:** 4-6 months
**Project Duration:** 4-6 months each
**Cost:** $5,000-15,000`;
  }
  
  return `**Six Sigma Certification Levels:**

| Belt | Training | Project | Experience | Role |
|------|----------|---------|------------|------|
| **White** | 4-8 hrs | None | None | Awareness |
| **Yellow** | 16-24 hrs | None | None | Team Member |
| **Green** | 40-80 hrs | 1 project | Recommended | Lead Small Projects |
| **Black** | 120-160 hrs | 2 projects | 3+ years | Lead Complex Projects |
| **Master Black** | 200+ hrs | Multiple | 5+ years + BB | Mentor, Strategy |

**Certifying Bodies:**
• **ASQ** (American Society for Quality) - Most recognized
• **IASSC** (International Association for Six Sigma Certification)
• **The Council for Six Sigma Certification**
• **Villanova University**
• **Purdue University**

**Tips for Success:**
1. Start with your current belt level
2. Apply concepts to real projects at work
3. Use statistical software (Excel, Minitab)
4. Join study groups
5. Practice with sample exams`;
}

// Main response generator
export async function comprehensiveResponseGenerator(query: string): Promise<ChatResponse> {
  const queryLower = query.toLowerCase();
  const topic = extractTopic(query);
  
  // Check for statistical calculations
  const statHelp = generateStatisticalHelp(topic, queryLower);
  if (statHelp) {
    return {
      content: statHelp,
      suggestions: ['Process Capability', 'Control Charts', 'Sample Size']
    };
  }
  
  // Check for certification questions
  if (topic === 'certification' || queryLower.includes('belt') || queryLower.includes('certification')) {
    const certHelp = generateCertificationHelp(query);
    return {
      content: certHelp,
      suggestions: ['Green Belt Requirements', 'Study Tips', 'ASQ Exam']
    };
  }
  
  // Find relevant knowledge
  const relevantKnowledge = findRelevantKnowledge(query);
  
  if (relevantKnowledge.length > 0 && relevantKnowledge[0]) {
    // Use the most relevant entry
    const bestMatch = relevantKnowledge[0];
    
    return {
      content: bestMatch.content,
      suggestions: bestMatch.relatedTopics.slice(0, 3)
    };
  }
  
  // Default responses for common questions
  if (queryLower.includes('hello') || queryLower.includes('hi')) {
    return {
      content: 'Hello! I\'m your Six Sigma Assistant. I can help you with:\n\n• **DMAIC methodology** - Define, Measure, Analyze, Improve, Control\n• **Statistical tools** - Control charts, capability analysis, hypothesis tests\n• **Certification guidance** - White, Yellow, Green, Black Belt\n• **Problem solving** - Root cause analysis, 5 Whys, Fishbone diagrams\n• **Process improvement** - Lean tools, waste reduction, flow optimization\n\nWhat would you like to learn about?',
      suggestions: ['DMAIC Overview', 'Certification Paths', 'Statistical Tools']
    };
  }
  
  // General fallback
  return {
    content: `I can help you with many Six Sigma topics! Here are some things you can ask:

**DMAIC Phases:**
• "Explain the Define phase"
• "What happens in Measure?"
• "How do I analyze data?"

**Statistical Tools:**
• "How do I calculate Cpk?"
• "Which control chart should I use?"
• "What sample size do I need?"

**Certification:**
• "What are Green Belt requirements?"
• "How do I prepare for ASQ exam?"
• "White vs Yellow belt?"

**Problem Solving:**
• "How do I do a 5 Whys?"
• "What is a Fishbone diagram?"
• "How do I create a control plan?"

Try asking a specific question about any of these topics!`,
    suggestions: ['DMAIC Overview', 'Calculate Cpk', 'Certification Requirements']
  };
}

export default comprehensiveResponseGenerator;
