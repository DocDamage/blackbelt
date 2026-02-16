/**
 * Industry-Specific Six Sigma & Compliance Playbooks
 * 
 * Tailored guidance for implementing Six Sigma in different industries.
 */

export interface IndustryPlaybook {
  id: string;
  industry: string;
  description: string;
  keyStandards: string[];
  typicalProjects: string[];
  criticalMetrics: string[];
  complianceRequirements: string[];
  toolsAndMethods: string[];
  caseStudies: string[];
}

export const industryPlaybooks: IndustryPlaybook[] = [
  {
    id: 'medical-devices',
    industry: 'Medical Devices',
    description: 'Medical device manufacturing requires strict adherence to FDA regulations (21 CFR Part 820) and ISO 13485. Six Sigma helps ensure product safety, efficacy, and compliance while reducing defects that could impact patient health.',
    keyStandards: [
      'FDA 21 CFR Part 820 (Quality System Regulation)',
      'ISO 13485:2016 (Medical Device QMS)',
      'ISO 14971 (Risk Management)',
      'IEC 62304 (Medical Device Software)',
      'FDA 21 CFR Part 11 (Electronic Records)',
      'MDR 2017/745 (EU Medical Device Regulation)'
    ],
    typicalProjects: [
      'Reducing sterilization cycle time while maintaining efficacy',
      'Improving catheter extrusion process yield',
      'Reducing packaging defects and seal failures',
      'Optimizing implant machining tolerances',
      'Reducing software bugs in medical device firmware',
      'Improving supplier quality for critical components'
    ],
    criticalMetrics: [
      'First Pass Yield (Target: >99%)',
      'Defects Per Million Opportunities (DPMO)',
      'Process Capability (Cpk ≥ 1.33 minimum)',
      'Complaint Rate per 1000 units',
      'CAPA Cycle Time',
      'Audit Findings per Area',
      'Supplier PPM (Parts Per Million)',
      'On-Time Delivery'
    ],
    complianceRequirements: [
      'Design Controls (DHF, DMR, DHR documentation)',
      'Risk Management File (ISO 14971)',
      'Biocompatibility Testing (ISO 10993)',
      'Sterilization Validation (ISO 11137)',
      'Packaging Validation (ISO 11607)',
      'Labeling and UDI Requirements',
      'Post-Market Surveillance (MDR Vigilance)',
      'Software Validation (IEC 62304)'
    ],
    toolsAndMethods: [
      'Design FMEA (DFMEA) - Critical for design controls',
      'Process FMEA (PFMEA) - Required for manufacturing',
      'Fault Tree Analysis (FTA)',
      'Hazard Analysis',
      'Statistical Process Control (SPC) with 1.33 Cpk minimum',
      'Measurement System Analysis (MSA)',
      'Design of Experiments (DOE) for process optimization',
      'Risk Priority Number (RPN) tracking',
      'Traceability Matrix',
      'Validation Protocols (IQ/OQ/PQ)'
    ],
    caseStudies: [
      'Stent Manufacturing: Reduced surface defects by 85% using DOE',
      'IVD Reagent Production: Improved batch consistency from 87% to 99.2%',
      'Surgical Instrument Sterilization: Reduced cycle time by 40% while maintaining SAL 10^-6',
      'Catheter Extrusion: Decreased ovality variation by 70%'
    ]
  },
  {
    id: 'automotive',
    industry: 'Automotive',
    description: 'Automotive manufacturing demands high volume, low defect rates, and compliance with IATF 16949. Six Sigma is essential for reducing warranty costs, improving safety-critical component reliability, and meeting OEM customer-specific requirements.',
    keyStandards: [
      'IATF 16949:2016 (Automotive QMS)',
      'AIAG Core Tools (APQP, PPAP, FMEA, MSA, SPC)',
      'VDA 6.3 (Process Audit)',
      'ISO 26262 (Functional Safety)',
      'ASPICE (Software Process)',
      'Customer Specific Requirements (CSR)'
    ],
    typicalProjects: [
      'Reducing engine component machining defects',
      'Improving paint finish quality (orange peel, dirt)',
      'Reducing electronics solder defects (PCB assembly)',
      'Optimizing injection molding cycle time',
      'Improving tire uniformity and balance',
      'Reducing transmission assembly defects'
    ],
    criticalMetrics: [
      'Parts Per Million (PPM) - Target: <25 for critical',
      'Line Stop Rate',
      'First Time Through (FTT)',
      'Overall Equipment Effectiveness (OEE)',
      'Warranty Cost per Vehicle',
      'Field Failure Rate',
      'Scrap and Rework Cost',
      'Dock-to-Dock Time'
    ],
    complianceRequirements: [
      'Advanced Product Quality Planning (APQP)',
      'Production Part Approval Process (PPAP) Levels 1-5',
      'Failure Mode and Effects Analysis (FMEA)',
      'Control Plans (CP)',
      'Measurement System Analysis (MSA)',
      'Statistical Process Control (SPC)',
      '8D Problem Solving for customer complaints',
      'Layered Process Audits (LPA)',
      'Error Proofing (Poka-Yoke)'
    ],
    toolsAndMethods: [
      'APQP (5 phases from planning to production)',
      'PPAP (18 required elements)',
      'FMEA with Action Priority (AP) scoring',
      'SPC with Cpk ≥ 1.67 for critical dimensions',
      'MSA with GRR < 10% for critical',
      '8D Problem Solving',
      '5-Why Analysis',
      'Is/Is Not Analysis',
      '7 Quality Control Tools',
      'Shainin Techniques (Variable Search, Component Swap)'
    ],
    caseStudies: [
      'Engine Block Machining: Reduced bore diameter variation by 60%',
      'Transmission Assembly: Eliminated 99% of misaligned gear defects',
      'Paint Shop: Reduced dirt inclusions from 150 PPM to 8 PPM',
      'PCB Assembly: Decreased solder voids by 85% through DOE'
    ]
  },
  {
    id: 'aerospace',
    industry: 'Aerospace & Defense',
    description: 'Aerospace demands the highest quality and reliability standards. AS9100 and NADCAP requirements combined with Six Sigma ensure airworthiness and mission success. Critical for reducing non-conformance costs and maintaining certification.',
    keyStandards: [
      'AS9100D (Aerospace QMS)',
      'AS9102 (First Article Inspection)',
      'AS9145 (APQP and PPAP)',
      'NADCAP (Special Processes Accreditation)',
      'ISO 10012 (Measurement Management)',
      'MIL-STD-45662 (Calibration)'
    ],
    typicalProjects: [
      'Reducing titanium machining scrap rates',
      'Improving composite layup quality',
      'Reducing fastener installation defects',
      'Optimizing heat treatment processes',
      'Improving coating adhesion (plating, anodizing)',
      'Reducing non-conformance in special processes'
    ],
    criticalMetrics: [
      'Cost of Non-Quality (CONQ)',
      'First Article Inspection (FAI) Pass Rate',
      'Scrap Rate (Target: <0.5%)',
      'Rework Rate',
      'Supplier Quality Performance',
      'On-Time Delivery (OTD)',
      'Escape Rate (defects found by customer)',
      'Audit Score'
    ],
    complianceRequirements: [
      'First Article Inspection (AS9102)',
      'Material and Process Certifications',
      'Special Process Accreditation (NADCAP)',
      'Tooling and Equipment Control',
      'Foreign Object Debris (FOD) Prevention',
      'Configuration Management',
      'Counterfeit Parts Prevention (AS6174)',
      'ITAR/EAR Compliance'
    ],
    toolsAndMethods: [
      'AS9102 First Article Inspection',
      'First Article Inspection Report (FAIR)',
      'Process Failure Modes and Effects Analysis (PFMEA)',
      'Control Plans with SPC',
      'Gauge R&R for CMMs and Special Gauges',
      'Process Capability Studies (Cpk ≥ 1.67)',
      'Source Inspection',
      'Supplier Development Programs',
      'Lean Manufacturing (5S, Visual Management)',
      'Reliability Analysis (Weibull)'
    ],
    caseStudies: [
      'Turbine Blade Machining: Reduced scrap from 12% to 1.5%',
      'Composite Bonding: Improved peel strength consistency by 45%',
      'Special Process Control: Achieved NADCAP accreditation with zero findings',
      'Fastener Installation: Eliminated 99.5% of torque defects'
    ]
  },
  {
    id: 'pharmaceuticals',
    industry: 'Pharmaceuticals & Biotech',
    description: 'Pharmaceutical manufacturing is governed by strict FDA regulations (21 CFR 210/211) and requires validation of all processes. Six Sigma ensures process understanding, reduces batch failures, and maintains regulatory compliance.',
    keyStandards: [
      'FDA 21 CFR Part 210/211 (CGMP)',
      'FDA 21 CFR Part 11 (Electronic Records)',
      'ICH Q7 (API GMP)',
      'ICH Q8/Q9/Q10 (Quality Risk Management)',
      'EU GMP Annex 15 (Qualification and Validation)',
      'ISPE GAMP 5 (Validation Lifecycle)',
      'USP <1058> (Analytical Instrument Qualification)'
    ],
    typicalProjects: [
      'Reducing tablet weight variation',
      'Improving API yield in chemical synthesis',
      'Reducing bioreactor contamination',
      'Optimizing lyophilization cycle time',
      'Improving fill/finish line efficiency',
      'Reducing OOS (Out of Specification) investigations'
    ],
    criticalMetrics: [
      'Right First Time (RFT) Rate (Target: >98%)',
      'Batch Success Rate',
      'OOS Rate (Out of Specification)',
      'OOT Rate (Out of Trend)',
      'Process Capability (Cpk ≥ 1.33 for critical)',
      'Deviation Rate',
      'Change Control Cycle Time',
      'Annual Product Reviews (APR) Findings'
    ],
    complianceRequirements: [
      'Process Validation (PPQ - Process Performance Qualification)',
      'Cleaning Validation',
      'Method Validation (ICH Q2)',
      'Equipment Qualification (IQ/OQ/PQ)',
      'Computer System Validation (CSV)',
      'Annual Product Reviews (APR)',
      'Change Control Management',
      'CAPA and Deviation Management',
      'Environmental Monitoring'
    ],
    toolsAndMethods: [
      'Quality Risk Management (ICH Q9)',
      'Process Analytical Technology (PAT)',
      'Design of Experiments (DOE) for formulation',
      'Multivariate Data Analysis (MVDA)',
      'Statistical Process Control (SPC)',
      'Process Capability Analysis',
      'Continued Process Verification (CPV)',
      'Trend Analysis and Control Charts',
      'Root Cause Analysis (Fishbone, 5 Whys)',
      'Failure Mode Effects Analysis (FMEA)'
    ],
    caseStudies: [
      'Tablet Compression: Reduced weight variation by 70% using DOE',
      'API Synthesis: Improved yield from 82% to 94%',
      'Aseptic Processing: Eliminated contamination events through barrier isolation improvements',
      'Analytical Method: Reduced RSD from 2.5% to 0.8%'
    ]
  },
  {
    id: 'food-beverage',
    industry: 'Food & Beverage',
    description: 'Food manufacturing requires compliance with food safety standards (FSSC 22000, SQF) while maintaining quality and taste consistency. Six Sigma helps reduce waste, improve shelf life, and ensure food safety.',
    keyStandards: [
      'FSSC 22000 (Food Safety System Certification)',
      'SQF (Safe Quality Food)',
      'BRCGS (British Retail Consortium)',
      'IFS (International Featured Standards)',
      'HACCP (Hazard Analysis Critical Control Points)',
      'FSMA (Food Safety Modernization Act)'
    ],
    typicalProjects: [
      'Reducing product weight variation in packaging',
      'Improving mixing uniformity in batch processes',
      'Reducing foreign material contamination',
      'Optimizing baking/cooking uniformity',
      'Improving shelf life through process control',
      'Reducing allergen cross-contact risk'
    ],
    criticalMetrics: [
      'Foreign Material Complaints (Target: 0)',
      'Microbial Test Failures',
      'Fill Weight Accuracy (Cpk)',
      'Process Yield',
      'Giveaway (overfill cost)',
      'Consumer Complaints per Million',
      'Shelf Life Performance',
      'Audit Scores (A, B, C ratings)'
    ],
    complianceRequirements: [
      'HACCP Plan Implementation',
      'Allergen Control Program',
      'Foreign Material Control (X-ray, metal detection)',
      'Sanitation Standard Operating Procedures (SSOPs)',
      'Supplier Approval and Monitoring',
      'Traceability and Recall Procedures',
      'Environmental Monitoring (pathogens)',
      'Labeling Compliance (nutrition, allergens)',
      'Food Defense (Intentional Adulteration)'
    ],
    toolsAndMethods: [
      'HACCP (7 Principles)',
      'Statistical Process Control (SPC)',
      'Process Capability for Fill Weights',
      '5S and Visual Management',
      'Poka-Yoke (Error Proofing)',
      'Total Productive Maintenance (TPM)',
      'Kanban for Material Flow',
      'Root Cause Analysis',
      'Sensory Evaluation Statistics',
      'Shelf Life Modeling (ASLT)'
    ],
    caseStudies: [
      'Packaging Line: Reduced giveaway by 45% ($2M annual savings)',
      'Baking Process: Improved moisture uniformity by 60%',
      'Allergen Control: Zero cross-contact incidents for 24 months',
      'Foreign Material: Reduced customer complaints by 95%'
    ]
  },
  {
    id: 'electronics',
    industry: 'Electronics & Semiconductors',
    description: 'Electronics manufacturing faces rapid technology changes, miniaturization challenges, and strict quality requirements. Six Sigma is critical for improving yields, reducing defects, and ensuring reliability in high-volume production.',
    keyStandards: [
      'IPC-A-610 (Acceptability of Electronics Assemblies)',
      'IPC-J-STD-001 (Requirements for Soldered Assemblies)',
      'ISO 9001 (Quality Management)',
      'TL 9000 (Telecom Quality)',
      'JEDEC Standards (Semiconductor)',
      'MIL-STD-883 (Test Methods)'
    ],
    typicalProjects: [
      'Reducing solder defects (voids, bridging, insufficient)',
      'Improving SMT placement accuracy',
      'Reducing ESD damage',
      'Optimizing reflow profile',
      'Improving PCB cleanliness (ionic contamination)',
      'Reducing component defects in semiconductor fab'
    ],
    criticalMetrics: [
      'First Pass Yield (FPY) - Target: >98%',
      'Defects Per Million Opportunities (DPMO)',
      'Test Coverage',
      'Field Failure Rate (FIT - Failures In Time)',
      'Mean Time Between Failures (MTBF)',
      'Solder Joint Reliability',
      'IPC Class 3 Compliance Rate',
      'Cycle Time'
    ],
    complianceRequirements: [
      'RoHS Compliance (Lead-free soldering)',
      'REACH Substance Restrictions',
      'Conflict Minerals Reporting (3TG)',
      'IPC-A-610 Inspection Standards',
      'ESD Control Program (ANSI/ESD S20.20)',
      'Moisture Sensitivity Level (MSL) Control',
      'Component Traceability',
      'Electromagnetic Compatibility (EMC)'
    ],
    toolsAndMethods: [
      'SPC for Solder Paste Volume',
      'Design of Experiments (DOE) for process optimization',
      'Gauge R&R for AOI/X-ray',
      'Failure Analysis (FA)',
      'Thermal Profiling',
      'Ionic Contamination Testing (ROSE)',
      'X-ray Inspection',
      'Automated Optical Inspection (AOI)',
      'Statistical Yield Analysis',
      'Design for Manufacturing (DFM)',
      'Design for Test (DFT)'
    ],
    caseStudies: [
      'SMT Line: Reduced defects from 500 DPMO to 50 DPMO',
      'Reflow Optimization: Eliminated voids >25% through DOE',
      'Semiconductor Fab: Improved yield by 8% through SPC',
      'BGA Assembly: Reduced bridging by 90% through stencil optimization'
    ]
  }
];

/**
 * Get playbook by industry ID
 */
export function getIndustryPlaybook(industryId: string): IndustryPlaybook | undefined {
  return industryPlaybooks.find(pb => pb.id === industryId);
}

/**
 * Search playbooks by keyword
 */
export function searchIndustryPlaybooks(keyword: string): IndustryPlaybook[] {
  const k = keyword.toLowerCase();
  return industryPlaybooks.filter(pb => 
    pb.industry.toLowerCase().includes(k) ||
    pb.description.toLowerCase().includes(k) ||
    pb.keyStandards.some(s => s.toLowerCase().includes(k)) ||
    pb.typicalProjects.some(p => p.toLowerCase().includes(k))
  );
}

export default industryPlaybooks;
