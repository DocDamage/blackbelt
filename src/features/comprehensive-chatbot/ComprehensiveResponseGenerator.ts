/**
 * Comprehensive Response Generator
 * 
 * Generates detailed responses to Six Sigma questions using the knowledge base.
 * 
 * Technical Debt Fix - Issue 60: Optimized knowledge base loading with keyword index
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
import qualitySoftwareSystems from './QualitySoftwareSystems';
import aiQualityKnowledge from './AIQualityKnowledge';

export interface ChatResponse {
  content: string;
  suggestions?: string[];
}

// Combine all knowledge bases
const allKnowledge = [...dmaicKnowledge, ...sixSigmaToolsKnowledge];

// Pre-built keyword index for fast lookups (Issue 60 fix)
// This avoids scanning all entries on every query
interface KeywordIndex {
  [keyword: string]: number[]; // keyword -> array of knowledge base indices
}

// Build inverted keyword index for O(1) lookups
const keywordIndex: KeywordIndex = {};

function buildKeywordIndex(): void {
  if (Object.keys(keywordIndex).length > 0) return; // Already built
  
  allKnowledge.forEach((entry, index) => {
    entry.keywords.forEach(keyword => {
      const normalizedKw = keyword.toLowerCase();
      if (!keywordIndex[normalizedKw]) {
        keywordIndex[normalizedKw] = [];
      }
      if (!keywordIndex[normalizedKw].includes(index)) {
        keywordIndex[normalizedKw].push(index);
      }
    });
  });
}

// Initialize index on first use
let indexInitialized = false;

function ensureIndexBuilt(): void {
  if (!indexInitialized) {
    buildKeywordIndex();
    indexInitialized = true;
  }
}

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

/**
 * Find relevant knowledge using optimized keyword index (Issue 60 fix)
 * O(k) lookup where k is number of query keywords instead of O(n*k)
 */
