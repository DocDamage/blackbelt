/**
 * Tests for Analysis API Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalysisApiClient } from './analysisApi';

// Mock fetch
global.fetch = vi.fn();

describe('AnalysisApiClient', () => {
    let client: AnalysisApiClient;

    beforeEach(() => {
        vi.clearAllMocks();
        client = new AnalysisApiClient('http://localhost:8001');
    });

    describe('healthCheck', () => {
        it('returns healthy status when API is available', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => ({ status: 'healthy', version: '1.0.0', storage_count: 10 }),
            });

            const result = await client.healthCheck();
            expect(result.healthy).toBe(true);
            expect(result.version).toBe('1.0.0');
            expect(result.storageCount).toBe(10);
        });

        it('returns unhealthy status when API returns error', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
            });

            const result = await client.healthCheck();
            expect(result.healthy).toBe(false);
        });

        it('returns unhealthy status when fetch throws', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

            const result = await client.healthCheck();
            expect(result.healthy).toBe(false);
        });
    });

    describe('isReachable', () => {
        it('returns true when API is reachable', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
            });

            const result = await client.isReachable();
            expect(result).toBe(true);
        });

        it('returns false when API is not reachable', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

            const result = await client.isReachable();
            expect(result).toBe(false);
        });
    });

    describe('uploadFile', () => {
        it('uploads file successfully', async () => {
            const mockResponse = {
                filename: 'test.csv',
                rows: 100,
                columns: ['col1', 'col2'],
                dtypes: { col1: 'float64' },
                preview: [{ col1: 1 }],
                numeric_columns: ['col1'],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.uploadFile(file);

            expect(result).toEqual(mockResponse);
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8001/upload',
                expect.objectContaining({ method: 'POST' })
            );
        });

        it('throws error when upload fails', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                statusText: 'Bad Request',
            });

            const file = new File(['content'], 'test.csv');
            await expect(client.uploadFile(file)).rejects.toThrow('Upload failed');
        });
    });

    describe('descriptive', () => {
        it('performs descriptive analysis', async () => {
            const mockResponse = {
                analysis_id: '123',
                timestamp: '2024-01-01',
                analysis_type: 'descriptive',
                results: [{ column: 'col1', mean: 10 }],
                metadata: {},
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.descriptive(file, ['col1']);

            expect(result.results).toHaveLength(1);
        });

        it('throws error when analysis fails', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: false,
                statusText: 'Server Error',
            });

            const file = new File(['content'], 'test.csv');
            await expect(client.descriptive(file)).rejects.toThrow('Analysis failed');
        });
    });

    describe('capability', () => {
        it('performs capability analysis', async () => {
            const mockResponse = {
                analysis_id: '123',
                timestamp: '2024-01-01',
                analysis_type: 'capability',
                results: { cpk: 1.33, capable: true },
                metadata: {},
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.capability(file, 'col1', 10, 2);

            expect(result.results.cpk).toBe(1.33);
        });

        it('includes target when provided', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => ({}),
            });

            const file = new File(['content'], 'test.csv');
            await client.capability(file, 'col1', 10, 2, 6);

            const mockCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
            const formData = mockCall[1]!.body as FormData;
            expect(formData.has('target')).toBe(true);
        });
    });

    describe('regression', () => {
        it('performs regression analysis', async () => {
            const mockResponse = {
                analysis_id: '123',
                results: {
                    r_squared: 0.85,
                    coefficients: {},
                },
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.regression(file, 'y', ['x1', 'x2']);

            expect(result.results.r_squared).toBe(0.85);
        });
    });

    describe('ttest', () => {
        it('performs t-test analysis', async () => {
            const mockResponse = {
                analysis_id: '123',
                results: {
                    t_statistic: 2.5,
                    p_value: 0.02,
                    significant: true,
                },
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.ttest(file, 'col1', 'one-sample');

            expect(result.results.significant).toBe(true);
        });

        it('includes optional parameters when provided', async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => ({}),
            });

            const file = new File(['content'], 'test.csv');
            await client.ttest(file, 'col1', 'two-sample', 'col2', 5, 0.01);

            const mockCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]!;
            const formData = mockCall[1]!.body as FormData;
            expect(formData.has('column2')).toBe(true);
            expect(formData.has('hypothesized_mean')).toBe(true);
            expect(formData.get('alpha')).toBe('0.01');
        });
    });

    describe('controlChart', () => {
        it('performs control chart analysis', async () => {
            const mockResponse = {
                analysis_id: '123',
                results: {
                    chart_type: 'xbar-r',
                    ucl: 10,
                    lcl: 2,
                },
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const file = new File(['content'], 'test.csv');
            const result = await client.controlChart(file, 'col1', 'xbar-r', 5);

            expect(result.results.chart_type).toBe('xbar-r');
        });
    });

    describe('getCsvExportUrl', () => {
        it('returns correct export URL', () => {
            const url = client.getCsvExportUrl('123');
            expect(url).toBe('http://localhost:8001/export/csv/123');
        });
    });

    describe('listResults', () => {
        it('returns list of analyses', async () => {
            const mockResponse = {
                count: 2,
                analyses: [
                    { analysis_id: '1', type: 'descriptive', timestamp: '2024-01-01' },
                    { analysis_id: '2', type: 'capability', timestamp: '2024-01-02' },
                ],
            };

            (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await client.listResults();
            expect(result.count).toBe(2);
        });
    });
});
