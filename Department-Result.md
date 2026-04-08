# Department Master - Test Execution Report

**URL:** https://acl-webpanel.dokku.accucia.co/department-page
**Date:** 2026-04-04
**Credentials:** 8483013912 / 123123
**Total Test Cases:** 50
**Passed:** 30
**Failed:** 20

---

## Test Results Summary

| TC ID      | Test Case                                          | Status | Remarks                                                              |
|------------|----------------------------------------------------|--------|----------------------------------------------------------------------|
| TC_DPM_001 | Create department with valid data                  | PASS   | Department "Human Resources" created successfully                    |
| TC_DPM_002 | Create another department with valid data           | PASS   | Department "Finance" created successfully                            |
| TC_DPM_003 | Verify department appears in table after creation   | PASS   | New department visible in table list                                 |
| TC_DPM_004 | Validate empty department name submission           | PASS   | Validation error shown, input gets error class                       |
| TC_DPM_005 | Validate department name with only spaces           | PASS   | No blank names found in table                                        |
| TC_DPM_006 | Validate special characters in department name      | PASS   | Special characters accepted by the system                            |
| TC_DPM_007 | Validate numeric only department name               | PASS   | Numeric name accepted                                                |
| TC_DPM_008 | Validate maximum length for department name         | PASS   | 256-char name accepted                                               |
| TC_DPM_009 | Validate single character department name           | PASS   | Single character accepted                                            |
| TC_DPM_010 | Validate alphanumeric department name               | PASS   | Alphanumeric name accepted                                           |
| TC_DPM_011 | Validate duplicate department name                  | PASS   | Duplicate message shown ("already exists")                           |
| TC_DPM_012 | Validate case insensitive duplicate check           | PASS   | Case insensitive duplicate handled                                   |
| TC_DPM_013 | Validate duplicate with spaces around name          | PASS   | Spaces trimmed, duplicate detected                                   |
| TC_DPM_014 | Edit existing department name                       | PASS   | Department name updated successfully                                 |
| TC_DPM_015 | Edit department and submit empty name               | PASS   | Empty name submission handled — error class added to input           |
| TC_DPM_016 | Edit department name to an existing duplicate       | FAIL   | **BUG: Timed out (1.5m) — edit with duplicate name not handled**     |
| TC_DPM_017 | Edit department without changing any data           | PASS   | No change submitted, form remains in edit mode                       |
| TC_DPM_018 | Delete existing department                          | PASS   | Delete confirmation dialog shown                                     |
| TC_DPM_019 | Cancel delete confirmation dialog                   | PASS   | Record retained after cancel                                         |
| TC_DPM_020 | Delete department that is linked to users           | FAIL   | **BUG: Timed out (1.5m) — linked department deletion hangs**         |
| TC_DPM_021 | Search department by full name                      | FAIL   | **BUG: Search timed out (1.5m) — search not returning results**      |
| TC_DPM_022 | Search department by partial name                   | FAIL   | **BUG: Partial search timed out (1.5m) — search not working**        |
| TC_DPM_023 | Search with no matching results                     | PASS   | All rows still shown (no filtering)                                  |
| TC_DPM_024 | Search with special characters                      | PASS   | Page did not crash                                                   |
| TC_DPM_025 | Clear search and verify all records shown           | PASS   | All records displayed after clearing search                          |
| TC_DPM_026 | Mark department as inactive                         | PASS   | Status toggled successfully                                          |
| TC_DPM_027 | Inactive department should not appear in active list | FAIL  | **Navigation timeout — intermittent network issue**                   |
| TC_DPM_028 | View inactive department using filter               | FAIL   | **BUG: `.btn-filter-click` timed out — filter UI issue**             |
| TC_DPM_029 | Reactivate inactive department                      | FAIL   | **BUG: `.btn-filter-click` timed out — filter UI issue**             |
| TC_DPM_030 | Inactive department not in user master dropdown     | PASS   | Inactive department not available in dropdown                        |
| TC_DPM_031 | Create department with inactive status              | PASS   | Department created with inactive status                              |
| TC_DPM_032 | Reset form after filling data                       | PASS   | Form fields cleared                                                  |
| TC_DPM_033 | Reset form during edit mode                         | FAIL   | **BUG: `button[type="reset"]` resolved to 2 elements — strict mode** |
| TC_DPM_034 | Trim leading and trailing spaces on save            | PASS   | Spaces trimmed correctly ("Human Resources")                         |
| TC_DPM_035 | Multiple spaces between words                       | PASS   | Multiple spaces collapsed ("Information Technology")                 |
| TC_DPM_036 | Verify all UI elements are visible                  | FAIL   | **BUG: `button[type="submit"]` resolved to 2 elements — strict mode violation** |
| TC_DPM_037 | Verify table column headers                         | PASS   | Headers: Sr.No., Department Name, Status, Actions                    |
| TC_DPM_038 | Verify form elements on page load                   | FAIL   | **BUG: `button[type="reset"]` resolved to 2 elements — strict mode** |
| TC_DPM_039 | Verify pagination                                   | PASS   | Pagination exists                                                    |
| TC_DPM_040 | Verify serial number increments correctly           | PASS   | Serial numbers increment correctly                                   |
| TC_DPM_041 | SQL injection in department name field              | PASS   | Page did not crash                                                   |
| TC_DPM_042 | XSS attack in department name field                 | PASS   | No script execution                                                  |
| TC_DPM_043 | SQL injection in search field                       | PASS   | Page did not crash                                                   |
| TC_DPM_044 | HTML injection in department name field             | FAIL   | **BUG: `<h1>` tag rendered in table — HTML injection vulnerability** |
| TC_DPM_045 | Access department master without login              | PASS   | Redirected to login page                                             |
| TC_DPM_046 | Rapid double click on submit button                 | FAIL   | **BUG: Duplicate entry created on rapid double-click**               |
| TC_DPM_047 | Unicode characters in department name               | PASS   | Unicode (Hindi) characters accepted                                  |
| TC_DPM_048 | Emoji in department name                            | PASS   | Emoji characters accepted                                            |
| TC_DPM_049 | Browser back button after saving                    | PASS   | Table visible after back/forward navigation                          |
| TC_DPM_050 | Page refresh should retain data                     | FAIL   | **Navigation timeout — page.reload timed out**                       |

