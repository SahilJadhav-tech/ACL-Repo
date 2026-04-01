import { test, expect } from '@playwright/test';

test('Explore Amenities page', async ({ page }) => {
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

  // Navigate directly to amenities page
  await page.goto('https://acl-webpanel.dokku.accucia.co/amenities-page', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  console.log('AMENITIES URL:', page.url());

  // Get all form inputs
  const inputs = await page.locator('input, select, textarea').all();
  console.log('\n=== ALL FORM ELEMENTS ===');
  for (const inp of inputs) {
    const tag = await inp.evaluate(el => el.tagName);
    const type = await inp.getAttribute('type');
    const name = await inp.getAttribute('name');
    const id = await inp.getAttribute('id');
    const placeholder = await inp.getAttribute('placeholder');
    const cls = await inp.getAttribute('class');
    const visible = await inp.isVisible().catch(() => false);
    console.log(`  ${tag} type=${type} name=${name} id=${id} placeholder="${placeholder}" visible=${visible} class=${cls}`);
  }

  // Get all buttons
  const buttons = await page.locator('button:visible').all();
  console.log('\n=== BUTTONS ===');
  for (const btn of buttons) {
    const text = (await btn.innerText().catch(() => '')).trim();
    const type = await btn.getAttribute('type');
    const cls = await btn.getAttribute('class');
    console.log(`  "${text}" type=${type} class=${cls}`);
  }

  // Get table info
  const tables = await page.locator('table').all();
  console.log('\n=== TABLES ===');
  for (const table of tables) {
    const id = await table.getAttribute('id');
    const cls = await table.getAttribute('class');
    const headers = await table.locator('thead th').allTextContents();
    console.log(`  Table id=${id} class=${cls} headers=${JSON.stringify(headers)}`);

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(`  Row count: ${rowCount}`);
    for (let i = 0; i < Math.min(3, rowCount); i++) {
      const cells = await rows.nth(i).locator('td').allTextContents();
      console.log(`  Row ${i}: ${JSON.stringify(cells)}`);

      // Check action links/buttons
      const actions = await rows.nth(i).locator('a, button').all();
      for (const a of actions) {
        const title = await a.getAttribute('title');
        const tag = await a.evaluate(el => el.tagName);
        const text = (await a.innerText().catch(() => '')).trim();
        console.log(`    Action: ${tag} title=${title} text="${text}"`);
      }
    }
  }
});
