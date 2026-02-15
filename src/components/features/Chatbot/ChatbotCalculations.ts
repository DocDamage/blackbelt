/**
 * Six Sigma Calculator Functions
 * Extracted from Chatbot for maintainability and reusability
 */

// Cpk Calculator
export function calculateCpk(usl: number, lsl: number, mean: number, stddev: number): { cpk: number; cpu: number; cpl: number; cp: number } {
    const cpu = (usl - mean) / (3 * stddev);
    const cpl = (mean - lsl) / (3 * stddev);
    const cpk = Math.min(cpu, cpl);
    const cp = (usl - lsl) / (6 * stddev);
    return {
        cpk: Math.round(cpk * 1000) / 1000,
        cpu: Math.round(cpu * 1000) / 1000,
        cpl: Math.round(cpl * 1000) / 1000,
        cp: Math.round(cp * 1000) / 1000
    };
}

// Sample Size Calculator for Mean
export function calculateSampleSizeMean(zValue: number, sigma: number, marginOfError: number): number {
    return Math.ceil(Math.pow((zValue * sigma) / marginOfError, 2));
}

// Sample Size Calculator for Proportion
export function calculateSampleSizeProp(zValue: number, p: number, marginOfError: number): number {
    return Math.ceil(p * (1 - p) * Math.pow(zValue / marginOfError, 2));
}

// Control Chart Constants
const A2_CONSTANTS: Record<number, number> = {
    2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483,
    7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308
};

const D4_CONSTANTS: Record<number, number> = {
    2: 3.267, 3: 2.574, 4: 2.282, 5: 2.114, 6: 2.004,
    7: 1.924, 8: 1.864, 9: 1.816, 10: 1.777
};

const D3_CONSTANTS: Record<number, number> = {
    2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0.076, 8: 0.136, 9: 0.184, 10: 0.223
};

// Control Chart Limits (Xbar-R)
export function calculateXbarRLimits(xbarbar: number, rbar: number, n: number): {
    xbarUCL: number;
    xbarLCL: number;
    rUCL: number;
    rLCL: number
} {
    const a2 = A2_CONSTANTS[n] || 0.308;
    const d4 = D4_CONSTANTS[n] || 1.777;
    const d3 = D3_CONSTANTS[n] || 0.223;

    return {
        xbarUCL: Math.round((xbarbar + a2 * rbar) * 1000) / 1000,
        xbarLCL: Math.round((xbarbar - a2 * rbar) * 1000) / 1000,
        rUCL: Math.round((d4 * rbar) * 1000) / 1000,
        rLCL: Math.round((d3 * rbar) * 1000) / 1000
    };
}

// DPMO and Sigma Level
export function calculateDPMO(defects: number, units: number, opportunities: number): {
    dpo: number;
    dpmo: number;
    sigma: number;
    yield: number
} {
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

    return {
        dpo: Math.round(dpo * 1000000) / 1000000,
        dpmo: Math.round(dpmo),
        sigma,
        yield: Math.round(yieldPct * 100) / 100
    };
}

// T-statistic Calculator
export function calculateTStat(mean1: number, mean2: number, s1: number, s2: number, n1: number, n2: number): {
    t: number;
    df: number;
    pooledVar: number
} {
    const pooledVar = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
    const se = Math.sqrt(pooledVar * (1 / n1 + 1 / n2));
    const t = (mean1 - mean2) / se;
    return {
        t: Math.round(t * 1000) / 1000,
        df: n1 + n2 - 2,
        pooledVar: Math.round(pooledVar * 1000) / 1000
    };
}

// Excel Formula Generator
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

// Constants for calculations
export const Z_VALUES = {
    '90%': 1.645,
    '95%': 1.96,
    '99%': 2.576
};

export const CPK_THRESHOLDS = {
    NOT_CAPABLE: 1.0,
    CAPABLE: 1.33,
    EXCELLENT: 1.67
};