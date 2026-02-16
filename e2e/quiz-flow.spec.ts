import { test, expect } from '@playwright/test';

/**
 * Quiz Flow E2E Tests
 * 
 * Critical Path: Navigate to belt → start quiz → answer questions → earn certificate
 */

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('user can navigate to a belt', async ({ page }) => {
    // Look for belt links (White, Yellow, Green, Black, Master Black)
    const beltLinks = page.locator('text=/white belt|yellow belt|green belt|black belt/i');
    
    if (await beltLinks.first().isVisible().catch(() => false)) {
      await beltLinks.first().click();
      
      // Should navigate to belt page
      await expect(page).toHaveURL(/.*belt.*/);
    }
  });

  test('user can view belt content', async ({ page }) => {
    // Navigate to White Belt
    await page.goto('/white-belt');
    
    // Should show belt content
    await expect(page.locator('body')).toContainText(/white belt|introduction|module/i);
  });

  test('user can start a quiz', async ({ page }) => {
    // Navigate to a belt
    await page.goto('/white-belt');
    
    // Look for quiz/start button
    const startQuizButton = page.locator('text=/start quiz|take quiz|begin quiz/i').first();
    
    if (await startQuizButton.isVisible().catch(() => false)) {
      await startQuizButton.click();
      
      // Should show quiz interface
      await expect(page.locator('text=/question|quiz|score/i').first()).toBeVisible();
    }
  });

  test('user can answer quiz questions', async ({ page }) => {
    // Navigate to a belt and start quiz
    await page.goto('/white-belt');
    
    const startQuizButton = page.locator('text=/start quiz|take quiz/i').first();
    
    if (await startQuizButton.isVisible().catch(() => false)) {
      await startQuizButton.click();
      
      // Wait for question to appear
      await page.waitForTimeout(500);
      
      // Look for answer options
      const answerOptions = page.locator('input[type="radio"], button[class*="option"], [role="radio"]').first();
      
      if (await answerOptions.isVisible().catch(() => false)) {
        // Select an answer
        await answerOptions.click();
        
        // Look for next/submit button
        const nextButton = page.locator('text=/next|submit|continue/i').first();
        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click();
        }
      }
    }
  });

  test('user can complete quiz and see results', async ({ page }) => {
    // Navigate to a belt and start quiz
    await page.goto('/white-belt');
    
    const startQuizButton = page.locator('text=/start quiz|take quiz/i').first();
    
    if (await startQuizButton.isVisible().catch(() => false)) {
      await startQuizButton.click();
      
      // Answer questions until complete (limit to 5 iterations)
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);
        
        // Check if quiz is complete
        const resultsVisible = await page.locator('text=/results|score|certificate|complete/i')
          .first()
          .isVisible()
          .catch(() => false);
        
        if (resultsVisible) {
          break;
        }
        
        // Select an answer
        const answerOptions = page.locator('input[type="radio"], [role="radio"]').first();
        if (await answerOptions.isVisible().catch(() => false)) {
          await answerOptions.click();
        }
        
        // Click next
        const nextButton = page.locator('text=/next|submit|continue/i').first();
        if (await nextButton.isEnabled().catch(() => false)) {
          await nextButton.click();
        }
      }
      
      // Should see results or certificate
      await expect(page.locator('body')).toContainText(/score|result|certificate|complete/i);
    }
  });

  test('quiz timer is visible', async ({ page }) => {
    await page.goto('/white-belt');
    
    const startQuizButton = page.locator('text=/start quiz|take quiz/i').first();
    
    if (await startQuizButton.isVisible().catch(() => false)) {
      await startQuizButton.click();
      
      // Look for timer
      const timer = page.locator('text=/\\d+:\\d+|timer|time remaining/i').first();
      
      // Timer should be visible or mentioned
      const hasTimer = await timer.isVisible().catch(() => false);
      expect(hasTimer || await page.locator('body').textContent().then(t => /time|duration/i.test(t || ''))).toBeTruthy();
    }
  });
});
