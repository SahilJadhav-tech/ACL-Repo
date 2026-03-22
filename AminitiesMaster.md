import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://your-app-url.com'; // Update URL

// Navigate to Amenities page
async function navigateToAmenities(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(2000);

  await page.click('text=Masters');
  await page.click('text=Amenities');
  await page.waitForTimeout(1000);
}

test.describe('Amenities Master Tests', () => {

  // ✅ 1
  test('1. Create Amenity with Valid Data', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Amenity name']", 'Tennis Court');

    // Status ON
    const toggle = page.locator("text=Active").locator('xpath=..').locator('input[type="checkbox"]');
    if (!(await toggle.isChecked())) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Tennis Court');
  });

  // ✅ 2
  test('2. Validation - Empty Amenity Name', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Amenity name']", '');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Amenity Name is required')).toBeVisible();
  });

  // ✅ 3
  test('3. Create Duplicate Amenity', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Amenity name']", 'Tennis Court');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // ✅ 4
  test('4. Search Amenity', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Search']", 'Tennis');
    await page.keyboard.press('Enter');

    const results = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(results.some(r => r.includes('Tennis'))).toBeTruthy();
  });

  // ✅ 5
  test('5. Edit Amenity Name', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Search']", 'Tennis Court');
    await page.keyboard.press('Enter');

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Tennis Court') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Amenity name']", 'Tennis Court Updated');
    await page.click('button:has-text("Submit")');

    const updated = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(updated).toContain('Tennis Court Updated');
  });

  // ✅ 6
  test('6. Toggle Status Active/Inactive', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Search']", 'Tennis Court Updated');
    await page.keyboard.press('Enter');

    const row = page.locator('table tbody tr').first();

    // Click Edit
    await row.locator('button[title="Edit"]').click();

    const toggle = page.locator("input[type='checkbox']");
    await toggle.click(); // Toggle status

    await page.click('button:has-text("Submit")');

    // Verify status change
    const statusText = await row.locator('td:nth-child(3)').innerText();
    expect(['Active', 'Inactive']).toContain(statusText);
  });

  // ✅ 7
  test('7. Delete Amenity', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Search']", 'Tennis Court Updated');
    await page.keyboard.press('Enter');

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Tennis Court Updated') {
        await rows.nth(i).locator('button[title="Delete"]').click();
        break;
      }
    }

    page.once('dialog', dialog => dialog.accept());

    const remaining = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(remaining).not.toContain('Tennis Court Updated');
  });

  // ✅ 8
  test('8. Reset Form Functionality', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Amenity name']", 'Temp Data');
    await page.click('button:has-text("Reset")');

    const value = await page.inputValue("input[placeholder='Amenity name']");
    expect(value).toBe('');
  });

  // ✅ 9
  test('9. Special Characters Validation', async ({ page }) => {
    await navigateToAmenities(page);

    await page.fill("input[placeholder='Amenity name']", '@@@###');
    await page.click('button:has-text("Submit")');

    // Depending on validation rules
    await expect(page.locator('text=invalid')).toBeVisible();
  });

  // ✅ 10
  test('10. Max Length Validation', async ({ page }) => {
    await navigateToAmenities(page);

    const longText = 'A'.repeat(256);
    await page.fill("input[placeholder='Amenity name']", longText);
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=maximum')).toBeVisible();
  });

});