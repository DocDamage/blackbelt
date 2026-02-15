import { useState, useCallback } from 'react';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
    execute: (...args: unknown[]) => Promise<T | null>;
    reset: () => void;
}

export function useAsync<T>(asyncFn: (...args: unknown[]) => Promise<T>, immediate = false): UseAsyncReturn<T> {
    const [state, setState] = useState<AsyncState<T>>({ data: null, loading: immediate, error: null });

    const execute = useCallback(async (...args: unknown[]): Promise<T | null> => {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await asyncFn(...args);
            setState({ data, loading: false, error: null });
            return data;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({ data: null, loading: false, error: err });
            return null;
        }
    }, [asyncFn]);

    const reset = useCallback(() => { setState({ data: null, loading: false, error: null }); }, []);
    return { ...state, execute, reset };
}

export function useLoading(initialState = false): { loading: boolean; setLoading: (value: boolean) => void; withLoading: <T>(fn: () => Promise<T>) => Promise<T> } {
    const [loading, setLoading] = useState(initialState);
    const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        setLoading(true);
        try { return await fn(); } finally { setLoading(false); }
    }, []);
    return { loading, setLoading, withLoading };
}

export default useAsync;
