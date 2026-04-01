import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://acl-webpanel.dokku.accucia.co';

async function login(page: Page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.fill('#mobile_number', '8483013912');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);
  await page.fill('#password', '123123');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(5000);
}

async function goToAmenities(page: Page) {
  await login(page);
  await page.evaluate(() => { window.location.href = '/amenities-page'; });
  await page.waitForTimeout(5000);
  // Wait for the table to be present
  await page.waitForSelector('#amenities_table', { timeout: 10000 }).catch(() => {});
}

async function setFlatpickrTime(page: Page, selector: string, timeValue: string) {
  await page.evaluate(({ sel, val }) => {
    const el = document.querySelector(sel) as any;
    if (el && el._flatpickr) {
      el._flatpickr.setDate(val, true);
    } else if (el) {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, { sel: selector, val: timeValue });
  await page.waitForTimeout(300);
}

function getTableNames(page: Page) {
  return page.locator('#amenities_table tbody tr td:nth-child(2)').allTextContents();
}

// ✅ 1. Create Amenity with Valid Data
test('TC_AM_001 - Create Amenity with Valid Data', async ({ page }) => {
  await goToAmenities(page);

  await page.fill('#amenity_name', 'Swimming Pool');
  await page.selectOption('#access', { label: 'Member Only' });
  await setFlatpickrTime(page, '#opening_time', '06:00 AM');
  await setFlatpickrTime(page, '#closing_time', '09:00 PM');

  const statusChk = page.locator('#status');
  if (!(await statusChk.isChecked())) await statusChk.check();

  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  // Check for success toast or table update
  const toastText = await page.locator('.toast-message, .swal2-html-container, [class*="toast"]').innerText().catch(() => '');
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
  console.log('TOAST:', toastText);
  const found = names.some(n => n.trim().toLowerCase().includes('swimming pool'));
  console.log('FOUND_SWIMMING_POOL:', found);
});

// ✅ 2. Validation - Empty Amenity Name
test('TC_AM_002 - Validation Empty Amenity Name', async ({ page }) => {
  await goToAmenities(page);

  await page.fill('#amenity_name', '');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  const hasValidation = bodyText.toLowerCase().includes('please enter amenity name') ||
    bodyText.toLowerCase().includes('required') ||
    bodyText.toLowerCase().includes('please');
  const inputCls = await page.locator('#amenity_name').getAttribute('class') || '';
  const hasErrorClass = inputCls.includes('error') || inputCls.includes('invalid');
  console.log('VALIDATION:', hasValidation, 'ERROR_CLASS:', hasErrorClass);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 500));
});

// ✅ 3. Create Duplicate Amenity
test('TC_AM_003 - Create Duplicate Amenity', async ({ page }) => {
  await goToAmenities(page);

  // Use Member Only to avoid extra required fields
  await page.fill('#amenity_name', 'Bad Minton');
  await page.selectOption('#access', { label: 'Member Only' });
  await setFlatpickrTime(page, '#opening_time', '06:00 AM');
  await setFlatpickrTime(page, '#closing_time', '08:00 PM');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  const bodyText = await page.locator('body').innerText();
  const hasDuplicateMsg = bodyText.toLowerCase().includes('already') ||
    bodyText.toLowerCase().includes('exist') ||
    bodyText.toLowerCase().includes('duplicate');
  const toastText = await page.locator('.toast-message, .swal2-html-container, [class*="toast"]').innerText().catch(() => '');
  console.log('DUPLICATE_MSG:', hasDuplicateMsg, 'TOAST:', toastText);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 500));
});

// ✅ 4. Search Amenity
test('TC_AM_004 - Search Amenity', async ({ page }) => {
  await goToAmenities(page);

  await page.fill('.input-search', 'Bad Minton');
  await page.waitForTimeout(2000);

  const names = await getTableNames(page);
  console.log('SEARCH_RESULTS:', JSON.stringify(names));
  const found = names.some(n => n.trim().toLowerCase().includes('bad minton'));
  console.log('FOUND_BAD_MINTON:', found);
});

// ✅ 5. Edit Amenity Name
test('TC_AM_005 - Edit Amenity Name', async ({ page }) => {
  await goToAmenities(page);

  const rows = page.locator('#amenities_table tbody tr');
  const count = await rows.count();
  let edited = false;

  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase().includes('tennis court')) {
      await rows.nth(i).locator('a[title="Edit"]').click();
      await page.waitForTimeout(2000);
      await page.fill('#amenity_name', 'Tennis Court Updated');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);
      edited = true;
      break;
    }
  }

  console.log('EDITED:', edited);
  const names = await getTableNames(page);
  console.log('TABLE_NAMES:', JSON.stringify(names));
});

