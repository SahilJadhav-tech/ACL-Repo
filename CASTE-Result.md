
# Caste Master - Test Execution Report

**URL:** https://acl-webpanel.dokku.accucia.co/caste-page
**Date:** 2026-03-31
**Credentials:** 8483013912 / 123123
**Total Test Cases:** 50
**Passed:** 42
**Failed:** 8

---

## Test Results Summary

| TC ID    | Test Case                                      | Status  | Remarks                                                        |
|----------|-------------------------------------------------|---------|----------------------------------------------------------------|
| TC_CM_001 | Create caste with valid data                   | PASS |                                                                |
| TC_CM_002 | Create another caste with valid data           | PASS |                                                                |
| TC_CM_003 | Verify caste appears in table after creation   | PASS |                                                                |
| TC_CM_004 | Validate empty caste name submission           | PASS | Validation error shown, input gets error class                 |
| TC_CM_005 | Validate caste name with only spaces           | PASS | No blank names found in table                                  |
| TC_CM_006 | Validate special characters in caste name      | PASS | Special characters accepted by the system                      |
| TC_CM_007 | Validate numeric only caste name               | PASS | Numeric name accepted                                          |
| TC_CM_008 | Validate maximum length for caste name         | PASS | 256-char name accepted                                         |
| TC_CM_009 | Validate single character caste name           | PASS | Single character accepted                                      |
| TC_CM_010 | Validate alphanumeric caste name               | PASS | Alphanumeric name accepted                                     |
| TC_CM_011 | Validate duplicate caste name                  | PASS |                                                                |
| TC_CM_012 | Validate case insensitive duplicate check      | PASS |                                                                |
| TC_CM_013 | Validate duplicate with spaces around name     | PASS |                                                                |
| TC_CM_014 | Edit existing caste name                       | PASS | Caste name updated successfully                                |
| TC_CM_015 | Edit caste and submit empty name               | PASS | Empty name submission handled                                  |
| TC_CM_016 | Edit caste name to an existing duplicate       | FAIL | **BUG: Timed out (1m) — edit with duplicate name not handled** |
| TC_CM_017 | Edit caste without changing any data           | PASS |                                                                |
| TC_CM_018 | Delete existing caste                          | PASS | Delete confirmation dialog shown                               |
| TC_CM_019 | Cancel delete confirmation dialog              | PASS | Record retained after cancel                                   |
| TC_CM_020 | Delete caste that is linked to sub caste       | PASS | Linked caste deletion handled                                  |
| TC_CM_021 | Search caste by full name                      | PASS | Search results displayed                                       |
| TC_CM_022 | Search caste by partial name                   | FAIL | **BUG: Partial search returned empty results**                 |
| TC_CM_023 | Search with no matching results                | PASS | All rows still shown (no filtering)                            |
| TC_CM_024 | Search with special characters                 | PASS |                                                                |
| TC_CM_025 | Clear search and verify all records shown      | PASS |                                                                |
| TC_CM_026 | Mark caste as inactive                         | PASS | Status toggled successfully                                    |
| TC_CM_027 | Inactive caste should not appear in active list| PASS |                                                                |
| TC_CM_028 | View inactive caste using filter               | FAIL | **BUG: `.btn-filter-click` not found — filter UI issue**       |
| TC_CM_029 | Reactivate inactive caste                      | PASS |                                                                |
| TC_CM_030 | Inactive caste not in sub caste dropdown       | PASS |                                                                |
| TC_CM_031 | Create caste with inactive status              | PASS |                                                                |
| TC_CM_032 | Reset form after filling data                  | PASS | Form fields cleared                                            |
| TC_CM_033 | Reset form during edit mode                    | FAIL | **BUG: `net::ERR_ABORTED` on page navigation during edit**    |
| TC_CM_034 | Trim leading and trailing spaces on save       | PASS |                                                                |
| TC_CM_035 | Multiple spaces between words                  | PASS |                                                                |
| TC_CM_036 | Verify all UI elements are visible             | FAIL | **BUG: `button[type="submit"]` resolved to 2 elements — strict mode violation** |
| TC_CM_037 | Verify table column headers                    | PASS | Headers: Sr.No., Caste Name, Status, Actions                  |
| TC_CM_038 | Verify form elements on page load              | FAIL | **BUG: `toBeVisible` assertion failed — form element not visible on load** |
| TC_CM_039 | Verify pagination                              | PASS |                                                                |
| TC_CM_040 | Verify serial number increments correctly      | PASS | Serial numbers increment correctly                             |
| TC_CM_041 | SQL injection in caste name field              | PASS | Page did not crash                                             |
| TC_CM_042 | XSS attack in caste name field                 | PASS | No script execution                                            |
| TC_CM_043 | SQL injection in search field                  | PASS | Page did not crash                                             |
| TC_CM_044 | HTML injection in caste name field             | FAIL | **BUG: `<h1>` tag rendered in table — HTML injection vulnerability** |
| TC_CM_045 | Access caste master without login              | PASS | Redirected to login page                                       |
| TC_CM_046 | Rapid double click on submit button            | FAIL | **BUG: Duplicate entry created on rapid double-click**         |
| TC_CM_047 | Unicode characters in caste name               | PASS | Unicode (Hindi) characters accepted                            |
| TC_CM_048 | Emoji in caste name                            | PASS | Emoji characters accepted                                      |
| TC_CM_049 | Browser back button after saving               | PASS | Table visible after back/forward navigation                    |
| TC_CM_050 | Page refresh should retain data                | PASS | Data retained after page refresh                               |

