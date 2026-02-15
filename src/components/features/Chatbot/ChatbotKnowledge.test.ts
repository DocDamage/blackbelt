/**
 * Tests for Chatbot Knowledge Base
 */

import { describe, it, expect, vi } from 'vitest';
import {
    extractKeywords,
    buildKnowledgeBase,
    searchKnowledge,
    KnowledgeItem,
} from './ChatbotKnowledge';

// Mock belt modules
vi.mock('../../../content/whiteBelt/modules', () => ({
    whiteBeltModules: [
        {
            id: 'white-1',
            title: 'Introduction to Six Sigma',
            lessons: [
                {
                    id: 'lesson-1',
                    title: 'What is Six Sigma',
                    content: '<p>Six Sigma is a methodology for process improvement.</p>',
                    duration: 10,
                    completed: false,
                },
            ],
        },
    ],
    getWhiteBeltLessonCount: vi.fn().mockReturnValue(1),
    getWhiteBeltTotalMinutes: vi.fn().mockReturnValue(10),
}));

vi.mock('../../../content/yellowBelt/modules', () => ({
    yellowBeltModules: [
        {
            id: 'yellow-1',
            title: 'DMAIC Overview',
            lessons: [
                {
                    id: 'lesson-2',
                    title: 'Define Phase',
                    content: '<p>The Define phase establishes project goals.</p>',
                    duration: 15,
                    completed: false,
                },
            ],
        },
    ],
    getYellowBeltLessonCount: vi.fn().mockReturnValue(1),
    getYellowBeltTotalMinutes: vi.fn().mockReturnValue(15),
}));

vi.mock('../../../content/greenBelt/modules', () => ({
    greenBeltModules: [],
    getGreenBeltLessonCount: vi.fn().mockReturnValue(0),
    getGreenBeltTotalMinutes: vi.fn().mockReturnValue(0),
}));

vi.mock('../../../content/blackBelt/modules', () => ({
    blackBeltModules: [],
    getBlackBeltLessonCount: vi.fn().mockReturnValue(0),
    getBlackBeltTotalMinutes: vi.fn().mockReturnValue(0),
}));

vi.mock('../../../content/masterBlackBelt/modules', () => ({
    masterBlackBeltModules: [],
    getMasterBlackBeltLessonCount: vi.fn().mockReturnValue(0),
    getMasterBlackBeltTotalMinutes: vi.fn().mockReturnValue(0),
}));

vi.mock('../../../content/compliance/echaData', () => ({
    searchEchaSubstances: vi.fn(),
    getSubstanceStats: vi.fn(),
}));

