import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://acl-webpanel.dokku.accucia.co';

async function login(page: Page) {
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);
  await page.fill('#mobile_number', '8483013912');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);
  await page.fill('#password', '123123');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);
}

async function goToCaste(page: Page) {
  await login(page);
  await page.goto(`${BASE_URL}/caste-page`);
  await page.waitForTimeout(3000);
}

function getTableNames(page: Page) {
  return page.locator('#caste_table tbody tr td:nth-child(2)').allTextContents();
}

// ==============================
// ✅ POSITIVE TEST CASES
// ==============================

test('TC_CM_001 - Create caste with valid data', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Brahmin');
  const chk = page.locator('#status');
  if (!(await chk.isChecked())) await chk.check();
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
  expect(names.map(n => n.trim().toLowerCase())).toContain('brahmin');
});

test('TC_CM_002 - Create another caste with valid data', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Kshatriya');
  const chk = page.locator('#status');
  if (!(await chk.isChecked())) await chk.check();
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
  expect(names.map(n => n.trim().toLowerCase())).toContain('kshatriya');
});

test('TC_CM_003 - Verify caste appears in table after creation', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Vaishya');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
  expect(names.map(n => n.trim().toLowerCase())).toContain('vaishya');
});

// ==============================
// ❌ VALIDATION TEST CASES
// ==============================

test('TC_CM_004 - Validate empty caste name submission', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  // Check for validation message or toast
  const bodyText = await page.locator('body').innerText();
  const hasValidation = bodyText.toLowerCase().includes('required') ||
    bodyText.toLowerCase().includes('please') ||
    bodyText.toLowerCase().includes('enter') ||
    bodyText.toLowerCase().includes('error') ||
    bodyText.toLowerCase().includes('validation');
  // Or check the field has validation class
  const inputCls = await page.locator('#caste_name').getAttribute('class') || '';
  const hasErrorClass = inputCls.includes('error') || inputCls.includes('invalid');
  // Or check toastr/swal
  const toastVisible = await page.locator('.toast, .swal2-popup, .toastr, [class*="toast"], [class*="alert"], [role="alert"]').isVisible().catch(() => false);
  console.log('VALIDATION:', hasValidation, 'ERROR_CLASS:', hasErrorClass, 'TOAST:', toastVisible);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 500));
  expect(hasValidation || hasErrorClass || toastVisible).toBeTruthy();
});

test('TC_CM_005 - Validate caste name with only spaces', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '     ');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  const toastVisible = await page.locator('.toast, .swal2-popup, [class*="toast"], [role="alert"]').isVisible().catch(() => false);
  const inputCls = await page.locator('#caste_name').getAttribute('class') || '';
  console.log('BODY_SNIPPET:', bodyText.substring(0, 300));
  console.log('TOAST:', toastVisible, 'INPUT_CLASS:', inputCls);
  // If spaces are accepted and trimmed, the field would be empty => should fail validation
  // Or if it saves " " as name, that's a bug
  const names = await getTableNames(page);
  const hasBlanks = names.some(n => n.trim() === '');
  console.log('HAS_BLANK_NAMES:', hasBlanks);
});

test('TC_CM_006 - Validate special characters in caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '@#$%^&*!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  const names = await getTableNames(page);
  const accepted = names.map(n => n.trim()).includes('@#$%^&*!');
  console.log('SPECIAL_CHARS_ACCEPTED:', accepted);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 300));
});

test('TC_CM_007 - Validate numeric only caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '123456');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  const accepted = names.map(n => n.trim()).includes('123456');
  console.log('NUMERIC_ACCEPTED:', accepted);
});

test('TC_CM_008 - Validate maximum length for caste name', async ({ page }) => {
  await goToCaste(page);
  const longText = 'A'.repeat(256);
  await page.fill('#caste_name', longText);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  const accepted = names.some(n => n.trim().length >= 256);
  const inputVal = await page.inputValue('#caste_name');
  console.log('LONG_TEXT_ACCEPTED:', accepted, 'INPUT_LENGTH:', inputVal.length);
});

