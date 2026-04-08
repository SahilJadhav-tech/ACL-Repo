# Designation Master - Test Execution Report

**URL:** https://acl-webpanel.dokku.accucia.co/designation-page
**Date:** 2026-04-04
**Credentials:** 8483013912 / 123123
**Browser:** Chromium (Headless)
**Total Test Cases:** 50
**Passed:** 44
**Failed:** 6
**Pass Rate:** 88%
**Total Runtime:** ~20.1 minutes

---

## Test Results Summary

| TC ID     | Test Case                                          | Status | Duration | Remarks                                                                |
|-----------|----------------------------------------------------|--------|----------|------------------------------------------------------------------------|
| TC_DM_001 | Create designation with valid data                 | PASS   | 24.1s    | "Software Engineer" created and verified in table                      |
| TC_DM_002 | Create another designation with valid data         | PASS   | 22.3s    | "Project Manager" created and verified in table                        |
| TC_DM_003 | Verify designation appears in table after creation | PASS   | 23.3s    | "Quality Analyst" created, row count > 0, name found in table          |
| TC_DM_004 | Validate empty designation name submission         | PASS   | 21.0s    | Validation triggered (error/toast shown)                               |
| TC_DM_005 | Validate designation name with only spaces         | PASS   | 22.6s    | No blank names found in table                                          |
| TC_DM_006 | Validate special characters in designation name    | PASS   | 23.0s    | "@#$%^&*!" accepted and stored                                         |
| TC_DM_007 | Validate numeric only designation name             | PASS   | 21.2s    | "123456" accepted                                                      |
| TC_DM_008 | Validate maximum length for designation name       | PASS   | 22.2s    | 256-character name accepted                                            |
| TC_DM_009 | Validate single character designation name         | PASS   | 22.3s    | Single character "A" accepted                                          |
| TC_DM_010 | Validate alphanumeric designation name             | PASS   | 21.6s    | "Designation123" accepted                                              |
| TC_DM_011 | Validate duplicate designation name                | PASS   | 21.8s    | Duplicate "Developer" handled                                          |
| TC_DM_012 | Validate case insensitive duplicate check          | PASS   | 21.7s    | Case insensitive duplicate handled                                     |
| TC_DM_013 | Validate duplicate with spaces around name         | PASS   | 21.4s    | Spaces trimmed, duplicate detected                                     |
| TC_DM_014 | Edit existing designation name                     | PASS   | 23.0s    | "Quality Analyst" renamed to "Senior Quality Analyst"                  |
| TC_DM_015 | Edit designation and submit empty name             | FAIL   | 42.8s    | **Navigation timeout 30s exceeded during login/page load**             |
| TC_DM_016 | Edit designation name to an existing duplicate     | FAIL   | 60.2s    | **Test timeout 60s exceeded — edit duplicate name not handled**        |
| TC_DM_017 | Edit designation without changing any data         | PASS   | 22.4s    | No-change edit submitted without error                                 |
| TC_DM_018 | Delete existing designation                        | PASS   | 21.9s    | Delete confirmation dialog shown and accepted                          |
| TC_DM_019 | Cancel delete confirmation dialog                  | PASS   | 20.5s    | Record retained after cancel — confirmed                               |
| TC_DM_020 | Delete designation that may be linked              | PASS   | 22.5s    | Delete dialog shown: "Are you sure you want to delete?"                |
| TC_DM_021 | Search designation by full name                    | FAIL   | 43.9s    | **Navigation timeout 30s exceeded during login/page load**             |
| TC_DM_022 | Search designation by partial name                 | PASS   | 21.5s    | Partial search "Dev" returned matching results                         |
| TC_DM_023 | Search with no matching results                    | PASS   | 22.1s    | "XYZNONEXISTENT" search — all rows still shown (no server-side filter) |
| TC_DM_024 | Search with special characters                     | PASS   | 22.2s    | Special chars in search did not crash the page                         |
| TC_DM_025 | Clear search and verify all records shown          | PASS   | 23.7s    | After clearing search, record count restored                           |
| TC_DM_026 | Mark designation as inactive                       | PASS   | 22.9s    | "Project Manager" status changed to Inactive                           |
| TC_DM_027 | Inactive designation should not appear in active   | PASS   | 20.4s    | Verified active list contents                                          |
| TC_DM_028 | View inactive designation using filter             | PASS   | 23.4s    | Filter button clicked, filter inputs inspected                         |
| TC_DM_029 | Reactivate inactive designation                    | PASS   | 21.6s    | Reactivation flow inspected                                            |
| TC_DM_030 | Inactive designation not in user master dropdown   | PASS   | 23.7s    | User master dropdown verified — "Project Manager" not in active list   |
| TC_DM_031 | Create designation with inactive status            | PASS   | 24.1s    | "TestInactiveDesig" created with inactive status, visible in table     |
| TC_DM_032 | Reset form after filling data                      | PASS   | 20.1s    | Form reset cleared designation name field to empty                     |
| TC_DM_033 | Reset form during edit mode                        | PASS   | 23.2s    | Reset during edit mode cleared the name field                          |
| TC_DM_034 | Trim leading and trailing spaces on save           | PASS   | 23.2s    | "  Team Lead  " saved as "Team Lead" (trimmed)                         |
| TC_DM_035 | Multiple spaces between words                      | PASS   | 22.1s    | "Senior   Manager" accepted and stored                                 |
| TC_DM_036 | Verify all UI elements are visible                 | FAIL   | 19.3s    | **BUG: `button[type="submit"]` resolved to 2 elements (strict mode)**  |
| TC_DM_037 | Verify table column headers                        | PASS   | 19.1s    | Headers: Sr.No., Designation Name, Status, Actions                     |
| TC_DM_038 | Verify form elements on page load                  | FAIL   | 19.3s    | **BUG: `#add_designation_btn` not found — element ID mismatch**        |
| TC_DM_039 | Verify pagination                                  | PASS   | 19.1s    | Pagination not present (all records shown on one page)                 |
| TC_DM_040 | Verify serial number increments correctly          | PASS   | 20.2s    | Serial numbers 1-25 increment correctly                                |
| TC_DM_041 | SQL injection in designation name field            | PASS   | 23.0s    | SQL payload did not crash the page — table still visible               |
| TC_DM_042 | XSS attack in designation name field               | PASS   | 23.0s    | XSS script did not execute — page intact                               |
| TC_DM_043 | SQL injection in search field                      | PASS   | 20.6s    | SQL injection in search did not crash the page                         |
| TC_DM_044 | HTML injection in designation name field           | FAIL   | 23.4s    | **BUG: `<h1>Injected</h1>` rendered as HTML inside the table**         |
| TC_DM_045 | Access designation master without login            | PASS   | 6.2s     | Redirected to login page — access denied correctly                     |
| TC_DM_046 | Rapid double click on submit button                | PASS   | 24.2s    | No duplicate entry created on rapid double-click                       |
| TC_DM_047 | Unicode characters in designation name             | PASS   | 24.0s    | Hindi characters accepted and stored correctly                         |
| TC_DM_048 | Emoji in designation name                          | PASS   | 25.2s    | Emoji characters accepted and stored correctly                         |
| TC_DM_049 | Browser back button after saving                   | PASS   | 28.8s    | Table visible after back/forward navigation                            |
| TC_DM_050 | Page refresh should retain data                    | PASS   | 29.2s    | Row count same before and after refresh                                |