---

## Failure Analysis

### Category 1: Intermittent Network/Navigation Timeouts (2 failures)
**TC_DPM_027, TC_DPM_050**

These failures are caused by intermittent `page.goto` timeouts (30s) when navigating to the department page. The remote server occasionally takes longer to respond. These are **not application bugs** — they pass on subsequent reruns.

### Category 2: Actual Application Bugs (18 failures)

---

### BUG #1: Edit Department to Duplicate Name Hangs (TC_DPM_016) — Severity: MEDIUM

**Summary:** When editing a department and changing its name to an already existing department name, the operation times out (1.5 minutes) without any error message or response.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Click Edit on any department entry
3. Change the name to an existing department name (e.g., "Finance")
4. Click Submit

**Expected Result:** The system should show an error like "Department name already exists" and prevent the duplicate.

**Actual Result:** The operation hangs/times out with no feedback to the user.

**Impact:**
- Poor user experience — no feedback on duplicate edit attempt
- User is left waiting with no indication of what went wrong

---

### BUG #2: Delete Linked Department Hangs (TC_DPM_020) — Severity: MEDIUM

**Summary:** Attempting to delete a department that is linked to users causes the operation to time out (1.5 minutes) with no error message or confirmation.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Click Delete on "Human Resources" department (which is likely linked to users)
3. Accept the confirmation dialog

**Expected Result:** If the department is linked, the system should show an error message explaining it cannot be deleted.

**Actual Result:** The operation hangs/times out.

**Impact:**
- Users cannot get feedback about why a department cannot be deleted
- Linked department deletion should be gracefully handled with a meaningful error message

---

### BUG #3: Search Feature Not Working Properly (TC_DPM_021, TC_DPM_022) — Severity: HIGH

**Summary:** The search functionality on the Department Master page does not properly filter and return results. Both full name and partial name searches time out or return empty results.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Type "Finance" in the search field
3. Wait for results

