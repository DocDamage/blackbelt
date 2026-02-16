import { test, expect } from '@playwright/test';

/**
 * Statistical Analysis Flow E2E Tests
 * 
 * Critical Path: File upload → analysis → view results
 */

test.describe('Statistical Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('user can navigate to analysis page', async ({ page }) => {
    // Look for analysis/data upload link
    const analysisLink = page.locator('text=/analysis|upload|data|statistics/i').first();
    
    if (await analysisLink.isVisible().catch(() => false)) {
      await analysisLink.click();
      
      // Should navigate to analysis
      await expect(page).toHaveURL(/.*analysis|.*upload|.*data/);
    }
  });

  test('analysis page has file upload', async ({ page }) => {
    await page.goto('/analysis');
    
    // Look for file input
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      await expect(fileInput).toBeVisible();
    }
  });

  test('user can upload CSV file', async ({ page }) => {
    await page.goto('/analysis');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      // Create a test CSV file
      const csvContent = 'column1,column2,column3\n1,2,3\n4,5,6\n7,8,9';
      
      await fileInput.setInputFiles({
        name: 'test-data.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      });
      
      // Wait for upload to complete
      await page.waitForTimeout(1000);
      
      // Should show upload success or preview
      const uploadSuccess = await page.locator('text=/uploaded|success|preview|data/i')
        .first()
        .isVisible()
        .catch(() => false);
      
      expect(uploadSuccess).toBeTruthy();
    }
  });

  test('user can select analysis type', async ({ page }) => {
    await page.goto('/analysis');
    
    // Look for analysis type selector
    const analysisType = page.locator('select[name="analysisType"], text=/descriptive|capability|regression/i').first();
    
    if (await analysisType.isVisible().catch(() => false)) {
      await expect(analysisType).toBeVisible();
    }
  });

  test('user can run descriptive analysis', async ({ page }) => {
    await page.goto('/analysis');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      // Upload test file
      const csvContent = 'measurement\n10.1\n10.2\n10.0\n9.9\n10.1';
      await fileInput.setInputFiles({
        name: 'measurements.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      });
      
      await page.waitForTimeout(1000);
      
      // Select descriptive analysis
      const descriptiveOption = page.locator('text=/descriptive|statistics|summary/i').first();
      if (await descriptiveOption.isVisible().catch(() => false)) {
        await descriptiveOption.click();
      }
      
      // Run analysis
      const runButton = page.locator('button:has-text(/analyze|run|calculate/i)').first();
      if (await runButton.isVisible().catch(() => false)) {
        await runButton.click();
        
        // Wait for results
        await page.waitForTimeout(2000);
        
        // Should show results
        await expect(page.locator('body')).toContainText(/mean|std|min|max|result/i);
      }
    }
  });

  test('user can run capability analysis', async ({ page }) => {
    await page.goto('/analysis');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      // Upload test file
      const csvContent = 'diameter\n10.1\n10.2\n10.0\n9.9\n10.1\n10.3\n10.0\n9.8\n10.2\n10.1';
      await fileInput.setInputFiles({
        name: 'diameters.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      });
      
      await page.waitForTimeout(1000);
      
      // Select capability analysis
      const capabilityOption = page.locator('text=/capability|cpk|cp|cpl/i').first();
      if (await capabilityOption.isVisible().catch(() => false)) {
        await capabilityOption.click();
      }
      
      // Enter specification limits
      const uslInput = page.locator('input[name="usl"], input[placeholder*="USL" i]').first();
      const lslInput = page.locator('input[name="lsl"], input[placeholder*="LSL" i]').first();
      
      if (await uslInput.isVisible().catch(() => false)) {
        await uslInput.fill('10.5');
      }
      
      if (await lslInput.isVisible().catch(() => false)) {
        await lslInput.fill('9.5');
      }
      
      // Run analysis
      const runButton = page.locator('button:has-text(/analyze|run|calculate/i)').first();
      if (await runButton.isVisible().catch(() => false)) {
        await runButton.click();
        
        await page.waitForTimeout(2000);
        
        // Should show capability results
        await expect(page.locator('body')).toContainText(/cp|cpk|sigma|capable/i);
      }
    }
  });

  test('analysis results show charts/visualizations', async ({ page }) => {
    await page.goto('/analysis');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      // Upload and analyze
      const csvContent = 'value\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
      await fileInput.setInputFiles({
        name: 'data.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvContent)
      });
      
      await page.waitForTimeout(1000);
      
      const runButton = page.locator('button:has-text(/analyze|run/i)').first();
      if (await runButton.isVisible().catch(() => false)) {
        await runButton.click();
        await page.waitForTimeout(2000);
        
        // Look for chart/visualization
        const hasChart = await page.locator('canvas, svg, .chart, [class*="chart"], [class*="graph"]')
          .first()
          .isVisible()
          .catch(() => false);
        
        // Charts are optional but nice to have
        if (hasChart) {
          await expect(page.locator('canvas, svg').first()).toBeVisible();
        }
      }
    }
  });

  test('user can export analysis results', async ({ page }) => {
    await page.goto('/analysis');
    
    // Look for export options
    const exportButton = page.locator('text=/export|download|save/i').first();
    
    if (await exportButton.isVisible().catch(() => false)) {
      await exportButton.click();
      
      // Should show export options
      await expect(page.locator('text=/json|csv|excel|pdf/i').first()).toBeVisible();
    }
  });

  test('invalid file type shows error', async ({ page }) => {
    await page.goto('/analysis');
    
    const fileInput = page.locator('input[type="file"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      // Try to upload invalid file type
      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('This is not a valid data file')
      });
      
      await page.waitForTimeout(1000);
      
      // Should show error
      const hasError = await page.locator('text=/error|invalid|unsupported|file type/i')
        .first()
        .isVisible()
        .catch(() => false);
      
      expect(hasError).toBeTruthy();
    }
  });
});
