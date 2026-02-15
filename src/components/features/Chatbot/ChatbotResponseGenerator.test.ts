/**
 * Tests for ChatbotResponseGenerator
 */

import { describe, it, expect, vi } from 'vitest';
import { parseCalculation, generateResponse } from './ChatbotResponseGenerator';

// Mock dependencies
vi.mock('./ChatbotKnowledge', () => ({
    buildKnowledgeBase: vi.fn(() => []),
    searchKnowledge: vi.fn(() => []),
    searchEchaSubstances: vi.fn(() => []),
    getSubstanceStats: vi.fn(() => ({ total: 100 })),
}));

describe('ChatbotResponseGenerator', () => {
    describe('parseCalculation', () => {
        it('parses Cpk calculation with all parameters', () => {
            const result = parseCalculation('calculate cpk usl=10 lsl=2 mean=6 stddev=1');
            expect(result).toContain('Capability Analysis Results');
            expect(result).toContain('Cpk');
            expect(result).toContain('Excel Formula');
        });

        it('returns Cpk help when parameters incomplete', () => {
            const result = parseCalculation('cpk');
            expect(result).toContain('Cpk Calculator');
            expect(result).toContain('Provide values');
        });

        it('parses sample size calculation for mean', () => {
            const result = parseCalculation('sample size mean sigma=5 error=1');
            expect(result).toContain('Sample Size Calculation');
            expect(result).toContain('Mean');
        });

        it('parses sample size calculation for proportion', () => {
            const result = parseCalculation('sample size error=0.05 p=0.5');
            expect(result).toContain('Sample Size Calculation');
            expect(result).toContain('Proportion');
        });

        it('returns sample size help when parameters incomplete', () => {
            const result = parseCalculation('sample size');
            expect(result).toContain('Sample Size Calculator');
        });

        it('parses control chart limits calculation', () => {
            const result = parseCalculation('control chart xbar=50 rbar=4 n=5');
            expect(result).toContain('Control Limits');
            expect(result).toContain('UCL');
            expect(result).toContain('LCL');
        });

        it('returns control chart help when parameters incomplete', () => {
            const result = parseCalculation('control limit');
            expect(result).toContain('Control Chart Calculator');
        });

        it('parses DPMO calculation', () => {
            const result = parseCalculation('dpmo defects=15 units=1000 opportunities=5');
            expect(result).toContain('DPMO');
            expect(result).toContain('Sigma Level');
        });

        it('returns DPMO help when parameters incomplete', () => {
            const result = parseCalculation('dpmo');
            expect(result).toContain('DPMO Calculator');
        });

        it('parses t-test calculation', () => {
            const result = parseCalculation('t-test mean1=45 mean2=42 s1=3 s2=4 n1=25 n2=30');
            expect(result).toContain('T-Test');
            expect(result).toContain('t-statistic');
        });

        it('parses Excel formula request', () => {
            const result = parseCalculation('excel formula for mean');
            expect(result).toContain('Excel Formula');
        });

        it('returns null for non-calculation queries', () => {
            const result = parseCalculation('hello');
            expect(result).toBeNull();
        });
    });

    describe('generateResponse', () => {
        it('returns greeting response', () => {
            const result = generateResponse('hello');
            expect(result).toContain('Hello');
            expect(result).toContain('Six Sigma');
        });

        it('returns equation sheet response', () => {
            const result = generateResponse('equation sheet');
            expect(result).toContain('Equation Quick Reference');
            expect(result).toContain('Cp');
        });

        it('returns Excel formulas response', () => {
            const result = generateResponse('excel formulas');
            expect(result).toContain('Excel Formulas');
            expect(result).toContain('AVERAGE');
        });

        it('returns cause and effect response', () => {
            const result = generateResponse('cause and effect matrix');
            expect(result).toContain('Cause-and-Effect');
        });

        it('returns Python code response', () => {
            const result = generateResponse('python code');
            expect(result).toContain('Python');
        });

        it('returns Python DOE code response', () => {
            const result = generateResponse('python doe code');
            expect(result).toContain('pyDOE2');
        });

        it('returns Python regression code response', () => {
            const result = generateResponse('python regression code');
            expect(result).toContain('statsmodels');
        });

        it('returns Python control chart code response', () => {
            const result = generateResponse('python control chart code');
            expect(result).toContain('matplotlib');
        });

        it('returns R code response', () => {
            const result = generateResponse('r code');
            expect(result).toContain('R');
        });

        it('returns R DOE code response', () => {
            const result = generateResponse('r code doe');
            expect(result).toContain('FrF2');
        });

        it('returns R control chart code response', () => {
            const result = generateResponse('r code control chart');
            expect(result).toContain('qcc');
        });

        it('returns belt comparison response', () => {
            const result = generateResponse('difference between belts');
            expect(result).toContain('Belt Level Comparison');
        });

        it('returns DMAIC response', () => {
            const result = generateResponse('what is dmaic');
            expect(result).toContain('DMAIC');
        });

        it('returns control chart response', () => {
            const result = generateResponse('control chart types');
            expect(result).toContain('Control Charts');
        });

        it('returns Cpk calculator help when query lacks parameters', () => {
            const result = generateResponse('what is cpk');
            expect(result).toContain('Cpk Calculator');
            expect(result).toContain('Provide values like');
        });

        it('returns REACH response', () => {
            const result = generateResponse('what is reach');
            expect(result).toContain('REACH');
        });

        it('returns SVHC response', () => {
            const result = generateResponse('svhc substances');
            expect(result).toContain('SVHC');
        });

        it('returns CLP response', () => {
            const result = generateResponse('clp regulation');
            expect(result).toContain('CLP');
        });

        it('returns plastics compliance response', () => {
            const result = generateResponse('plastics compliance');
            expect(result).toContain('Plastics');
        });

        it('returns default response for unknown queries', () => {
            const result = generateResponse('xyzabc123');
            expect(result).toContain('couldn\'t find');
        });
    });
});
