/**
 * Comprehensive Six Sigma Knowledge Base
 * 
 * An extensive knowledge base covering all aspects of Six Sigma,
 * Lean, statistical methods, certification requirements, and more.
 */

export interface KnowledgeEntry {
  id: string;
  category: string;
  topic: string;
  content: string;
  relatedTopics: string[];
  keywords: string[];
  beltLevel: 'White' | 'Yellow' | 'Green' | 'Black' | 'Master Black' | 'All';
}

// Comprehensive Six Sigma DMAIC Knowledge
const dmaicKnowledge: KnowledgeEntry[] = [
  {
    id: 'define-1',
    category: 'DMAIC',
    topic: 'Define Phase Overview',
    content: `The Define phase is the first step in DMAIC. Key activities:
- Create Project Charter: Problem statement, scope, goals, timeline, team members
- Identify Customers: Internal and external stakeholders
- Define CTQs (Critical to Quality): Voice of Customer translated to measurable requirements
- Map High-Level Process: SIPOC diagram (Suppliers, Inputs, Process, Outputs, Customers)
- Set Project Goals: SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)

Deliverables: Approved project charter, identified customers, CTQ definitions, SIPOC diagram.`,
    relatedTopics: ['Project Charter', 'SIPOC', 'CTQ', 'Voice of Customer'],
    keywords: ['define', 'dmaic', 'project charter', 'scope', 'goals', 'sipoc', 'ctq', 'voice of customer', 'voc'],
    beltLevel: 'White'
  },
  {
    id: 'define-2',
    category: 'DMAIC',
    topic: 'Project Charter',
    content: `A Project Charter is a formal document that authorizes the project. Components:
1. Business Case: Why is this project important?
2. Problem Statement: What is wrong? (data-driven, specific)
3. Project Scope: What's included/excluded (In-Scope, Out-of-Scope)
4. Goals/Objectives: What will be achieved? (measurable targets)
5. Timeline: Major milestones (Define, Measure, Analyze, Improve, Control dates)
6. Team Members: Champion, Sponsor, Belt, Team members, roles
7. Resources: Budget, equipment, software needed
8. Risks: Potential obstacles and mitigation plans

Example Problem Statement: "Customer complaints about late deliveries have increased 40% in Q3 2024, from 50 to 70 per month, affecting 3 major clients."`,
    relatedTopics: ['Define Phase', 'Business Case', 'Problem Statement', 'Scope'],
    keywords: ['project charter', 'business case', 'problem statement', 'scope', 'timeline', 'goals', 'objectives', 'sponsor', 'champion'],
    beltLevel: 'Yellow'
  },
  {
    id: 'define-3',
    category: 'DMAIC',
    topic: 'SIPOC Diagram',
    content: `SIPOC is a high-level process mapping tool. It stands for:
- **S**uppliers: Who provides inputs? (internal/external)
- **I**nputs: What materials, information, resources are needed?
- **P**rocess: What are the 4-7 high-level steps? (verb-noun format)
- **O**utputs: What products/services are created?
- **C**ustomers: Who receives the outputs? (internal/external)

Example for Pizza Delivery:
- Suppliers: Ingredient vendors, POS system vendor
- Inputs: Dough, toppings, orders, delivery addresses
- Process: 1) Receive Order, 2) Prepare Pizza, 3) Bake, 4) Package, 5) Deliver
- Outputs: Pizza, receipt, delivery confirmation
- Customers: Hungry customers, accounting department

Use SIPOC to understand boundaries before detailed process mapping.`,
    relatedTopics: ['Process Mapping', 'Define Phase', 'High-Level Map'],
    keywords: ['sipoc', 'suppliers', 'inputs', 'process', 'outputs', 'customers', 'process mapping', 'high level'],
    beltLevel: 'Yellow'
  },
  {
    id: 'measure-1',
    category: 'DMAIC',
    topic: 'Measure Phase Overview',
    content: `The Measure phase collects data to quantify the problem. Key activities:
- Create Detailed Process Map: Flowchart showing all steps, decisions, handoffs
- Define Metrics: What to measure (defects, time, cost, variation)
- Data Collection Plan: What, where, when, how, who
- Measurement System Analysis (MSA): Ensure data is accurate (Gage R&R)
- Establish Baseline: Current process performance (sigma level, DPMO, Cpk)
- Assess Process Capability: Can the process meet requirements?

Deliverables: Process map, validated measurement system, baseline metrics, capability study.

Key Question: "How is the process performing today, and can we trust the data?"`,
    relatedTopics: ['Process Mapping', 'MSA', 'Gage R&R', 'Process Capability', 'Baseline'],
    keywords: ['measure', 'dmaic', 'process map', 'data collection', 'msa', 'measurement system analysis', 'gage r&r', 'baseline', 'capability'],
    beltLevel: 'Yellow'
  },
  {
    id: 'measure-2',
    category: 'DMAIC',
    topic: 'Data Collection Plan',
    content: `A Data Collection Plan ensures systematic data gathering:

**What to Measure:**
- Y (Output): Primary metric (defect rate, cycle time, cost)
- X (Inputs): Potential causes (temperature, operator, material lot)
- Stratification factors: Time, shift, location, machine

**Where to Collect:**
- Specific process steps, workstations, or locations

**When to Collect:**
- Frequency: Every unit, hourly, daily, weekly
- Duration: 2 weeks, 30 days, until sample size reached
- Time of day: All shifts, specific times

**How to Collect:**
- Manual: Check sheets, forms, counters
- Automated: Sensors, software, MES systems
- Sampling: Random, systematic, stratified

**Who Collects:**
- Operators, inspectors, automatic systems

**Sample Size Calculation:**
Use formula: n = (Z² × σ²) / E²
Where: Z = confidence level (1.96 for 95%), σ = standard deviation, E = margin of error`,
    relatedTopics: ['Measure Phase', 'Sampling', 'Metrics', 'Data Types'],
    keywords: ['data collection', 'sampling', 'sample size', 'stratification', 'metrics', 'y variable', 'x variable', 'check sheet'],
    beltLevel: 'Green'
  },
  {
    id: 'measure-3',
    category: 'DMAIC',
    topic: 'Gage R&R (Repeatability & Reproducibility)',
    content: `Gage R&R evaluates measurement system variation. Components:

**Repeatability (Equipment Variation):**
- Same operator, same part, same setup
- Variation due to the measurement device itself
- Goal: < 10% of total variation (Excellent), < 30% (Acceptable)

**Reproducibility (Operator Variation):**
- Different operators measuring same parts
- Variation due to operator technique, training, interpretation
- Goal: < 10% of total variation

**Study Design:**
- Typical: 3 operators × 10 parts × 3 trials = 90 measurements
- Parts should represent full process range
- Randomize measurement order

**Interpreting Results:**
- %Study Var < 10%: Measurement system acceptable
- %Study Var 10-30%: May be acceptable depending on application
- %Study Var > 30%: Measurement system needs improvement

**Number of Distinct Categories (NDC):**
- NDC ≥ 5: Measurement system can detect part-to-part variation
- NDC < 5: System cannot adequately distinguish parts

**Improvement Actions:**
- Calibrate gages, train operators, standardize procedures, improve fixtures`,
    relatedTopics: ['MSA', 'Measurement System Analysis', 'Variation', 'Calibration'],
    keywords: ['gage r&r', 'repeatability', 'reproducibility', 'msa', 'measurement system', 'ndc', 'distinct categories', 'calibration', 'operator'],
    beltLevel: 'Green'
  },
  {
    id: 'analyze-1',
    category: 'DMAIC',
    topic: 'Analyze Phase Overview',
    content: `The Analyze phase identifies root causes of the problem. Key activities:
- Analyze Process Data: Current performance vs requirements
- Identify Variation Sources: Where does variation come from?
- Root Cause Analysis: 5 Whys, Fishbone (Ishikawa), FMEA
- Hypothesis Testing: Statistical validation of potential causes
- Regression Analysis: Quantify relationships between X and Y
- Identify Vital Few: Pareto analysis to focus on significant factors

Deliverables: Verified root causes, statistical analysis results, prioritized improvement opportunities.

Key Question: "What are the root causes of defects/variation, and how do we know?"`,
    relatedTopics: ['Root Cause Analysis', '5 Whys', 'Fishbone', 'Hypothesis Testing', 'Regression'],
    keywords: ['analyze', 'dmaic', 'root cause', '5 whys', 'fishbone', 'ishikawa', 'fmea', 'hypothesis test', 'pareto', 'regression'],
    beltLevel: 'Green'
  },
  {
    id: 'analyze-2',
    category: 'DMAIC',
    topic: '5 Whys Root Cause Analysis',
    content: `The 5 Whys technique digs deep to find root causes. Process:
1. Write the problem statement
2. Ask "Why does this happen?" Write the answer
3. Ask "Why?" again about that answer
4. Repeat until reaching a fundamental cause (usually 3-7 whys)
5. Verify the root cause with data

**Example: Machine stopped (production line)**
1. Why? Fuse burned out → Why?
2. Why? Not enough lubrication → Why?
3. Why? Oil pump didn't draw enough → Why?
4. Why? Oil pump not primed → Why?
5. Why? No preventive maintenance schedule

**Root Cause:** Lack of PM schedule
**Countermeasure:** Implement PM system

**Tips:**
- Focus on process, not people
- Verify each answer with facts
- Use "5" as guideline, not rule
- Multiple root paths may exist
- Combine with other tools (Fishbone, data analysis)

**When to Use:**
- Simple to moderately complex problems
- Need quick analysis
- Human/operational factors suspected`,
    relatedTopics: ['Root Cause Analysis', 'Fishbone', 'Analyze Phase'],
    keywords: ['5 whys', 'root cause', 'why analysis', 'fishbone', 'cause and effect', 'problem solving'],
    beltLevel: 'Yellow'
  },
  {
    id: 'analyze-3',
    category: 'DMAIC',
    topic: 'Fishbone (Ishikawa) Diagram',
    content: `The Fishbone Diagram organizes potential causes by category.

**Structure:**
- Head: Problem statement (effect)
- Spine: Main arrow pointing to head
- Bones: Categories of causes
- Sub-bones: Specific causes within each category

**Traditional 6M Categories (Manufacturing):**
- **Manpower (People):** Training, skill, fatigue, attitude
- **Method:** Procedures, standards, work instructions
- **Machine:** Equipment, tools, maintenance
- **Material:** Raw materials, components, supplies
- **Measurement:** Gages, inspection, calibration
- **Mother Nature (Environment):** Temperature, humidity, lighting

**4S Categories (Service):**
- **Surroundings:** Environment, location
- **Suppliers:** External inputs
- **Systems:** Processes, procedures
- **Skills:** Training, knowledge

**8P Categories (Service/Admin):**
- **People, Process, Place, Procedures, Policies, Product, Price, Promotion**

**How to Create:**
1. Define problem clearly
2. Draw spine and main bones (categories)
3. Brainstorm causes for each category
4. Ask "Why?" for each cause to go deeper
5. Circle most likely causes
6. Collect data to verify`,
    relatedTopics: ['Root Cause Analysis', 'Brainstorming', '6M', 'Analyze Phase'],
    keywords: ['fishbone', 'ishikawa', 'cause and effect', '6m', '4s', '8p', 'root cause', 'brainstorming', 'categories'],
    beltLevel: 'Yellow'
  },
  {
    id: 'improve-1',
    category: 'DMAIC',
    topic: 'Improve Phase Overview',
    content: `The Improve phase develops and implements solutions. Key activities:
- Generate Solutions: Brainstorm, benchmarking, TRIZ, Design of Experiments
- Evaluate & Select: Criteria matrix, cost-benefit analysis, risk assessment
- Pilot Solutions: Small-scale test before full implementation
- Validate Improvement: Confirm root causes addressed, targets met
- Plan Implementation: Timeline, resources, training, communication
- Design Controls: Ensure changes stick (procedures, mistake-proofing)

Deliverables: Implemented solutions, validated improvements, updated procedures, control plans.

Key Question: "How do we eliminate root causes and achieve our goals?"

**Solution Selection Criteria:**
- Effectiveness: Does it address root cause?
- Feasibility: Can we implement it?
- Cost: Implementation and operating costs
- Risk: Potential negative impacts
- Speed: How quickly can we implement?`,
    relatedTopics: ['Solution Selection', 'Pilot', 'DOE', 'FMEA', 'Mistake-Proofing'],
    keywords: ['improve', 'dmaic', 'solution', 'brainstorm', 'pilot', 'validate', 'implementation', 'design of experiments', 'doe'],
    beltLevel: 'Green'
  },
  {
    id: 'improve-2',
    category: 'DMAIC',
    topic: 'Design of Experiments (DOE)',
    content: `DOE systematically investigates factor effects on output.

**Key Concepts:**
- **Factors (X):** Inputs being studied (temperature, pressure, time)
- **Levels:** Settings for each factor (Low/High, -1/+1)
- **Response (Y):** Output being measured
- **Design:** Combination of factor levels to test
- **Replicates:** Repeat runs to assess variation

**2^k Full Factorial Design:**
- Tests all combinations of k factors at 2 levels each
- 2² = 4 runs, 2³ = 8 runs, 2⁴ = 16 runs
- Can detect main effects and all interactions

**Example: 2³ Design (3 factors)**
Run | A | B | C | Y
---|---|---|---|---
1 | -1 | -1 | -1 | 12
2 | +1 | -1 | -1 | 18
3 | -1 | +1 | -1 | 15
4 | +1 | +1 | -1 | 22
5 | -1 | -1 | +1 | 14
6 | +1 | -1 | +1 | 21
7 | -1 | +1 | +1 | 16
8 | +1 | +1 | +1 | 24

**Fractional Factorial (2^(k-p)):**
- Tests subset of full factorial
- Less runs, confounded interactions
- Good for screening many factors

**Analysis:**
- Main Effects Plot: Average Y at each factor level
- Interaction Plot: Lines parallel = no interaction
- ANOVA: Statistical significance of effects
- Regression Model: Y = β₀ + β₁A + β₂B + β₁₂AB + ε`,
    relatedTopics: ['Improve Phase', 'Factorial Design', 'ANOVA', 'Regression', 'Optimization'],
    keywords: ['doe', 'design of experiments', 'factorial', 'fractional factorial', 'main effect', 'interaction', 'anova', 'levels', 'factors', 'response'],
    beltLevel: 'Black'
  },
  {
    id: 'control-1',
    category: 'DMAIC',
    topic: 'Control Phase Overview',
    content: `The Control phase sustains improvements. Key activities:
- Document New Process: Updated SOPs, work instructions, visual aids
- Implement Monitoring: Control charts, dashboards, audits
- Create Response Plans: What to do when process drifts
- Train Personnel: Ensure everyone knows new process
- Transfer Ownership: Hand off to process owner
- Close Project: Final report, lessons learned, celebrate

Deliverables: Control plan, updated procedures, training completion, monitoring system, closed project.

Key Question: "How do we maintain the gains and prevent backsliding?"

**Control Plan Components:**
1. Process step description
2. Key metrics and specifications
3. Measurement method and frequency
4. Sample size
5. Control method (chart type, dashboard)
6. Responsibility
7. Reaction plan (out-of-control response)`,
    relatedTopics: ['Control Charts', 'SOP', 'Monitoring', 'Control Plan', 'Response Plan'],
    keywords: ['control', 'dmaic', 'control plan', 'control chart', 'monitoring', 'sop', 'standard operating procedure', 'response plan'],
    beltLevel: 'Green'
  },
  {
    id: 'control-2',
    category: 'DMAIC',
    topic: 'Statistical Process Control (SPC)',
    content: `SPC uses control charts to monitor process stability.

**Key Concepts:**
- **Common Cause Variation:** Natural, inherent variation (random)
- **Special Cause Variation:** Assignable, unusual causes (signals)
- **Control Limits:** ±3σ from center line (99.73% of normal data)
- **Specification Limits:** Customer requirements (USL, LSL)

**Control Chart Selection:**
| Data Type | Subgroup Size | Chart |
|-----------|--------------|-------|
| Variable | n=1 | I-MR (Individuals) |
| Variable | n=2-10 | X-bar & R |
| Variable | n>10 | X-bar & S |
| Attribute (defects) | - | c-chart |
| Attribute (defectives) | - | p-chart |
| Attribute (opportunities) | - | u-chart |
| Attribute (constant n) | - | np-chart |

**Control Chart Elements:**
- UCL: Upper Control Limit
- CL: Center Line (average)
- LCL: Lower Control Limit
- Points: Sample statistics

**Out-of-Control Signals:**
1. Point outside UCL/LCL
2. 7 points trending up/down
3. 8 points on same side of center
4. 2 of 3 points in Zone A (outer third)
5. 4 of 5 points in Zone B or beyond
6. 14 points alternating up/down
7. 15 points in Zone C (middle third)

**When to Recalculate Limits:**
- Process change verified
- New equipment/method
- After removing special causes
- Regular schedule (monthly/quarterly)`,
    relatedTopics: ['Control Phase', 'Control Charts', 'Variation', 'Monitoring'],
    keywords: ['spc', 'statistical process control', 'control chart', 'control limits', 'specification limits', 'ucl', 'lcl', 'common cause', 'special cause', 'out of control'],
    beltLevel: 'Green'
  }
];

export default dmaicKnowledge;
