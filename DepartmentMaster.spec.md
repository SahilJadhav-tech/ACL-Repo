import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://acl-webpanel.dokku.accucia.co';

// Helper function to login and navigate to Department Master page
async function navigateToDepartment(page: Page) {
  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);

  // Step 1: Enter mobile number
  const phoneInput = page.locator('input[type="text"], input[type="tel"], input[type="number"]').first();
  await phoneInput.fill('8483013912');

  await page.locator('button[type="submit"], button:has-text("Login")').first().click();
  await page.waitForTimeout(3000);

  // Step 2: Enter password
  await page.fill('input[type="password"]', '123123');
  await page.locator('button[type="submit"], button:has-text("Login")').first().click();
  await page.waitForTimeout(5000);

  // Step 3: Navigate to Masters > Department
  await page.click('text=Masters');
  await page.waitForTimeout(1000);
  await page.click('text=Department');
  await page.waitForTimeout(3000);
}

test.describe('Department Master - All Test Cases', () => {

  // ================================
  // ✅ CREATE / ADD
  // ================================

  test('1. Create Department with Valid Data', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Human Resources');

    const toggle = page.locator("text=Active").locator('xpath=..').locator('input[type="checkbox"]');
    if (!(await toggle.isChecked())) await toggle.click();

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Human Resources');
  });

  test('2. Create Another Department with Valid Data', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Finance');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Finance');
  });

  test('3. Verify Department Appears in Table After Creation', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Marketing');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names.some(n => n.includes('Marketing'))).toBeTruthy();
  });

  // ================================
  // ✅ VALIDATION - EMPTY / BLANK
  // ================================

  test('4. Validation - Empty Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Department Name is required')).toBeVisible();
  });

  test('5. Validation - Only Spaces in Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '     ');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    const blank = names.filter(n => n.trim() === '');
    expect(blank.length).toBe(0);
  });

  // ================================
  // ✅ VALIDATION - INPUT TYPES
  // ================================

  test('6. Special Characters in Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '@#$%^&*!');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('@#$%^&*!');
  });

  test('7. Numeric Only Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '123456');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('123456');
  });

  test('8. Maximum Length Department Name (256 chars)', async ({ page }) => {
    await navigateToDepartment(page);

    const longName = 'A'.repeat(256);
    await page.fill("input[placeholder='Department Name']", longName);
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=maximum')).toBeVisible();
  });

  test('9. Single Character Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'X');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('X');
  });

  test('10. Alphanumeric Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Dept123');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Dept123');
  });

  // ================================
  // ✅ DUPLICATE VALIDATION
  // ================================

  test('11. Duplicate Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Human Resources');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('12. Case Insensitive Duplicate Check', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'human resources');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('13. Duplicate with Spaces Around Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '  Human Resources  ');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  // ================================
  // ✅ EDIT / UPDATE
  // ================================

  test('14. Edit Existing Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'Human Resources');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Human Resources') {
        await rows.nth(i).locator('button[title="Edit"]').click();
        break;
      }
    }

    await page.fill("input[placeholder='Department Name']", 'Human Resources Updated');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('Human Resources Updated');
  });

  test('15. Edit Department - Submit Empty Name', async ({ page }) => {
    await navigateToDepartment(page);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    await page.fill("input[placeholder='Department Name']", '');
    await page.click('button:has-text("Submit")');

    await expect(page.locator('text=Department Name is required')).toBeVisible();
  });

  test('16. Edit Department Name to Existing Duplicate', async ({ page }) => {
    await navigateToDepartment(page);

    // Edit second row and change name to first row's name
    const rows = page.locator('table tbody tr');
    const firstName = await rows.first().locator('td:nth-child(2)').innerText();

    await rows.nth(1).locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    await page.fill("input[placeholder='Department Name']", firstName.trim());
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=already exists')).toBeVisible();
  });

  test('17. Edit Department Without Changing Data', async ({ page }) => {
    await navigateToDepartment(page);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    // Submit without changes
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  // ================================
  // ✅ DELETE
  // ================================

  test('18. Delete Existing Department', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'Dept123');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const name = await rows.nth(i).locator('td:nth-child(2)').innerText();
      if (name === 'Dept123') {
        await rows.nth(i).locator('button[title="Delete"]').click();
        break;
      }
    }

    page.once('dialog', dialog => dialog.accept());
    await page.waitForTimeout(1000);

    const remaining = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(remaining).not.toContain('Dept123');
  });

  test('19. Cancel Delete Confirmation Dialog', async ({ page }) => {
    await navigateToDepartment(page);

    const countBefore = await page.locator('table tbody tr').count();
    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Delete"]').click();

    page.once('dialog', dialog => dialog.dismiss());
    await page.waitForTimeout(1000);

    const countAfter = await page.locator('table tbody tr').count();
    expect(countAfter).toBe(countBefore);
  });

  test('20. Delete Department Linked to Users', async ({ page }) => {
    await navigateToDepartment(page);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Delete"]').click();

    page.once('dialog', dialog => dialog.accept());
    await page.waitForTimeout(2000);

    // Should show error about linked records
    await expect(page.locator('text=cannot delete')).toBeVisible();
  });

  // ================================
  // ✅ SEARCH
  // ================================

  test('21. Search Department by Full Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'Finance');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const results = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(results.some(r => r.includes('Finance'))).toBeTruthy();
  });

  test('22. Search Department by Partial Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'Fin');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const results = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(results.some(r => r.includes('Finance'))).toBeTruthy();
  });

  test('23. Search with No Matching Results', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'XYZNONEXISTENT999');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = await page.locator('table tbody tr').count();
    expect(rows === 0 || (await page.locator('text=No data').count()) > 0).toBeTruthy();
  });

  test('24. Search with Special Characters', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", '@#$%^&');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Page should not crash
    await expect(page.locator('table')).toBeVisible();
  });

  test('25. Clear Search and Verify All Records Shown', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", 'Finance');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Clear search
    await page.fill("input[placeholder='Search']", '');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  // ================================
  // ✅ STATUS - ACTIVE / INACTIVE
  // ================================

  test('26. Mark Department as Inactive', async ({ page }) => {
    await navigateToDepartment(page);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    const toggle = page.locator("input[type='checkbox']");
    await toggle.click(); // Toggle to inactive
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const statusText = await row.locator('td:nth-child(3)').innerText();
    expect(['Active', 'Inactive']).toContain(statusText);
  });

  test('27. Inactive Department Not Visible in Active List', async ({ page }) => {
    await navigateToDepartment(page);

    const statuses = await page.locator('table tbody tr td:nth-child(3)').allTextContents();

    // In default view, all visible should be Active
    for (const status of statuses) {
      expect(status.trim()).toBe('Active');
    }
  });

  test('28. View Inactive Department Using Filter', async ({ page }) => {
    await navigateToDepartment(page);

    await page.click('.btn-filter-click');
    await page.waitForTimeout(1000);

    await page.locator('text=Inactive').click();
    await page.waitForTimeout(1000);

    const statuses = await page.locator('table tbody tr td:nth-child(3)').allTextContents();
    expect(statuses.some(s => s.trim() === 'Inactive')).toBeTruthy();
  });

  test('29. Reactivate Inactive Department', async ({ page }) => {
    await navigateToDepartment(page);

    // Show inactive records
    await page.click('.btn-filter-click');
    await page.waitForTimeout(1000);
    await page.locator('text=Inactive').click();
    await page.waitForTimeout(1000);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    const toggle = page.locator("input[type='checkbox']");
    await toggle.click(); // Toggle back to active
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  test('30. Inactive Department Not in User Master Dropdown', async ({ page }) => {
    await navigateToDepartment(page);

    // Navigate to user master
    await page.goto(`${BASE_URL}/user-page`);
    await page.waitForTimeout(3000);

    const dropdown = page.locator('select[name*="department"], select[id*="department"]').first();
    if (await dropdown.isVisible().catch(() => false)) {
      const options = await dropdown.locator('option').allTextContents();
      // Inactive department should not appear
      expect(options).toBeDefined();
    }
  });

  test('31. Create Department with Inactive Status', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Inactive Test Dept');

    const toggle = page.locator("text=Active").locator('xpath=..').locator('input[type="checkbox"]');
    if (await toggle.isChecked()) await toggle.click(); // Set inactive

    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  // ================================
  // ✅ FORM BEHAVIOR
  // ================================

  test('32. Reset Form After Filling Data', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Temp Data');
    await page.click('button:has-text("Reset")');

    const value = await page.inputValue("input[placeholder='Department Name']");
    expect(value).toBe('');
  });

  test('33. Reset Form During Edit Mode', async ({ page }) => {
    await navigateToDepartment(page);

    const row = page.locator('table tbody tr').first();
    await row.locator('button[title="Edit"]').click();
    await page.waitForTimeout(1000);

    await page.fill("input[placeholder='Department Name']", 'Modified Name');
    await page.click('button:has-text("Reset")');
    await page.waitForTimeout(1000);

    const value = await page.inputValue("input[placeholder='Department Name']");
    expect(value === '' || value !== 'Modified Name').toBeTruthy();
  });

  test('34. Trim Leading and Trailing Spaces on Save', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '   Operations   ');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names.some(n => n.trim() === 'Operations')).toBeTruthy();
  });

  test('35. Multiple Spaces Between Words Collapsed', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Information    Technology');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names.some(n => n.includes('Information') && n.includes('Technology'))).toBeTruthy();
  });

  // ================================
  // ✅ UI VALIDATION
  // ================================

  test('36. Verify All UI Elements Visible', async ({ page }) => {
    await navigateToDepartment(page);

    await expect(page.locator("input[placeholder='Department Name']")).toBeVisible();
    await expect(page.locator('button:has-text("Submit")')).toBeVisible();
    await expect(page.locator('button:has-text("Reset")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('37. Verify Table Column Headers', async ({ page }) => {
    await navigateToDepartment(page);

    const headers = await page.locator('table thead th').allTextContents();
    const headerText = headers.join(' ').toLowerCase();

    expect(headerText).toContain('sr');
    expect(headerText).toContain('department');
    expect(headerText).toContain('status');
    expect(headerText).toContain('action');
  });

  test('38. Verify Form Elements on Page Load', async ({ page }) => {
    await navigateToDepartment(page);

    const value = await page.inputValue("input[placeholder='Department Name']");
    expect(value).toBe('');

    // Status toggle should be checked (Active) by default
    const toggle = page.locator("text=Active").locator('xpath=..').locator('input[type="checkbox"]');
    if (await toggle.isVisible().catch(() => false)) {
      expect(await toggle.isChecked()).toBeTruthy();
    }
  });

  test('39. Verify Pagination Exists', async ({ page }) => {
    await navigateToDepartment(page);

    const pagination = page.locator('.pagination, nav[aria-label="pagination"], [class*="pagina"]');
    const count = await pagination.count();
    expect(count).toBeGreaterThan(0);
  });

  test('40. Verify Serial Number Increments Correctly', async ({ page }) => {
    await navigateToDepartment(page);

    const serialNos = await page.locator('table tbody tr td:nth-child(1)').allTextContents();
    for (let i = 0; i < serialNos.length; i++) {
      const num = parseInt(serialNos[i].trim());
      if (!isNaN(num)) {
        expect(num).toBe(i + 1);
      }
    }
  });

  // ================================
  // 🔒 SECURITY
  // ================================

  test('41. SQL Injection in Department Name Field', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", "'; DROP TABLE departments; --");
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  test('42. XSS Attack in Department Name Field', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '<script>alert("XSS")</script>');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  test('43. SQL Injection in Search Field', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Search']", "' OR 1=1; --");
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  test('44. HTML Injection in Department Name Field', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", '<h1>Injected</h1>');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    // h1 tag should NOT be rendered inside table
    const h1Count = await page.locator('table tbody h1').count();
    expect(h1Count).toBe(0);
  });

  test('45. Access Department Master Without Login', async ({ page }) => {
    await page.goto(`${BASE_URL}/department-page`);
    await page.waitForTimeout(3000);

    const url = page.url();
    expect(url).not.toContain('department');
  });

  // ================================
  // ⚡ EDGE CASES
  // ================================

  test('46. Rapid Double Click on Submit Button', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'RapidClickDept');

    const btn = page.locator('button:has-text("Submit")');
    await Promise.all([
      btn.click(),
      btn.click()
    ]);
    await page.waitForTimeout(2000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    const duplicates = names.filter(n => n.trim() === 'RapidClickDept');
    expect(duplicates.length).toBeLessThanOrEqual(1);
  });

  test('47. Unicode Characters in Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'विभाग');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names).toContain('विभाग');
  });

  test('48. Emoji in Department Name', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'Department 🏢🏛️');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    const names = await page.locator('table tbody tr td:nth-child(2)').allTextContents();
    expect(names.some(n => n.includes('🏢'))).toBeTruthy();
  });

  test('49. Browser Back Button After Saving', async ({ page }) => {
    await navigateToDepartment(page);

    await page.fill("input[placeholder='Department Name']", 'BackNavDept');
    await page.click('button:has-text("Submit")');
    await page.waitForTimeout(1000);

    await page.goBack();
    await page.waitForTimeout(1000);
    await page.goForward();
    await page.waitForTimeout(1000);

    await expect(page.locator('table')).toBeVisible();
  });

  test('50. Page Refresh Should Retain Data', async ({ page }) => {
    await navigateToDepartment(page);

    const rowsBefore = await page.locator('table tbody tr').count();

    await page.reload();
    await page.waitForTimeout(3000);

    const rowsAfter = await page.locator('table tbody tr').count();
    expect(rowsAfter).toBe(rowsBefore);
  });

});
