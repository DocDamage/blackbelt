/**
 * Tests for ECHA API Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    fetchSvhcSubstances,
    searchEchaSubstances,
    getSubstanceByCas,
    getSubstanceStats,
    clearEchaCache,
    getEchaCacheInfo,
} from './echaApi';

// Mock fetch
global.fetch = vi.fn();

// Mock static data
vi.mock('../content/compliance/echaData', () => ({
    svhcSubstances: [
        { name: 'Test Substance', cas: '123-45-6', ec: '234-567-8', reason: 'Carcinogenic', dateAdded: '2020-01-01', list: 'SVHC' },
    ],
}));

describe('ECHA API Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('fetchSvhcSubstances', () => {
        it('returns cached data when available and valid', async () => {
            const cachedData = [{ name: 'Cached', cas: '111-11-1', ec: '222-222-2', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' as const }];
            localStorage.setItem('echa_substances_cache', JSON.stringify(cachedData));
            localStorage.setItem('echa_cache_timestamp', Date.now().toString());

            const result = await fetchSvhcSubstances();

            expect(result.source).toBe('cache');
            expect(result.substances).toEqual(cachedData);
        });

        it('fetches from API when cache is expired', async () => {
            const apiData = {
                substances: [{ name: 'API Substance', cas: '333-33-3', ec: '444-444-4', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' }],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const result = await fetchSvhcSubstances();

            expect(result.source).toBe('api');
            expect(fetch).toHaveBeenCalledWith('/api/echa/svhc', expect.any(Object));
        });

        it('falls back to static data when API fails', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

            const result = await fetchSvhcSubstances();

            expect(result.source).toBe('fallback');
            expect(result.substances.length).toBeGreaterThan(0);
        });

        it('forces refresh when forceRefresh is true', async () => {
            const cachedData = [{ name: 'Cached', cas: '111-11-1', ec: '222-222-2', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' as const }];
            localStorage.setItem('echa_substances_cache', JSON.stringify(cachedData));
            localStorage.setItem('echa_cache_timestamp', Date.now().toString());

            const apiData = {
                substances: [{ name: 'Fresh', cas: '555-55-5', ec: '666-666-6', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' }],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const result = await fetchSvhcSubstances(true);

            expect(result.source).toBe('api');
        });
    });

    describe('searchEchaSubstances', () => {
        it('searches by name', async () => {
            const apiData = {
                substances: [
                    { name: 'Lead Compound', cas: '123-45-6', ec: '234-567-8', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' },
                    { name: 'Cadmium Oxide', cas: '789-01-2', ec: '890-123-4', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const results = await searchEchaSubstances('lead');

            expect(results).toHaveLength(1);
            expect(results[0]!.name).toBe('Lead Compound');
        });

        it('searches by CAS number', async () => {
            const apiData = {
                substances: [
                    { name: 'Substance A', cas: '123-45-6', ec: '234-567-8', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const results = await searchEchaSubstances('123-45');

            expect(results).toHaveLength(1);
        });

        it('searches case-insensitively', async () => {
            const apiData = {
                substances: [
                    { name: 'LEAD COMPOUND', cas: '123-45-6', ec: '234-567-8', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const results = await searchEchaSubstances('lead');

            expect(results).toHaveLength(1);
        });
    });

    describe('getSubstanceByCas', () => {
        it('returns substance by exact CAS match', async () => {
            const apiData = {
                substances: [
                    { name: 'Test', cas: '123-45-6', ec: '234-567-8', reason: 'Test', dateAdded: '2020-01-01', list: 'SVHC' },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const result = await getSubstanceByCas('123-45-6');

            expect(result).toBeDefined();
            expect(result?.name).toBe('Test');
        });

        it('returns undefined when CAS not found', async () => {
            const apiData = {
                substances: [],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const result = await getSubstanceByCas('999-99-9');

            expect(result).toBeUndefined();
        });
    });

    describe('getSubstanceStats', () => {
        it('calculates statistics correctly', async () => {
            const apiData = {
                substances: [
                    { name: 'A', cas: '1', ec: '1', reason: 'Carcinogenic', dateAdded: '2020-01-01', list: 'SVHC' as const },
                    { name: 'B', cas: '2', ec: '2', reason: 'Toxic for Reproduction', dateAdded: '2020-01-01', list: 'Annex XIV' as const },
                    { name: 'C', cas: '3', ec: '3', reason: 'PBT', dateAdded: '2020-01-01', list: 'SVHC' as const },
                    { name: 'D', cas: '4', ec: '4', reason: 'Endocrine', dateAdded: '2020-01-01', list: 'SVHC' as const },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => apiData,
            });

            const stats = await getSubstanceStats();

            expect(stats.total).toBe(4);
            expect(stats.svhc).toBe(3);
            expect(stats.annexXiv).toBe(1);
            expect(stats.carcinogenic).toBe(1);
            expect(stats.reprotoxic).toBe(1);
            expect(stats.pbt).toBe(1);
            expect(stats.endocrine).toBe(1);
        });
    });

    describe('clearEchaCache', () => {
        it('removes cache from localStorage', () => {
            localStorage.setItem('echa_substances_cache', '[]');
            localStorage.setItem('echa_cache_timestamp', '123');

            clearEchaCache();

            expect(localStorage.getItem('echa_substances_cache')).toBeNull();
            expect(localStorage.getItem('echa_cache_timestamp')).toBeNull();
        });
    });

    describe('getEchaCacheInfo', () => {
        it('returns cache info when cached', () => {
            const timestamp = Date.now();
            localStorage.setItem('echa_cache_timestamp', timestamp.toString());

            const info = getEchaCacheInfo();

            expect(info.cached).toBe(true);
            expect(info.timestamp).toBe(new Date(timestamp).toISOString());
            expect(info.age).toBeGreaterThanOrEqual(0);
        });

        it('returns not cached when no timestamp', () => {
            const info = getEchaCacheInfo();

            expect(info.cached).toBe(false);
            expect(info.timestamp).toBeNull();
            expect(info.age).toBeNull();
        });
    });
});
