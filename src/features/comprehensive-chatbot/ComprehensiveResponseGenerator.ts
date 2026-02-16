/**
 * Comprehensive Response Generator
 * 
 * Generates detailed responses to Six Sigma questions using the knowledge base.
 */

import dmaicKnowledge from './ComprehensiveKnowledgeBase';
import sixSigmaToolsKnowledge from './SixSigmaToolsKnowledge';
import globalComplianceKnowledge, { ComplianceEntry } from './GlobalComplianceKnowledge';
import { parseCalculationRequest, calculateCpk, calculateSampleSizeMean, sigmaToDpmo } from './Calculators';
import { searchIndustryPlaybooks } from './IndustryPlaybooks';
import supplierComplianceKnowledge from './SupplierCompliance';
import sdsAndLabelingKnowledge from './SDSAndLabeling';
import auditChecklists from './AuditChecklists';
import { searchCaseStudies } from './CaseStudies';
import esgSustainabilityKnowledge from './ESGSustainability';

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
  'tools': ['5s', 'kaizen', 'poka yoke', 'kanban', 'vsm', 'pareto', 'histogram'],
  'compliance': ['reach', 'rohs', 'prop 65', 'tsca', 'weee', 'bpa', 'phthalates', 'heavy metals']
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

// Find relevant compliance knowledge
function findRelevantCompliance(query: string): ComplianceEntry[] {
  const queryLower = query.toLowerCase();
  
  return globalComplianceKnowledge.filter(entry => {
    const matchesKeyword = entry.keywords.some((kw: string) => queryLower.includes(kw));
    const matchesRegulation = queryLower.includes(entry.regulation.toLowerCase());
    const matchesJurisdiction = queryLower.includes(entry.jurisdiction.toLowerCase());
    const matchesCategory = entry.applicableProducts.some(product => 
      queryLower.includes(product.toLowerCase())
    );
    
    return matchesKeyword || matchesRegulation || matchesJurisdiction || matchesCategory;
  });
}