test('TC_CM_009 - Validate single character caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'A');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  const accepted = names.map(n => n.trim()).includes('A');
  console.log('SINGLE_CHAR_ACCEPTED:', accepted);
});

test('TC_CM_010 - Validate alphanumeric caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Caste123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  const accepted = names.map(n => n.trim()).includes('Caste123');
  console.log('ALPHANUMERIC_ACCEPTED:', accepted);
});

// ==============================
// 🔁 DUPLICATE TEST CASES
// ==============================

test('TC_CM_011 - Validate duplicate caste name', async ({ page }) => {
  await goToCaste(page);
  // Try to add an existing caste
  await page.fill('#caste_name', 'Common');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  const hasDuplicateMsg = bodyText.toLowerCase().includes('already') ||
    bodyText.toLowerCase().includes('exist') ||
    bodyText.toLowerCase().includes('duplicate');
  const toastText = await page.locator('.toast-message, .swal2-html-container, [class*="toast"]').innerText().catch(() => '');
  console.log('DUPLICATE_MSG:', hasDuplicateMsg, 'TOAST:', toastText);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 500));
});

test('TC_CM_012 - Validate case insensitive duplicate check', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'common');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  const names = await getTableNames(page);
  const lowerCount = names.filter(n => n.trim().toLowerCase() === 'common').length;
  console.log('COMMON_COUNT:', lowerCount, 'NAMES:', JSON.stringify(names));
});

test('TC_CM_013 - Validate duplicate with spaces around name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '  Common  ');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  const commonCount = names.filter(n => n.trim().toLowerCase() === 'common').length;
  console.log('COMMON_WITH_SPACES_COUNT:', commonCount);
});

// ==============================
// ✏️ EDIT / UPDATE TEST CASES
// ==============================

test('TC_CM_014 - Edit existing caste name', async ({ page }) => {
  await goToCaste(page);
  // Find and click edit on a row
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  let edited = false;
  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase() === 'vaishya') {
      await rows.nth(i).locator('a[title="Edit"]').click();
      await page.waitForTimeout(1000);
      await page.fill('#caste_name', 'Vaishya Updated');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      edited = true;
      break;
    }
  }
  console.log('EDITED:', edited);
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
  if (edited) {
    expect(names.map(n => n.trim().toLowerCase())).toContain('vaishya updated');
  }
});

test('TC_CM_015 - Edit caste and submit empty name', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  await rows.first().locator('a[title="Edit"]').click();
  await page.waitForTimeout(1000);
  await page.fill('#caste_name', '');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  const inputCls = await page.locator('#caste_name').getAttribute('class') || '';
  console.log('EMPTY_EDIT_BODY:', bodyText.substring(0, 300));
  console.log('INPUT_CLASS:', inputCls);
});

test('TC_CM_016 - Edit caste name to an existing duplicate', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase() !== 'common') {
      await rows.nth(i).locator('a[title="Edit"]').click();
      await page.waitForTimeout(1000);
      await page.fill('#caste_name', 'Common');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
      break;
    }
  }
  const bodyText = await page.locator('body').innerText();
  const toastText = await page.locator('.toast-message, .swal2-html-container').innerText().catch(() => '');
  console.log('DUPLICATE_EDIT_BODY:', bodyText.substring(0, 400));
  console.log('TOAST:', toastText);
});

test('TC_CM_017 - Edit caste without changing any data', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  await rows.first().locator('a[title="Edit"]').click();
  await page.waitForTimeout(1000);
  // Don't change anything, just submit
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  console.log('NO_CHANGE_EDIT:', bodyText.substring(0, 300));
});

// ==============================
// 🗑️ DELETE TEST CASES
// ==============================

