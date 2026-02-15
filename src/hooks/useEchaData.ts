/**
 * React Hook for ECHA Data
 * 
 * Provides easy access to ECHA substance data with automatic caching,
 * loading states, and error handling.
 */

import { useState, useEffect, useCallback } from 'react';
import {
    fetchSvhcSubstances,
    searchEchaSubstances,
    getSubstanceByCas,
    getSubstanceStats,
    clearEchaCache,
    getEchaCacheInfo,
    SubstanceEntry,
    EchaApiResponse
} from '../services/echaApi';

interface EchaStats {
    total: number;
    svhc: number;
    annexXiv: number;
    annexXvii: number;
    carcinogenic: number;
    reprotoxic: number;
    pbt: number;
    vpvb: number;
    endocrine: number;
}

/**
 * Hook to access ECHA substance data
 */
interface UseEchaDataResult {
    substances: SubstanceEntry[];
    stats: EchaStats;
    loading: boolean;
    error: string | null;
    source: 'api' | 'cache' | 'fallback' | null;
    lastUpdated: string | null;
    refresh: () => Promise<void>;
    search: (query: string) => Promise<SubstanceEntry[]>;
    getByCas: (cas: string) => Promise<SubstanceEntry | undefined>;
    clearCache: () => void;
}

export function useEchaData(autoLoad: boolean = true): UseEchaDataResult {
    const [substances, setSubstances] = useState<SubstanceEntry[]>([]);
    const [stats, setStats] = useState<EchaStats>({
        total: 0,
        svhc: 0,
        annexXiv: 0,
        annexXvii: 0,
        carcinogenic: 0,
        reprotoxic: 0,
        pbt: 0,
        vpvb: 0,
        endocrine: 0,
    });
    const [loading, setLoading] = useState(autoLoad);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<'api' | 'cache' | 'fallback' | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const loadData = useCallback(async (forceRefresh: boolean = false) => {
        setLoading(true);
        setError(null);

        try {
            const response: EchaApiResponse = await fetchSvhcSubstances(forceRefresh);

            setSubstances(response.substances);
            setSource(response.source);
            setLastUpdated(response.lastUpdated);

            // Calculate stats
            const statsData = await getSubstanceStats({ forceRefresh });
            setStats(statsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load ECHA data');
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = useCallback(async () => {
        await loadData(true);
    }, [loadData]);

    const search = useCallback(async (query: string): Promise<SubstanceEntry[]> => {
        return searchEchaSubstances(query);
    }, []);

    const getByCas = useCallback(async (cas: string): Promise<SubstanceEntry | undefined> => {
        return getSubstanceByCas(cas);
    }, []);

    const clearCache = useCallback(() => {
        clearEchaCache();
    }, []);

    useEffect(() => {
        if (autoLoad) {
            loadData();
        }
    }, [autoLoad, loadData]);

    return {
        substances,
        stats,
        loading,
        error,
        source,
        lastUpdated,
        refresh,
        search,
        getByCas,
        clearCache,
    };
}

/**
 * Hook for searching ECHA substances
 */
export function useEchaSearch(initialQuery: string = '') {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SubstanceEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const searchResults = await searchEchaSubstances(searchQuery);
            setResults(searchResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (query) {
                search(query);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, search]);

    return {
        query,
        setQuery,
        results,
        loading,
        error,
        search,
    };
}

/**
 * Hook for ECHA cache management
 */
export function useEchaCache() {
    const [cacheInfo, setCacheInfo] = useState<{
        cached: boolean;
        timestamp: string | null;
        age: number | null;
    }>({ cached: false, timestamp: null, age: null });

    const refreshCacheInfo = useCallback(() => {
        setCacheInfo(getEchaCacheInfo());
    }, []);

    const clear = useCallback(() => {
        clearEchaCache();
        refreshCacheInfo();
    }, [refreshCacheInfo]);

    useEffect(() => {
        refreshCacheInfo();
    }, [refreshCacheInfo]);

    return {
        cacheInfo,
        refreshCacheInfo,
        clearCache: clear,
    };
}

export type { SubstanceEntry, EchaStats };