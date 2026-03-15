import { test, expect } from '@playwright/test';

test.describe('Smoke Test - Home Page', () => {
    test('should display the main title correctly', async ({ page }) => {
        // Navigate to the home page (configured with baseURL in playwright.config.ts)
        await page.goto('/');

        // Expect the title "ChairSleep" to be visible
        await expect(page.getByRole('link', { name: 'ChairSleep' })).toBeVisible();

        // Expect the main catchphrase to be visible
        const heading = page.locator('h1');
        await expect(heading).toContainText('仮眠方法を');
    });
});
