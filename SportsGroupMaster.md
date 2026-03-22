import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://your-app-url.com'; // Replace with your actual URL

// Helper function to navigate to Sports group page
async function navigateToSportsGroup(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input#username', 'admin');      // Update selectors/credentials as needed
  await page.fill('input#password', 'password');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(2000);

  // Navigate through menu to Sports group
  await page.click('text=Masters');
  await page.click('text=Sports group');
  await page.waitForTimeout(1000);
}

test.describe('Sports Group Master Tests', () => {

  test('1. Create Sports Group with Valid Data', async ({ page }) => {
    await navigateToSportsGroup(page);

    await page.fill("input[placeholder='Group name']", 'Table Tennis');

    // Make sure status toggle is active
    const statusToggle = page.locator("text=Active").locator('xpath=..').locator('input[type="checkbox"]');
    if (!(await statusToggle.isChecked())) {
      await statusToggle.click();
    }

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    // Verify new group appears in the list
    const groupNames = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(groupNames).toContain('Table Tennis');
  });

  test('2. Create Sports Group with Empty Group Name (Validation)', async ({ page }) => {
    await navigateToSportsGroup(page);

    await page.fill("input[placeholder='Group name']", '');
    await page.click('button:has-text("Submit")');

    // Check for validation message
    const errorMsg = page.locator('text=Group Name is required');
    await expect(errorMsg).toBeVisible();
  });

  test('3. Search for Existing Sports Group', async ({ page }) => {
    await navigateToSportsGroup(page);

    await page.fill("input[placeholder='Search group']", 'Football');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const searchResults = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(searchResults.some(name => name.includes('Football'))).toBeTruthy();
  });

  test('4. Edit Existing Sports Group', async ({ page }) => {
    await navigateToSportsGroup(page);

    await page.fill("input[placeholder='Search group']", 'Football');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const groupName = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (groupName === 'Football') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Group name']", 'Football Updated');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const updatedNames = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(updatedNames).toContain('Football Updated');
  });

  test('5. Delete Existing Sports Group', async ({ page }) => {
    await navigateToSportsGroup(page);

    await page.fill("input[placeholder='Search group']", 'Football Updated');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const groupName = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (groupName === 'Football Updated') {
        await rows.nth(i).locator('button[title="Delete"]').click();
        break;
      }
    }

    // Confirm dialog
    page.once('dialog', dialog => dialog.accept());
    await page.waitForTimeout(1000);

    const remainingNames = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(remainingNames).not.toContain('Football Updated');
  });

});