test('TC_CM_018 - Delete existing caste', async ({ page }) => {
  await goToCaste(page);
  const namesBefore = await getTableNames(page);
  console.log('BEFORE_DELETE:', JSON.stringify(namesBefore));

  // Find Vaishya Updated or any test caste to delete
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  let targetName = '';
  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase().includes('vaishya')) {
      targetName = name;
      // Handle dialog
      page.once('dialog', dialog => dialog.accept());
      await rows.nth(i).locator('a[title="Delete"]').click();
      await page.waitForTimeout(3000);
      break;
    }
  }
  console.log('DELETED_TARGET:', targetName);
  const namesAfter = await getTableNames(page);
  console.log('AFTER_DELETE:', JSON.stringify(namesAfter));
});

test('TC_CM_019 - Cancel delete confirmation dialog', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  const firstName = (await rows.first().locator('td:nth-child(2)').innerText()).trim();

  page.once('dialog', dialog => dialog.dismiss());
  await rows.first().locator('a[title="Delete"]').click();
  await page.waitForTimeout(2000);

  const names = await getTableNames(page);
  const stillExists = names.map(n => n.trim()).includes(firstName);
  console.log('CANCEL_DELETE:', firstName, 'STILL_EXISTS:', stillExists);
  expect(stillExists).toBeTruthy();
});

test('TC_CM_020 - Delete caste that is linked to sub caste', async ({ page }) => {
  await goToCaste(page);
  // Try to delete "Common" which might be linked
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name === 'Common') {
      page.once('dialog', dialog => dialog.accept());
      await rows.nth(i).locator('a[title="Delete"]').click();
      await page.waitForTimeout(3000);
      break;
    }
  }
  const bodyText = await page.locator('body').innerText();
  const toastText = await page.locator('.toast-message, .swal2-html-container').innerText().catch(() => '');
  console.log('LINKED_DELETE:', bodyText.substring(0, 400));
  console.log('TOAST:', toastText);
  // Check if Common still exists
  const names = await getTableNames(page);
  console.log('NAMES_AFTER:', JSON.stringify(names));
});

// ==============================
// 🔍 SEARCH TEST CASES
// ==============================

test('TC_CM_021 - Search caste by full name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('.input-search', 'Common');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  console.log('SEARCH_FULL:', JSON.stringify(names));
  expect(names.some(n => n.trim().toLowerCase().includes('common'))).toBeTruthy();
});

test('TC_CM_022 - Search caste by partial name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('.input-search', 'Com');
  await page.waitForTimeout(2000);
  const names = await getTableNames(page);
  console.log('SEARCH_PARTIAL:', JSON.stringify(names));
  expect(names.some(n => n.trim().toLowerCase().includes('com'))).toBeTruthy();
});

test('TC_CM_023 - Search with no matching results', async ({ page }) => {
  await goToCaste(page);
  await page.fill('.input-search', 'XYZNONEXISTENT');
  await page.waitForTimeout(2000);
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  const bodyText = await page.locator('#caste_table').innerText();
  console.log('NO_MATCH_COUNT:', count, 'TABLE_TEXT:', bodyText.substring(0, 200));
});

test('TC_CM_024 - Search with special characters', async ({ page }) => {
  await goToCaste(page);
  await page.fill('.input-search', '@#$%');
  await page.waitForTimeout(2000);
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  const bodyText = await page.locator('#caste_table').innerText();
  console.log('SPECIAL_SEARCH_COUNT:', count, 'TEXT:', bodyText.substring(0, 200));
});

test('TC_CM_025 - Clear search and verify all records shown', async ({ page }) => {
  await goToCaste(page);
  const allCount = await page.locator('#caste_table tbody tr').count();

  await page.fill('.input-search', 'Common');
  await page.waitForTimeout(2000);
  const filteredCount = await page.locator('#caste_table tbody tr').count();

  await page.fill('.input-search', '');
  await page.waitForTimeout(2000);
  const afterClearCount = await page.locator('#caste_table tbody tr').count();

  console.log('ALL:', allCount, 'FILTERED:', filteredCount, 'AFTER_CLEAR:', afterClearCount);
  expect(afterClearCount).toBeGreaterThanOrEqual(filteredCount);
});