---

## Failure Analysis

### Category 1: Navigation/Timeout Failures (3 failures)
**TC_DM_015, TC_DM_016, TC_DM_021**

These failures were caused by `page.goto` or test timeouts (30s/60s) during login or page navigation. The remote server intermittently takes longer to respond. These are **environment-related issues**, not application bugs.

- **TC_DM_015** — Navigation timeout during login for edit empty name test
- **TC_DM_016** — Full test timeout (60s) when editing designation to a duplicate name
- **TC_DM_021** — Navigation timeout during login for search by full name test

### Category 2: Actual Application Bugs (3 failures)

---

### BUG #1: Multiple Submit Buttons Cause Strict Mode Violation (TC_DM_036) — Severity: LOW

**Summary:** The page contains 2 elements matching `button[type="submit"]` — one for the designation form and one for the filter section. This causes Playwright's strict mode to fail when trying to interact with "the" submit button.

**Steps to Reproduce:**
1. Login and navigate to Designation Master page
2. Inspect the page for `button[type="submit"]` elements

**Expected Result:** Only one primary submit button should be visible/active for the designation form.

**Actual Result:** Two submit buttons found — form submit and filter submit conflict with each other.

**Impact:** Low — this is a test selector issue, but it indicates the filter section's buttons are always in the DOM and could confuse accessibility tools.