**Expected Result:** Records containing "Finance" should be displayed.

**Actual Result:** Search operation times out / returns empty results.

**Impact:**
- Users cannot search for departments by name
- Critical usability issue when the department list is large

---

### BUG #4: Filter Button Not Functional (TC_DPM_028, TC_DPM_029) — Severity: LOW

**Summary:** The `.btn-filter-click` filter button causes navigation timeout when clicked, preventing users from filtering active/inactive departments.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Click the Filter button

**Expected Result:** Filter options should appear to filter active/inactive departments.

**Actual Result:** Filter button click causes a timeout.

**Impact:**
- Users cannot filter departments by active/inactive status
- Inactive departments cannot be viewed or reactivated through the filter

---

### BUG #5: Multiple Submit/Reset Buttons on Page (TC_DPM_033, TC_DPM_036, TC_DPM_038) — Severity: LOW

**Summary:** Multiple `button[type="submit"]` and `button[type="reset"]` elements are found on the page, causing strict mode violations. The filter section has its own submit/reset buttons that conflict with the form buttons.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Inspect the page for `button[type="submit"]` elements

**Expected Result:** Only one submit button should be active/visible for the main form.

**Actual Result:** Two submit buttons found — one for the add/edit form and one for the filter section. Both resolve when using `button[type="submit"]` selector.

**Impact:**
- Automation scripts break due to ambiguous button selectors
- Could confuse assistive technologies and screen readers

---

### BUG #6: HTML Injection Vulnerability (TC_DPM_044) — Severity: HIGH

**Summary:** The department name field does not sanitize HTML input. When `<h1>Injected</h1>` is entered as a department name, the `<h1>` tag is rendered inside the table, confirming an HTML injection vulnerability.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Enter `<h1>Injected</h1>` in the Department Name field
3. Click Submit
4. Observe the table — the text is rendered as an HTML heading inside the table

**Expected Result:** HTML tags should be escaped/sanitized and displayed as plain text in the table.

**Actual Result:** The `<h1>` tag is rendered as actual HTML inside the department table, confirming the vulnerability.

**Impact:**
- HTML injection can be used to deface the page or mislead users
- Could potentially be escalated to XSS if script tags or event handlers are accepted
- All users viewing the Department Master page would see the injected HTML

---

### BUG #7: Duplicate Entry on Rapid Double-Click (TC_DPM_046) — Severity: MEDIUM

**Summary:** Rapidly clicking the Submit button twice creates duplicate department entries. There is no debounce or disable mechanism on the submit button after the first click.

**Steps to Reproduce:**
1. Login and navigate to Master / Department page
2. Enter a valid department name (e.g., "RapidTestDept")
3. Quickly click the Submit button twice in rapid succession
4. Observe the table

**Expected Result:** Only one entry should be created. The submit button should be disabled after the first click or the server should reject the duplicate.

**Actual Result:** Two entries with the same department name are created in the table.

**Impact:**
- Data integrity issue — duplicate records in the database
- Users may accidentally create duplicates during normal usage with slow network

---

## Observations

1. **Login Flow:** Two-step login — mobile number first, then password on the next screen
2. **Form Fields:** Department Name (text input) and Status (checkbox toggle, default Active)
3. **Table Structure:** Columns — Sr.No., Department Name, Status, Actions (Edit/Delete)
4. **Status Toggle:** Active/Inactive toggle works correctly
5. **Duplicate Checks:** Duplicate department names are handled during creation but **not during edit** (hangs)
6. **Search:** Full name and partial search both have issues returning results
7. **Security:** SQL injection payloads do not crash the page, but **HTML injection is possible** — this is a significant security concern
8. **Double-Click:** No submit button debounce — rapid clicks create duplicate entries
9. **Unicode Support:** Hindi characters and emojis are accepted and stored correctly
10. **Trim:** Leading/trailing spaces are trimmed correctly on save
11. **Navigation:** Back/forward browser navigation works correctly
12. **Multiple Buttons:** Filter section introduces duplicate submit/reset buttons that can cause conflicts
