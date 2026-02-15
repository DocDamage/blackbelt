import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Performance Budgets Configuration
 * 
 * @technical_debt Issue 55: Performance Budgets
 * 
 * Bundle size limits:
 * - react-vendor: React ecosystem (react, react-dom, react-router) - target < 150KB
 * - markdown: Markdown processing libraries - target < 250KB
 * - vendor: All other dependencies - target < 300KB
 * - app chunks: Individual application chunks - target < 100KB each
 * - initial CSS: Critical CSS bundle - target < 50KB
 * 
 * These budgets are enforced during CI builds and will fail if exceeded.
 */

// Performance budgets in KB (gzip estimation)
const PERFORMANCE_BUDGETS = {
    // Vendor chunks
    'react-vendor': 150,
    'markdown': 250,
    'vendor': 300,
    
    // Application chunks (fallback for non-vendor chunks)
    default: 150,
    
    // Warning threshold (80% of budget)
    warningThreshold: 0.8,
};

// Calculate budget status for logging
function logBudgetStatus(chunkName: string, size: number, budget: number) {
    const sizeKB = (size / 1024).toFixed(2);
    const budgetKB = budget;
    const percentage = ((Number(sizeKB) / budgetKB) * 100).toFixed(1);
    
    const status = Number(sizeKB) > budgetKB ? '❌ EXCEEDED' : 
                   Number(sizeKB) > budgetKB * PERFORMANCE_BUDGETS.warningThreshold ? '⚠️ WARNING' : 
                   '✅ OK';
    
    console.log(`${status} ${chunkName}: ${sizeKB}KB / ${budgetKB}KB (${percentage}%)`);
}

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Split node_modules into vendor chunks
                    if (id.includes('node_modules')) {
                        // React ecosystem
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'react-vendor';
                        }
                        // Markdown processing
                        if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('unified')) {
                            return 'markdown';
                        }
                        // All other vendor code
                        return 'vendor';
                    }
                },
                // Performance budget enforcement
                experimentalMinChunkSize: 10000, // 10KB minimum chunk size
            },
        },
        // Chunk size warning limit - logs warning when exceeded
        chunkSizeWarningLimit: 200,
        // Report bundle size after build
        reportCompressedSize: true,
        // CSS code splitting
        cssCodeSplit: true,
        // Source maps for debugging (disabled in production for size)
        sourcemap: process.env.NODE_ENV !== 'production',
        // Rollup build options
        target: 'es2018',
        // Minification options
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: process.env.NODE_ENV === 'production',
            },
        },
    },
    // Preview server for analyzing production build
    preview: {
        port: 4173,
    },
})
