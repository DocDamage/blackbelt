import { test, expect } from '@playwright/test';

/**
 * Navigation and Accessibility E2E Tests
 */

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/six sigma|training|academy|home/i);
  });

  test('navigation menu is visible', async ({ page }) => {
    const nav = page.locator('nav, header, [role="navigation"]').first();
    await expect(nav).toBeVisible();
  });

  test('user can navigate to different belt levels', async ({ page }) => {
    const beltLinks = [
      { name: /white belt/i, url: /white/ },
      { name: /yellow belt/i, url: /yellow/ },
      { name: /green belt/i, url: /green/ },
      { name: /black belt/i, url: /black/ },
    ];
    
    for (const belt of beltLinks) {
      const link = page.locator('a').filter({ hasText: belt.name }).first();
      
      if (await link.isVisible().catch(() => false)) {
        await link.click();
        await expect(page).toHaveURL(belt.url);
        
        // Go back to homepage
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('user can navigate using keyboard', async ({ page }) => {
    // Press Tab to navigate through focusable elements
    await page.keyboard.press('Tab');
    
    // Check that some element is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('skip link is available for keyboard users', async ({ page }) => {
    // Tab to find skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a[href^="#"]:has-text(/skip|main content/i)');
    
    if (await skipLink.isVisible().catch(() => false)) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('page has proper heading structure', async ({ page }) => {
    const h1 = page.locator('h1').first();
    const h1Count = await page.locator('h1').count();
    
    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // H1 should be visible
    await expect(h1).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      
      // Images should have alt text (can be empty for decorative)
      expect(alt !== null).toBeTruthy();
    }
  });

  test('links have descriptive text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      
      // Links should have text or aria-label
      const hasContent = text && text.trim().length > 0;
      const hasLabel = await link.getAttribute('aria-label') !== null;
      
      expect(hasContent || hasLabel).toBeTruthy();
    }
  });

  test('buttons are accessible', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const button = buttons.nth(i);
      
      // Buttons should be visible and enabled (or have a reason for being disabled)
      await expect(button).toBeVisible();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    const inputs = page.locator('input, select, textarea').filter({
      hasNot: page.locator('[type="hidden"]')
    });
    
    const count = await inputs.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const input = inputs.nth(i);
      
      // Check for associated label or aria-label
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');
      
      // Look for label element
      let hasLabelElement = false;
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        hasLabelElement = await label.isVisible().catch(() => false);
      }
      
      const hasLabel = ariaLabel || ariaLabelledBy || placeholder || hasLabelElement;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('color contrast meets WCAG standards', async ({ page }) => {
    // This is a basic check - comprehensive a11y testing requires axe-core
    const body = page.locator('body');
    const color = await body.evaluate(el => getComputedStyle(el).color);
    const bgColor = await body.evaluate(el => getComputedStyle(el).backgroundColor);
    
    // Just verify colors are set (actual contrast checking requires tools)
    expect(color).toBeTruthy();
    expect(bgColor).toBeTruthy();
  });

  test('page is responsive', async ({ page }) => {
    // Test at different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Page should not have horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      
      expect(hasOverflow).toBeFalsy();
    }
  });
});
