/**
 * Chatbot Response Generator
 * Handles all response generation logic
 */

import {
    calculateCpk,
    calculateSampleSizeMean,
    calculateSampleSizeProp,
    calculateXbarRLimits,
    calculateDPMO,
    calculateTStat,
    generateExcelFormula
} from './ChatbotCalculations';
import {
    buildKnowledgeBase,
    searchKnowledge,
    searchEchaSubstances,
    getSubstanceStats
} from './ChatbotKnowledge';

// Build knowledge base once
const knowledge = buildKnowledgeBase();

/**
 * Parse calculation request and return formatted response
 */
export function parseCalculation(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // Cpk calculation: "calculate cpk usl=10 lsl=2 mean=6 stddev=1"
    const cpkMatch = query.match(/cpk.*usl[=:\s]*([\d.]+).*lsl[=:\s]*([\d.]+).*mean[=:\s]*([\d.]+).*(stddev|std|stdev|sigma|s)[=:\s]*([\d.]+)/i);
    if (cpkMatch || lowerQuery.includes('cpk')) {
        if (cpkMatch && cpkMatch[1] && cpkMatch[2] && cpkMatch[3] && cpkMatch[5]) {
            const usl = parseFloat(cpkMatch[1] ?? '0');
            const lsl = parseFloat(cpkMatch[2] ?? '0');
            const mean = parseFloat(cpkMatch[3] ?? '0');
            const stddev = parseFloat(cpkMatch[5] ?? '0');
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
        const type = (excelMatch[1] ?? '').trim().toLowerCase().replace(/\s+/g, '_');
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
    const isSampleCalc = lowerQuery.includes('sample size') || lowerQuery.includes('how many samples');

    if (isSampleCalc) {
        const confMatch = query.match(/(?:confidence|conf)[=:\s]*([\d.]+)/i);
        const errorMatch = query.match(/(?:margin|error|e)[=:\s]*([\d.]+)/i);

        if (confMatch || errorMatch) {
            const conf = confMatch ? parseFloat(confMatch[1] ?? '95') : 95;
            const margin = errorMatch ? parseFloat(errorMatch[1] ?? '0') : 0;

            if (margin > 0) {
                const z = conf >= 99 || conf >= 0.99 ? 2.576 : conf >= 95 || conf >= 0.95 ? 1.96 : 1.645;
                const displayConf = conf > 1 ? conf : conf * 100;

                const sigmaMatch = query.match(/sigma[=:\s]*([\d.]+)/i);
                const sigma = sigmaMatch ? parseFloat(sigmaMatch[1] ?? '0') : null;
                const isMean = lowerQuery.includes('mean') || sigma !== null;

                if (isMean) {
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
                    const p = pMatch ? parseFloat(pMatch[1] ?? '0.5') : 0.5;

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

        return `**Sample Size Calculator** - Try these:
• Mean: \`sample size mean sigma=5 error=1\`
• Proportion: \`sample size error=0.05 p=0.5\``;
    }

    // Control chart limits
    const controlMatch = query.match(/control.*xbar[=:\s]*([\d.]+).*rbar[=:\s]*([\d.]+).*n[=:\s]*([\d]+)/i);
    if (controlMatch || (lowerQuery.includes('control') && lowerQuery.includes('limit'))) {
        if (controlMatch) {
            const xbarbar = parseFloat(controlMatch[1] ?? '0');
            const rbar = parseFloat(controlMatch[2] ?? '0');
            const n = parseInt(controlMatch[3] ?? '0');
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
            const defects = parseInt(dpmoMatch[1] ?? '0');
            const units = parseInt(dpmoMatch[2] ?? '0');
            const opp = parseInt(dpmoMatch[3] ?? '0');
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
        const mean1 = parseFloat(ttestMatch[1] ?? '0');
        const mean2 = parseFloat(ttestMatch[2] ?? '0');
        const s1 = parseFloat(ttestMatch[3] ?? '0');
        const s2 = parseFloat(ttestMatch[4] ?? '0');
        const n1 = parseInt(ttestMatch[5] ?? '0');
        const n2 = parseInt(ttestMatch[6] ?? '0');
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

/**
 * Generate response for user query
 */
export function generateResponse(query: string): string {
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
        const casNum = casMatch[1] ?? '';
        const results = searchEchaSubstances(casNum);
        if (results.length > 0) {
            const s = results[0]!;
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
                const s = results[0]!;
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
        const topResult = results[0]!;
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