// ==============================
// 🔄 STATUS TEST CASES
// ==============================

test('TC_CM_026 - Mark caste as inactive', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase() === 'kshatriya') {
      await rows.nth(i).locator('a[title="Edit"]').click();
      await page.waitForTimeout(1000);
      const chk = page.locator('#status');
      if (await chk.isChecked()) await chk.uncheck();
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      break;
    }
  }
  const bodyText = await page.locator('body').innerText();
  console.log('INACTIVE_RESULT:', bodyText.substring(0, 400));
});

test('TC_CM_027 - Inactive caste should not appear in active list', async ({ page }) => {
  await goToCaste(page);
  const names = await getTableNames(page);
  console.log('ACTIVE_LIST:', JSON.stringify(names));
  const hasKshatriya = names.map(n => n.trim().toLowerCase()).includes('kshatriya');
  console.log('KSHATRIYA_IN_ACTIVE:', hasKshatriya);
});

test('TC_CM_028 - View inactive caste using filter', async ({ page }) => {
  await goToCaste(page);
  // Click Filter button
  await page.click('.btn-filter-click');
  await page.waitForTimeout(2000);
  // Look for inactive/date filter options
  const bodyText = await page.locator('body').innerText();
  console.log('FILTER_BODY:', bodyText.substring(0, 600));
  // Check all visible inputs after filter click
  const inputs = await page.locator('input:visible, select:visible').all();
  for (const inp of inputs) {
    const type = await inp.getAttribute('type');
    const name = await inp.getAttribute('name');
    const id = await inp.getAttribute('id');
    const placeholder = await inp.getAttribute('placeholder');
    console.log(`FILTER_INPUT: type=${type} name=${name} id=${id} placeholder=${placeholder}`);
  }
});

test('TC_CM_029 - Reactivate inactive caste', async ({ page }) => {
  await goToCaste(page);
  // First need to find inactive castes - check if there's a way to see them
  // Try clicking filter
  await page.click('.btn-filter-click');
  await page.waitForTimeout(2000);
  const bodyText = await page.locator('body').innerText();
  console.log('REACTIVATE_BODY:', bodyText.substring(0, 600));
});

test('TC_CM_030 - Inactive caste not in sub caste dropdown', async ({ page }) => {
  await login(page);
  await page.goto(`${BASE_URL}/subcaste-page`);
  await page.waitForTimeout(3000);
  const bodyText = await page.locator('body').innerText();
  console.log('SUBCASTE_PAGE:', bodyText.substring(0, 800));
  // Look for caste dropdown
  const selects = await page.locator('select:visible').all();
  for (const s of selects) {
    const name = await s.getAttribute('name');
    const id = await s.getAttribute('id');
    const options = await s.locator('option').allTextContents();
    console.log(`SELECT: name=${name} id=${id} options=${JSON.stringify(options)}`);
  }
});

test('TC_CM_031 - Create caste with inactive status', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'TestInactive');
  const chk = page.locator('#status');
  if (await chk.isChecked()) await chk.uncheck();
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('AFTER_INACTIVE_CREATE:', JSON.stringify(names));
  const hasTestInactive = names.map(n => n.trim().toLowerCase()).includes('testinactive');
  console.log('VISIBLE_IN_TABLE:', hasTestInactive);
});

// ==============================
// 🔄 RESET / FORM TEST CASES
// ==============================

test('TC_CM_032 - Reset form after filling data', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Temp Caste');
  await page.click('button[type="reset"]');
  await page.waitForTimeout(1000);
  const value = await page.inputValue('#caste_name');
  console.log('RESET_VALUE:', `"${value}"`);
  expect(value).toBe('');
});

