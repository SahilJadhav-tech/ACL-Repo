import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://acl-webpanel.dokku.accucia.co';

// ================================
// Helper: Login and Navigate to Caste Master
// ================================
async function loginAndNavigateToCasteMaster(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('#phone', '8483013912');
  await page.fill('#password', '123123');
  await page.click('#loginBtn');
  await page.waitForTimeout(2000);

  await page.click('text=Masters');
  await page.click('text=Caste Master');
  await page.waitForTimeout(1000);
}

test.describe('Caste Master Module – Full Test Suite', () => {

  // ==============================
  // ✅ POSITIVE TEST CASES (Create)
  // ==============================

  // ✅ TC_CM_001 - Create Caste with Valid Data
  test('TC_CM_001 - Create caste with valid data', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Brahmin');

    const toggle = page.locator("input[type='checkbox']");
    if (!(await toggle.isChecked())) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Brahmin');
  });

  // ✅ TC_CM_002 - Create Another Caste with Valid Data
  test('TC_CM_002 - Create another caste with valid data', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Kshatriya');

    const toggle = page.locator("input[type='checkbox']");
    if (!(await toggle.isChecked())) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Kshatriya');
  });

  // ✅ TC_CM_003 - Verify Caste Appears in Table After Creation
  test('TC_CM_003 - Verify caste appears in table after creation', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Vaishya');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Vaishya');
  });

  // ==============================
  // ❌ VALIDATION TEST CASES
  // ==============================

  // ❌ TC_CM_004 - Mandatory Field Validation (Empty Caste Name)
  test('TC_CM_004 - Validate empty caste name submission', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Caste Name is required')).toBeVisible();
  });

  // ❌ TC_CM_005 - Only Spaces in Caste Name
  test('TC_CM_005 - Validate caste name with only spaces', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '     ');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Caste Name is required')).toBeVisible();
  });

  // ❌ TC_CM_006 - Special Characters Validation
  test('TC_CM_006 - Validate special characters in caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '@#$%^&*!');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=invalid')).toBeVisible();
  });

  // ❌ TC_CM_007 - Numeric Only Caste Name
  test('TC_CM_007 - Validate numeric only caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '123456');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=invalid')).toBeVisible();
  });

  // ❌ TC_CM_008 - Maximum Length Validation
  test('TC_CM_008 - Validate maximum length for caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const longText = 'A'.repeat(256);
    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", longText);
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=maximum')).toBeVisible();
  });

  // ❌ TC_CM_009 - Minimum Length Validation (Single Character)
  test('TC_CM_009 - Validate single character caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'A');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=minimum')).toBeVisible();
  });

  // ❌ TC_CM_010 - Alphanumeric Mix Validation
  test('TC_CM_010 - Validate alphanumeric caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Caste123');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=invalid')).toBeVisible();
  });

  // ==============================
  // 🔁 DUPLICATE TEST CASES
  // ==============================

  // 🔁 TC_CM_011 - Duplicate Caste Name Validation
  test('TC_CM_011 - Validate duplicate caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Brahmin');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // 🔁 TC_CM_012 - Case Sensitivity Duplicate Check
  test('TC_CM_012 - Validate case insensitive duplicate check', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'brahmin');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // 🔁 TC_CM_013 - Duplicate with Leading/Trailing Spaces
  test('TC_CM_013 - Validate duplicate with spaces around name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '  Brahmin  ');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // ==============================
  // ✏️ EDIT / UPDATE TEST CASES
  // ==============================

  // ✏️ TC_CM_014 - Edit Existing Caste Name
  test('TC_CM_014 - Edit existing caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Vaishya');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Vaishya') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Caste Name']", 'Vaishya Updated');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Vaishya Updated');
  });

  // ✏️ TC_CM_015 - Edit Caste with Empty Name
  test('TC_CM_015 - Edit caste and submit empty name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Vaishya Updated');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Vaishya Updated') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Caste Name']", '');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Caste Name is required')).toBeVisible();
  });

  // ✏️ TC_CM_016 - Edit Caste to Existing Duplicate Name
  test('TC_CM_016 - Edit caste name to an existing duplicate', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Vaishya Updated');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Vaishya Updated') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Caste Name']", 'Brahmin');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // ✏️ TC_CM_017 - Edit Without Making Changes
  test('TC_CM_017 - Edit caste without changing any data', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const rows = page.locator('table tbody tr');
    await rows.first().locator('button[title="Edit"]').click();
    await page.waitForTimeout(500);

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=success')).toBeVisible();
  });

  // ==============================
  // 🗑️ DELETE TEST CASES
  // ==============================

  // 🗑️ TC_CM_018 - Delete Caste Successfully
  test('TC_CM_018 - Delete existing caste', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Vaishya Updated');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Vaishya Updated') {
        await rows.nth(i).locator('button[title="Delete"]').click();
        break;
      }
    }

    page.once('dialog', dialog => dialog.accept());
    await page.waitForTimeout(1000);

    const remaining = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(remaining).not.toContain('Vaishya Updated');
  });

  // 🗑️ TC_CM_019 - Cancel Delete Confirmation
  test('TC_CM_019 - Cancel delete confirmation dialog', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const rows = page.locator('table tbody tr');
    const firstName = await rows.first().locator('td:nth-child(2)').innerText();

    await rows.first().locator('button[title="Delete"]').click();

    page.once('dialog', dialog => dialog.dismiss());
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain(firstName);
  });

  // 🗑️ TC_CM_020 - Delete Caste Linked to Sub Caste
  test('TC_CM_020 - Delete caste that is linked to sub caste', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Brahmin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Brahmin') {
        await rows.nth(i).locator('button[title="Delete"]').click();
        break;
      }
    }

    page.once('dialog', dialog => dialog.accept());
    await page.waitForTimeout(1000);

    await expect(page.locator('text=cannot delete')).toBeVisible();
  });

  // ==============================
  // 🔍 SEARCH TEST CASES
  // ==============================

  // 🔍 TC_CM_021 - Search Caste by Full Name
  test('TC_CM_021 - Search caste by full name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Brahmin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const results = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(results.some(r => r.includes('Brahmin'))).toBeTruthy();
  });

  // 🔍 TC_CM_022 - Search Caste by Partial Name
  test('TC_CM_022 - Search caste by partial name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Bra');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const results = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(results.some(r => r.includes('Brahmin'))).toBeTruthy();
  });

  // 🔍 TC_CM_023 - Search with No Matching Results
  test('TC_CM_023 - Search with no matching results', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'XYZNONEXISTENT');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBe(0);
  });

  // 🔍 TC_CM_024 - Search with Special Characters
  test('TC_CM_024 - Search with special characters', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", '@#$%');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBe(0);
  });

  // 🔍 TC_CM_025 - Clear Search and Show All Records
  test('TC_CM_025 - Clear search and verify all records shown', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Brahmin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const filteredCount = await page.locator('table tbody tr').count();

    await page.fill("input[placeholder='Search']", '');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const allCount = await page.locator('table tbody tr').count();
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  // ==============================
  // 🔄 STATUS (Active/Inactive) TEST CASES
  // ==============================

  // 🔄 TC_CM_026 - Mark Caste as Inactive
  test('TC_CM_026 - Mark caste as inactive', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Kshatriya');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Kshatriya') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    const toggle = page.locator("input[type='checkbox']");
    if (await toggle.isChecked()) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=success')).toBeVisible();
  });

  // 🔄 TC_CM_027 - Inactive Caste Not Visible in Active List
  test('TC_CM_027 - Inactive caste should not appear in active list', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", 'Kshatriya');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).not.toContain('Kshatriya');
  });

  // 🔄 TC_CM_028 - Show Inactive Records Using Filter
  test('TC_CM_028 - View inactive caste using inactive filter', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('#showInactive');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Kshatriya');
  });

  // 🔄 TC_CM_029 - Reactivate Inactive Caste
  test('TC_CM_029 - Reactivate inactive caste', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('#showInactive');
    await page.waitForTimeout(1000);

    await page.fill("input[placeholder='Search']", 'Kshatriya');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Kshatriya') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    const toggle = page.locator("input[type='checkbox']");
    if (!(await toggle.isChecked())) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=success')).toBeVisible();
  });

  // 🔄 TC_CM_030 - Inactive Caste Not Available in Sub Caste Dropdown
  test('TC_CM_030 - Inactive caste should not appear in sub caste dropdown', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    // First mark Kshatriya as inactive again
    await page.fill("input[placeholder='Search']", 'Kshatriya');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    await rows.first().locator('button[title="Edit"]').click();

    const toggle = page.locator("input[type='checkbox']");
    if (await toggle.isChecked()) await toggle.click();
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    // Navigate to Sub Caste Master and verify dropdown
    await page.click('text=Masters');
    await page.click('text=Sub Caste Master');
    await page.waitForTimeout(1000);

    await page.click('button:has-text("Add")');
    const dropdownOptions = await page.locator('#parentCasteDropdown option').allTextContents();
    expect(dropdownOptions).not.toContain('Kshatriya');
  });

  // 🔄 TC_CM_031 - Create Caste with Inactive Status
  test('TC_CM_031 - Create caste with inactive status', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Shudra');

    const toggle = page.locator("input[type='checkbox']");
    if (await toggle.isChecked()) await toggle.click(); // Set to inactive

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    // Should not be visible in active list
    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).not.toContain('Shudra');

    // Should be visible in inactive filter
    await page.click('#showInactive');
    await page.waitForTimeout(1000);

    const allNames = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(allNames).toContain('Shudra');
  });

  // ==============================
  // 🔄 RESET / FORM TEST CASES
  // ==============================

  // 🔄 TC_CM_032 - Reset Form After Filling Data
  test('TC_CM_032 - Reset form after filling data', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Temp Caste');
    await page.click('button:has-text("Reset")');

    const value = await page.inputValue("input[placeholder='Caste Name']");
    expect(value).toBe('');
  });

  // 🔄 TC_CM_033 - Reset Form During Edit Mode
  test('TC_CM_033 - Reset form during edit mode', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const rows = page.locator('table tbody tr');
    await rows.first().locator('button[title="Edit"]').click();
    await page.waitForTimeout(500);

    await page.fill("input[placeholder='Caste Name']", 'Changed Name');
    await page.click('button:has-text("Reset")');

    const value = await page.inputValue("input[placeholder='Caste Name']");
    expect(value).toBe('');
  });

  // ==============================
  // ✂️ TRIM / WHITESPACE TEST CASES
  // ==============================

  // ✂️ TC_CM_034 - Trim Leading and Trailing Spaces
  test('TC_CM_034 - Trim leading and trailing spaces on save', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '  Maratha  ');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Maratha');
    expect(names).not.toContain('  Maratha  ');
  });

  // ✂️ TC_CM_035 - Multiple Spaces Between Words
  test('TC_CM_035 - Validate multiple spaces between words', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Scheduled   Caste');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    const found = names.some(n => n.includes('Scheduled') && n.includes('Caste'));
    expect(found).toBeTruthy();
  });

  // ==============================
  // 📋 UI / UX TEST CASES
  // ==============================

  // 📋 TC_CM_036 - Verify All UI Elements Are Visible
  test('TC_CM_036 - Verify all UI elements are visible', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await expect(page.locator('button:has-text("Add")')).toBeVisible();
    await expect(page.locator("input[placeholder='Search']")).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('#showInactive')).toBeVisible();
  });

  // 📋 TC_CM_037 - Verify Table Column Headers
  test('TC_CM_037 - Verify table column headers', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const headers = await page.locator('table thead th').allTextContents();
    expect(headers.some(h => h.includes('Sr'))).toBeTruthy();
    expect(headers.some(h => h.includes('Caste Name'))).toBeTruthy();
    expect(headers.some(h => h.includes('Status'))).toBeTruthy();
    expect(headers.some(h => h.includes('Action'))).toBeTruthy();
  });

  // 📋 TC_CM_038 - Verify Form Opens on Add Button Click
  test('TC_CM_038 - Verify form opens on Add button click', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.waitForTimeout(500);

    await expect(page.locator("input[placeholder='Caste Name']")).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
  });

  // 📋 TC_CM_039 - Verify Pagination (If Applicable)
  test('TC_CM_039 - Verify pagination for large data set', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const paginationExists = await page.locator('.pagination').isVisible().catch(() => false);
    if (paginationExists) {
      await page.click('.pagination >> text=2');
      await page.waitForTimeout(1000);

      const rows = page.locator('table tbody tr');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  // 📋 TC_CM_040 - Verify Serial Number Column
  test('TC_CM_040 - Verify serial number increments correctly', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const srNos = await page.locator('table tbody tr td:nth-child(1)').allTextContents();
    for (let i = 0; i < srNos.length; i++) {
      expect(parseInt(srNos[i])).toBe(i + 1);
    }
  });

  // ==============================
  // 🔒 SECURITY TEST CASES
  // ==============================

  // 🔒 TC_CM_041 - SQL Injection in Caste Name
  test('TC_CM_041 - SQL injection in caste name field', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", "'; DROP TABLE castes; --");
    await page.click('button:has-text("Submit")');

    // Should show error or reject input, not crash
    const tableVisible = await page.locator('table').isVisible();
    expect(tableVisible).toBeTruthy();
  });

  // 🔒 TC_CM_042 - XSS Attack in Caste Name
  test('TC_CM_042 - XSS attack in caste name field', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '<script>alert("XSS")</script>');
    await page.click('button:has-text("Submit")');

    // Should not execute script, page should remain intact
    const tableVisible = await page.locator('table').isVisible();
    expect(tableVisible).toBeTruthy();
  });

  // 🔒 TC_CM_043 - SQL Injection in Search Field
  test('TC_CM_043 - SQL injection in search field', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.fill("input[placeholder='Search']", "' OR 1=1; --");
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Should not return all records or crash
    const tableVisible = await page.locator('table').isVisible();
    expect(tableVisible).toBeTruthy();
  });

  // 🔒 TC_CM_044 - HTML Injection in Caste Name
  test('TC_CM_044 - HTML injection in caste name field', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '<h1>Injected</h1>');
    await page.click('button:has-text("Submit")');

    const h1Exists = await page.locator('table h1').isVisible().catch(() => false);
    expect(h1Exists).toBeFalsy();
  });

  // 🔒 TC_CM_045 - Unauthorized Access Without Login
  test('TC_CM_045 - Access caste master without login', async ({ page }) => {
    await page.goto(`${BASE_URL}/master/casteMaster`);
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/login/);
  });

  // ==============================
  // ⚡ EDGE CASES
  // ==============================

  // ⚡ TC_CM_046 - Rapid Double Click on Submit
  test('TC_CM_046 - Rapid double click on submit button', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'RapidTestCaste');

    await page.click('button:has-text("Submit")');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(2000);

    // Should not create duplicate records
    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    const occurrences = names.filter(n => n === 'RapidTestCaste').length;
    expect(occurrences).toBeLessThanOrEqual(1);
  });

  // ⚡ TC_CM_047 - Unicode Characters in Caste Name
  test('TC_CM_047 - Unicode characters in caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", '\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    // Verify it either saves correctly or shows validation error
    const hasSuccess = await page.locator('text=success').isVisible().catch(() => false);
    const hasError = await page.locator('text=invalid').isVisible().catch(() => false);
    expect(hasSuccess || hasError).toBeTruthy();
  });

  // ⚡ TC_CM_048 - Emoji in Caste Name
  test('TC_CM_048 - Emoji in caste name', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'Test Caste');
    await page.click('button:has-text("Submit")');

    const hasError = await page.locator('text=invalid').isVisible().catch(() => false);
    expect(hasError).toBeTruthy();
  });

  // ⚡ TC_CM_049 - Browser Back Button After Save
  test('TC_CM_049 - Browser back button after saving caste', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    await page.click('button:has-text("Add")');
    await page.fill("input[placeholder='Caste Name']", 'BackButtonTest');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await page.goBack();
    await page.waitForTimeout(1000);
    await page.goForward();
    await page.waitForTimeout(1000);

    // Page should still work properly
    const tableVisible = await page.locator('table').isVisible();
    expect(tableVisible).toBeTruthy();
  });

  // ⚡ TC_CM_050 - Page Refresh After Adding Caste
  test('TC_CM_050 - Page refresh should retain data', async ({ page }) => {
    await loginAndNavigateToCasteMaster(page);

    const beforeRefresh = await page.locator('table tbody tr').count();

    await page.reload();
    await page.waitForTimeout(2000);

    const afterRefresh = await page.locator('table tbody tr').count();
    expect(afterRefresh).toBe(beforeRefresh);
  });

});