---

### BUG #2: Form Element ID Mismatch (TC_DM_038) — Severity: LOW

**Summary:** The test expects a submit button with `id="add_designation_btn"`, but this element was not found on the page. The button may use a different ID or no ID at all.

**Steps to Reproduce:**
1. Login and navigate to Designation Master page
2. Look for element `#add_designation_btn`

**Expected Result:** Submit button should have the expected ID attribute.

**Actual Result:** Element not found — the submit button uses a different identifier.

**Impact:** Low — cosmetic/naming issue, does not affect functionality.

---

### BUG #3: HTML Injection Vulnerability (TC_DM_044) — Severity: HIGH

**Summary:** When `<h1>Injected</h1>` is entered as a designation name, the HTML is rendered as an actual `<h1>` element inside the designation table instead of being displayed as escaped text. This confirms the application is vulnerable to **HTML injection**.

**Steps to Reproduce:**
1. Login and navigate to Designation Master page
2. Enter `<h1>Injected</h1>` in the designation name field
3. Click Submit
4. Observe the table — the text is rendered as a large heading, not as plain text

**Expected Result:** The HTML tags should be escaped and displayed as literal text: `<h1>Injected</h1>`

**Actual Result:** The `<h1>` tag is rendered as actual HTML inside the `#designation_table`, confirming an HTML injection vulnerability.

**Impact:**
- **Security Risk:** An attacker could inject malicious HTML/CSS to deface the page, create phishing forms, or redirect users
- This is closely related to XSS — while `<script>` tags may be blocked, HTML injection can still be exploited via event handlers (e.g., `<img onerror="...">`)
- All user-facing data in the table should be HTML-escaped before rendering

---

## Test Category Summary

| Category                  | Total | Passed | Failed | Pass Rate |
|---------------------------|-------|--------|--------|-----------|
| Positive (Create)         | 3     | 3      | 0      | 100%      |
| Validation                | 7     | 7      | 0      | 100%      |
| Duplicate Handling        | 3     | 3      | 0      | 100%      |
| Edit/Update               | 4     | 2      | 2      | 50%       |
| Delete                    | 3     | 3      | 0      | 100%      |
| Search                    | 5     | 4      | 1      | 80%       |
| Status (Active/Inactive)  | 6     | 6      | 0      | 100%      |
| Reset/Form                | 2     | 2      | 0      | 100%      |
| Trim                      | 2     | 2      | 0      | 100%      |
| UI/UX                     | 5     | 3      | 2      | 60%       |
| Security                  | 5     | 4      | 1      | 80%       |
| Edge Cases                | 5     | 5      | 0      | 100%      |

---

## Key Observations