// ✅ 6. Toggle Status Active/Inactive
test('TC_AM_006 - Toggle Status Active Inactive', async ({ page }) => {
  await goToAmenities(page);

  const rows = page.locator('#amenities_table tbody tr');
  const count = await rows.count();

  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase().includes('tennis court') || name.toLowerCase().includes('spa')) {
      await rows.nth(i).locator('a[title="Edit"]').click();
      await page.waitForTimeout(2000);

      const statusChk = page.locator('#status');
      const wasBefore = await statusChk.isChecked();
      if (wasBefore) await statusChk.uncheck();
      else await statusChk.check();

      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);

      console.log('TOGGLED:', name, 'STATUS_BEFORE:', wasBefore, 'STATUS_AFTER:', !wasBefore);
      break;
    }
  }

  const bodyText = await page.locator('body').innerText();
  console.log('TOGGLE_RESULT:', bodyText.substring(0, 400));
});

// ✅ 7. Delete Amenity
test('TC_AM_007 - Delete Amenity', async ({ page }) => {
  await goToAmenities(page);

  const namesBefore = await getTableNames(page);
  console.log('BEFORE_DELETE:', JSON.stringify(namesBefore));

  const rows = page.locator('#amenities_table tbody tr');
  const count = await rows.count();
  let targetName = '';

  for (let i = 0; i < count; i++) {
    const name = (await rows.nth(i).locator('td:nth-child(2)').innerText()).trim();
    if (name.toLowerCase().includes('swimming pool')) {
      targetName = name;
      page.once('dialog', dialog => dialog.accept());
      const deleteLink = rows.nth(i).locator('a[title="Delete"]');
      if (await deleteLink.count() > 0) {
        await deleteLink.click();
        await page.waitForTimeout(3000);
      } else {
        console.log('NO_DELETE_BUTTON_FOUND');
      }
      break;
    }
  }

  console.log('DELETED_TARGET:', targetName);
  const namesAfter = await getTableNames(page);
  console.log('AFTER_DELETE:', JSON.stringify(namesAfter));
});

// ✅ 8. Reset Form Functionality
test('TC_AM_008 - Reset Form Functionality', async ({ page }) => {
  await goToAmenities(page);

  await page.fill('#amenity_name', 'Temp Data');
  const valueBefore = await page.inputValue('#amenity_name');
  await page.click('button[type="reset"]');
  await page.waitForTimeout(1000);

  const valueAfter = await page.inputValue('#amenity_name');
  console.log('BEFORE_RESET:', `"${valueBefore}"`, 'AFTER_RESET:', `"${valueAfter}"`);
});

// ✅ 9. Special Characters Validation
test('TC_AM_009 - Special Characters Validation', async ({ page }) => {
  await goToAmenities(page);

  await page.fill('#amenity_name', '@@@###');
  await page.selectOption('#access', { label: 'Member Only' });
  await setFlatpickrTime(page, '#opening_time', '06:00 AM');
  await setFlatpickrTime(page, '#closing_time', '08:00 PM');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  const bodyText = await page.locator('body').innerText();
  const names = await getTableNames(page);
  const accepted = names.map(n => n.trim()).includes('@@@###');
  const toastText = await page.locator('.toast-message, .swal2-html-container, [class*="toast"]').innerText().catch(() => '');
  console.log('SPECIAL_CHARS_ACCEPTED:', accepted);
  console.log('TOAST:', toastText);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 300));
});

// ✅ 10. Max Length Validation
test('TC_AM_010 - Max Length Validation', async ({ page }) => {
  await goToAmenities(page);

  const longText = 'A'.repeat(256);
  await page.fill('#amenity_name', longText);
  await page.selectOption('#access', { label: 'Member Only' });
  await setFlatpickrTime(page, '#opening_time', '06:00 AM');
  await setFlatpickrTime(page, '#closing_time', '08:00 PM');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);

  const bodyText = await page.locator('body').innerText();
  const names = await getTableNames(page);
  const accepted = names.some(n => n.trim().length >= 256);
  const inputVal = await page.inputValue('#amenity_name');
  const toastText = await page.locator('.toast-message, .swal2-html-container, [class*="toast"]').innerText().catch(() => '');
  console.log('LONG_TEXT_ACCEPTED:', accepted, 'INPUT_LENGTH:', inputVal.length);
  console.log('TOAST:', toastText);
  console.log('BODY_SNIPPET:', bodyText.substring(0, 300));
});