// Generate compliance help
function generateComplianceHelp(query: string): string | null {
  const queryLower = query.toLowerCase();
  
  // Check for compliance overview questions
  if (queryLower.includes('reach') || queryLower.includes('eu chemicals')) {
    const reachEntry = globalComplianceKnowledge.find(e => e.id === 'eu-reach-1');
    if (reachEntry) return reachEntry.content;
  }
  
  if (queryLower.includes('rohs') || (queryLower.includes('electronics') && queryLower.includes('eu'))) {
    const rohsEntry = globalComplianceKnowledge.find(e => e.id === 'eu-rohs-1');
    if (rohsEntry) return rohsEntry.content;
  }
  
  if (queryLower.includes('prop 65') || queryLower.includes('california') || queryLower.includes('warning label')) {
    const prop65Entry = globalComplianceKnowledge.find(e => e.id === 'us-prop65-1');
    if (prop65Entry) return prop65Entry.content;
  }
  
  if (queryLower.includes('tsca') || (queryLower.includes('us') && queryLower.includes('chemical'))) {
    const tscaEntry = globalComplianceKnowledge.find(e => e.id === 'us-tsca-1');
    if (tscaEntry) return tscaEntry.content;
  }
  
  if (queryLower.includes('bpa') || queryLower.includes('bisphenol')) {
    const bpaEntry = globalComplianceKnowledge.find(e => e.id === 'plastics-bpa-1');
    if (bpaEntry) return bpaEntry.content;
  }
  
  if (queryLower.includes('phthalate')) {
    const phthalateEntry = globalComplianceKnowledge.find(e => e.id === 'plastics-phthalates-1');
    if (phthalateEntry) return phthalateEntry.content;
  }
  
  if (queryLower.includes('heavy metal') || queryLower.includes('lead') || queryLower.includes('cadmium')) {
    const heavyMetalEntry = globalComplianceKnowledge.find(e => e.id === 'plastics-heavy-metals-1');
    if (heavyMetalEntry) return heavyMetalEntry.content;
  }
  
  if (queryLower.includes('china') && queryLower.includes('chemical')) {
    const chinaEntry = globalComplianceKnowledge.find(e => e.id === 'cn-reach-1');
    if (chinaEntry) return chinaEntry.content;
  }
  
  if (queryLower.includes('korea') && queryLower.includes('chemical')) {
    const koreaEntry = globalComplianceKnowledge.find(e => e.id === 'kr-reach-1');
    if (koreaEntry) return koreaEntry.content;
  }
  
  // If specific match not found, return general compliance search
  const relevantCompliance = findRelevantCompliance(query);
  if (relevantCompliance.length > 0 && relevantCompliance[0]) {
    return relevantCompliance[0].content;
  }
  
  return null;
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
  
  // Check for interactive calculation requests
  const calcRequest = parseCalculationRequest(queryLower);
  if (calcRequest) {
    let result: { result: string; interpretation: string } | null = null;
    
    switch (calcRequest.type) {
      case 'cpk':
        if (calcRequest.params.length === 4) {
          const [mean, usl, lsl, stdDev] = calcRequest.params;
          if (mean && usl && lsl && stdDev) {
            result = calculateCpk(mean, usl, lsl, stdDev);
          }
        }
        break;
      case 'sampleSizeMean':
        if (calcRequest.params.length === 3) {
          const [confidence, margin, stdDev] = calcRequest.params;
          if (confidence && margin && stdDev) {
            result = calculateSampleSizeMean(confidence, margin, stdDev);
          }
        }
        break;
      case 'sigmaDpmo':
        if (calcRequest.params.length === 1) {
          const sigma = calcRequest.params[0];
          if (sigma) {
            result = sigmaToDpmo(sigma);
          }
        }
        break;
    }
    
    if (result) {
      return {
        content: result.result,
        suggestions: ['Sample Size', 'Gage R&R', 'Sigma Converter']
      };
    }
  }
  
  // Check for statistical calculations (formula explanations)
  const statHelp = generateStatisticalHelp(topic, queryLower);
  if (statHelp) {
    return {
      content: statHelp,
      suggestions: ['Process Capability', 'Control Charts', 'Sample Size']
    };
  }
  
  // Check for compliance questions
  const complianceHelp = generateComplianceHelp(queryLower);
  if (complianceHelp) {
    return {
      content: complianceHelp,
      suggestions: ['REACH', 'RoHS', 'Prop 65', 'TSCA', 'Phthalates', 'BPA']
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
  
  // Check for industry-specific questions
  if (queryLower.includes('industry') || queryLower.includes('medical device') || 
      queryLower.includes('automotive') || queryLower.includes('aerospace') ||
      queryLower.includes('pharmaceutical') || queryLower.includes('food') ||
      queryLower.includes('electronics') || queryLower.includes('iatf') ||
      queryLower.includes('as9100') || queryLower.includes('iso 13485')) {
    const industries = searchIndustryPlaybooks(query);
    if (industries.length > 0 && industries[0]) {
      const pb = industries[0];
      return {
        content: `**${pb.industry} Six Sigma Playbook**

${pb.description}

**Key Standards:**
${pb.keyStandards.map(s => `• ${s}`).join('\n')}

**Typical Projects:**
${pb.typicalProjects.slice(0, 4).map(p => `• ${p}`).join('\n')}

**Critical Metrics:**
${pb.criticalMetrics.slice(0, 5).map(m => `• ${m}`).join('\n')}

**Compliance Requirements:**
${pb.complianceRequirements.slice(0, 4).map(r => `• ${r}`).join('\n')}

**Tools and Methods:**
${pb.toolsAndMethods.slice(0, 5).map(t => `• ${t}`).join('\n')}

**Case Study Example:**
${pb.caseStudies[0]}`,
        suggestions: pb.keyStandards.slice(0, 3)
      };
    }
  }
  
  // Check for supplier/compliance questions
  if (queryLower.includes('supplier') || queryLower.includes('conflict mineral') || 
      queryLower.includes('coc') || queryLower.includes('certificate of compliance') ||
      queryLower.includes('smelter') || queryLower.includes('cmrt')) {
    const relevantSupplier = supplierComplianceKnowledge.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantSupplier) {
      return {
        content: relevantSupplier.content,
        suggestions: ['Conflict Minerals', 'Supplier Audit', 'Certificate of Compliance']
      };
    }
  }
  
  // Check for SDS/Labeling questions
  if (queryLower.includes('sds') || queryLower.includes('safety data sheet') || 
      queryLower.includes('msds') || queryLower.includes('ghs') || 
      queryLower.includes('label') || queryLower.includes('pictogram') ||
      queryLower.includes('hazard') || queryLower.includes('transport') ||
      queryLower.includes('un number')) {
    const relevantSDS = sdsAndLabelingKnowledge.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantSDS) {
      return {
        content: relevantSDS.content,
        suggestions: ['SDS Sections', 'GHS Labeling', 'Transport Classification']
      };
    }
  }
  
  // Check for audit questions
  if (queryLower.includes('audit') || queryLower.includes('inspection') || 
      queryLower.includes('checklist') || queryLower.includes('iso 9001') ||
      queryLower.includes('fda inspection') || queryLower.includes('483') ||
      queryLower.includes('lpa') || queryLower.includes('layered process')) {
    const relevantAudit = auditChecklists.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantAudit) {
      return {
        content: relevantAudit.content,
        suggestions: ['ISO 9001 Audit', 'FDA Inspection', 'Layered Process Audit']
      };
    }
  }
  
  // Check for case studies
  if (queryLower.includes('case study') || queryLower.includes('example') ||
      queryLower.includes('success story') || queryLower.includes('project example')) {
    const cases = searchCaseStudies(query);
    if (cases.length > 0 && cases[0]) {
      const cs = cases[0];
      return {
        content: `**Case Study: ${cs.title}**

**Industry:** ${cs.industry}

**Challenge:**
${cs.challenge}

**Approach:**
${cs.approach}

**Results:**
${cs.results}

**Tools Used:** ${cs.toolsUsed.join(', ')}

**Timeline:** ${cs.timeline}

**ROI:** ${cs.roi}

**Lessons Learned:**
${cs.lessonsLearned}`,
        suggestions: ['DMAIC', cs.industry, 'Tools Used']
      };
    }
  }
  
  // Check for ESG/Sustainability questions
  if (queryLower.includes('esg') || queryLower.includes('sustainability') || 
      queryLower.includes('carbon') || queryLower.includes('emission') || 
      queryLower.includes('scope 1') || queryLower.includes('scope 2') ||
      queryLower.includes('scope 3') || queryLower.includes('csrd') ||
      queryLower.includes('circular economy') || queryLower.includes('ghg')) {
    const relevantESG = esgSustainabilityKnowledge.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantESG) {
      return {
        content: relevantESG.content,
        suggestions: ['Carbon Footprint', 'CSRD', 'Circular Economy', 'ESG Frameworks']
      };
    }
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
      content: 'Hello! I\'m your Six Sigma & Compliance Assistant. I can help you with:\n\n• **Six Sigma DMAIC** - Define, Measure, Analyze, Improve, Control\n• **Statistical tools** - Control charts, capability analysis, hypothesis tests\n• **Certification guidance** - White, Yellow, Green, Black Belt\n• **Global Compliance** - REACH, RoHS, Prop 65, TSCA, Phthalates, BPA\n• **Problem solving** - Root cause analysis, 5 Whys, Fishbone diagrams\n• **Process improvement** - Lean tools, waste reduction, flow optimization\n\nWhat would you like to learn about?',
      suggestions: ['DMAIC Overview', 'REACH Compliance', 'Certification Paths', 'Prop 65', 'Statistical Tools']
    };
  }
  
  // General fallback
  return {
    content: `I can help you with Six Sigma and Global Compliance topics! Here are some things you can ask:

**Six Sigma DMAIC:**
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

**Global Compliance:**
• "What is REACH?"
• "RoHS restricted substances"
• "California Prop 65 requirements"
• "BPA restrictions"
• "Phthalate regulations"
• "Heavy metals limits"

**Problem Solving:**
• "How do I do a 5 Whys?"
• "What is a Fishbone diagram?"

Try asking a specific question!`,
    suggestions: ['DMAIC Overview', 'REACH', 'Prop 65', 'Calculate Cpk', 'Certification Requirements']
  };
}

export default comprehensiveResponseGenerator;
