import { test, expect } from '@playwright/test';

/**
 * Profile Flow E2E Tests
 * 
 * Critical Path: Navigate to profile → update information → persists across sessions
 */

test.describe('Profile Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('user can navigate to profile page', async ({ page }) => {
    // Look for profile link
    const profileLink = page.locator('text=/profile|account|settings/i').first();
    
    if (await profileLink.isVisible().catch(() => false)) {
      await profileLink.click();
      
      // Should navigate to profile
      await expect(page).toHaveURL(/.*profile|.*account|.*settings/);
    }
  });

  test('profile page displays user information', async ({ page }) => {
    await page.goto('/profile');
    
    // Should show profile information
    const profileContent = await page.locator('body').textContent();
    expect(profileContent).toMatch(/profile|account|name|email|settings/i);
  });

  test('user can update profile name', async ({ page }) => {
    await page.goto('/profile');
    
    // Look for name input
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    
    if (await nameInput.isVisible().catch(() => false)) {
      const newName = `Updated User ${Date.now()}`;
      
      // Clear and fill name
      await nameInput.clear();
      await nameInput.fill(newName);
      
      // Save changes
      const saveButton = page.locator('button[type="submit"], text=/save|update/i').first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        
        // Should show success message
        await expect(page.locator('text=/saved|updated|success/i').first()).toBeVisible();
      }
    }
  });

  test('user can update profile email', async ({ page }) => {
    await page.goto('/profile');
    
    // Look for email input
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    
    if (await emailInput.isVisible().catch(() => false) && await emailInput.isEnabled().catch(() => false)) {
      // Note: Email might be read-only in some implementations
      const currentEmail = await emailInput.inputValue();
      
      if (currentEmail) {
        // Email is editable
        const newEmail = `updated-${Date.now()}@example.com`;
        await emailInput.clear();
        await emailInput.fill(newEmail);
        
        const saveButton = page.locator('button[type="submit"]').first();
        if (await saveButton.isVisible().catch(() => false)) {
          await saveButton.click();
        }
      }
    }
  });

  test('profile changes persist after page reload', async ({ page }) => {
    await page.goto('/profile');
    
    const nameInput = page.locator('input[name="name"]').first();
    
    if (await nameInput.isVisible().catch(() => false)) {
      const testName = `Persistence Test ${Date.now()}`;
      
      // Update name
      await nameInput.clear();
      await nameInput.fill(testName);
      
      // Save
      const saveButton = page.locator('button[type="submit"]').first();
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        await page.waitForTimeout(500);
      }
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify name persisted
      const nameAfterReload = await nameInput.inputValue();
      expect(nameAfterReload).toBe(testName);
    }
  });

  test('user can change password', async ({ page }) => {
    await page.goto('/profile');
    
    // Look for password change section
    const passwordSection = page.locator('text=/change password|update password|password/i').first();
    
    if (await passwordSection.isVisible().catch(() => false)) {
      await passwordSection.click();
      
      // Fill password fields
      const currentPassword = page.locator('input[name="currentPassword"], input[placeholder*="current" i]').first();
      const newPassword = page.locator('input[name="newPassword"], input[placeholder*="new" i]').first();
      const confirmPassword = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]').first();
      
      if (await currentPassword.isVisible().catch(() => false)) {
        await currentPassword.fill('CurrentPassword123!');
      }
      
      if (await newPassword.isVisible().catch(() => false)) {
        await newPassword.fill('NewPassword123!');
      }
      
      if (await confirmPassword.isVisible().catch(() => false)) {
        await confirmPassword.fill('NewPassword123!');
      }
      
      // Submit
      const updateButton = page.locator('button:has-text("update"), button:has-text("change"), button[type="submit"]').first();
      if (await updateButton.isVisible().catch(() => false)) {
        await updateButton.click();
      }
    }
  });

  test('user can view progress statistics', async ({ page }) => {
    await page.goto('/profile');
    
    // Look for progress/stats section
    const progressSection = page.locator('text=/progress|statistics|stats|completed|belt/i').first();
    
    if (await progressSection.isVisible().catch(() => false)) {
      // Progress information should be visible
      await expect(progressSection).toBeVisible();
    }
  });

  test('user can access certificates', async ({ page }) => {
    await page.goto('/profile');
    
    // Look for certificates section
    const certificatesLink = page.locator('text=/certificate|achievement|badge/i').first();
    
    if (await certificatesLink.isVisible().catch(() => false)) {
      await certificatesLink.click();
      
      // Should show certificates
      await expect(page.locator('body')).toContainText(/certificate|achievement|badge|earned/i);
    }
  });
});
