const { test, expect } = require('@playwright/test');

test.describe('Sub Caste Master Module – Full Automation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://your-app-url/subcaste'); // Update with your real URL
  });

  // ==============================
  // ✅ Create & Validation
  // ==============================

  test('Create new sub caste', async ({ page }) => {
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin'); // Select parent caste
    await page.fill('#subCasteName', 'Iyer');
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toContainText('success');
  });

  test('Mandatory validation – empty sub caste', async ({ page }) => {
    await page.click('#addBtn');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toBeVisible();
  });

  test('Duplicate sub caste validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', 'Iyengar');
    await page.click('#saveBtn');

    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', 'Iyengar');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toContainText('already exists');
  });

  test('Trim spaces validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', '  Iyer  ');
    await page.click('#saveBtn');

    await expect(page.locator('table')).toContainText('Iyer');
  });

  test('Case sensitivity validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', 'Mudaliar');
    await page.click('#saveBtn');

    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', 'mudaliar');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toContainText('already exists');
  });

  test('Maximum length validation', async ({ page }) => {
    let longName = 'S'.repeat(256); // assuming 255 max
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', longName);
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toContainText('maximum length');
  });

  test('Special characters validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.fill('#subCasteName', '@Iyer$123');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toContainText('invalid characters');
  });

  // ==============================
  // ✅ Edit & Update
  // ==============================

  test('Edit sub caste', async ({ page }) => {
    await page.click('text=Iyer');
    await page.click('#editBtn');

    await page.fill('#subCasteName', 'Iyer Updated');
    await page.selectOption('#parentCasteDropdown', 'Brahmin');
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  // ==============================
  // ✅ Delete
  // ==============================

  test('Delete sub caste', async ({ page }) => {
    await page.click('text=Iyer Updated');
    await page.click('#deleteBtn');
    await page.click('#confirmDelete');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  test('Delete restriction – linked sub caste', async ({ page }) => {
    await page.click('text=Iyengar');
    await page.click('#deleteBtn');
    await page.click('#confirmDelete');

    await expect(page.locator('#errorMsg')).toContainText('cannot delete');
  });

  // ==============================
  // ✅ Search & View
  // ==============================

  test('Search sub caste', async ({ page }) => {
    await page.fill('#searchBox', 'Iyer');
    await expect(page.locator('table')).toContainText('Iyer');
  });

  test('Partial search validation', async ({ page }) => {
    await page.fill('#searchBox', 'Iy');
    await expect(page.locator('table')).toContainText('Iyengar');
  });

  // ==============================
  // ✅ UI / UX Validations
  // ==============================

  test('UI elements visibility', async ({ page }) => {
    await expect(page.locator('#addBtn')).toBeVisible();
    await expect(page.locator('#subCasteName')).toBeVisible();
    await expect(page.locator('#saveBtn')).toBeVisible();
    await expect(page.locator('#parentCasteDropdown')).toBeVisible();
    await expect(page.locator('#searchBox')).toBeVisible();
    await expect(page.locator('#showInactive')).toBeVisible();
  });

  // ==============================
  // ✅ Inactive / Active Scenarios
  // ==============================

  test('Mark sub caste as inactive', async ({ page }) => {
    await page.click('text=Iyengar');
    await page.click('#editBtn');
    await page.click('#statusToggle'); // mark inactive
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toContainText('updated');
  });

  test('Inactive sub caste not visible in active list', async ({ page }) => {
    await page.fill('#searchBox', 'Iyengar');
    await expect(page.locator('table')).not.toContainText('Iyengar');
  });

  test('Show inactive sub caste using filter', async ({ page }) => {
    await page.click('#showInactive');
    await expect(page.locator('table')).toContainText('Iyengar');
  });

  test('Reactivate inactive sub caste', async ({ page }) => {
    await page.click('#showInactive');
    await page.click('text=Iyengar');
    await page.click('#editBtn');
    await page.click('#statusToggle'); // back to active
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  test('Inactive sub caste not selectable in dropdown', async ({ page }) => {
    await page.goto('http://your-app-url/employee');
    await page.click('#subCasteDropdown');

    await expect(page.locator('dropdown-options')).not.toContainText('Iyengar');
  });

  // ==============================
  // ✅ Permissions / Security
  // ==============================

  test('Unauthorized user cannot add/edit/delete sub caste', async ({ page }) => {
    // Assume user is logged in as read-only
    await page.click('#addBtn');
    await expect(page.locator('#errorMsg')).toContainText('unauthorized');
  });

});clear