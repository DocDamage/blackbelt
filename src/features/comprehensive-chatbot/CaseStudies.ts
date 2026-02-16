/**
 * Real-World Case Studies Library
 * 
 * Detailed case studies showing DMAIC applications and results.
 */

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  approach: string;
  results: string;
  toolsUsed: string[];
  lessonsLearned: string;
  timeline: string;
  roi: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Reducing Medical Device Sterilization Cycle Time',
    industry: 'Medical Devices',
    challenge: 'Ethylene oxide (EtO) sterilization cycle taking 72 hours, creating inventory backlog and delayed shipments. Target was 48 hours without compromising sterility assurance level (SAL 10^-6).',
    approach: `**Define:**
- Project scope: EtO sterilization process for Class II devices
- CTQ: Cycle time < 48 hours, SAL maintained at 10^-6
- SIPOC mapped for sterilization workflow

**Measure:**
- Baseline: 72 hours average, 15% variance
- MSA on cycle time measurement system
- Process map revealed 8 non-value-add wait steps
- Data collection: 30 cycles over 2 months

**Analyze:**
- Hypothesis testing: Temperature vs. cycle time
- DOE: 2^3 factorial on temperature, humidity, gas concentration
- ANOVA showed humidity was significant factor (p<0.001)
- Regression model: R² = 0.89
- Root cause: Conservative safety margins built into legacy process

**Improve:**
- Optimized EtO concentration: 450mg/L → 600mg/L
- Reduced aeration time through improved ventilation
- Modified load configuration for better gas penetration
- Updated validation protocols (IQ/OQ/PQ)
- Pilotted 5 cycles successfully

**Control:**
- SPC charts for cycle time and biological indicator results
- Updated work instructions
- Operator training on new parameters
- Quarterly reviews of SAL data`,
    results: 'Cycle time reduced from 72 to 46 hours (36% reduction). SAL maintained at 10^-6. Inventory turns improved from 6 to 10 per year. Backlog eliminated.',
    toolsUsed: ['DOE', 'Regression', 'Hypothesis Testing', 'SPC', 'Process Mapping', 'ANOVA'],
    lessonsLearned: 'Legacy processes often have built-in conservatism. Statistical validation allows optimization while maintaining safety. Cross-functional team (sterilization, validation, operations) critical.',
    timeline: '4 months (DMAIC phases)',
    roi: '$450,000 annual savings (inventory carrying cost + expedited shipping)'
  },
  {
    id: 'case-2',
    title: 'Automotive Paint Shop Defect Reduction',
    industry: 'Automotive',
    challenge: 'Paint defects (dirt inclusions, orange peel) running at 320 PPM, customer complaint rate increasing. Target: <50 PPM. Annual cost of defects: $2.8M.',
    approach: `**Define:**
- Defect categories: Dirt (60%), Orange peel (25%), Color match (15%)
- Focus on dirt inclusions (biggest impact per Pareto)
- Project charter with $2M savings target

**Measure:**
- Measurement system study for defect classification
- Baseline: 320 PPM, process capability not calculable (non-normal)
- Data stratified by shift, booth, season
- Fishbone analysis: Man, Machine, Material, Method, Environment

**Analyze:**
- Chi-square test: Shift 2 had significantly higher defects (p=0.03)
- Correlation: Humidity >70% correlated with 40% more defects
- ANOVA: Booth B significantly different from A and C
- 5 Whys on dirt inclusions → booth filtration insufficient

**Improve:**
- Upgraded booth filtration (HEPA filters)
- Installed humidity control system
- Revised cleaning protocol between color changes
- Added tack-off stations before booth entry
- Standardized gun settings across all operators

**Control:**
- Control charts for defects by shift
- Daily 5S audits
- Preventive maintenance schedule for filtration
- Reaction plan for humidity excursions`,
    results: 'Defects reduced from 320 PPM to 28 PPM (91% reduction). Customer complaints eliminated. First pass yield improved from 94.2% to 99.1%.',
    toolsUsed: ['Pareto', 'Fishbone', 'ANOVA', 'Chi-Square', '5 Whys', 'SPC', '5S'],
    lessonsLearned: 'Environmental factors (humidity) were hidden variable. Stratification by shift/booth revealed patterns not visible in aggregate data. Operator involvement in solution design critical for adoption.',
    timeline: '6 months',
    roi: '$2.1M annual savings (rework + scrap reduction)'
  },
  {
    id: 'case-3',
    title: 'Pharmaceutical Tablet Weight Variation',
    industry: 'Pharmaceuticals',
    challenge: 'Tablet weight variation causing content uniformity failures. RSD of 4.5%, USP requirement <6% but internal target <2%. Risk of batch rejection and FDA observation.',
    approach: `**Define:**
- Critical quality attribute: Tablet weight (target 500mg ±5%)
- Batch failure rate: 8% due to content uniformity
- Regulatory risk if trend continues

**Measure:**
- Baseline data: RSD = 4.5%, Cpk = 0.78
- Process mapping of compression operation
- Measurement system analysis (weighing system GRR < 2%)
- Data collection: 50 tablets every 30 minutes, 10 batches

**Analyze:**
- Multi-vari analysis: Within-bottle, bottle-to-bottle, batch-to-batch
- DOE: Full factorial on compression force, speed, pre-compression, fill depth
- Main effects plot showed fill depth most significant
- Interaction: Compression force × speed significant
- Root cause: Powder flow inconsistency affecting fill weight

**Improve:**
- Optimized powder blend flow properties (glidant level)
- Modified hopper design to prevent bridging
- Implemented force feeder with feedback control
- Optimized compression profile using DOE results
- Validation batch: RSD = 1.8%

**Control:**
- NIR real-time monitoring of tablet weight
- SPC chart for weight RSD by batch
- Powder flow testing before compression
- Preventive maintenance on force feeder`,
    results: 'Weight RSD reduced from 4.5% to 1.6% (64% improvement). Cpk improved from 0.78 to 1.85. Batch failures eliminated. Zero FDA observations on subsequent inspections.',
    toolsUsed: ['MSA', 'Multi-vari', 'DOE', 'ANOVA', 'Regression', 'SPC', 'NIR'],
    lessonsLearned: 'Powder properties (physical characteristics) often root cause of tableting issues. Real-time monitoring enables proactive control. DOE approach more effective than one-factor-at-a-time.',
    timeline: '8 months (included validation)',
    roi: '$1.2M (avoided batch rejections + rework savings)'
  },
  {
    id: 'case-4',
    title: 'Aerospace Special Process NADCAP Accreditation',
    industry: 'Aerospace',
    challenge: 'Heat treatment process needed NADCAP accreditation for new aerospace customer contract worth $5M annually. Previous audit had 12 findings. Risk of losing customer.',
    approach: `**Define:**
- Scope: Vacuum heat treatment of titanium components
- Critical processes: Solution treatment, aging, vacuum integrity
- Must achieve zero findings for accreditation

**Measure:**
- Gap analysis against AC7102/5 (Heat Treatment) checklist
- Baseline: 12 findings from previous audit
- Process audit of all heat treat operations
- Pyrometry survey per AMS 2750

**Analyze:**
- Pareto of findings: Documentation (40%), Calibration (30%), Process control (20%), Training (10%)
- Root cause analysis on each finding category
- 5 Whys on documentation gaps → no clear ownership
- Calibration issues traced to inadequate MSA

**Improve:**
- Assigned document owners with quarterly reviews
- Updated all heat treat procedures to current revision
- Implemented new calibration system with alerts
- Pyrometry TUS (Temperature Uniformity Survey) completed
- SAT (System Accuracy Test) schedule established
- Training matrix updated and completed for all operators
- Mock audit conducted with external consultant

**Control:**
- Monthly internal audits using NADCAP checklist
- TUS/SAT schedule tracked in quality calendar
- Quarterly management reviews of heat treat metrics
- Document control system with revision tracking
- Annual surveillance audit ready`,
    results: 'Achieved NADCAP accreditation with zero findings. Contract secured. Process capability demonstrated with all requirements met. Systematic approach now applied to other special processes.',
    toolsUsed: ['Gap Analysis', 'Pareto', '5 Whys', 'Process Audit', 'Pyrometry Survey', 'FMEA'],
    lessonsLearned: 'NADCAP requires system-level thinking, not just fixing individual findings. Pyrometry compliance (AMS 2750) is often the most technical challenge. Mock audits essential for preparation.',
    timeline: '5 months (from gap analysis to accreditation)',
    roi: '$5M annual contract secured + $800K additional contracts from accreditation'
  },
  {
    id: 'case-5',
    title: 'Electronics SMT Solder Void Reduction',
    industry: 'Electronics',
    challenge: 'BGA solder voids averaging 35%, exceeding IPC Class 3 requirement of <25%. X-ray inspection rejecting 15% of boards. Customer complaints increasing.',
    approach: `**Define:**
- CTQ: Solder voids < 25% per ball, < 10% overall
- Focus on BGA256 packages (highest void rate)
- Project scope: Reflow process optimization

**Measure:**
- Baseline: 35% average voids, 15% rejection rate
- X-ray measurement system study (GRR acceptable)
- Data stratified by paste type, profile, stencil design
- Process map of SMT line

**Analyze:**
- DOE: 2^4 factorial on peak temp, time above liquidus, ramp rate, cooling rate
- Main effects: Peak temp and time above liquidus significant
- Interaction: Cooling rate × peak temp
- Regression model: Predicts voids with R² = 0.84
- Root cause: Reflow profile too aggressive, insufficient flux activation

**Improve:**
- Optimized reflow profile using DOE results
- Peak temp: 245°C → 250°C (better wetting)
- Time above liquidus: 60s → 75s (better flux outgassing)
- Slower cooling rate: 3°C/s → 2°C/s (reduce thermal shock)
- Paste volume optimized through stencil aperture redesign
- Nitrogen atmosphere maintained throughout

**Control:**
- SPC chart for void percentage
- Thermal profiling every shift
- X-ray inspection 100% until process stable
- Reaction plan for voids >20%
- Operator training on paste handling`,
    results: 'Voids reduced from 35% to 8% (77% reduction). Rejection rate dropped from 15% to 1.2%. First pass yield improved from 85% to 98.8%. Customer complaints eliminated.',
    toolsUsed: ['DOE', 'Regression', 'SPC', 'GR&R', 'Process Mapping'],
    lessonsLearned: 'Reflow profile optimization requires DOE approach - one-factor changes insufficient. Thermal profiling critical for control. Paste handling and storage often overlooked factors.',
    timeline: '3 months',
    roi: '$680K annual savings (rework + scrap + inspection time)'
  },
  {
    id: 'case-6',
    title: 'Food Packaging Giveaway Reduction',
    industry: 'Food & Beverage',
    challenge: 'Overfilling snack bags to ensure minimum weight compliance. Average giveaway 4.5g per 200g bag (2.25%). Target: <1% giveaway. Annual cost: $3.2M in excess product.',
    approach: `**Define:**
- CTQ: Net weight 200g ± 5g (legal requirement: average ≥ labeled weight)
- Giveaway = Actual weight - Target weight
- Baseline: 4.5g average giveaway, Cpk = 0.95

**Measure:**
- Statistical checkweigher validation
- Baseline: n=5000 bags over 2 weeks
- Multi-vari: Within-head, head-to-head, time-based
- Process capability analysis

**Analyze:**
- Multi-vari showed head #3 consistently overweight
- Time-based variation correlated with product density changes
- ANOVA: Filler head significant factor (p<0.001)
- Root cause: Volumetric filling affected by product density variation

**Improve:**
- Calibrated all filler heads to consistent performance
- Implemented checkweigher feedback control loop
- Added product density measurement with automatic adjustment
- Optimized cutoff timing
- Reduced target weight slightly (within legal limits)
- Validation: 30 days of compliant weights

**Control:**
- Real-time checkweigher SPC
- Hourly weight checks logged
- Automatic stop if 3 consecutive underweights
- Weekly calibration verification
- Quarterly process capability study`,
    results: 'Giveaway reduced from 4.5g (2.25%) to 1.2g (0.6%) per bag. Cpk improved from 0.95 to 1.67. Zero underweight violations. Annual savings $2.1M in product cost.',
    toolsUsed: ['Process Capability', 'Multi-vari', 'ANOVA', 'SPC', 'Control Charts', 'Gage R&R'],
    lessonsLearned: 'Legal minimum weights allow optimization within tolerance. Checkweigher feedback control enables real-time adjustment. Product characteristics (density) must be monitored.',
    timeline: '4 months',
    roi: '$2.1M annual savings in product giveaway'
  }
];

/**
 * Search case studies by industry or keyword
 */
export function searchCaseStudies(keyword: string): CaseStudy[] {
  const k = keyword.toLowerCase();
  return caseStudies.filter(cs => 
    cs.industry.toLowerCase().includes(k) ||
    cs.title.toLowerCase().includes(k) ||
    cs.toolsUsed.some(t => t.toLowerCase().includes(k)) ||
    cs.challenge.toLowerCase().includes(k)
  );
}

/**
 * Get case study by ID
 */
export function getCaseStudy(id: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.id === id);
}

export default caseStudies;
