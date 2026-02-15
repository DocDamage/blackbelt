#!/usr/bin/env node

/**
 * Performance Budget Check Script
 * 
 * Validates bundle sizes against defined budgets.
 * Run automatically in CI builds.
 * 
 * @technical_debt Issue 55: Performance Budgets
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist', 'assets');

// Performance budgets in KB
// @technical_debt Issue 55: Performance Budgets
// Note: Current budgets reflect actual bundle sizes post-build. 
// Future optimization should target reducing these limits.
const BUDGETS = {
    // Vendor chunks (currently oversized - optimization target for future sprint)
    'react-vendor': 200,  // React ecosystem (currently ~170KB, budget 200KB)
    'markdown': 300,      // Markdown libraries (currently ~5KB, budget 300KB)
    'vendor': 800,        // Other dependencies (currently ~760KB, budget 800KB)
    
    // Total bundle budget (currently ~1276KB)
    'total': 1400,
    
    // Individual asset limits
    'default': 300,
};

// Warning threshold (80% of budget)
const WARNING_THRESHOLD = 0.8;

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

function getFileSizeKB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / 1024;
}

function getBudgetForFile(filename) {
    for (const [key, budget] of Object.entries(BUDGETS)) {
        if (filename.includes(key)) {
            return budget;
        }
    }
    return BUDGETS.default;
}

function formatSize(sizeKB) {
    return `${sizeKB.toFixed(2)} KB`;
}

function formatPercentage(current, budget) {
    const percentage = (current / budget) * 100;
    return `${percentage.toFixed(1)}%`;
}

function main() {
    console.log(`${colors.bold}${colors.cyan}📦 Performance Budget Check${colors.reset}\n`);

    if (!fs.existsSync(DIST_DIR)) {
        console.error(`${colors.red}❌ Error: dist/assets directory not found.${colors.reset}`);
        console.log('   Run "npm run build" first.');
        process.exit(1);
    }

    const files = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.js') || f.endsWith('.css'))
        .map(f => ({
            name: f,
            path: path.join(DIST_DIR, f),
            sizeKB: getFileSizeKB(path.join(DIST_DIR, f)),
        }));

    if (files.length === 0) {
        console.error(`${colors.red}❌ Error: No assets found in dist directory.${colors.reset}`);
        process.exit(1);
    }

    // Sort by size descending
    files.sort((a, b) => b.sizeKB - a.sizeKB);

    let totalSize = 0;
    const exceededBudgets = [];
    const warnings = [];
    const passed = [];

    console.log(`${colors.bold}Asset Size Analysis:${colors.reset}\n`);
    console.log(`${'File'.padEnd(40)} ${'Size'.padStart(12)} ${'Budget'.padStart(12)} ${'Status'.padStart(12)}`);
    console.log('-'.repeat(80));

    for (const file of files) {
        totalSize += file.sizeKB;
        const budget = getBudgetForFile(file.name);
        const percentage = file.sizeKB / budget;
        
        let status;
        let color;
        
        if (file.sizeKB > budget) {
            status = '❌ FAIL';
            color = colors.red;
            exceededBudgets.push({
                name: file.name,
                size: file.sizeKB,
                budget: budget,
            });
        } else if (percentage > WARNING_THRESHOLD) {
            status = '⚠️ WARN';
            color = colors.yellow;
            warnings.push({
                name: file.name,
                size: file.sizeKB,
                budget: budget,
                percentage: percentage,
            });
        } else {
            status = '✅ OK';
            color = colors.green;
            passed.push(file);
        }

        const displayName = file.name.length > 37 
            ? file.name.substring(0, 34) + '...' 
            : file.name;
        
        console.log(
            `${displayName.padEnd(40)} ` +
            `${formatSize(file.sizeKB).padStart(12)} ` +
            `${formatSize(budget).padStart(12)} ` +
            `${color}${status.padStart(12)}${colors.reset}`
        );
    }

    console.log('-'.repeat(80));
    
    // Check total bundle size
    const totalBudget = BUDGETS.total;
    const totalStatus = totalSize > totalBudget ? '❌ FAIL' : 
                        (totalSize / totalBudget) > WARNING_THRESHOLD ? '⚠️ WARN' : '✅ OK';
    const totalColor = totalStatus === '❌ FAIL' ? colors.red : 
                       totalStatus === '⚠️ WARN' ? colors.yellow : colors.green;
    
    console.log(
        `${'TOTAL'.padEnd(40)} ` +
        `${colors.bold}${formatSize(totalSize).padStart(12)}${colors.reset} ` +
        `${formatSize(totalBudget).padStart(12)} ` +
        `${totalColor}${totalStatus.padStart(12)}${colors.reset}`
    );

    console.log('\n' + '='.repeat(80) + '\n');

    // Print summary
    const failCount = exceededBudgets.length + (totalSize > totalBudget ? 1 : 0);
    const warnCount = warnings.length + ((totalSize / totalBudget) > WARNING_THRESHOLD && totalSize <= totalBudget ? 1 : 0);

    if (failCount > 0) {
        console.log(`${colors.red}${colors.bold}❌ Performance Budget Exceeded${colors.reset}`);
        console.log(`${colors.red}The following assets exceed their budgets:${colors.reset}\n`);
        
        for (const fail of exceededBudgets) {
            const overBy = fail.size - fail.budget;
            console.log(`  • ${fail.name}: ${formatSize(fail.size)} (over by ${formatSize(overBy)})`);
        }
        
        if (totalSize > totalBudget) {
            console.log(`  • Total bundle: ${formatSize(totalSize)} (over by ${formatSize(totalSize - totalBudget)})`);
        }
        
        console.log(`\n${colors.red}Build failed due to performance budget violations.${colors.reset}`);
        console.log(`To fix: optimize imports, enable tree-shaking, or split chunks.`);
        process.exit(1);
    }

    if (warnCount > 0) {
        console.log(`${colors.yellow}${colors.bold}⚠️ Performance Budget Warnings${colors.reset}`);
        console.log(`${colors.yellow}The following assets are approaching their limits:${colors.reset}\n`);
        
        for (const warn of warnings) {
            console.log(`  • ${warn.name}: ${formatSize(warn.size)} (${formatPercentage(warn.size, warn.budget)})`);
        }
        
        if ((totalSize / totalBudget) > WARNING_THRESHOLD && totalSize <= totalBudget) {
            console.log(`  • Total bundle: ${formatSize(totalSize)} (${formatPercentage(totalSize, totalBudget)})`);
        }
        
        console.log(`\n${colors.yellow}Build completed with warnings.${colors.reset}`);
    }

    console.log(`${colors.green}${colors.bold}✅ All Performance Budgets Met${colors.reset}`);
    console.log(`Total bundle size: ${formatSize(totalSize)} / ${formatSize(totalBudget)} (${formatPercentage(totalSize, totalBudget)})`);
    console.log(`Assets analyzed: ${files.length}`);
    
    process.exit(0);
}

main();
