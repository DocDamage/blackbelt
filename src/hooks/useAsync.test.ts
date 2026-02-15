/**
 * Tests for useAsync Hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync, useLoading } from './useAsync';

describe('useAsync', () => {
    it('initializes with correct default state', () => {
        const mockFn = vi.fn().mockResolvedValue('data');
        const { result } = renderHook(() => useAsync(mockFn));

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('initializes with loading true when immediate is true', () => {
        const mockFn = vi.fn().mockResolvedValue('data');
        const { result } = renderHook(() => useAsync(mockFn, true));

        expect(result.current.loading).toBe(true);
    });

    it('executes async function successfully', async () => {
        const mockFn = vi.fn().mockResolvedValue('test data');
        const { result } = renderHook(() => useAsync(mockFn));

        let executeResult: string | null = null;
        await act(async () => {
            executeResult = await result.current.execute('arg1', 'arg2') as string;
        });

        expect(executeResult).toBe('test data');
        expect(result.current.data).toBe('test data');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('handles loading state during execution', async () => {
        let resolve: (value: string) => void;
        const promise = new Promise<string>((r) => { resolve = r; });
        const mockFn = vi.fn().mockReturnValue(promise);

        const { result } = renderHook(() => useAsync(mockFn));

        act(() => {
            result.current.execute();
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolve!('data');
            await promise;
        });

        expect(result.current.loading).toBe(false);
    });

    it('handles error state', async () => {
        const error = new Error('Test error');
        const mockFn = vi.fn().mockRejectedValue(error);
        const { result } = renderHook(() => useAsync(mockFn));

        await act(async () => {
            await result.current.execute();
        });

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toEqual(error);
    });

    it('handles non-error rejections', async () => {
        const mockFn = vi.fn().mockRejectedValue('string error');
        const { result } = renderHook(() => useAsync(mockFn));

        await act(async () => {
            await result.current.execute();
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('string error');
    });

    it('resets state correctly', async () => {
        const mockFn = vi.fn().mockResolvedValue('data');
        const { result } = renderHook(() => useAsync(mockFn));

        await act(async () => {
            await result.current.execute();
        });

        expect(result.current.data).toBe('data');

        act(() => {
            result.current.reset();
        });

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('returns null on error', async () => {
        const mockFn = vi.fn().mockRejectedValue(new Error('Test'));
        const { result } = renderHook(() => useAsync(mockFn));

        let executeResult: unknown;
        await act(async () => {
            executeResult = await result.current.execute();
        });

        expect(executeResult).toBeNull();
    });
});

describe('useLoading', () => {
    it('initializes with correct default state', () => {
        const { result } = renderHook(() => useLoading());
        expect(result.current.loading).toBe(false);
    });

    it('initializes with custom initial state', () => {
        const { result } = renderHook(() => useLoading(true));
        expect(result.current.loading).toBe(true);
    });

    it('sets loading state manually', () => {
        const { result } = renderHook(() => useLoading());

        act(() => {
            result.current.setLoading(true);
        });

        expect(result.current.loading).toBe(true);

        act(() => {
            result.current.setLoading(false);
        });

        expect(result.current.loading).toBe(false);
    });

    it('wraps async function with loading state', async () => {
        const { result } = renderHook(() => useLoading());
        const mockFn = vi.fn().mockResolvedValue('data');

        let fnResult: string;
        await act(async () => {
            fnResult = await result.current.withLoading(mockFn);
        });

        expect(fnResult!).toBe('data');
        expect(mockFn).toHaveBeenCalled();
    });

    it('sets loading true during wrapped function execution', async () => {
        const { result } = renderHook(() => useLoading());
        let resolve: () => void;
        const promise = new Promise<void>((r) => { resolve = r; });
        const mockFn = vi.fn().mockReturnValue(promise);

        act(() => {
            result.current.withLoading(mockFn);
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolve!();
            await promise;
        });

        expect(result.current.loading).toBe(false);
    });

    it('sets loading false even when wrapped function throws', async () => {
        const { result } = renderHook(() => useLoading());
        const mockFn = vi.fn().mockRejectedValue(new Error('Test'));

        await act(async () => {
            try {
                await result.current.withLoading(mockFn);
            } catch {
                // Expected
            }
        });

        expect(result.current.loading).toBe(false);
    });

    it('re-throws error from wrapped function', async () => {
        const { result } = renderHook(() => useLoading());
        const error = new Error('Test error');
        const mockFn = vi.fn().mockRejectedValue(error);

        await expect(
            act(async () => {
                await result.current.withLoading(mockFn);
            })
        ).rejects.toThrow('Test error');
    });
});
