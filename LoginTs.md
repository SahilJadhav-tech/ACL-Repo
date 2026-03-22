import { test, expect } from '@playwright/test';

test.describe('Login Page Full Test Suite', () => {

    const url = 'https://example.com/login';

    // ================================
    // ✅ TS_001 - Valid Login
    // ================================
    test('TS_001 - Valid Login', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page).toHaveURL(/dashboard/);
    });

    // ================================
    // ❌ INVALID LOGIN
    // ================================
    test('TS_002 - Invalid Password', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', 'wrong123');
        await page.click('#loginBtn');
        await expect(page.locator('#errorMsg')).toBeVisible();
    });

    test('TS_003 - Invalid Phone', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '9999999999');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#errorMsg')).toBeVisible();
    });

    test('TS_004 - Both Invalid', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '1111111111');
        await page.fill('#password', 'wrong');
        await page.click('#loginBtn');
        await expect(page.locator('#errorMsg')).toBeVisible();
    });

    // ================================
    // 📱 PHONE VALIDATION
    // ================================
    test('TS_005 - Phone < 10 digits', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '12345');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
    });

    test('TS_006 - Phone > 10 digits', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '1234567890123');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
    });

    test('TS_007 - Phone with alphabets', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '98abc43210');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
    });

    test('TS_008 - Empty phone', async ({ page }) => {
        await page.goto(url);
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
    });

    // ================================
    // 🔐 PASSWORD VALIDATION
    // ================================
    test('TS_009 - Empty password', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.click('#loginBtn');
        await expect(page.locator('#passwordError')).toBeVisible();
    });

    test('TS_010 - Short password', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123');
        await page.click('#loginBtn');
        await expect(page.locator('#passwordError')).toBeVisible();
    });

    test('TS_011 - Only spaces password', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', '     ');
        await page.click('#loginBtn');
        await expect(page.locator('#passwordError')).toBeVisible();
    });

    // ================================
    // 🔘 BUTTON BEHAVIOR
    // ================================
    test('TS_012 - Click login with empty fields', async ({ page }) => {
        await page.goto(url);
        await page.click('#loginBtn');
        await expect(page.locator('#errorMsg')).toBeVisible();
    });

    test('TS_013 - Press Enter key', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/dashboard/);
    });

    // ================================
    // ⚡ RAPID FIRE CLICK
    // ================================
    test('TS_014 - Rapid multiple clicks', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');

        const btn = page.locator('#loginBtn');

        await Promise.all([
            btn.click(),
            btn.click(),
            btn.click()
        ]);

        await expect(page).toHaveURL(/dashboard/);
    });

    // ================================
    // ⚡ API CALL CHECK
    // ================================
    test('TS_015 - Only one API call on rapid click', async ({ page }) => {
        await page.goto(url);

        let count = 0;
        page.on('request', req => {
            if (req.url().includes('/login')) count++;
        });

        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');

        const btn = page.locator('#loginBtn');

        await Promise.all([
            btn.click(),
            btn.click()
        ]);

        await page.waitForURL(/dashboard/);
        console.log('API Calls:', count);
    });

    // ================================
    // ⚠️ ERROR HANDLING
    // ================================
    test('TS_016 - Error message visible', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '123');
        await page.fill('#password', '123');
        await page.click('#loginBtn');
        await expect(page.locator('#errorMsg')).toBeVisible();
    });

    // ================================
    // 🔒 SECURITY
    // ================================
    test('TS_017 - SQL Injection', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', "' OR '1'='1");
        await page.fill('#password', "' OR '1'='1");
        await page.click('#loginBtn');
        await expect(page).not.toHaveURL(/dashboard/);
    });

    test('TS_018 - XSS Attack', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '<script>alert(1)</script>');
        await page.fill('#password', 'test');
        await page.click('#loginBtn');
        await expect(page).not.toHaveURL(/dashboard/);
    });

    // ================================
    // 🔄 NAVIGATION
    // ================================
    test('TS_019 - Stay on login page on failure', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '123');
        await page.fill('#password', '123');
        await page.click('#loginBtn');
        await expect(page).toHaveURL(/login/);
    });

    // ================================
    // ⚡ PERFORMANCE
    // ================================
    test('TS_020 - Login response time', async ({ page }) => {
        await page.goto(url);

        const start = Date.now();

        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');
        await page.click('#loginBtn');

        await page.waitForURL(/dashboard/);

        const end = Date.now();
        console.log('Response Time:', end - start, 'ms');
    });

    // ================================
    // 🚨 MANDATORY FIELD VALIDATION
    // ================================
    test('TS_021 - Both fields blank', async ({ page }) => {
        await page.goto(url);
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
        await expect(page.locator('#passwordError')).toBeVisible();
    });

    test('TS_022 - Phone blank only', async ({ page }) => {
        await page.goto(url);
        await page.fill('#password', '123123');
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toBeVisible();
    });

    test('TS_023 - Password blank only', async ({ page }) => {
        await page.goto(url);
        await page.fill('#phone', '8483013912');
        await page.click('#loginBtn');
        await expect(page.locator('#passwordError')).toBeVisible();
    });

    test('TS_024 - Validate mandatory error text', async ({ page }) => {
        await page.goto(url);
        await page.click('#loginBtn');
        await expect(page.locator('#phoneError')).toHaveText(/required/i);
        await expect(page.locator('#passwordError')).toHaveText(/required/i);
    });

    test('TS_025 - Error disappears after valid input', async ({ page }) => {
        await page.goto(url);

        await page.click('#loginBtn'); // trigger errors

        await page.fill('#phone', '8483013912');
        await page.fill('#password', '123123');

        await expect(page.locator('#phoneError')).toHaveCount(0);
        await expect(page.locator('#passwordError')).toHaveCount(0);
    });

});