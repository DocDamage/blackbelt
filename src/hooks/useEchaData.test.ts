/**
 * Tests for useEchaData Hooks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEchaData, useEchaSearch, useEchaCache } from './useEchaData';

// Mock services
vi.mock('../services/echaApi', () => ({
    fetchSvhcSubstances: vi.fn(),
    searchEchaSubstances: vi.fn(),
    getSubstanceByCas: vi.fn(),
    getSubstanceStats: vi.fn(),
    clearEchaCache: vi.fn(),
    getEchaCacheInfo: vi.fn(),
}));

import {
    fetchSvhcSubstances,
    searchEchaSubstances,
    getSubstanceByCas,
    getSubstanceStats,
    clearEchaCache,
    getEchaCacheInfo,
} from '../services/echaApi';

describe('useEchaData', () => {
    const mockSubstances = [
        { id: '1', name: 'Substance 1', cas: '123-45-6', ec: '123-456-7', reason: 'Test reason', dateAdded: '2024-01-01', list: 'SVHC' as const },
        { id: '2', name: 'Substance 2', cas: '789-01-2', ec: '789-012-3', reason: 'Test reason', dateAdded: '2024-01-01', list: 'SVHC' as const },
    ];

    const mockStats = {
        total: 100,
        svhc: 50,
        annexXiv: 20,
        annexXvii: 30,
        carcinogenic: 10,
        reprotoxic: 5,
        pbt: 8,
        vpvb: 4,
        endocrine: 3,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (fetchSvhcSubstances as ReturnType<typeof vi.fn>).mockResolvedValue({
            substances: mockSubstances,
            source: 'api',
            lastUpdated: new Date().toISOString(),
        });
        (getSubstanceStats as ReturnType<typeof vi.fn>).mockResolvedValue(mockStats);
    });

    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useEchaData(false));

        expect(result.current.substances).toEqual([]);
        expect(result.current.stats.total).toBe(0);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.source).toBeNull();
        expect(result.current.lastUpdated).toBeNull();
    });

    it('initializes with loading true when autoLoad is true', () => {
        const { result } = renderHook(() => useEchaData(true));
        expect(result.current.loading).toBe(true);
    });

    it('loads data on mount when autoLoad is true', async () => {
        const { result } = renderHook(() => useEchaData(true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.substances).toEqual(mockSubstances);
        expect(result.current.stats).toEqual(mockStats);
        expect(result.current.source).toBe('api');
    });

    it('does not load data on mount when autoLoad is false', async () => {
        renderHook(() => useEchaData(false));

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(fetchSvhcSubstances).not.toHaveBeenCalled();
    });

    it('refresh reloads data', async () => {
        const { result } = renderHook(() => useEchaData(true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        await act(async () => {
            await result.current.refresh();
        });

        expect(fetchSvhcSubstances).toHaveBeenCalledTimes(2);
        expect(fetchSvhcSubstances).toHaveBeenLastCalledWith(true);
    });

    it('search function returns results', async () => {
        const searchResults = [mockSubstances[0]];
        (searchEchaSubstances as ReturnType<typeof vi.fn>).mockResolvedValue(searchResults);

        const { result } = renderHook(() => useEchaData(false));

        let searchResult: Awaited<ReturnType<typeof result.current.search>>;
        await act(async () => {
            searchResult = await result.current.search('test');
        });

        expect(searchEchaSubstances).toHaveBeenCalledWith('test');
        expect(searchResult!).toEqual(searchResults);
    });

    it('getByCas returns substance', async () => {
        (getSubstanceByCas as ReturnType<typeof vi.fn>).mockResolvedValue(mockSubstances[0]);

        const { result } = renderHook(() => useEchaData(false));

        let substance: Awaited<ReturnType<typeof result.current.getByCas>>;
        await act(async () => {
            substance = await result.current.getByCas('123-45-6');
        });

        expect(getSubstanceByCas).toHaveBeenCalledWith('123-45-6');
        expect(substance!).toEqual(mockSubstances[0]);
    });

    it('clearCache calls clearEchaCache', async () => {
        const { result } = renderHook(() => useEchaData(false));

        act(() => {
            result.current.clearCache();
        });

        expect(clearEchaCache).toHaveBeenCalled();
    });

    it('handles errors', async () => {
        (fetchSvhcSubstances as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API Error'));

        const { result } = renderHook(() => useEchaData(true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('API Error');
    });

    it('handles string errors', async () => {
        (fetchSvhcSubstances as ReturnType<typeof vi.fn>).mockRejectedValue('String error');

        const { result } = renderHook(() => useEchaData(true));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Failed to load ECHA data');
    });
});

describe('useEchaSearch', () => {
    const mockSubstances = [
        { id: '1', name: 'Substance 1', cas: '123-45-6', ec: '123-456-7', reason: 'Test reason', dateAdded: '2024-01-01', list: 'SVHC' as const },
        { id: '2', name: 'Substance 2', cas: '789-01-2', ec: '789-012-3', reason: 'Test reason', dateAdded: '2024-01-01', list: 'SVHC' as const },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        (searchEchaSubstances as ReturnType<typeof vi.fn>).mockResolvedValue(mockSubstances);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useEchaSearch());

        expect(result.current.query).toBe('');
        expect(result.current.results).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('initializes with custom initial query', () => {
        const { result } = renderHook(() => useEchaSearch('initial'));
        expect(result.current.query).toBe('initial');
    });

    it('updates query', () => {
        const { result } = renderHook(() => useEchaSearch());

        act(() => {
            result.current.setQuery('test');
        });

        expect(result.current.query).toBe('test');
    });

    it('manual search bypasses debounce', async () => {
        (searchEchaSubstances as ReturnType<typeof vi.fn>).mockResolvedValue(mockSubstances);
        
        const { result } = renderHook(() => useEchaSearch());

        await act(async () => {
            await result.current.search('manual');
        });

        expect(searchEchaSubstances).toHaveBeenCalledWith('manual');
        expect(result.current.results).toEqual(mockSubstances);
    });

    it('manual search bypasses debounce', async () => {
        const { result } = renderHook(() => useEchaSearch());

        await act(async () => {
            await result.current.search('manual');
        });

        expect(searchEchaSubstances).toHaveBeenCalledWith('manual');
    });

    it('handles search errors', async () => {
        (searchEchaSubstances as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Search failed'));

        const { result } = renderHook(() => useEchaSearch());

        await act(async () => {
            await result.current.search('error');
        });

        expect(result.current.error).toBe('Search failed');
        expect(result.current.results).toEqual([]);
    });
});

describe('useEchaCache', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getEchaCacheInfo as ReturnType<typeof vi.fn>).mockReturnValue({
            cached: true,
            timestamp: '2024-01-01T00:00:00Z',
            age: 3600,
        });
    });

    it('initializes with cache info', () => {
        const { result } = renderHook(() => useEchaCache());

        expect(result.current.cacheInfo.cached).toBe(true);
        expect(result.current.cacheInfo.timestamp).toBe('2024-01-01T00:00:00Z');
        expect(result.current.cacheInfo.age).toBe(3600);
    });

    it('clears cache and refreshes info', () => {
        const { result } = renderHook(() => useEchaCache());

        (getEchaCacheInfo as ReturnType<typeof vi.fn>).mockReturnValue({
            cached: false,
            timestamp: null,
            age: null,
        });

        act(() => {
            result.current.clearCache();
        });

        expect(clearEchaCache).toHaveBeenCalled();
        expect(result.current.cacheInfo.cached).toBe(false);
    });

    it('refreshes cache info manually', () => {
        const { result } = renderHook(() => useEchaCache());

        (getEchaCacheInfo as ReturnType<typeof vi.fn>).mockReturnValue({
            cached: true,
            timestamp: '2024-02-01T00:00:00Z',
            age: 7200,
        });

        act(() => {
            result.current.refreshCacheInfo();
        });

        expect(getEchaCacheInfo).toHaveBeenCalledTimes(2);
        expect(result.current.cacheInfo.timestamp).toBe('2024-02-01T00:00:00Z');
    });
});
