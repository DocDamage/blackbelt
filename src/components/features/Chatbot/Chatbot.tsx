import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

// Import all module content for knowledge base
import { whiteBeltModules } from '../../../content/whiteBelt/modules';
import { yellowBeltModules } from '../../../content/yellowBelt/modules';
import { greenBeltModules } from '../../../content/greenBelt/modules';
import { blackBeltModules } from '../../../content/blackBelt/modules';
import { masterBlackBeltModules } from '../../../content/masterBlackBelt/modules';
import { searchEchaSubstances, getSubstanceStats } from '../../../content/compliance/echaData';

// ==================== CALCULATOR FUNCTIONS ====================

// Cpk Calculator
function calculateCpk(usl: number, lsl: number, mean: number, stddev: number): { cpk: number; cpu: number; cpl: number; cp: number } {
    const cpu = (usl - mean) / (3 * stddev);
    const cpl = (mean - lsl) / (3 * stddev);
    const cpk = Math.min(cpu, cpl);
    const cp = (usl - lsl) / (6 * stddev);
    return { cpk: Math.round(cpk * 1000) / 1000, cpu: Math.round(cpu * 1000) / 1000, cpl: Math.round(cpl * 1000) / 1000, cp: Math.round(cp * 1000) / 1000 };
}


// Sample Size Calculator for Mean (exported for future use)
export function calculateSampleSizeMean(zValue: number, sigma: number, marginOfError: number): number {
    return Math.ceil(Math.pow((zValue * sigma) / marginOfError, 2));
}

// Sample Size Calculator for Proportion (exported for future use)
export function calculateSampleSizeProp(zValue: number, p: number, marginOfError: number): number {
    return Math.ceil(p * (1 - p) * Math.pow(zValue / marginOfError, 2));
}

// Control Chart Limits (Xbar-R)
function calculateXbarRLimits(xbarbar: number, rbar: number, n: number): { xbarUCL: number; xbarLCL: number; rUCL: number; rLCL: number } {
    const a2 = [0, 0, 1.880, 1.023, 0.729, 0.577, 0.483, 0.419, 0.373, 0.337, 0.308][n] || 0.308;
    const d4 = [0, 0, 3.267, 2.574, 2.282, 2.114, 2.004, 1.924, 1.864, 1.816, 1.777][n] || 1.777;
    const d3 = n <= 6 ? 0 : [0, 0, 0, 0, 0, 0, 0, 0.076, 0.136, 0.184, 0.223][n] || 0.223;

    return {
        xbarUCL: Math.round((xbarbar + a2 * rbar) * 1000) / 1000,
        xbarLCL: Math.round((xbarbar - a2 * rbar) * 1000) / 1000,
        rUCL: Math.round((d4 * rbar) * 1000) / 1000,
        rLCL: Math.round((d3 * rbar) * 1000) / 1000
    };
}

// DPMO and Sigma Level
function calculateDPMO(defects: number, units: number, opportunities: number): { dpo: number; dpmo: number; sigma: number; yield: number } {
    const dpo = defects / (units * opportunities);
    const dpmo = dpo * 1000000;
    // Approximate sigma level from DPMO (with 1.5 shift)
    let sigma = 6;
    if (dpmo >= 308537) sigma = 2;
    else if (dpmo >= 66807) sigma = 3;
    else if (dpmo >= 6210) sigma = 4;
    else if (dpmo >= 233) sigma = 5;
    else if (dpmo >= 3.4) sigma = 6;
    const yieldPct = (1 - dpo) * 100;

    return { dpo: Math.round(dpo * 1000000) / 1000000, dpmo: Math.round(dpmo), sigma, yield: Math.round(yieldPct * 100) / 100 };
}

// T-statistic Calculator
function calculateTStat(mean1: number, mean2: number, s1: number, s2: number, n1: number, n2: number): { t: number; df: number; pooledVar: number } {
    const pooledVar = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
    const se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
    const t = (mean1 - mean2) / se;
    return { t: Math.round(t * 1000) / 1000, df: n1 + n2 - 2, pooledVar: Math.round(pooledVar * 1000) / 1000 };
}

// Excel Formula Generator (exported for future use)
export function generateExcelFormula(type: string, params: Record<string, string>): string {
    switch (type) {
        case 'cpk':
            return `=MIN((${params.usl}-AVERAGE(${params.data}))/(3*STDEV.S(${params.data})),(AVERAGE(${params.data})-${params.lsl})/(3*STDEV.S(${params.data})))`;
        case 'ttest':
            return `=T.TEST(${params.range1},${params.range2},2,2)`;
        case 'mean':
            return `=AVERAGE(${params.data})`;
        case 'stdev':
            return `=STDEV.S(${params.data})`;
        case 'confidence':
            return `=CONFIDENCE.T(${params.alpha},STDEV.S(${params.data}),COUNT(${params.data}))`;
        case 'xbar_ucl':
            return `=${params.xbarbar}+${params.a2}*${params.rbar}`;
        case 'xbar_lcl':
            return `=${params.xbarbar}-${params.a2}*${params.rbar}`;
        default:
            return 'Formula not found';
    }
}

