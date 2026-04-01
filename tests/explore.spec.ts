import { test, expect } from '@playwright/test';

test('Explore Masters and Caste Master page', async ({ page }) => {
  // Login
  await page.goto('https://acl-webpanel.dokku.accucia.co');
  await page.waitForTimeout(2000);
  await page.fill('#mobile_number', '8483013912');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);
  await page.fill('#password', '123123');
  await page.click('button:has-text("Login")');
  await page.waitForTimeout(3000);

  console.log('Logged in. URL:', page.url());

  // Click Masters dropdown
  await page.click('text=Masters');
  await page.waitForTimeout(2000);

  // Get all sub-links under Masters
  const allLinks = await page.locator('a:visible').all();
  console.log('\n=== ALL VISIBLE LINKS AFTER MASTERS CLICK ===');
  for (const link of allLinks) {
    const text = (await link.innerText().catch(() => '')).trim();
    const href = await link.getAttribute('href');
    if (text) console.log(`  "${text}" -> ${href}`);
  }

  // Look for anything with "caste" in it
  const casteLinks = await page.locator('a').all();
  for (const link of casteLinks) {
    const text = (await link.innerText().catch(() => '')).trim().toLowerCase();
    const href = (await link.getAttribute('href')) || '';
    if (text.includes('caste') || href.includes('caste') || href.includes('Caste')) {
      console.log(`\nFOUND CASTE: "${text}" -> ${href}`);
    }
  }
});
