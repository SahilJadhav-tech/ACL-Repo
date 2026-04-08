const { test, expect } = require('@playwright/test');

test.describe('Designation Master Module', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://your-app-url/designation');
  });

  // ✅ TC_DM_001 - Create Designation
  test('Create new designation', async ({ page }) => {
    await page.click('#addBtn');
    await page.fill('#designationName', 'Software Engineer');
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toContainText('success');
  });

  // ✅ TC_DM_002 - Mandatory Validation
  test('Validate empty designation', async ({ page }) => {
    await page.click('#addBtn');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toBeVisible();
  });

  // ✅ TC_DM_003 - Duplicate Check
  test('Duplicate designation validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.fill('#designationName', 'Manager');
    await page.click('#saveBtn');

    await page.click('#addBtn');
    await page.fill('#designationName', 'Manager');
    await page.click('#saveBtn');

    await expect(page.locator('#errorMsg')).toContainText('already exists');
  });

  // ✅ TC_DM_004 - Edit Designation
  test('Edit designation', async ({ page }) => {
    await page.click('text=Software Engineer');
    await page.click('#editBtn');

    await page.fill('#designationName', 'Senior Software Engineer');
    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  // ✅ TC_DM_005 - Delete Designation
  test('Delete designation', async ({ page }) => {
    await page.click('text=Software Engineer');
    await page.click('#deleteBtn');
    await page.click('#confirmDelete');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  // ✅ TC_DM_006 - Search Designation
  test('Search designation', async ({ page }) => {
    await page.fill('#searchBox', 'Manager');

    await expect(page.locator('table')).toContainText('Manager');
  });

  // ✅ TC_DM_007 - Trim Spaces
  test('Trim spaces validation', async ({ page }) => {
    await page.click('#addBtn');
    await page.fill('#designationName', '  Developer  ');
    await page.click('#saveBtn');

    await expect(page.locator('table')).toContainText('Developer');
  });

  // ✅ TC_DM_008 - UI Check
  test('UI elements visibility', async ({ page }) => {
    await expect(page.locator('#addBtn')).toBeVisible();
    await expect(page.locator('#designationName')).toBeVisible();
    await expect(page.locator('#saveBtn')).toBeVisible();
  });

});
const { test, expect } = require('@playwright/test');

test.describe('Inactive Designation Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://your-app-url/designation');
  });

  // ✅ TC_DM_009 - Mark Designation as Inactive
  test('Mark designation as inactive', async ({ page }) => {
    await page.click('text=Software Engineer');
    await page.click('#editBtn');

    // Toggle inactive
    await page.click('#statusToggle'); // or checkbox

    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toContainText('updated');
  });

  // ✅ TC_DM_010 - Verify Inactive Not Visible in Active List
  test('Inactive designation should not appear in active list', async ({ page }) => {
    await page.fill('#searchBox', 'Software Engineer');

    await expect(page.locator('table')).not.toContainText('Software Engineer');
  });

  // ✅ TC_DM_011 - Show Inactive Records
  test('View inactive designation using filter', async ({ page }) => {
    await page.click('#showInactive'); // checkbox/filter

    await expect(page.locator('table')).toContainText('Software Engineer');
  });

  // ✅ TC_DM_012 - Reactivate Designation
  test('Reactivate inactive designation', async ({ page }) => {
    await page.click('#showInactive');
    await page.click('text=Software Engineer');

    await page.click('#editBtn');
    await page.click('#statusToggle'); // back to active

    await page.click('#saveBtn');

    await expect(page.locator('#successMsg')).toBeVisible();
  });

  // ✅ TC_DM_013 - Prevent Use of Inactive in Dropdown
  test('Inactive designation should not be selectable', async ({ page }) => {
    await page.goto('http://your-app-url/employee');

    await page.click('#designationDropdown');

    await expect(page.locator('dropdown-options')).not.toContainText('Software Engineer');
  });

});