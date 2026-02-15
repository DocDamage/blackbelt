/**
 * Tests for ChatbotCalculations
 */

import { describe, it, expect } from 'vitest';
import {
    calculateCpk,
    calculateSampleSizeMean,
    calculateSampleSizeProp,
    calculateXbarRLimits,
    calculateDPMO,
    calculateTStat,
    generateExcelFormula,
    Z_VALUES,
    CPK_THRESHOLDS,
} from './ChatbotCalculations';

describe('ChatbotCalculations', () => {
    describe('calculateCpk', () => {
        it('calculates Cpk correctly for centered process', () => {
            const result = calculateCpk(10, 2, 6, 1);
            expect(result.cpk).toBeCloseTo(1.333, 2);
            expect(result.cp).toBeCloseTo(1.333, 2);
        });

        it('calculates Cpk correctly for off-center process', () => {
            const result = calculateCpk(10, 2, 7, 1);
            expect(result.cpk).toBeLessThan(result.cp);
            expect(result.cpu).toBeCloseTo(1.0, 2);
            expect(result.cpl).toBeCloseTo(1.667, 2);
        });

        it('returns rounded values to 3 decimal places', () => {
            const result = calculateCpk(10, 2, 6, 1.333);
            expect(result.cpk.toString()).toMatch(/^\d+\.?\d{0,3}$/);
        });

        it('handles edge case when stddev is very small', () => {
            const result = calculateCpk(10, 2, 6, 0.001);
            expect(result.cpk).toBeGreaterThan(100);
        });
    });

    describe('calculateSampleSizeMean', () => {
        it('calculates sample size correctly', () => {
            const n = calculateSampleSizeMean(1.96, 5, 1);
            expect(n).toBe(97); // ceil(96.04)
        });

        it('returns integer value', () => {
            const n = calculateSampleSizeMean(1.96, 10, 2);
            expect(Number.isInteger(n)).toBe(true);
        });

        it('increases with higher confidence (Z)', () => {
            const n95 = calculateSampleSizeMean(1.96, 5, 1);
            const n99 = calculateSampleSizeMean(2.576, 5, 1);
            expect(n99).toBeGreaterThan(n95);
        });

        it('decreases with larger margin of error', () => {
            const n1 = calculateSampleSizeMean(1.96, 5, 1);
            const n2 = calculateSampleSizeMean(1.96, 5, 2);
            expect(n2).toBeLessThan(n1);
        });
    });

    describe('calculateSampleSizeProp', () => {
        it('calculates sample size for proportion with p=0.5', () => {
            const n = calculateSampleSizeProp(1.96, 0.5, 0.05);
            expect(n).toBe(385); // Maximum variance at p=0.5
        });

        it('returns smaller sample size for extreme p values', () => {
            const n50 = calculateSampleSizeProp(1.96, 0.5, 0.05);
            const n10 = calculateSampleSizeProp(1.96, 0.1, 0.05);
            expect(n10).toBeLessThan(n50);
        });

        it('returns integer value', () => {
            const n = calculateSampleSizeProp(1.96, 0.3, 0.05);
            expect(Number.isInteger(n)).toBe(true);
        });
    });

    describe('calculateXbarRLimits', () => {
        it('calculates control limits for n=5', () => {
            const result = calculateXbarRLimits(50, 4, 5);
            expect(result.xbarUCL).toBeCloseTo(52.308, 2);
            expect(result.xbarLCL).toBeCloseTo(47.692, 2);
            expect(result.rUCL).toBeCloseTo(8.456, 2);
            expect(result.rLCL).toBeCloseTo(0.892, 2); // D3 * Rbar = 0.223 * 4
        });

        it('calculates control limits for n=2', () => {
            const result = calculateXbarRLimits(50, 4, 2);
            expect(result.xbarUCL).toBeCloseTo(57.52, 2);
            expect(result.xbarLCL).toBeCloseTo(42.48, 2);
        });

        it('uses default constants for n>10', () => {
            const result = calculateXbarRLimits(50, 4, 15);
            expect(result.xbarUCL).toBeDefined();
            expect(result.xbarLCL).toBeDefined();
        });

        it('returns rounded values', () => {
            const result = calculateXbarRLimits(50, 4, 5);
            expect(result.xbarUCL.toString()).toMatch(/^\d+\.?\d{0,3}$/);
        });
    });

    describe('calculateDPMO', () => {
        it('calculates DPMO correctly', () => {
            const result = calculateDPMO(15, 1000, 5);
            expect(result.dpmo).toBe(3000);
            expect(result.dpo).toBe(0.003);
        });

        it('returns sigma level 6 for very low DPMO', () => {
            const result = calculateDPMO(1, 1000000, 1);
            expect(result.sigma).toBe(6);
        });

        it('returns sigma level 2 for high DPMO', () => {
            const result = calculateDPMO(500000, 1000, 1);
            expect(result.sigma).toBe(2);
        });

        it('calculates yield correctly', () => {
            const result = calculateDPMO(10, 1000, 10);
            // 10 defects / (1000 units * 10 opp) = 0.001 DPO = 99.9% yield
            expect(result.yield).toBe(99.9);
        });

        it('rounds DPMO to integer', () => {
            const result = calculateDPMO(1, 3, 3);
            expect(Number.isInteger(result.dpmo)).toBe(true);
        });
    });

    describe('calculateTStat', () => {
        it('calculates t-statistic correctly', () => {
            const result = calculateTStat(45, 42, 3, 4, 25, 30);
            expect(result.t).toBeDefined();
            expect(result.df).toBe(53); // 25 + 30 - 2
        });

        it('returns positive t when mean1 > mean2', () => {
            const result = calculateTStat(50, 40, 5, 5, 20, 20);
            expect(result.t).toBeGreaterThan(0);
        });

        it('returns negative t when mean1 < mean2', () => {
            const result = calculateTStat(40, 50, 5, 5, 20, 20);
            expect(result.t).toBeLessThan(0);
        });

        it('calculates degrees of freedom correctly', () => {
            const result = calculateTStat(45, 42, 3, 4, 10, 15);
            expect(result.df).toBe(23); // 10 + 15 - 2
        });

        it('returns rounded values', () => {
            const result = calculateTStat(45, 42, 3, 4, 25, 30);
            expect(result.t.toString()).toMatch(/^-?\d+\.?\d{0,3}$/);
        });
    });

    describe('generateExcelFormula', () => {
        it('generates Cpk formula', () => {
            const formula = generateExcelFormula('cpk', { usl: '10', lsl: '2', data: 'A1:A100' });
            expect(formula).toContain('MIN');
            expect(formula).toContain('AVERAGE');
            expect(formula).toContain('STDEV.S');
        });

        it('generates t-test formula', () => {
            const formula = generateExcelFormula('ttest', { range1: 'A1:A10', range2: 'B1:B10' });
            expect(formula).toContain('T.TEST');
        });

        it('generates mean formula', () => {
            const formula = generateExcelFormula('mean', { data: 'A1:A100' });
            expect(formula).toBe('=AVERAGE(A1:A100)');
        });

        it('generates stdev formula', () => {
            const formula = generateExcelFormula('stdev', { data: 'A1:A100' });
            expect(formula).toBe('=STDEV.S(A1:A100)');
        });

        it('generates confidence formula', () => {
            const formula = generateExcelFormula('confidence', { alpha: '0.05', data: 'A1:A100' });
            expect(formula).toContain('CONFIDENCE.T');
        });

        it('generates X-bar UCL formula', () => {
            const formula = generateExcelFormula('xbar_ucl', { xbarbar: '50', a2: '0.577', rbar: '4' });
            expect(formula).toContain('50');
            expect(formula).toContain('0.577');
        });

        it('generates X-bar LCL formula', () => {
            const formula = generateExcelFormula('xbar_lcl', { xbarbar: '50', a2: '0.577', rbar: '4' });
            expect(formula).toContain('-');
        });

        it('returns not found for unknown type', () => {
            const formula = generateExcelFormula('unknown', {});
            expect(formula).toBe('Formula not found');
        });
    });

    describe('Constants', () => {
        it('has correct Z values', () => {
            expect(Z_VALUES['90%']).toBe(1.645);
            expect(Z_VALUES['95%']).toBe(1.96);
            expect(Z_VALUES['99%']).toBe(2.576);
        });

        it('has correct CPK thresholds', () => {
            expect(CPK_THRESHOLDS.NOT_CAPABLE).toBe(1.0);
            expect(CPK_THRESHOLDS.CAPABLE).toBe(1.33);
            expect(CPK_THRESHOLDS.EXCELLENT).toBe(1.67);
        });
    });
});