// Parse calculation request
function parseCalculation(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // Cpk calculation: "calculate cpk usl=10 lsl=2 mean=6 stddev=1"
    const cpkMatch = query.match(/cpk.*usl[=:\s]*([\d.]+).*lsl[=:\s]*([\d.]+).*mean[=:\s]*([\d.]+).*(stddev|std|stdev|sigma|s)[=:\s]*([\d.]+)/i);
    if (cpkMatch || lowerQuery.includes('cpk')) {
        if (cpkMatch) {
            const usl = parseFloat(cpkMatch[1]);
            const lsl = parseFloat(cpkMatch[2]);
            const mean = parseFloat(cpkMatch[3]);
            const stddev = parseFloat(cpkMatch[5]);
            const result = calculateCpk(usl, lsl, mean, stddev);

            const excelFormula = generateExcelFormula('cpk', { usl: usl.toString(), lsl: lsl.toString(), data: 'data' });
            return `**📊 Capability Analysis Results**

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Cp | ${result.cp} | ${result.cp >= 1.33 ? '✅ Capable' : result.cp >= 1.0 ? '⚠️ Marginal' : '❌ Not Capable'} |
| Cpk | ${result.cpk} | ${result.cpk >= 1.33 ? '✅ Capable & Centered' : result.cpk >= 1.0 ? '⚠️ Marginal' : '❌ Needs Improvement'} |
| Cpu (upper) | ${result.cpu} | Distance to USL |
| Cpl (lower) | ${result.cpl} | Distance to LSL |

**Inputs:** USL=${usl}, LSL=${lsl}, Mean=${mean}, StdDev=${stddev}

**Excel Formula:**
\`\`\`excel
${excelFormula}
\`\`\``;
        } else {
            return `**Cpk Calculator** - Provide values like:
\`calculate cpk usl=10 lsl=2 mean=6 stddev=1\`

Or use this Excel formula:
\`=MIN((USL-AVERAGE(data))/(3*STDEV.S(data)),(AVERAGE(data)-LSL)/(3*STDEV.S(data)))\``;
        }
    }

    // Generic Excel Formula Request
    const excelMatch = query.match(/excel\s+formula\s+(?:for\s+)?([a-z0-9_\s]+)/i);
    if (excelMatch && !lowerQuery.includes('calculate')) {
        const type = excelMatch[1].trim().toLowerCase().replace(/\s+/g, '_');
        const knownTypes: Record<string, string> = {
            'mean': 'mean',
            'average': 'mean',
            'stdev': 'stdev',
            'standard_deviation': 'stdev',
            'cpk': 'cpk',
            'ttest': 'ttest',
            't_test': 'ttest',
            'confidence': 'confidence',
            'confidence_interval': 'confidence'
        };

        const mappedType = knownTypes[type];
        if (mappedType) {
            // Create dummy params for the explanation
            const dummyParams: Record<string, string> = {
                data: 'A1:A10',
                range1: 'A1:A10',
                range2: 'B1:B10',
                usl: 'USL',
                lsl: 'LSL',
                alpha: '0.05',
                xbarbar: 'Mean',
                rbar: 'Range',
                a2: 'A2'
            };

            return `**Excel Formula for ${type.replace(/_/g, ' ')}:**
\`\`\`excel
${generateExcelFormula(mappedType, dummyParams)}
\`\`\``;
        }
    }

    // Sample size calculation
    // Match "sample size" AND ("mean" OR "prop") OR specific params
    const isSampleCalc = lowerQuery.includes('sample size') || lowerQuery.includes('how many samples');

    if (isSampleCalc) {
        const confMatch = query.match(/(?:confidence|conf)[=:\s]*([\d.]+)/i);
        const errorMatch = query.match(/(?:margin|error|e)[=:\s]*([\d.]+)/i);

        // If we have parameters, try to calculate
        if (confMatch || errorMatch) {
            const conf = confMatch ? parseFloat(confMatch[1]) : 95; // Default 95%
            const margin = errorMatch ? parseFloat(errorMatch[1]) : 0;

            if (margin > 0) {
                const z = conf >= 99 || conf >= 0.99 ? 2.576 : conf >= 95 || conf >= 0.95 ? 1.96 : 1.645;
                const displayConf = conf > 1 ? conf : conf * 100;

                // Check type
                const sigmaMatch = query.match(/sigma[=:\s]*([\d.]+)/i);
                const sigma = sigmaMatch ? parseFloat(sigmaMatch[1]) : null;
                const isMean = lowerQuery.includes('mean') || sigma !== null;

                if (isMean) {
                    // Assume sigma=1 if mean specified but no sigma given, or prompt user?
                    // Let's prompt if sigma missing for mean
                    if (sigma === null) {
                        return `**Sample Size (Mean)** requires a standard deviation. Try:
\`sample size mean sigma=5 error=1\``;
                    }

                    const n = calculateSampleSizeMean(z, sigma, margin);
                    return `**📊 Sample Size Calculation (Mean)**

| Parameter | Value |
|-----------|-------|
| Confidence Level | ${displayConf}% |
| Margin of Error | ±${margin} |
| Standard Deviation (σ) | ${sigma} |
| Z-value | ${z} |
| **Required n** | **${n}** |

**Excel Formula:**
\`=CEILING((${z}*${sigma}/${margin})^2,1)\``;
                } else {
                    const pMatch = query.match(/p[=:\s]*([\d.]+)/i);
                    const p = pMatch ? parseFloat(pMatch[1]) : 0.5;

                    const n = calculateSampleSizeProp(z, p, margin);
                    return `**📊 Sample Size Calculation (Proportion)**

| Parameter | Value |
|-----------|-------|
| Confidence Level | ${displayConf}% |
| Margin of Error | ±${margin} |
| Estimated Proportion (p) | ${p} |
| Z-value | ${z} |
| **Required n** | **${n}** |

${p === 0.5 ? '*Using p=0.5 for maximum sample size (conservative estimate)*' : ''}

**Excel Formula:**
\`=CEILING(${p}*(1-${p})*(${z}/${margin})^2,1)\``;
                }
            }
        }

        // Return help text if no valid params found
        return `**Sample Size Calculator** - Try these:
• Mean: \`sample size mean sigma=5 error=1\`
• Proportion: \`sample size error=0.05 p=0.5\``;
    }

    // Control chart limits
    const controlMatch = query.match(/control.*xbar[=:\s]*([\d.]+).*rbar[=:\s]*([\d.]+).*n[=:\s]*([\d]+)/i);
    if (controlMatch || (lowerQuery.includes('control') && lowerQuery.includes('limit'))) {
        if (controlMatch) {
            const xbarbar = parseFloat(controlMatch[1]);
            const rbar = parseFloat(controlMatch[2]);
            const n = parseInt(controlMatch[3]);
            const limits = calculateXbarRLimits(xbarbar, rbar, n);
            return `**📊 X-bar R Chart Control Limits** (n=${n})

| Chart | UCL | Center | LCL |
|-------|-----|--------|-----|
| X-bar | ${limits.xbarUCL} | ${xbarbar} | ${limits.xbarLCL} |
| R | ${limits.rUCL} | ${rbar} | ${limits.rLCL} |

**Excel Formulas:**
\`\`\`excel
X-bar UCL: ${generateExcelFormula('xbar_ucl', { xbarbar: xbarbar.toString(), a2: 'A2', rbar: rbar.toString() })}
X-bar LCL: ${generateExcelFormula('xbar_lcl', { xbarbar: xbarbar.toString(), a2: 'A2', rbar: rbar.toString() })}
R UCL: =D4*${rbar}
R LCL: =D3*${rbar}
\`\`\``;
        } else {
            return `**Control Chart Calculator** - Provide values like:
\`control chart xbar=50 rbar=4 n=5\``;
        }
    }

    // DPMO calculation
    const dpmoMatch = query.match(/dpmo.*defects[=:\s]*([\d]+).*units[=:\s]*([\d]+).*opp[portunities]*[=:\s]*([\d]+)/i);
    if (dpmoMatch || lowerQuery.includes('dpmo')) {
        if (dpmoMatch) {
            const defects = parseInt(dpmoMatch[1]);
            const units = parseInt(dpmoMatch[2]);
            const opp = parseInt(dpmoMatch[3]);
            const result = calculateDPMO(defects, units, opp);
            return `**📊 DPMO & Sigma Level**

| Metric | Value |
|--------|-------|
| Defects | ${defects} |
| Units | ${units} |
| Opportunities/Unit | ${opp} |
| DPO | ${result.dpo} |
| **DPMO** | **${result.dpmo}** |
| **Sigma Level** | **${result.sigma}σ** |
| Yield | ${result.yield}% |

**Excel Formulas:**
\`\`\`excel
DPO: =${defects}/(${units}*${opp})
DPMO: =DPO*1000000
\`\`\``;
        } else {
            return `**DPMO Calculator** - Provide values like:
\`dpmo defects=15 units=1000 opportunities=5\``;
        }
    }

    // T-test calculation
    const ttestMatch = query.match(/t-?test.*mean1[=:\s]*([\d.]+).*mean2[=:\s]*([\d.]+).*s1[=:\s]*([\d.]+).*s2[=:\s]*([\d.]+).*n1[=:\s]*([\d]+).*n2[=:\s]*([\d]+)/i);
    if (ttestMatch) {
        const mean1 = parseFloat(ttestMatch[1]);
        const mean2 = parseFloat(ttestMatch[2]);
        const s1 = parseFloat(ttestMatch[3]);
        const s2 = parseFloat(ttestMatch[4]);
        const n1 = parseInt(ttestMatch[5]);
        const n2 = parseInt(ttestMatch[6]);
        const result = calculateTStat(mean1, mean2, s1, s2, n1, n2);
        const significant = Math.abs(result.t) > 2.0;
        return `**📊 Two-Sample T-Test Results**

| Statistic | Value |
|-----------|-------|
| t-statistic | ${result.t} |
| Degrees of freedom | ${result.df} |
| Pooled Variance | ${result.pooledVar} |
| **Significant?** | ${significant ? '✅ Yes (|t| > 2)' : '❌ No (|t| ≤ 2)'} |

*Compare to t-critical for exact α level*

**Excel Formula:**
\`=T.TEST(range1,range2,2,2)\``;
    }

    return null;
}

