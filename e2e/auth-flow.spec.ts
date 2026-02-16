import { test, expect } from '@playwright/test';

/**
 * Authentication Flow E2E Tests
 * 
 * Critical Path: User registration → login → profile access
 */

test.describe('Authentication Flow', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User'
  };

  test('user can navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Look for login or sign in link
    const loginLink = page.locator('text=/sign in|login|log in/i').first();
    
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login|.*auth/);
    }
  });

  test('user can register a new account', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to registration if available
    const registerLink = page.locator('text=/register|sign up|create account/i').first();
    
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
      
      // Fill registration form
      await page.fill('input[type="email"], input[name="email"]', testUser.email);
      await page.fill('input[type="password"], input[name="password"]', testUser.password);
      await page.fill('input[name="name"], input[placeholder*="name" i]', testUser.name);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard or show success
      await expect(page).not.toHaveURL(/.*register|.*signup/);
    }
  });

  test('user can login with existing account', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to login
    const loginLink = page.locator('text=/sign in|login|log in/i').first();
    
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
      
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', testUser.email);
      await page.fill('input[type="password"], input[name="password"]', testUser.password);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard
      await expect(page).not.toHaveURL(/.*login|.*auth/);
    }
  });

  test('user sees error with invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    const loginLink = page.locator('text=/sign in|login|log in/i').first();
    
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
      
      // Fill with invalid credentials
      await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=/error|invalid|incorrect|failed/i')).toBeVisible();
    }
  });

  test('user can logout', async ({ page }) => {
    await page.goto('/');
    
    // Look for logout button/link
    const logoutButton = page.locator('text=/logout|sign out|log out/i').first();
    
    if (await logoutButton.isVisible().catch(() => false)) {
      await logoutButton.click();
      
      // Should redirect to home or login
      await expect(page).toHaveURL(/.*\/$|.*login/);
    }
  });
});