describe('ChatbotKnowledge', () => {
    describe('extractKeywords', () => {
        it('extracts keywords from simple text', () => {
            const result = extractKeywords('process improvement methodology');
            expect(result).toContain('process');
            expect(result).toContain('improvement');
            expect(result).toContain('methodology');
        });

        it('removes stop words', () => {
            const result = extractKeywords('the process is very important for the system');
            expect(result).not.toContain('the');
            expect(result).not.toContain('is');
            expect(result).not.toContain('for');
            expect(result).toContain('process');
            expect(result).toContain('important');
            expect(result).toContain('system');
        });

        it('removes short words', () => {
            const result = extractKeywords('a an at be do it of on to');
            expect(result).toHaveLength(0);
        });

        it('removes punctuation', () => {
            const result = extractKeywords('process, improvement; methodology!');
            expect(result).toContain('process');
            expect(result).toContain('improvement');
            expect(result).toContain('methodology');
        });

        it('removes duplicates', () => {
            const result = extractKeywords('process process improvement process');
            expect(result.filter(k => k === 'process')).toHaveLength(1);
        });

        it('converts to lowercase', () => {
            const result = extractKeywords('PROCESS Improvement');
            expect(result).toContain('process');
            expect(result).toContain('improvement');
        });

        it('handles empty string', () => {
            const result = extractKeywords('');
            expect(result).toHaveLength(0);
        });

        it('handles string with only stop words', () => {
            const result = extractKeywords('the and or but if then');
            expect(result).toHaveLength(0);
        });

        it('handles special characters', () => {
            const result = extractKeywords('cpk@process#improvement$');
            expect(result).toContain('cpk');
            expect(result).toContain('process');
            expect(result).toContain('improvement');
        });
    });

    describe('buildKnowledgeBase', () => {
        it('builds knowledge base with belt content', () => {
            const knowledge = buildKnowledgeBase();
            expect(knowledge.length).toBeGreaterThan(0);
        });

        it('includes white belt content', () => {
            const knowledge = buildKnowledgeBase();
            const whiteBeltItem = knowledge.find(k => k.belt === 'White Belt');
            expect(whiteBeltItem).toBeDefined();
        });

        it('includes yellow belt content', () => {
            const knowledge = buildKnowledgeBase();
            const yellowBeltItem = knowledge.find(k => k.belt === 'Yellow Belt');
            expect(yellowBeltItem).toBeDefined();
        });

        it('includes compliance topics', () => {
            const knowledge = buildKnowledgeBase();
            const complianceItem = knowledge.find(k => k.belt === 'Compliance');
            expect(complianceItem).toBeDefined();
        });

        it('includes lean topics', () => {
            const knowledge = buildKnowledgeBase();
            const leanItem = knowledge.find(k => k.belt === 'Lean');
            expect(leanItem).toBeDefined();
        });

        it('includes template topics', () => {
            const knowledge = buildKnowledgeBase();
            const templateItem = knowledge.find(k => k.belt === 'Templates');
            expect(templateItem).toBeDefined();
        });

        it('includes industry topics', () => {
            const knowledge = buildKnowledgeBase();
            const industryItem = knowledge.find(k => k.belt === 'Industry');
            expect(industryItem).toBeDefined();
        });

        it('includes certification topics', () => {
            const knowledge = buildKnowledgeBase();
            const certItem = knowledge.find(k => k.belt === 'Certification');
            expect(certItem).toBeDefined();
        });

        it('extracts keywords for belt content', () => {
            const knowledge = buildKnowledgeBase();
            const whiteBeltItem = knowledge.find(k => k.belt === 'White Belt');
            expect(whiteBeltItem?.keywords.length).toBeGreaterThan(0);
        });

        it('strips HTML from content', () => {
            const knowledge = buildKnowledgeBase();
            const whiteBeltItem = knowledge.find(k => k.belt === 'White Belt');
            expect(whiteBeltItem?.content).not.toContain('<p>');
            expect(whiteBeltItem?.content).not.toContain('</p>');
        });
    });

    describe('searchKnowledge', () => {
        const mockKnowledge: KnowledgeItem[] = [
            {
                topic: 'Process Capability',
                belt: 'Green Belt',
                content: 'Cpk measures process capability',
                keywords: ['cpk', 'capability', 'process', 'sigma'],
            },
            {
                topic: 'DMAIC Define',
                belt: 'Yellow Belt',
                content: 'Define phase establishes project goals',
                keywords: ['define', 'dmaic', 'project', 'goals'],
            },
            {
                topic: 'Control Charts',
                belt: 'Green Belt',
                content: 'SPC monitors process stability',
                keywords: ['spc', 'control', 'charts', 'monitoring'],
            },
        ];

        it('returns empty array for no matches', () => {
            const results = searchKnowledge('xyz123', mockKnowledge);
            expect(results).toHaveLength(0);
        });

        it('matches topic with high score', () => {
            const results = searchKnowledge('process capability', mockKnowledge);
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]!.topic).toBe('Process Capability');
            expect(results[0]!.score).toBeGreaterThan(0);
        });

        it('matches keywords', () => {
            const results = searchKnowledge('cpk', mockKnowledge);
            expect(results.length).toBeGreaterThan(0);
            expect(results[0]!.topic).toBe('Process Capability');
        });

        it('matches content words', () => {
            const results = searchKnowledge('stability', mockKnowledge);
            expect(results.length).toBeGreaterThan(0);
        });

        it('returns top 3 matches only', () => {
            const largeKnowledge: KnowledgeItem[] = Array(10).fill(null).map((_, i) => ({
                topic: `Topic ${i}`,
                belt: 'Test',
                content: 'test content',
                keywords: ['test'],
            }));

            const results = searchKnowledge('test', largeKnowledge);
            expect(results).toHaveLength(3);
        });

        it('sorts by score descending', () => {
            const results = searchKnowledge('process', mockKnowledge);
            for (let i = 1; i < results.length; i++) {
                expect(results[i - 1]!.score).toBeGreaterThanOrEqual(results[i]!.score);
            }
        });

        it('handles case insensitive search', () => {
            const results = searchKnowledge('CPK', mockKnowledge);
            expect(results.length).toBeGreaterThan(0);
        });

        it('scores topic matches higher than keyword matches', () => {
            const results = searchKnowledge('define', mockKnowledge);
            const defineResult = results.find(r => r.topic === 'DMAIC Define');
            expect(defineResult?.score).toBeGreaterThan(3); // More than just keyword match
        });

        it('filters out zero score items', () => {
            const results = searchKnowledge('nonexistent', mockKnowledge);
            expect(results.every(r => r.score > 0)).toBe(true);
        });
    });
});