test('TC_CM_033 - Reset form during edit mode', async ({ page }) => {
  await goToCaste(page);
  const rows = page.locator('#caste_table tbody tr');
  await rows.first().locator('a[title="Edit"]').click();
  await page.waitForTimeout(1000);
  await page.fill('#caste_name', 'Changed Name');
  await page.click('button[type="reset"]');
  await page.waitForTimeout(1000);
  const value = await page.inputValue('#caste_name');
  console.log('RESET_EDIT_VALUE:', `"${value}"`);
});

// ==============================
// ✂️ TRIM TEST CASES
// ==============================

test('TC_CM_034 - Trim leading and trailing spaces on save', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '  Maratha  ');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('TRIM_NAMES:', JSON.stringify(names));
  const hasUntrimmed = names.some(n => n.includes('  Maratha  '));
  const hasTrimmed = names.some(n => n.trim() === 'Maratha');
  console.log('UNTRIMMED:', hasUntrimmed, 'TRIMMED:', hasTrimmed);
});

test('TC_CM_035 - Multiple spaces between words', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Scheduled   Caste');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('MULTI_SPACE_NAMES:', JSON.stringify(names));
});

// ==============================
// 📋 UI / UX TEST CASES
// ==============================

test('TC_CM_036 - Verify all UI elements are visible', async ({ page }) => {
  await goToCaste(page);
  const nameInput = await page.locator('#caste_name').isVisible();
  const statusChk = await page.locator('#status').isVisible();
  const submitBtn = await page.locator('button[type="submit"]').isVisible();
  const resetBtn = await page.locator('button[type="reset"]').isVisible();
  const searchInput = await page.locator('.input-search').isVisible();
  const table = await page.locator('#caste_table').isVisible();
  const filterBtn = await page.locator('.btn-filter-click').isVisible();
  console.log('NAME:', nameInput, 'STATUS:', statusChk, 'SUBMIT:', submitBtn, 'RESET:', resetBtn, 'SEARCH:', searchInput, 'TABLE:', table, 'FILTER:', filterBtn);
  expect(nameInput && statusChk && submitBtn && resetBtn && searchInput && table).toBeTruthy();
});

test('TC_CM_037 - Verify table column headers', async ({ page }) => {
  await goToCaste(page);
  const headers = await page.locator('#caste_table thead th').allTextContents();
  console.log('HEADERS:', JSON.stringify(headers));
  expect(headers.some(h => h.includes('Sr'))).toBeTruthy();
  expect(headers.some(h => h.includes('Caste Name'))).toBeTruthy();
  expect(headers.some(h => h.includes('Status'))).toBeTruthy();
  expect(headers.some(h => h.includes('Actions'))).toBeTruthy();
});

test('TC_CM_038 - Verify form elements on page load', async ({ page }) => {
  await goToCaste(page);
  await expect(page.locator('#caste_name')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
  await expect(page.locator('button[type="reset"]')).toBeVisible();
  await expect(page.locator('#status')).toBeVisible();
  console.log('FORM_ELEMENTS_VISIBLE: true');
});

test('TC_CM_039 - Verify pagination', async ({ page }) => {
  await goToCaste(page);
  const paginationExists = await page.locator('.pagination, .dataTables_paginate').isVisible().catch(() => false);
  console.log('PAGINATION_EXISTS:', paginationExists);
  if (paginationExists) {
    const pageLinks = await page.locator('.paginate_button, .page-link').allTextContents();
    console.log('PAGE_LINKS:', JSON.stringify(pageLinks));
  }
});

test('TC_CM_040 - Verify serial number increments correctly', async ({ page }) => {
  await goToCaste(page);
  const srNos = await page.locator('#caste_table tbody tr td:nth-child(1)').allTextContents();
  console.log('SR_NOS:', JSON.stringify(srNos));
  for (let i = 0; i < srNos.length; i++) {
    expect(parseInt(srNos[i].trim())).toBe(i + 1);
  }
});

// ==============================
// 🔒 SECURITY TEST CASES
// ==============================

test('TC_CM_041 - SQL injection in caste name field', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', "'; DROP TABLE castes; --");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const tableVisible = await page.locator('#caste_table').isVisible();
  console.log('TABLE_AFTER_SQL_INJECTION:', tableVisible);
  expect(tableVisible).toBeTruthy();
});