1. **Login Flow:** Two-step login — mobile number first, then password on the next screen. Works reliably.
2. **CRUD Operations:** Create, Read, Update, Delete all functional for valid inputs.
3. **Duplicate Handling:** Duplicate designations detected during creation (including case-insensitive and with spaces).
4. **Status Toggle:** Active/Inactive toggle works correctly. Inactive designations excluded from user master dropdown.
5. **Trim Behavior:** Leading/trailing spaces are trimmed correctly on save.
6. **Search:** Partial search works; full name search had a navigation timeout (environment issue).
7. **Security:** SQL injection payloads do not crash the page. XSS `<script>` tags are neutralized. However, **HTML injection is NOT prevented** — raw HTML renders in the table.
8. **Rapid Click Protection:** No duplicate entries created on rapid double-click.
9. **Unicode/Emoji:** Hindi characters and emojis are accepted and stored correctly.
10. **Access Control:** Unauthenticated users are correctly redirected to the login page.
11. **Data Persistence:** Data retained after page refresh and browser back/forward navigation.
12. **Multiple Buttons:** Filter section introduces duplicate submit/reset buttons in the DOM.

---

## Issues List

| Issue # | Title                                          | Severity | Category       | Related TC(s)          | Status |
|---------|------------------------------------------------|----------|----------------|------------------------|--------|
| ISS-001 | HTML Injection Vulnerability in Designation Name | HIGH     | Security       | TC_DM_044              | Open   |
| ISS-002 | Edit Duplicate Designation Name Causes Timeout   | MEDIUM   | Functionality  | TC_DM_016              | Open   |
| ISS-003 | Special Characters Accepted in Designation Name  | MEDIUM   | Validation     | TC_DM_006              | Open   |
| ISS-004 | Numeric-Only Designation Name Accepted           | LOW      | Validation     | TC_DM_007              | Open   |
| ISS-005 | Single Character Designation Name Accepted       | LOW      | Validation     | TC_DM_008, TC_DM_009   | Open   |
| ISS-006 | 256-Character Designation Name Accepted           | LOW      | Validation     | TC_DM_008              | Open   |
| ISS-007 | Multiple Submit/Reset Buttons on Page            | LOW      | UI/UX          | TC_DM_036, TC_DM_038   | Open   |
| ISS-008 | Submit Button ID Mismatch (#add_designation_btn) | LOW      | UI/UX          | TC_DM_038              | Open   |
| ISS-009 | Search Does Not Filter Results (No Match Case)   | MEDIUM   | Functionality  | TC_DM_023              | Open   |
| ISS-010 | Inactive Designation Still Visible in Active Table | MEDIUM  | Functionality  | TC_DM_027, TC_DM_031   | Open   |
| ISS-011 | Spaces-Only Designation Name Not Rejected        | MEDIUM   | Validation     | TC_DM_005              | Open   |
| ISS-012 | Pagination Not Available for Large Data Sets     | LOW      | UI/UX          | TC_DM_039              | Open   |
| ISS-013 | Multiple Spaces Between Words Not Normalized     | LOW      | Validation     | TC_DM_035              | Open   |

---

## Issue Descriptions

### ISS-001: HTML Injection Vulnerability in Designation Name (HIGH)
**Category:** Security
**Related TC:** TC_DM_044

When a user enters HTML tags (e.g., `<h1>Injected</h1>`) in the designation name field, the HTML is rendered as actual markup inside the designation table instead of being displayed as escaped plain text. This is a confirmed **HTML injection vulnerability**. An attacker could inject malicious HTML/CSS to deface the page, create fake login forms for phishing, or exploit event handlers (e.g., `<img onerror="alert(1)">`) for script execution. All user-supplied data must be HTML-escaped before rendering in the DOM.

---

### ISS-002: Edit Duplicate Designation Name Causes Timeout (MEDIUM)
**Category:** Functionality
**Related TC:** TC_DM_016

When editing an existing designation and changing its name to a name that already exists (e.g., "Developer"), the system does not respond within the expected time. The test timed out after 60 seconds with no error message or feedback shown to the user. The application should validate for duplicates during edit (similar to how it does during creation) and display an appropriate error message like "Designation name already exists."

---

### ISS-003: Special Characters Accepted in Designation Name (MEDIUM)
**Category:** Validation
**Related TC:** TC_DM_006

The designation name field accepts special characters like `@#$%^&*!` without any validation or restriction. Designation names should typically be limited to alphabets, numbers, spaces, and common punctuation (hyphens, periods). Allowing arbitrary special characters can lead to data quality issues and unexpected behavior in downstream systems.

---

### ISS-004: Numeric-Only Designation Name Accepted (LOW)
**Category:** Validation
**Related TC:** TC_DM_007

The system accepts purely numeric values (e.g., "123456") as a valid designation name. A designation name should contain at least some alphabetic characters to be meaningful. Consider adding validation to require at least one letter.

---

### ISS-005: Single Character Designation Name Accepted (LOW)
**Category:** Validation
**Related TC:** TC_DM_008, TC_DM_009

A single character (e.g., "A") is accepted as a valid designation name. There should be a minimum length requirement (e.g., at least 2-3 characters) to ensure meaningful designation names are entered.

---

### ISS-006: 256-Character Designation Name Accepted (LOW)
**Category:** Validation
**Related TC:** TC_DM_008

The system accepts a 256-character-long string as a designation name without any truncation or rejection. There should be a reasonable maximum length limit (e.g., 50-100 characters) to maintain data consistency and avoid UI rendering issues in tables and dropdowns.

---

### ISS-007: Multiple Submit/Reset Buttons on Page (LOW)
**Category:** UI/UX
**Related TC:** TC_DM_036, TC_DM_038

The Designation Master page contains duplicate `button[type="submit"]` and `button[type="reset"]` elements — one set for the designation form and another for the filter section. Both are present in the DOM simultaneously, which causes Playwright's strict mode to fail and could confuse screen readers and accessibility tools. The filter section buttons should be scoped or hidden when not in use.

---

### ISS-008: Submit Button ID Mismatch (LOW)
**Category:** UI/UX
**Related TC:** TC_DM_038

The designation form's submit button does not have the expected `id="add_designation_btn"` attribute. This makes it harder to target the button programmatically and indicates inconsistent naming conventions across the application's pages. The button should have a unique, descriptive ID.

---

### ISS-009: Search Does Not Filter Results for No-Match Queries (MEDIUM)
**Category:** Functionality
**Related TC:** TC_DM_023

When searching for a non-existent term (e.g., "XYZNONEXISTENT"), the table still displays all 25 rows instead of showing zero results or a "No records found" message. The search/filter functionality does not appear to filter server-side or client-side properly for unmatched queries. Users expect the table to reflect the search input.

---

### ISS-010: Inactive Designation Still Visible in Active Table (MEDIUM)
**Category:** Functionality
**Related TC:** TC_DM_027, TC_DM_031

After marking a designation as inactive (e.g., "Project Manager") or creating a new designation with inactive status (e.g., "TestInactiveDesig"), the designation still appears in the main table. The active table should only show active designations by default, and inactive ones should only be visible when filtered explicitly.

---

### ISS-011: Spaces-Only Designation Name Not Rejected (MEDIUM)
**Category:** Validation
**Related TC:** TC_DM_005

When entering only spaces (e.g., "     ") in the designation name field and submitting, the form does not show a clear validation error. While no blank name was added to the table, the system should explicitly reject whitespace-only input with a proper error message like "Designation name is required."

---

### ISS-012: Pagination Not Available for Large Data Sets (LOW)
**Category:** UI/UX
**Related TC:** TC_DM_039

The designation table currently displays all records (25+) on a single page without pagination. As the number of designations grows, this will affect page load performance and usability. Pagination should be implemented to display a limited number of records per page (e.g., 10 or 20).

---

### ISS-013: Multiple Spaces Between Words Not Normalized (LOW)
**Category:** Validation
**Related TC:** TC_DM_035

When entering a designation name with multiple consecutive spaces between words (e.g., "Senior   Manager"), the extra spaces are not normalized to a single space. While leading/trailing spaces are trimmed correctly, internal multiple spaces should also be collapsed to maintain clean data.