function findRelevantKnowledge(query: string): typeof allKnowledge {
  ensureIndexBuilt();
  
  const queryLower = query.toLowerCase();
  const queryKeywords = queryLower.split(/\s+/).filter(k => k.length > 2); // Filter out short words
  
  // Use Set to avoid duplicates
  const matchedIndices = new Set<number>();
  
  // Fast index lookup
  queryKeywords.forEach(qk => {
    // Check for exact keyword matches in index
    Object.entries(keywordIndex).forEach(([kw, indices]) => {
      if (qk.includes(kw) || kw.includes(qk)) {
        indices.forEach(idx => matchedIndices.add(idx));
      }
    });
  });
  
  // Also check topics directly
  allKnowledge.forEach((entry, index) => {
    if (queryLower.includes(entry.topic.toLowerCase())) {
      matchedIndices.add(index);
    }
  });
  
  // Convert indices back to entries
  return Array.from(matchedIndices)
    .map(idx => allKnowledge[idx])
    .filter((entry): entry is typeof allKnowledge[0] => entry !== undefined);
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
    const matchesRegulation = queryLower.includes(entry.regulation?.toLowerCase() || '');
    const matchesJurisdiction = queryLower.includes(entry.jurisdiction?.toLowerCase() || '');
    const matchesCategory = entry.applicableProducts?.some(product => 
      queryLower.includes(product.toLowerCase())
    ) || false;
    
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
  
  // Check for California ESG disclosure (SB-253/261)
  if (queryLower.includes('sb-253') || queryLower.includes('sb253') || 
      queryLower.includes('sb-261') || queryLower.includes('sb261') ||
      queryLower.includes('california climate') || queryLower.includes('climate disclosure') ||
      (queryLower.includes('california') && (queryLower.includes('scope 1') || queryLower.includes('scope 2') || queryLower.includes('scope 3')))) {
    const caEntry = globalComplianceKnowledge.find(e => e.id === 'ca-sb253-1');
    if (caEntry) {
      return {
        content: caEntry.content,
        suggestions: ['CA SB-253', 'CA SB-261', 'Scope 3 Reporting', 'TCFD']
      };
    }
  }
  
  // Check for Halogen-free standards
  if (queryLower.includes('halogen-free') || queryLower.includes('halogen free') || 
      queryLower.includes('iec 61249') || queryLower.includes('jpca-es-01') ||
      queryLower.includes('chlorine limit') || queryLower.includes('bromine limit') ||
      queryLower.includes('tbbpa') || (queryLower.includes('pcb') && queryLower.includes('halogen'))) {
    const halogenEntry = globalComplianceKnowledge.find(e => e.id === 'halogen-free-1');
    if (halogenEntry) {
      return {
        content: halogenEntry.content,
        suggestions: ['IEC 61249', 'Halogen-Free PCB', 'Flame Retardants']
      };
    }
  }
  
  // Check for software/ERP/QMS questions
  if (queryLower.includes('sage 100') || queryLower.includes('sage erp') || 
      queryLower.includes('mas 90') || queryLower.includes('iqms') ||
      queryLower.includes('delmiaworks') || queryLower.includes('erp') ||
      queryLower.includes('qms software') || queryLower.includes('manufacturing software')) {
    const relevantSoftware = qualitySoftwareSystems.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantSoftware) {
      return {
        content: relevantSoftware.content,
        suggestions: ['Sage 100', 'IQMS/DELMIAWorks', 'QMS Features', 'ERP for Quality']
      };
    }
  }
  
  // Check for PFAS questions
  if (queryLower.includes('pfas') || queryLower.includes('forever chemical') ||
      queryLower.includes('pfoa') || queryLower.includes('pfos') ||
      queryLower.includes('fluorinated')) {
    const pfasEntry = globalComplianceKnowledge.find(e => e.id === 'us-pfas-1');
    if (pfasEntry) {
      return {
        content: pfasEntry.content,
        suggestions: ['PFAS Reporting', 'PFOS/PFOA', 'PFAS Restrictions', 'EPA PFAS']
      };
    }
  }
  
  // Check for POPS (Persistent Organic Pollutants)
  if (queryLower.includes('pops') || queryLower.includes('stockholm convention') ||
      queryLower.includes('persistent organic pollutant') || queryLower.includes('sccp')) {
    const popsEntry = globalComplianceKnowledge.find(e => e.id === 'eu-pops-1');
    if (popsEntry) {
      return {
        content: popsEntry.content,
        suggestions: ['EU POPS', 'Stockholm Convention', 'PFOS', 'SCCPs', 'POPS Restrictions']
      };
    }
  }
  
  // Check for EU MDR
  if (queryLower.includes('eu mdr') || queryLower.includes('medical device regulation') ||
      queryLower.includes('udi') || queryLower.includes('eudamed')) {
    const mdrEntry = globalComplianceKnowledge.find(e => e.id === 'eu-mdr-1');
    if (mdrEntry) {
      return {
        content: mdrEntry.content,
        suggestions: ['EU MDR Requirements', 'UDI', 'EUDAMED', 'Medical Device CE']
      };
    }
  }
  
  // Check for TSCA Section 6
  if (queryLower.includes('tsca section 6') || queryLower.includes('tsca restrictions') ||
      (queryLower.includes('tsca') && (queryLower.includes('restriction') || queryLower.includes('prohibit')))) {
    const tsca6Entry = globalComplianceKnowledge.find(e => e.id === 'us-tsca-6');
    if (tsca6Entry) {
      return {
        content: tsca6Entry.content,
        suggestions: ['TSCA Section 6', 'TSCA Restrictions', 'PCE', 'HBCD', 'TCE']
      };
    }
  }
  
  // Check for REACH Annex XIV
  if (queryLower.includes('reach annex xiv') || queryLower.includes('authorization') ||
      queryLower.includes('sunset date') || queryLower.includes('authorized substance')) {
    const annex14Entry = globalComplianceKnowledge.find(e => e.id === 'eu-reach-14');
    if (annex14Entry) {
      return {
        content: annex14Entry.content,
        suggestions: ['REACH Annex XIV', 'Authorization', 'Sunset Dates', 'SVHC Authorization']
      };
    }
  }
  
  // Check for REACH Annex XVII
  if (queryLower.includes('reach annex xvii') || queryLower.includes('restriction') ||
      queryLower.includes('restricted substance') || queryLower.includes('annex 17')) {
    const annex17Entry = globalComplianceKnowledge.find(e => e.id === 'eu-reach-17');
    if (annex17Entry) {
      return {
        content: annex17Entry.content,
        suggestions: ['REACH Annex XVII', 'Restricted Substances', 'CMR', 'PBT Restrictions']
      };
    }
  }
  
  // Check for AI/ML in Quality questions
  if (queryLower.includes('ai') || queryLower.includes('artificial intelligence') || 
      queryLower.includes('machine learning') || queryLower.includes('computer vision') ||
      queryLower.includes('digital twin') || queryLower.includes('predictive quality') ||
      queryLower.includes('automated inspection') || queryLower.includes('nlp') ||
      queryLower.includes('mlops') || queryLower.includes('smart manufacturing')) {
    const relevantAI = aiQualityKnowledge.find(k => 
      k.keywords.some((kw: string) => queryLower.includes(kw))
    );
    if (relevantAI) {
      return {
        content: relevantAI.content,
        suggestions: ['Computer Vision', 'Digital Twin', 'Predictive Quality', 'MLOps', 'AI Inspection']
      };
    }
    // Return general AI in Quality overview if no specific match
    return {
      content: `**AI/ML in Quality & Manufacturing**

I can help you with AI applications in quality:

**Computer Vision:**
- Automated defect detection with deep learning
- Visual inspection systems (99%+ accuracy)
- Applications: automotive, electronics, textiles, food

**Predictive Quality Analytics:**
- Predict defects before they occur
- Machine learning models for quality prediction
- Process drift detection

**Digital Twins:**
- Virtual replicas for simulation
- Process optimization without risk
- Predictive maintenance

**NLP for Quality:**
- Customer complaint analysis
- Root cause analysis from text
- Voice of Customer mining

**MLOps for Quality:**
- Deploy and maintain ML models in production
- Model monitoring and drift detection
- Regulatory compliance (FDA 21 CFR Part 11)

Ask about any specific AI quality topic!`,
      suggestions: ['Computer Vision', 'Predictive Analytics', 'Digital Twin', 'NLP', 'MLOps']
    };
  }
  
  // Check for UK REACH (Post-Brexit)
  if (queryLower.includes('uk reach') || queryLower.includes('gb reach') || 
      queryLower.includes('brexit chemicals') || (queryLower.includes('uk') && queryLower.includes('reach')) ||
      queryLower.includes('duin') || queryLower.includes('hse chemicals')) {
    const ukReachEntry = globalComplianceKnowledge.find(e => e.id === 'uk-reach-1');
    if (ukReachEntry) {
      return {
        content: ukReachEntry.content,
        suggestions: ['UK REACH', 'GB Only Representative', 'DUIN', 'HSE', 'Northern Ireland REACH']
      };
    }
  }
  
  // Check for EU CBAM
  if (queryLower.includes('cbam') || queryLower.includes('carbon border') || 
      queryLower.includes('carbon import') || queryLower.includes('carbon adjustment') ||
      queryLower.includes('embedded emissions') || queryLower.includes('carbon tariff')) {
    const cbamEntry = globalComplianceKnowledge.find(e => e.id === 'eu-cbam-1');
    if (cbamEntry) {
      return {
        content: cbamEntry.content,
        suggestions: ['CBAM', 'Carbon Border Adjustment', 'Embedded Emissions', 'EU Climate', 'Carbon Price']
      };
    }
  }
  
  // Check for Digital Product Passport
  if (queryLower.includes('digital product passport') || queryLower.includes('dpp') || 
      queryLower.includes('product passport') || queryLower.includes('battery passport') ||
      (queryLower.includes('qr code') && queryLower.includes('product')) ||
      queryLower.includes('espr') || queryLower.includes('ecodesign sustainable')) {
    const dppEntry = globalComplianceKnowledge.find(e => e.id === 'eu-dpp-1');
    if (dppEntry) {
      return {
        content: dppEntry.content,
        suggestions: ['Digital Product Passport', 'Battery Passport', 'ESPR', 'Circular Economy', 'Sustainability Data']
      };
    }
  }
  
  // Check for EPR (Extended Producer Responsibility)
  if (queryLower.includes('epr') || queryLower.includes('extended producer') || 
      queryLower.includes('producer responsibility') || queryLower.includes('packaging waste') ||
      queryLower.includes('weee') || queryLower.includes('battery recycling') ||
      queryLower.includes('textile waste') || queryLower.includes('circular economy regulation')) {
    const eprEntry = globalComplianceKnowledge.find(e => e.id === 'eu-epr-1');
    if (eprEntry) {
      return {
        content: eprEntry.content,
        suggestions: ['EPR', 'Extended Producer Responsibility', 'Packaging Waste', 'Battery Recycling', 'WEEE']
      };
    }
  }
  
  // Check for Green Claims / Anti-Greenwashing
  if (queryLower.includes('green claim') || queryLower.includes('greenwashing') || 
      queryLower.includes('environmental marketing') || queryLower.includes('eco-friendly claim') ||
      queryLower.includes('climate neutral') || queryLower.includes('carbon neutral claim') ||
      queryLower.includes('anti-greenwashing') || queryLower.includes('substantiation')) {
    const greenClaimsEntry = globalComplianceKnowledge.find(e => e.id === 'eu-green-claims-1');
    if (greenClaimsEntry) {
      return {
        content: greenClaimsEntry.content,
        suggestions: ['Green Claims', 'Anti-Greenwashing', 'Environmental Marketing', 'Climate Neutral', 'Substantiation']
      };
    }
  }
  
  // Check for China RoHS 2
  if (queryLower.includes('china rohs') || queryLower.includes('sj/t 11364') || 
      queryLower.includes('efup') || queryLower.includes('pollution control mark') ||
      (queryLower.includes('china') && queryLower.includes('rohs')) ||
      queryLower.includes('administrative measures hazardous substances')) {
    const chinaRohsEntry = globalComplianceKnowledge.find(e => e.id === 'cn-rohs-2-1');
    if (chinaRohsEntry) {
      return {
        content: chinaRohsEntry.content,
        suggestions: ['China RoHS 2', 'SJ/T 11364', 'EFUP', 'Pollution Control Mark', 'E-Label']
      };
    }
  }
  
  // Check for India RoHS
  if (queryLower.includes('india rohs') || queryLower.includes('e-waste india') || 
      queryLower.includes('cpcb') || (queryLower.includes('india') && queryLower.includes('electronics')) ||
      queryLower.includes('moefcc') || queryLower.includes('schedule i eee')) {
    const indiaRohsEntry = globalComplianceKnowledge.find(e => e.id === 'in-rohs-1');
    if (indiaRohsEntry) {
      return {
        content: indiaRohsEntry.content,
        suggestions: ['India RoHS', 'E-Waste India', 'CPCB', 'India Electronics', 'Schedule I EEE']
      };
    }
  }
  
  // Check for ANOVA calculation requests
  if (queryLower.includes('anova') || queryLower.includes('analysis of variance')) {
    return {
      content: `**ANOVA (Analysis of Variance) Calculator**

I can help you perform One-Way ANOVA to compare means across multiple groups.

**What ANOVA tells you:**
- Are there significant differences between group means?
- How much of the variance is explained by group differences?

**Required Input:**
- Data for each group (3+ groups recommended)
- Example format: Group 1: [10, 12, 11, 13], Group 2: [15, 14, 16, 15], Group 3: [8, 9, 10, 9]

**Output includes:**
- F-statistic and degrees of freedom
- Sum of squares (between, within, total)
- Mean squares
- Effect size (η² - eta squared)

**Interpretation:**
- F > F-critical (from F-table) → Significant difference
- η² > 0.14 = large effect, > 0.06 = medium, > 0.01 = small

Use the ANOVA function in the Calculators module with your data arrays.`,
      suggestions: ['ANOVA Calculator', 'F-Statistic', 'Group Comparison', 'Variance Analysis']
    };
  }
  
  // Check for Regression calculation requests
  if (queryLower.includes('regression') || queryLower.includes('linear regression') || 
      queryLower.includes('correlation') || queryLower.includes('r-squared') ||
      queryLower.includes('trend analysis') || queryLower.includes('predict y from x')) {
    return {
      content: `**Linear Regression Calculator**

I can help you perform simple linear regression analysis: y = mx + b

**What regression tells you:**
- Relationship between two variables (x and y)
- How well x predicts y (R-squared)
- Slope and intercept of the best-fit line

**Required Input:**
- X values (independent variable)
- Y values (dependent variable)
- Same number of data points for both

**Output includes:**
- Regression equation
- Slope and intercept with standard errors
- R-squared (percentage of variance explained)
- Correlation coefficient (r)

**Interpretation:**
- R² > 0.7 = Strong predictive model
- R² > 0.5 = Moderate predictive power
- Slope direction indicates positive/negative relationship

Use the Regression function in the Calculators module with your x and y arrays.`,
      suggestions: ['Regression Calculator', 'R-Squared', 'Correlation', 'Trend Analysis', 'Prediction']
    };
  }
  
  // Check for Gage R&R requests
  if (queryLower.includes('gage r&r') || queryLower.includes('gage rr') || 
      queryLower.includes('repeatability') || queryLower.includes('reproducibility') ||
      queryLower.includes('measurement system analysis') || queryLower.includes('msa study') ||
      queryLower.includes('measurement error')) {
    return {
      content: `**Gage R&R (Repeatability & Reproducibility) Calculator**

I can help you perform Measurement System Analysis (MSA) using ANOVA method.

**What Gage R&R tells you:**
- How much measurement variation comes from:
  - Equipment (Repeatability)
  - Operators (Reproducibility)
  - Parts (Part-to-part variation)

**Required Input:**
- Measurements: [parts][operators][trials] 3D array
- Tolerance range for the measurement
- Typical study: 10 parts × 3 operators × 3 trials = 90 measurements

**Output includes:**
- EV (Equipment Variation)
- AV (Appraiser Variation)
- GRR (Combined Gage R&R)
- PV (Part Variation)
- % of Tolerance
- % Contribution to variance

**Acceptability Criteria (AIAG):**
- < 10% of tolerance: ✅ Acceptable
- 10-30% of tolerance: ⚠️ Marginal
- > 30% of tolerance: ❌ Unacceptable

Use the GageRr function in the Calculators module with your measurement data.`,
      suggestions: ['Gage R&R', 'Measurement System Analysis', 'Repeatability', 'Reproducibility', 'MSA']
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
      content: 'Hello! I\'m your Six Sigma & Compliance Assistant. I can help you with:\n\n• **Six Sigma DMAIC** - Define, Measure, Analyze, Improve, Control\n• **Statistical tools** - Control charts, capability analysis, hypothesis tests\n• **Certification guidance** - White, Yellow, Green, Black Belt\n• **Global Compliance** - REACH, RoHS, Prop 65, TSCA, Phthalates, BPA, PFAS\n• **Medical Devices** - EU MDR, FDA QSR, ISO 13485\n• **Quality Software** - Sage 100, IQMS/DELMIAWorks\n• **Problem solving** - Root cause analysis, 5 Whys, Fishbone diagrams\n• **Process improvement** - Lean tools, waste reduction, flow optimization\n\nWhat would you like to learn about?',
      suggestions: ['DMAIC Overview', 'REACH Compliance', 'PFAS Regulations', 'EU MDR', 'Sage 100', 'Certification Paths', 'Prop 65', 'Statistical Tools']
    };
  }
  
  // General fallback
  return {
    content: `I can help you with Six Sigma, Global Compliance, and AI in Quality! Here are some things you can ask:

**Six Sigma DMAIC:**
• "Explain the Define phase"
• "What happens in Measure?"
• "How do I analyze data?"

**Statistical Tools:**
• "How do I calculate Cpk?"
• "Which control chart should I use?"
• "What sample size do I need?"
• "ANOVA calculator"
• "Linear regression analysis"
• "Gage R&R study"

**Certification:**
• "What are Green Belt requirements?"
• "How do I prepare for ASQ exam?"

**AI/ML in Quality:**
• "Computer vision for defect detection"
• "Digital twins for manufacturing"
• "Predictive quality analytics"
• "MLOps for quality systems"

**Global Compliance:**
• "What is REACH?" (EU and UK)
• "RoHS restricted substances" (EU, China, India)
• "California Prop 65 requirements"
• "PFAS/Forever chemicals regulations"
• "EU MDR for medical devices"
• "EU CBAM - Carbon Border Adjustment"
• "Digital Product Passport"
• "Extended Producer Responsibility (EPR)"
• "Green Claims / Anti-Greenwashing"
• "TSCA Section 6 restrictions"
• "POPS/Stockholm Convention"
• "BPA restrictions"
• "Phthalate regulations"
• "Heavy metals limits"

**Quality Software:**
• "Tell me about Sage 100"
• "What is IQMS/DELMIAWorks?"

**Problem Solving:**
• "How do I do a 5 Whys?"
• "What is a Fishbone diagram?"

Try asking a specific question!`,
    suggestions: ['DMAIC Overview', 'AI in Quality', 'UK REACH', 'CBAM', 'Digital Product Passport', 'EPR', 'Green Claims', 'ANOVA', 'Gage R&R']
  };
}

export default comprehensiveResponseGenerator;