// Excel file processing
import * as XLSX from 'xlsx';

interface UploadedData {
    filename: string;
    sheets: {
        name: string;
        data: Record<string, unknown>[];
        columns: string[];
        stats?: Record<string, { mean: number; stddev: number; min: number; max: number; count: number }>;
    }[];
}

function processExcelFile(file: File): Promise<UploadedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheets = workbook.SheetNames.map(name => {
                    const sheet = workbook.Sheets[name];
                    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
                    const columns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

                    // Calculate basic stats for numeric columns
                    const stats: Record<string, { mean: number; stddev: number; min: number; max: number; count: number }> = {};
                    columns.forEach(col => {
                        const values = jsonData
                            .map(row => row[col])
                            .filter(v => typeof v === 'number') as number[];

                        if (values.length > 0) {
                            const count = values.length;
                            const mean = values.reduce((a, b) => a + b, 0) / count;
                            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (count - 1);
                            const stddev = Math.sqrt(variance);
                            const min = Math.min(...values);
                            const max = Math.max(...values);
                            stats[col] = {
                                mean: Math.round(mean * 1000) / 1000,
                                stddev: Math.round(stddev * 1000) / 1000,
                                min,
                                max,
                                count
                            };
                        }
                    });

                    return { name, data: jsonData, columns, stats };
                });

                resolve({ filename: file.name, sheets });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function formatUploadedDataSummary(data: UploadedData): string {
    let summary = `**📁 Uploaded: ${data.filename}**\n\n`;

    data.sheets.forEach(sheet => {
        summary += `### Sheet: ${sheet.name}\n`;
        summary += `- **Rows:** ${sheet.data.length}\n`;
        summary += `- **Columns:** ${sheet.columns.join(', ')}\n\n`;

        if (sheet.stats && Object.keys(sheet.stats).length > 0) {
            summary += `**Numeric Column Statistics:**\n`;
            summary += `| Column | Count | Mean | Std Dev | Min | Max |\n`;
            summary += `|--------|-------|------|---------|-----|-----|\n`;

            Object.entries(sheet.stats).forEach(([col, s]) => {
                summary += `| ${col} | ${s.count} | ${s.mean} | ${s.stddev} | ${s.min} | ${s.max} |\n`;
            });
            summary += '\n';
        }
    });

    summary += `\n**You can now ask:**\n`;
    summary += `- "Calculate Cpk for [column name]"\n`;
    summary += `- "What's the mean of [column name]"\n`;
    summary += `- "Analyze [column name]"\n`;

    return summary;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

// Build knowledge base from all modules
function buildKnowledgeBase() {
    const allModules = [
        { belt: 'White Belt', modules: whiteBeltModules },
        { belt: 'Yellow Belt', modules: yellowBeltModules },
        { belt: 'Green Belt', modules: greenBeltModules },
        { belt: 'Black Belt', modules: blackBeltModules },
        { belt: 'Master Black Belt', modules: masterBlackBeltModules },
    ];

    const knowledge: { topic: string; belt: string; content: string; keywords: string[] }[] = [];

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

    // Add REACH Compliance Knowledge
    const complianceTopics = [
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
    const leanTopics = [
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
    const templateTopics = [
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
    const industryTopics = [
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
    const advancedStats = [
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
    const certificationTopics = [
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

    knowledge.push(...complianceTopics);
    knowledge.push(...leanTopics);
    knowledge.push(...templateTopics);
    knowledge.push(...industryTopics);
    knowledge.push(...advancedStats);
    knowledge.push(...certificationTopics);

    return knowledge;
}

function extractKeywords(text: string): string[] {
    const stopWords = new Set([
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

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word))
        .filter((word, index, self) => self.indexOf(word) === index);
}

function searchKnowledge(query: string, knowledge: ReturnType<typeof buildKnowledgeBase>): typeof knowledge {
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

function generateResponse(query: string, knowledge: ReturnType<typeof buildKnowledgeBase>): string {
    const lowerQuery = query.toLowerCase();

    // Try calculation first
    const calcResult = parseCalculation(query);
    if (calcResult) {
        return calcResult;
    }

    // Handle greetings
    if (lowerQuery.match(/^(hi|hello|hey|greetings)/)) {
        const stats = getSubstanceStats();
        return `Hello! 👋 I'm your Six Sigma & Compliance Assistant. I can help you with:

• **Belt training** - White through Master Black Belt
• **Calculations** - Cpk, DPMO, t-tests, control limits
• **Excel formulas** - Copy-paste ready formulas
• **REACH compliance** - ${stats.total} SVHC substances

**Try these calculators:**
• \`cpk usl=10 lsl=2 mean=6 stddev=1\`
• \`dpmo defects=15 units=1000 opportunities=5\`
• \`control chart xbar=50 rbar=4 n=5\`
• \`t-test mean1=45 mean2=42 s1=3 s2=4 n1=25 n2=30\`

What would you like to calculate or learn about?`;
    }

    // Handle equation sheet request
    if (lowerQuery.includes('equation') || lowerQuery.includes('formula sheet') || lowerQuery.includes('cheat sheet')) {
        return `**📋 Black Belt Equation Quick Reference**

**Process Capability:**
\`\`\`
Cp = (USL - LSL) / 6σ
Cpk = min[(USL - μ)/3σ, (μ - LSL)/3σ]
\`\`\`

**DPMO & Sigma:**
\`\`\`
DPO = Defects / (Units × Opportunities)
DPMO = DPO × 1,000,000
\`\`\`

**Hypothesis Testing:**
\`\`\`
t = (x̄ - μ₀) / (s / √n)
Z = (x̄ - μ₀) / (σ / √n)
\`\`\`

**Regression:**
\`\`\`
ŷ = b₀ + b₁x
R² = SSR/SST = 1 - SSE/SST
t = Coef / SE(Coef)
\`\`\`

**Control Charts (X-bar R):**
\`\`\`
UCL = X̿ + A₂R̄
LCL = X̿ - A₂R̄
\`\`\`

*Ask me to calculate any of these! Example: "cpk usl=10 lsl=2 mean=6 stddev=1"*`;
    }

    // Handle Excel formulas request
    if (lowerQuery.includes('excel') || lowerQuery.includes('spreadsheet')) {
        return `**📊 Excel Formulas for Six Sigma**

**Descriptive Statistics:**
\`\`\`excel
Mean:     =AVERAGE(A1:A100)
Std Dev:  =STDEV.S(A1:A100)
Variance: =VAR.S(A1:A100)
\`\`\`

**Process Capability:**
\`\`\`excel
Cp:  =(USL-LSL)/(6*STDEV.S(data))
Cpk: =MIN((USL-AVERAGE(data))/(3*STDEV.S(data)),
         (AVERAGE(data)-LSL)/(3*STDEV.S(data)))
\`\`\`

**Hypothesis Testing:**
\`\`\`excel
T-Test (p-value): =T.TEST(range1,range2,2,2)
Confidence Int:   =CONFIDENCE.T(0.05,STDEV.S(data),COUNT(data))
\`\`\`

**Control Charts:**
\`\`\`excel
X-bar UCL: =Xbar + A2*Rbar
X-bar LCL: =Xbar - A2*Rbar
R UCL:     =D4*Rbar
\`\`\`

**DPMO:**
\`\`\`excel
DPO:  =Defects/(Units*Opportunities)
DPMO: =DPO*1000000
\`\`\`

*Copy-paste ready! Replace cell references with your data ranges.*`;
    }

    // Handle C&E Matrix / Cause-and-Effect questions
    if (lowerQuery.includes('cause') && lowerQuery.includes('effect') || lowerQuery.includes('c&e') || lowerQuery.includes('x-y matrix') || lowerQuery.includes('kpiv')) {
        return `**📊 Cause-and-Effect Matrix (C&E / X-Y Matrix)**

The C&E Matrix prioritizes process inputs (Xs) based on their impact on customer outputs (Ys).

**How It Works:**
1. List Outputs (Ys) and weight by customer importance (1-10)
2. List Inputs (Xs) that might affect outputs
3. Score correlations (0=none, 1=low, 3=moderate, 9=high)
4. Calculate: Total = Σ(Importance × Correlation)
5. Rank inputs → Focus on highest = **KPIVs**

**Example:**
|  | Y1 (Imp=9) | Y2 (Imp=7) | Total |
|--|------------|------------|-------|
| X1: Speed | 9 | 3 | 9×9 + 7×3 = **102** |
| X2: Temp | 3 | 9 | 9×3 + 7×9 = **90** |

**Excel Formula:**
\`=SUMPRODUCT($B$2:$D$2,B3:D3)\`

**KPIVs** (Key Process Input Variables) go into:
• FMEA for failure mode analysis
• DOE as experimental factors
• Control Plan for monitoring`;
    }

    // Handle Python code requests
    if (lowerQuery.includes('python') && (lowerQuery.includes('code') || lowerQuery.includes('script'))) {
        if (lowerQuery.includes('doe') || lowerQuery.includes('experiment')) {
            return `**🐍 Python DOE Code**

\`\`\`python
import pyDOE2 as doe
import pandas as pd
import statsmodels.formula.api as smf

# Create 2^3 full factorial design
design = doe.ff2n(3)
df = pd.DataFrame(design, columns=['A', 'B', 'C'])

# Map coded levels to actual values
df['Temp'] = df['A'].map({-1: 150, 1: 200})
df['Pressure'] = df['B'].map({-1: 10, 1: 30})
df['Time'] = df['C'].map({-1: 5, 1: 15})

# After experiments, add response
df['Response'] = [78, 85, 82, 91, 80, 88, 84, 95]

# Analyze with full model
model = smf.ols('Response ~ A*B*C', data=df).fit()
print(model.summary())

# Effect sizes (2x coded coefficients)
effects = model.params[1:] * 2
print(effects.sort_values(ascending=False))
\`\`\`

**Install:** \`pip install pyDOE2 pandas statsmodels\``;
        }
        if (lowerQuery.includes('regression')) {
            return `**🐍 Python Regression Code**

\`\`\`python
import pandas as pd
import statsmodels.formula.api as smf
import matplotlib.pyplot as plt
from scipy import stats

# Load data
df = pd.read_excel('your_data.xlsx')

# Multiple regression
model = smf.ols('Response ~ Temp + Pressure + Speed', data=df).fit()
print(model.summary())

# Coefficients & p-values
print("\\nCoefficients:", model.params)
print("\\nP-values:", model.pvalues)
print("\\nR-squared:", model.rsquared)

# Residual plots
fig, axes = plt.subplots(2, 2, figsize=(10, 8))
axes[0,0].scatter(model.fittedvalues, model.resid)
axes[0,0].axhline(0, color='r', ls='--')
axes[0,0].set_title('Residuals vs Fitted')
stats.probplot(model.resid, plot=axes[0,1])
plt.tight_layout()
plt.savefig('residuals.png')
\`\`\`

**Install:** \`pip install pandas statsmodels matplotlib scipy\``;
        }
        if (lowerQuery.includes('control') || lowerQuery.includes('spc') || lowerQuery.includes('chart')) {
            return `**🐍 Python Control Chart Code**

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

def xbar_r_chart(data, n=5):
    """X-bar and R control charts"""
    subgroups = data.reshape(-1, n)
    xbar = subgroups.mean(axis=1)
    R = subgroups.ptp(axis=1)
    
    xbar_bar, r_bar = xbar.mean(), R.mean()
    
    # Constants for n=5
    A2, D3, D4 = 0.577, 0, 2.114
    
    # Limits
    ucl = xbar_bar + A2 * r_bar
    lcl = xbar_bar - A2 * r_bar
    
    # Plot
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
    ax1.plot(xbar, 'bo-')
    ax1.axhline(xbar_bar, color='g')
    ax1.axhline(ucl, color='r', ls='--')
    ax1.axhline(lcl, color='r', ls='--')
    ax1.set_title(f'X-bar Chart (UCL={ucl:.2f}, LCL={lcl:.2f})')
    
    ax2.plot(R, 'bo-')
    ax2.axhline(r_bar, color='g')
    ax2.axhline(D4*r_bar, color='r', ls='--')
    ax2.set_title('R Chart')
    plt.tight_layout()
    plt.savefig('control_chart.png')

# Usage
data = np.array([...])  # Your measurements
xbar_r_chart(data, n=5)
\`\`\``;
        }
        // Generic Python response
        return `**🐍 Python for Six Sigma**

Available code templates:
• \`python doe code\` - Design of Experiments
• \`python regression code\` - Linear/Multiple Regression
• \`python control chart code\` - SPC Charts
• \`python cpk code\` - Process Capability

**Quick Install:**
\`\`\`bash
pip install pandas numpy scipy statsmodels matplotlib pyDOE2
\`\`\``;
    }

    // Handle R code requests
    if (lowerQuery.includes(' r ') && (lowerQuery.includes('code') || lowerQuery.includes('script')) || lowerQuery.includes('r code')) {
        if (lowerQuery.includes('doe') || lowerQuery.includes('experiment')) {
            return `**📊 R DOE Code**

\`\`\`r
library(FrF2)

# 2^3 Full factorial design
design <- FrF2(nruns = 8, nfactors = 3,
               factor.names = c("Temp", "Pressure", "Time"))

# Add response data
design$Response <- c(78, 85, 82, 91, 80, 88, 84, 95)

# Analyze
model <- lm(Response ~ Temp * Pressure * Time, data = design)
summary(model)

# Effect plot
effects <- 2 * coef(model)[-1]
barplot(sort(effects), horiz=TRUE, las=1)
\`\`\`

**Install:** \`install.packages("FrF2")\``;
        }
        if (lowerQuery.includes('control') || lowerQuery.includes('spc')) {
            return `**📊 R Control Chart Code**

\`\`\`r
library(qcc)

# X-bar R chart (subgroups of 5)
data_matrix <- matrix(your_data, ncol=5, byrow=TRUE)
qcc(data_matrix, type="xbar", title="X-bar Chart")
qcc(data_matrix, type="R", title="R Chart")

# Individuals chart
qcc(your_data, type="xbar.one", title="I-MR Chart")

# Process capability
pc <- process.capability(
  qcc(data_matrix, type="xbar", plot=FALSE),
  spec.limits = c(LSL, USL)
)
\`\`\`

**Install:** \`install.packages("qcc")\``;
        }
        // Generic R response
        return `**📊 R for Six Sigma**

Key packages:
• \`qcc\` - Control charts, Cpk
• \`FrF2\` - Fractional factorial DOE
• \`DoE.base\` - DOE utilities
• \`car\` - VIF, diagnostics

\`\`\`r
install.packages(c("qcc", "FrF2", "DoE.base", "car"))
\`\`\`

Try: \`r code doe\` or \`r code control chart\``;
    }

    // Handle CAS number lookups
    const casMatch = query.match(/\b(\d{2,7}-\d{2}-\d)\b/);
    if (casMatch) {
        const casNum = casMatch[1];
        const results = searchEchaSubstances(casNum);
        if (results.length > 0) {
            const s = results[0];
            return `**🚨 SVHC Found: ${s.name}**

| Property | Value |
|----------|-------|
| CAS Number | ${s.cas} |
| EC Number | ${s.ec} |
| Reason | ${s.reason} |
| Date Added | ${s.dateAdded} |
| List | ${s.list} Candidate List |

**⚠️ Compliance Obligations:**
• Article 33: Inform customers if >0.1% in articles
• SCIP Database: Notify ECHA of articles containing this substance
• Consider substitution with safer alternatives`;
        } else {
            return `CAS number **${casNum}** was not found in the SVHC database.

This doesn't mean the substance is safe - it may still be regulated elsewhere. Check:
• ECHA website: https://echa.europa.eu/information-on-chemicals
• Annex XVII restrictions
• National regulations`;
        }
    }

    // Handle substance search queries
    if (lowerQuery.includes('search ') || lowerQuery.includes('find ') || lowerQuery.includes('lookup ')) {
        const searchTerm = query.replace(/^(search|find|lookup)\s+/i, '').trim();
        const results = searchEchaSubstances(searchTerm);
        if (results.length > 0) {
            let response = `**🔍 Found ${results.length} substance(s) matching "${searchTerm}":**\n\n`;
            results.forEach((s, i) => {
                response += `**${i + 1}. ${s.name}**\n`;
                response += `   CAS: ${s.cas} | ${s.reason}\n\n`;
            });
            response += `Ask about a specific CAS number for full details.`;
            return response;
        } else {
            return `No SVHC substances found matching "${searchTerm}".\n\nTry searching for:\n• Chemical names (e.g., "phthalate", "lead", "bisphenol")\n• CAS numbers (e.g., "80-05-7")\n• Categories (e.g., "carcinogenic", "endocrine")`;
        }
    }

    // Handle specific substance queries  
    const commonSubstances = ['dehp', 'bpa', 'bisphenol', 'phthalate', 'lead', 'cadmium', 'pfas', 'pfbs'];
    for (const sub of commonSubstances) {
        if (lowerQuery.includes(sub)) {
            const results = searchEchaSubstances(sub);
            if (results.length > 0) {
                const s = results[0];
                return `**${s.name}**

| Property | Value |
|----------|-------|
| CAS | ${s.cas} |
| EC | ${s.ec} |
| Reason | ${s.reason} |
| Added | ${s.dateAdded} |

This is on the **SVHC Candidate List**. Compliance required under REACH Article 33.`;
            }
        }
    }

    // Handle REACH questions
    if (lowerQuery.includes('reach') && !lowerQuery.includes('reach out')) {
        return `**REACH Regulation (EU)**

REACH = Registration, Evaluation, Authorisation and Restriction of Chemicals

**Key Components:**
• **Registration**: Manufacturers/importers must register substances >1 tonne/year with ECHA
• **Evaluation**: ECHA evaluates registration dossiers and testing proposals
• **Authorisation**: SVHC substances require authorization for continued use
• **Restriction**: Annex XVII lists conditions/bans on manufacture or use

**Key Lists:**
• SVHC Candidate List (235+ substances)
• Annex XIV (Authorisation List)
• Annex XVII (Restrictions)

Want details about SVHC, restrictions, or compliance steps?`;
    }

    // Handle SVHC questions
    if (lowerQuery.includes('svhc') || lowerQuery.includes('candidate list') || lowerQuery.includes('substances of very high concern')) {
        return `**SVHC - Substances of Very High Concern**

SVHC are chemicals identified for serious health/environmental effects.

**Categories:**
• **CMR** - Carcinogenic, Mutagenic, Reprotoxic (Cat 1A/1B)
• **PBT** - Persistent, Bioaccumulative, Toxic
• **vPvB** - Very Persistent, Very Bioaccumulative
• **Endocrine Disruptors** - Hormone disrupting properties

**Key Examples:**
| Substance | CAS | Reason |
|-----------|-----|--------|
| Lead | 7439-92-1 | Reprotoxic |
| DEHP | 117-81-7 | Reprotoxic |
| Bisphenol A | 80-05-7 | Endocrine |
| Cadmium | 7440-43-9 | CMR |

**Obligations:** If SVHC >0.1% in articles, you must inform customers (Article 33) and notify SCIP database.`;
    }

    // Handle CLP questions
    if (lowerQuery.includes('clp') || lowerQuery.includes('classification') || lowerQuery.includes('ghs') || lowerQuery.includes('pictogram')) {
        return `**CLP Regulation / GHS**

CLP = Classification, Labelling and Packaging (implements UN GHS in EU)

**Hazard Classes:**
• **Physical**: Explosives, Flammables, Oxidizers, Gases under pressure
• **Health**: Acute toxicity, CMR, Sensitization, STOT
• **Environmental**: Aquatic toxicity, Ozone layer

**Signal Words:**
• ⚠️ **DANGER** - More severe hazards
• ⚠️ **WARNING** - Less severe hazards

**GHS Pictograms:**
• GHS01 💥 Explosive
• GHS02 🔥 Flammable
• GHS05 ⚗️ Corrosive
• GHS06 ☠️ Acute toxicity
• GHS08 🏥 Health hazard
• GHS09 🌊 Environmental`;
    }

    // Handle Plastics compliance
    if (lowerQuery.includes('plastic') && (lowerQuery.includes('compliance') || lowerQuery.includes('reach') || lowerQuery.includes('regulation'))) {
        return `**Plastics Industry Compliance**

**Key Concerns:**
• **Phthalate plasticizers** - DEHP, DBP, BBP are SVHC
• **Flame retardants** - HBCD restricted
• **Heavy metal stabilizers** - Lead, cadmium restricted
• **BPA in polycarbonates** - Endocrine disruptor
• **Microplastics** - New restriction proposals

**Compliance Steps:**
1. Map your supply chain - know all chemical inputs
2. Check SVHC Candidate List quarterly
3. Article 33 - inform customers if SVHC >0.1%
4. SCIP database - notify ECHA of SVHC in articles
5. Seek safer alternatives

**Key Restrictions (Annex XVII):**
• Entry 51: Phthalates banned in toys >0.1%
• Entry 23: Cadmium banned in plastics`;
    }

    // Handle belt comparison questions
    if (lowerQuery.includes('difference') && (lowerQuery.includes('belt') || lowerQuery.includes('green') || lowerQuery.includes('black'))) {
        return `**Six Sigma Belt Level Comparison:**

• **White Belt**: Awareness level, basic terminology, team participation (4-8 hours training)
• **Yellow Belt**: DMAIC basics, quality tools, project support (16-24 hours training)
• **Green Belt**: Statistical analysis, SPC, lead projects part-time (40-80 hours training)
• **Black Belt**: Advanced statistics, DOE, MSA, lead projects full-time (160+ hours training)
• **Master Black Belt**: Strategic deployment, mentor belts, organizational change (extensive experience)

Each level builds on the previous one. Would you like details about a specific belt level?`;
    }

    // Handle DMAIC questions
    if (lowerQuery.includes('dmaic')) {
        return `**DMAIC: The Core Six Sigma Methodology**

DMAIC is a 5-phase structured problem-solving approach:

1. **Define** - What's the problem? Who's affected?
   Tools: Project Charter, SIPOC, VOC, CTQ

2. **Measure** - What's the current performance?
   Tools: Data Collection, Process Maps, MSA

3. **Analyze** - What are the root causes?
   Tools: Fishbone, 5 Whys, Hypothesis Testing

4. **Improve** - How do we fix it?
   Tools: DOE, FMEA, Poka-Yoke

5. **Control** - How do we keep it fixed?
   Tools: Control Charts, Control Plans, SOPs

Would you like me to explain any phase in more detail?`;
    }

    // Handle control chart questions
    if (lowerQuery.includes('control chart')) {
        return `**Control Charts: Monitoring Process Stability**

Control charts track process performance over time with:
• **Center Line (CL)**: Process average
• **Upper Control Limit (UCL)**: CL + 3σ
• **Lower Control Limit (LCL)**: CL - 3σ

**Types of Control Charts:**
| Data Type | Subgroup | Chart |
|-----------|----------|-------|
| Continuous | n=1 | I-MR |
| Continuous | n=2-9 | X̄-R |
| Continuous | n≥10 | X̄-S |
| Defective count | Fixed | np |
| Defect rate | Variable | p |

A point outside control limits signals **special cause variation** that needs investigation.`;
    }

    // Handle Cpk questions
    if (lowerQuery.includes('cpk') || lowerQuery.includes('capability')) {
        return `**Process Capability (Cpk)**

Cpk measures how well a process meets specifications, accounting for centering.

**Formula:**
Cpk = min[(USL - μ) / 3σ, (μ - LSL) / 3σ]

**Interpretation:**
• Cpk < 1.0: Not capable (producing defects)
• Cpk 1.0-1.33: Marginally capable
• Cpk 1.33-1.67: Capable
• Cpk > 1.67: Excellent

**Key Points:**
• Process must be stable before calculating Cpk
• Cp measures potential capability (ignores centering)
• Cpk accounts for how centered the process is`;
    }

    // Search knowledge base for other queries
    const results = searchKnowledge(query, knowledge);

    if (results.length > 0) {
        const topResult = results[0];
        const snippet = topResult.content.slice(0, 400) + (topResult.content.length > 400 ? '...' : '');

        let response = `**${topResult.topic}** (${topResult.belt})\n\n${snippet}`;

        if (results.length > 1) {
            response += `\n\n**Related topics:**\n`;
            results.slice(1).forEach(r => {
                response += `• ${r.topic} (${r.belt})\n`;
            });
        }

        return response;
    }

    // Default response
    return `I couldn't find specific information about "${query}" in my training database. 

Here are some topics I can help with:
• Six Sigma belt levels and requirements
• DMAIC methodology phases
• Quality tools (Control Charts, FMEA, DOE, Pareto)
• Statistical concepts (Cpk, hypothesis testing, ANOVA)
• Lean principles (waste, value stream, 5S)

Try asking about one of these topics!`;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Welcome to the Six Sigma & Compliance Assistant! 🎯

I can help you with:

• **Six Sigma** - Belt levels, DMAIC, quality tools
• **Compliance** - REACH, SVHC, CLP/GHS
• **Plastics** - Industry-specific regulations

How can I help you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Build knowledge base once
    const [knowledge] = useState(() => buildKnowledgeBase());

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setMessages(prev => [...prev, { role: 'user', content: `📎 Uploading: ${file.name}` }]);
        setIsTyping(true);

        try {
            const data = await processExcelFile(file);
            setUploadedData(data);
            const summary = formatUploadedDataSummary(data);
            setMessages(prev => [...prev, { role: 'assistant', content: summary }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure it's a valid Excel file (.xlsx, .xls).`
            }]);
        }

        setIsTyping(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

        // Check if query is about uploaded data
        let response: string;
        if (uploadedData && userMessage.toLowerCase().includes('analyze')) {
            // Find column mentioned in query
            const allColumns = uploadedData.sheets.flatMap(s => s.columns);
            const mentionedCol = allColumns.find(col =>
                userMessage.toLowerCase().includes(col.toLowerCase())
            );

            if (mentionedCol) {
                const sheet = uploadedData.sheets.find(s => s.stats && s.stats[mentionedCol]);
                if (sheet && sheet.stats && sheet.stats[mentionedCol]) {
                    const s = sheet.stats[mentionedCol];
                    response = `**📊 Analysis of "${mentionedCol}"**

| Statistic | Value |
|-----------|-------|
| Count | ${s.count} |
| Mean | ${s.mean} |
| Std Dev | ${s.stddev} |
| Min | ${s.min} |
| Max | ${s.max} |
| Range | ${s.max - s.min} |

**To calculate Cpk, provide spec limits:**
\`cpk usl=[upper] lsl=[lower] mean=${s.mean} stddev=${s.stddev}\``;
                } else {
                    response = `Column "${mentionedCol}" found but no numeric data available for analysis.`;
                }
            } else {
                response = `I have data from "${uploadedData.filename}" with columns: ${allColumns.join(', ')}. Which column would you like to analyze?`;
            }
        } else {
            response = generateResponse(userMessage, knowledge);
        }

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'Calculate Cpk',
        'Python code',
        'DOE analysis',
        'Excel formulas',
        'Control chart',
        'Equation sheet'
    ];

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <span className="chatbot-header-icon">🤖</span>
                        <div className="chatbot-header-info">
                            <div className="chatbot-header-title">Six Sigma Assistant</div>
                            <div className="chatbot-header-status">● Online</div>
                        </div>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chatbot-message ${msg.role}`}
                                dangerouslySetInnerHTML={{
                                    __html: msg.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\n/g, '<br>')
                                        .replace(/• /g, '&bull; ')
                                }}
                            />
                        ))}
                        {isTyping && (
                            <div className="chatbot-message assistant">
                                <div className="chatbot-typing">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="quick-questions">
                        {quickQuestions.map(q => (
                            <button
                                key={q}
                                className="quick-question"
                                onClick={() => {
                                    setInput(q);
                                    setTimeout(() => handleSend(), 100);
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="chatbot-input-container">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        <button
                            className="chatbot-upload"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isTyping}
                            title="Upload Excel/CSV file"
                        >
                            📎
                        </button>
                        <input
                            type="text"
                            className="chatbot-input"
                            placeholder="Ask or upload Excel file..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isTyping}
                        />
                        <button
                            className="chatbot-send"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Close chat' : 'Open chat assistant'}
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
}