test('TC_CM_042 - XSS attack in caste name field', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '<script>alert("XSS")</script>');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const tableVisible = await page.locator('#caste_table').isVisible();
  console.log('TABLE_AFTER_XSS:', tableVisible);
  expect(tableVisible).toBeTruthy();
});

test('TC_CM_043 - SQL injection in search field', async ({ page }) => {
  await goToCaste(page);
  await page.fill('.input-search', "' OR 1=1; --");
  await page.waitForTimeout(2000);
  const tableVisible = await page.locator('#caste_table').isVisible();
  console.log('TABLE_AFTER_SEARCH_INJECTION:', tableVisible);
  expect(tableVisible).toBeTruthy();
});

test('TC_CM_044 - HTML injection in caste name field', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '<h1>Injected</h1>');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const h1Exists = await page.locator('#caste_table h1').isVisible().catch(() => false);
  console.log('H1_IN_TABLE:', h1Exists);
  expect(h1Exists).toBeFalsy();
});

test('TC_CM_045 - Access caste master without login', async ({ page }) => {
  await page.goto(`${BASE_URL}/caste-page`);
  await page.waitForTimeout(3000);
  const url = page.url();
  console.log('NO_LOGIN_URL:', url);
  const redirectedToLogin = url.includes('login') || url === BASE_URL + '/' || url === BASE_URL;
  const hasLoginForm = await page.locator('#mobile_number').isVisible().catch(() => false);
  console.log('REDIRECTED:', redirectedToLogin, 'HAS_LOGIN_FORM:', hasLoginForm);
});

// ==============================
// ⚡ EDGE CASES
// ==============================

test('TC_CM_046 - Rapid double click on submit button', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'RapidTestCaste');
  await page.click('button[type="submit"]');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  const count = names.filter(n => n.trim() === 'RapidTestCaste').length;
  console.log('RAPID_CLICK_COUNT:', count);
  expect(count).toBeLessThanOrEqual(1);
});

test('TC_CM_047 - Unicode characters in caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', '\u092C\u094D\u0930\u093E\u0939\u094D\u092E\u0923');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('UNICODE_NAMES:', JSON.stringify(names));
  const bodyText = await page.locator('body').innerText();
  console.log('UNICODE_BODY:', bodyText.substring(0, 300));
});

test('TC_CM_048 - Emoji in caste name', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'Test \uD83D\uDE00 Caste');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  const names = await getTableNames(page);
  console.log('EMOJI_NAMES:', JSON.stringify(names));
});

test('TC_CM_049 - Browser back button after saving', async ({ page }) => {
  await goToCaste(page);
  await page.fill('#caste_name', 'BackButtonTest');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  await page.goBack();
  await page.waitForTimeout(2000);
  await page.goForward();
  await page.waitForTimeout(2000);

  const tableVisible = await page.locator('#caste_table').isVisible().catch(() => false);
  console.log('BACK_FWD_TABLE:', tableVisible);
  console.log('URL_AFTER:', page.url());
});

test('TC_CM_050 - Page refresh should retain data', async ({ page }) => {
  await goToCaste(page);
  const beforeRefresh = await page.locator('#caste_table tbody tr').count();

  await page.reload();
  await page.waitForTimeout(3000);

  const afterRefresh = await page.locator('#caste_table tbody tr').count();
  console.log('BEFORE:', beforeRefresh, 'AFTER:', afterRefresh);
  expect(afterRefresh).toBe(beforeRefresh);
});
