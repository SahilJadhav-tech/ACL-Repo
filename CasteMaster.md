

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://acl-webpanel.dokku.accucia.co';

test('Explore - Login and find Caste Master', async ({ page }) => {
  // Step 1: Go to login page
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);

  // Log the page URL and title
  console.log('=== LOGIN PAGE ===');
  console.log('URL:', page.url());
  console.log('Title:', await page.title());

  // Get all input fields
  const inputs = await page.locator('input').all();
  console.log('Input fields found:', inputs.length);
  for (const input of inputs) {
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    const id = await input.getAttribute('id');
    const cls = await input.getAttribute('class');
    console.log(`  Input: type=${type}, name=${name}, placeholder=${placeholder}, id=${id}, class=${cls}`);
  }

  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log('Buttons found:', buttons.length);
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    const type = await btn.getAttribute('type');
    const cls = await btn.getAttribute('class');
    console.log(`  Button: text="${text}", type=${type}, class=${cls}`);
  }

  // Try to login
  console.log('\n=== ATTEMPTING LOGIN ===');

  // Try different selectors for phone/username
  const phoneInput = page.locator('input[type="text"], input[type="tel"], input[type="number"], input[name="phone"], input[name="username"], input[name="mobileNumber"]').first();
  if (await phoneInput.isVisible().catch(() => false)) {
    await phoneInput.fill('8483013912');
    console.log('Filled phone field');
  }

  const passwordInput = page.locator('input[type="password"]').first();
  if (await passwordInput.isVisible().catch(() => false)) {
    await passwordInput.fill('123123');
    console.log('Filled password field');
  }

  // Click login button
  const loginBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign"), button:has-text("login")').first();
  if (await loginBtn.isVisible().catch(() => false)) {
    await loginBtn.click();
    console.log('Clicked login button');
  }

  await page.waitForTimeout(5000);

  console.log('\n=== AFTER LOGIN ===');
  console.log('URL:', page.url());

  // Check if there's an OTP/verification step
  const pageContent = await page.content();
  if (pageContent.includes('verification') || pageContent.includes('otp') || pageContent.includes('OTP') || pageContent.includes('code')) {
    console.log('OTP/Verification page detected!');
    // Log visible text
    const bodyText = await page.locator('body').innerText();
    console.log('Page text (first 500 chars):', bodyText.substring(0, 500));
  }

  // Check for dashboard or sidebar
  const sidebarLinks = await page.locator('a, .nav-link, .menu-item, [class*="sidebar"] a, [class*="menu"] a, [class*="nav"] a').all();
  console.log('\nNavigation links found:', sidebarLinks.length);
  for (const link of sidebarLinks.slice(0, 30)) {
    const text = await link.innerText().catch(() => '');
    const href = await link.getAttribute('href');
    if (text.trim()) {
      console.log(`  Link: "${text.trim()}" -> ${href}`);
    }
  }

  // Look for "Master" or "Caste" related elements
  console.log('\n=== LOOKING FOR MASTERS/CASTE ===');
  const masterElements = await page.locator('text=Master, text=master, text=Caste, text=caste').all();
  console.log('Master/Caste elements:', masterElements.length);

  // Try clicking on Masters menu
  const mastersMenu = page.locator('text=Masters').first();
  if (await mastersMenu.isVisible().catch(() => false)) {
    await mastersMenu.click();
    await page.waitForTimeout(2000);
    console.log('Clicked Masters menu');

    // Get sub-menu items
    const subMenuItems = await page.locator('.dropdown-menu a, .submenu a, [class*="sub"] a, ul a').all();
    console.log('Sub-menu items:', subMenuItems.length);
    for (const item of subMenuItems.slice(0, 20)) {
      const text = await item.innerText().catch(() => '');
      const href = await item.getAttribute('href');
      if (text.trim()) {
        console.log(`  SubMenu: "${text.trim()}" -> ${href}`);
      }
    }
  }

  // Try to find and click "Caste" link
  const casteLink = page.locator('a:has-text("Caste"), text=Caste Master, text=Caste').first();
  if (await casteLink.isVisible().catch(() => false)) {
    await casteLink.click();
    await page.waitForTimeout(3000);
    console.log('\n=== CASTE MASTER PAGE ===');
    console.log('URL:', page.url());

    // Get all form elements
    const allInputs = await page.locator('input, select, textarea').all();
    console.log('Form elements:', allInputs.length);
    for (const el of allInputs) {
      const tag = await el.evaluate(e => e.tagName);
      const type = await el.getAttribute('type');
      const name = await el.getAttribute('name');
      const placeholder = await el.getAttribute('placeholder');
      const id = await el.getAttribute('id');
      console.log(`  ${tag}: type=${type}, name=${name}, placeholder=${placeholder}, id=${id}`);
    }

    // Get all buttons
    const allButtons = await page.locator('button').all();
    console.log('Buttons:', allButtons.length);
    for (const btn of allButtons) {
      const text = await btn.innerText().catch(() => '');
      const cls = await btn.getAttribute('class');
      const title = await btn.getAttribute('title');
      console.log(`  Button: text="${text}", class=${cls}, title=${title}`);
    }

    // Get table structure
    const tableHeaders = await page.locator('table thead th, table th').allTextContents();
    console.log('Table headers:', tableHeaders);

    // Get table rows
    const tableRows = await page.locator('table tbody tr').all();
    console.log('Table rows:', tableRows.length);
    for (const row of tableRows.slice(0, 5)) {
      const cells = await row.locator('td').allTextContents();
      console.log(`  Row: ${cells.join(' | ')}`);
    }

    // Look for toggles/checkboxes
    const toggles = await page.locator('input[type="checkbox"], .toggle, .switch, [class*="toggle"], [class*="switch"]').all();
    console.log('Toggles/Checkboxes:', toggles.length);

    // Full page HTML snippet for form area
    const formHtml = await page.locator('form').first().innerHTML().catch(() => 'No form found');
    console.log('\nForm HTML (first 1000 chars):', formHtml.substring(0, 1000));
  }
});
/