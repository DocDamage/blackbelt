/**
 * ECHA API Service
 * 
 * Fetches SVHC (Substances of Very High Concern) data from the European Chemicals Agency.
 * Implements caching to minimize API calls and provide offline support.
 * 
 * ECHA Public API Documentation: https://echa.europa.eu/api
 */

// Simple logger fallback
const logger = {
    warn: (...args: unknown[]) => console.warn('[ECHA API]', ...args),
    error: (...args: unknown[]) => console.error('[ECHA API]', ...args),
    info: (...args: unknown[]) => console.info('[ECHA API]', ...args),
};

// Types
export interface SubstanceEntry {
    id?: string;
    name: string;
    cas: string;
    ec: string;
    reason: string;
    dateAdded: string;
    list: 'SVHC' | 'Annex XIV' | 'Annex XVII';
    additionalInfo?: {
        classification?: string[];
        svhcReason?: string[];
        authorizationDeadline?: string;
        restrictionDetails?: string;
    };
}

export interface EchaApiResponse {
    substances: SubstanceEntry[];
    lastUpdated: string;
    source: 'api' | 'cache' | 'fallback';
    total: number;
}

export interface EchaApiError {
    error: string;
    message: string;
    timestamp: string;
}

// Cache configuration
const CACHE_KEY = 'echa_substances_cache';
const CACHE_TIMESTAMP_KEY = 'echa_cache_timestamp';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// ECHA API endpoints (publicly accessible)
// Note: Direct API access is limited; we use backend proxy instead

// Fallback static data (used when API unavailable)
import { svhcSubstances as staticSvhcData } from '../content/compliance/echaData';

/**
 * Check if cached data is still valid
 */
function isCacheValid(): boolean {
    try {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (!timestamp) return false;

        const cacheTime = parseInt(timestamp, 10);
        const now = Date.now();
        return (now - cacheTime) < CACHE_DURATION_MS;
    } catch {
        return false;
    }
}

/**
 * Get cached substances from localStorage
 */
function getCachedSubstances(): SubstanceEntry[] | null {
    try {
        if (!isCacheValid()) return null;

        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        return JSON.parse(cached) as SubstanceEntry[];
    } catch (error) {
        logger.warn('Failed to read ECHA cache:', error);
        return null;
    }
}

/**
 * Cache substances to localStorage
 */
function cacheSubstances(substances: SubstanceEntry[]): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(substances));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
        logger.warn('Failed to cache ECHA substances:', error);
    }
}


/**
 * Fetch SVHC substances from ECHA website
 * Falls back to static data on failure
 */
export async function fetchSvhcSubstances(
    forceRefresh: boolean = false
): Promise<EchaApiResponse> {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
        const cached = getCachedSubstances();
        if (cached && cached.length > 0) {
            return {
                substances: cached,
                lastUpdated: localStorage.getItem(CACHE_TIMESTAMP_KEY) || new Date().toISOString(),
                source: 'cache',
                total: cached.length
            };
        }
    }

    try {
        // Attempt to fetch from ECHA
        // Note: Due to CORS restrictions, direct browser access may not work
        // This is designed to work with a proxy server or backend service
        const response = await fetch('/api/echa/svhc', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`ECHA API returned ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.substances) && data.substances.length > 0) {
            // Cache the results
            cacheSubstances(data.substances);

            return {
                substances: data.substances,
                lastUpdated: new Date().toISOString(),
                source: 'api',
                total: data.substances.length
            };
        }

        throw new Error('Invalid API response format');
    } catch (error) {
        logger.warn('ECHA API fetch failed, using fallback data:', error);

        // Return static fallback data
        const fallbackSubstances: SubstanceEntry[] = staticSvhcData.map((s, i) => ({
            ...s,
            id: `svhc-${s.cas}-${i}`
        }));

        return {
            substances: fallbackSubstances,
            lastUpdated: new Date().toISOString(),
            source: 'fallback',
            total: fallbackSubstances.length
        };
    }
}

/**
 * Search substances by query string
 */
export async function searchEchaSubstances(
    query: string,
    options: { forceRefresh?: boolean } = {}
): Promise<SubstanceEntry[]> {
    const { substances } = await fetchSvhcSubstances(options.forceRefresh);

    const lowerQuery = query.toLowerCase();
    return substances.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.cas.includes(lowerQuery) ||
        s.ec.includes(lowerQuery) ||
        s.reason.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get substance by CAS number
 */
export async function getSubstanceByCas(
    cas: string,
    options: { forceRefresh?: boolean } = {}
): Promise<SubstanceEntry | undefined> {
    const { substances } = await fetchSvhcSubstances(options.forceRefresh);
    return substances.find(s => s.cas === cas);
}

/**
 * Get substance statistics
 */
export async function getSubstanceStats(options: { forceRefresh?: boolean } = {}) {
    const { substances } = await fetchSvhcSubstances(options.forceRefresh);

    return {
        total: substances.length,
        svhc: substances.filter(s => s.list === 'SVHC').length,
        annexXiv: substances.filter(s => s.list === 'Annex XIV').length,
        annexXvii: substances.filter(s => s.list === 'Annex XVII').length,
        carcinogenic: substances.filter(s => s.reason.toLowerCase().includes('carcinogenic')).length,
        reprotoxic: substances.filter(s => s.reason.toLowerCase().includes('reproduction')).length,
        pbt: substances.filter(s => s.reason.toLowerCase().includes('pbt')).length,
        vpvb: substances.filter(s => s.reason.toLowerCase().includes('vpvb')).length,
        endocrine: substances.filter(s => s.reason.toLowerCase().includes('endocrine')).length,
    };
}

/**
 * Clear the ECHA cache
 */
export function clearEchaCache(): void {
    try {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    } catch (error) {
        logger.warn('Failed to clear ECHA cache:', error);
    }
}

/**
 * Get cache info
 */
export function getEchaCacheInfo(): { cached: boolean; timestamp: string | null; age: number | null } {
    try {
        const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        if (!timestamp) {
            return { cached: false, timestamp: null, age: null };
        }

        const cacheTime = parseInt(timestamp, 10);
        const age = Date.now() - cacheTime;

        return {
            cached: true,
            timestamp: new Date(cacheTime).toISOString(),
            age
        };
    } catch {
        return { cached: false, timestamp: null, age: null };
    }
}

// Export types
export type { SubstanceEntry as EchaSubstance };