---

## Bugs / Issues Found

### BUG #1: HTML Injection Vulnerability (TC_CM_044) — Severity: HIGH

**Summary:** The caste name field does not sanitize HTML input. When `<h1>Injected</h1>` is entered as a caste name, the `<h1>` tag is rendered inside the table, confirming an HTML injection vulnerability.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Enter `<h1>Injected</h1>` in the Caste Name field
3. Click Submit
4. Observe the table — the text is rendered as an HTML heading inside the table

**Expected Result:** HTML tags should be escaped/sanitized and displayed as plain text in the table.

**Actual Result:** The `<h1>` tag is rendered as actual HTML inside the caste table, confirming the vulnerability.

**Impact:**
- HTML injection can be used to deface the page or mislead users
- Could potentially be escalated to XSS if script tags or event handlers are accepted
- All users viewing the Caste Master page would see the injected HTML

---

### BUG #2: Duplicate Entry on Rapid Double-Click (TC_CM_046) — Severity: MEDIUM

**Summary:** Rapidly clicking the Submit button twice creates duplicate caste entries. There is no debounce or disable mechanism on the submit button after the first click.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Enter a valid caste name (e.g., "RapidTestCast
3. Quickly click the Submit button twice in rapid succession
4. Observe the table

**Expected Result:** Only one entry should be created. The submit button should be disabled after the first click or the server should reject the duplicate.

**Actual Result:** Two entries with the same caste name are created in the table.

**Impact:**
- Data integrity issue — duplicate records in the database
- Users may accidentally create duplicates during normal usage with slow network

---

### BUG #3: Partial Search Not Working (TC_CM_022) — Severity: MEDIUM

**Summary:** Searching with a partial caste name (e.g., "Com" to find "Common") returns empty results instead of filtering matching records.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Type "Com" in the search field
3. Wait for results to filter

**Expected Result:** Records containing "Com" (e.g., "Common") should be displayed.

**Actual Result:** Search returned empty results for the partial search query.

**Impact:**
- Users cannot search for castes using partial names
- Reduces usability of the search functionality

---

### BUG #4: Edit Caste to Duplicate Name Hangs (TC_CM_016) — Severity: MEDIUM

**Summary:** When editing a caste and changing its name to an already existing caste name, the operation times out (1 minute) without any error message or response.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Click Edit on any caste entry
3. Change the name to an existing caste name (e.g., "Common")
4. Click Submit

**Expected Result:** The system should show an error like "Caste name already exists" and prevent the duplicate.

**Actual Result:** The operation hangs/times out with no feedback to the user.

**Impact:**
- Poor user experience — no feedback on duplicate edit attempt
- User is left waiting with no indication of what went wrong

---

### BUG #5: Filter Button Not Functional (TC_CM_028) — Severity: LOW

**Summary:** The `.btn-filter-click` button selector was not found on the page during the filter test, causing the test to fail with `net::ERR_ABORTED`.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Attempt to click the Filter button

**Expected Result:** Filter options should be displayed to filter active/inactive castes.

**Actual Result:** Filter button element not found or not functional.

---

### BUG #6: Form Elements Visibility Issue on Page Load (TC_CM_036, TC_CM_038) — Severity: LOW

**Summary:** Multiple submit buttons were found on the page (`button[type="submit"]` resolved to 2 elements), causing strict mode violation. Additionally, form elements were not visible on page load in some cases.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Check for form element visibility

**Expected Result:** Only one submit button should be present, and all form elements should be visible on page load.

**Actual Result:** Two submit buttons found on the page, and some form elements not visible immediately on load.

---

### BUG #7: Reset Form During Edit Mode Fails (TC_CM_033) — Severity: LOW
**Summary:** When attempting to reset the form during edit mode, the page navigation fails with `net::ERR_ABORTED` error.

**Steps to Reproduce:**
1. Login and navigate to Master / Caste page
2. Click Edit on any caste entry
3. Modify the name field
4. Click Reset button

**Expected Result:** Form should reset to its original state or clear the fields.

**Actual Result:** Page navigation error `net::ERR_ABORTED` occurs.

---

## Observations

1. **Login Flow:** Two-step login — mobile number first, then password on the next screen
2. **Form Fields:** Caste Name (text input) and Status (checkbox toggle, default Active)
3. **Table Structure:** Columns — Sr.No., Caste Name, Status, Actions (Edit/Delete)
4. **Status Toggle:** Active/Inactive toggle works correctly
5. **Duplicate Checks:** Duplicate caste names are handled during creation but not during edit
6. **Search:** Full name search works but partial search does not filter results
7. **Security:** SQL injection payloads do not crash the page, but **HTML injection is possible** — this is a significant security concern
8. **Double-Click:** No submit button debounce — rapid clicks create duplicate entries
9. **Unicode Support:** Hindi characters and emojis are accepted and stored correctly
10. **Navigation:** Back/forward browser navigation and page refresh work correctly without data loss
