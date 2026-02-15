/**
 * Test Setup Configuration
 * Configures testing utilities and global mocks
 */

import '@testing-library/jest-dom';

// Mock IndexedDB
const indexedDB = {
    open: () => ({
        result: {
            createObjectStore: () => ({}),
            transaction: () => ({
                objectStore: () => ({
                    put: () => ({}),
                    get: () => ({}),
                    delete: () => ({}),
                    getAll: () => ({}),
                }),
            }),
        },
        onsuccess: null,
        onerror: null,
    }),
};

// @ts-ignore
global.indexedDB = indexedDB;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    observe() { }
    unobserve() { }
    disconnect() { }
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
};

// Mock scrollIntoView
const elementProto = window.HTMLElement.prototype;
elementProto.scrollIntoView = () => {};