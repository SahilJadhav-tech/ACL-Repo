import { test, expect } from '@playwright/test';

const baseURL = 'https://your-app-url.com/user-master';

// ----------- TEST DATA -----------
const validUser = {
  fullName: 'Sahil Sharma',
  mobile: '9876543210',
  email: 'sahil.sharma@test.com',
  employeeNumber: 'EMP001',
  designation: 'Membership Coordinator',
  department: 'Hr (human Resources)',
  reportingManager: 'Sameer Accucia',
  doj: '2023-01-01',
  currentAddress: 'Pune, India',
  permanentAddress: 'Pune, India'
};

// ----------- HELPER FUNCTION -----------
async function fillUserForm(page, user) {
  await page.fill('input[placeholder="Full name"]', user.fullName);
  await page.fill('input[placeholder="Mobile Number"]', user.mobile);
  await page.fill('input[placeholder="example@domain.com"]', user.email);
  await page.fill('input[placeholder="Employee Number"]', user.employeeNumber);

  await page.selectOption('select', { label: user.designation });
  await page.selectOption('select', { label: user.department });
  await page.selectOption('select', { label: user.reportingManager });

  await page.fill('input[type="date"]', user.doj);

  await page.fill('textarea[placeholder="Enter current address"]', user.currentAddress);
  await page.fill('textarea[placeholder="Enter permanent address"]', user.permanentAddress);
}

// ----------- TEST SUITE -----------

test.describe('User Master - Add User', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  // ✅ POSITIVE

  test('TC_001 - Create user with valid data', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=success')).toBeVisible();
  });

  test('TC_002 - Same as current address', async ({ page }) => {
    await page.fill('textarea[placeholder="Enter current address"]', 'Pune');
    await page.check('input[type="checkbox"]');
    await expect(page.locator('textarea[placeholder="Enter permanent address"]')).toHaveValue('Pune');
  });

  test('TC_003 - Create inactive user', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('label:has-text("Active")');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=success')).toBeVisible();
  });

  // ❌ VALIDATIONS

  test('TC_004 - Empty form submission', async ({ page }) => {
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=required')).toHaveCountGreaterThan(0);
  });

  test('TC_005 - Invalid mobile', async ({ page }) => {
    await page.fill('input[placeholder="Mobile Number"]', '12345');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=invalid mobile')).toBeVisible();
  });

  test('TC_006 - Invalid email', async ({ page }) => {
    await page.fill('input[placeholder="example@domain.com"]', 'test@com');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=invalid email')).toBeVisible();
  });

  test('TC_007 - Future date validation', async ({ page }) => {
    await page.fill('input[type="date"]', '2099-01-01');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=invalid date')).toBeVisible();
  });

  test('TC_008 - Empty full name', async ({ page }) => {
    await page.fill('input[placeholder="Full name"]', '');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('text=required')).toBeVisible();
  });

  // 🔁 DUPLICATES

  test('TC_009 - Duplicate email', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('Submit');

    await fillUserForm(page, validUser);
    await page.click('Submit');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('TC_010 - Duplicate mobile', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('Submit');

    const user2 = { ...validUser, email: 'new@test.com' };
    await fillUserForm(page, user2);
    await page.click('Submit');

    await expect(page.locator('text=mobile already exists')).toBeVisible();
  });

  test('TC_011 - Duplicate employee number', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('Submit');

    const user2 = { ...validUser, email: 'new2@test.com', mobile: '9999999999' };
    await fillUserForm(page, user2);
    await page.click('Submit');

    await expect(page.locator('text=employee already exists')).toBeVisible();
  });

  // 🔄 STATUS

  test('TC_012 - Default status active', async ({ page }) => {
    await expect(page.locator('text=Active')).toBeVisible();
  });

  test('TC_013 - Toggle status', async ({ page }) => {
    await page.click('label:has-text("Active")');
    await expect(page.locator('text=Inactive')).toBeVisible();
  });

  // 🔄 RESET

  test('TC_014 - Reset form', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.click('button:has-text("Reset Form")');
    await expect(page.locator('input[placeholder="Full name"]')).toHaveValue('');
  });

  // 🔍 SEARCH

  test('TC_015 - Search user', async ({ page }) => {
    await page.fill('input[placeholder="Search user"]', 'Sahil');
    await expect(page.locator('text=Sahil')).toBeVisible();
  });

  // 🔒 SECURITY

  test('TC_016 - SQL Injection', async ({ page }) => {
    await page.fill('input[placeholder="Full name"]', "' OR 1=1 --");
    await page.click('Submit');
    await expect(page.locator('text=invalid')).toBeVisible();
  });

  test('TC_017 - XSS attack', async ({ page }) => {
    await page.fill('input[placeholder="Full name"]', '<script>alert(1)</script>');
    await page.click('Submit');
    await expect(page.locator('text=invalid')).toBeVisible();
  });

  // ⚡ EDGE CASES

  test('TC_018 - Double submit prevention', async ({ page }) => {
    await fillUserForm(page, validUser);
    await page.dblclick('button:has-text("Submit")');
    await expect(page.locator('text=success')).toHaveCount(1);
  });

});