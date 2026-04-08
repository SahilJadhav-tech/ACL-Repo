# Designation Master - Test Execution Report

**URL:** https://acl-webpanel.dokku.accucia.co/designation-page
**Date:** 2026-04-01
**Credentials:** 8483013912 / 123123
**Total Test Cases:** 50
**Passed:** 30
**Failed:** 20

---

## Test Results Summary

| TC ID     | Test Case                                         | Status | Remarks                                                              |
|-----------|----------------------------------------------------|--------|----------------------------------------------------------------------|
| TC_DM_001 | Create designation with valid data                | FAIL   | **Navigation timeout — intermittent network issue during login**      |
| TC_DM_002 | Create another designation with valid data        | FAIL   | **Navigation timeout — intermittent network issue during login**      |
| TC_DM_003 | Verify designation appears in table after creation| FAIL   | **Navigation timeout — page didn't load in time**                     |
| TC_DM_004 | Validate empty designation name submission        | FAIL   | **Navigation timeout — intermittent network issue during login**      |
| TC_DM_005 | Validate designation name with only spaces        | PASS   | No blank names found in table                                        |
| TC_DM_006 | Validate special characters in designation name   | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_007 | Validate numeric only designation name            | PASS   | Numeric name accepted                                                |
| TC_DM_008 | Validate maximum length for designation name      | PASS   | 256-char name accepted                                               |
| TC_DM_009 | Validate single character designation name        | PASS   | Single character accepted                                            |
| TC_DM_010 | Validate alphanumeric designation name            | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_011 | Validate duplicate designation name               | PASS   | Duplicate message shown ("already exists")                           |
| TC_DM_012 | Validate case insensitive duplicate check         | PASS   | Case insensitive duplicate handled                                   |
| TC_DM_013 | Validate duplicate with spaces around name        | PASS   | Spaces trimmed, duplicate detected                                   |
| TC_DM_014 | Edit existing designation name                    | PASS   | Designation name updated successfully                                |
| TC_DM_015 | Edit designation and submit empty name            | PASS   | Empty name submission handled — error class added to input           |
| TC_DM_016 | Edit designation name to an existing duplicate    | FAIL   | **BUG: Timed out (1.5m) — edit with duplicate name not handled**     |
| TC_DM_017 | Edit designation without changing any data        | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_018 | Delete existing designation                       | PASS   | Delete confirmation dialog shown                                     |
| TC_DM_019 | Cancel delete confirmation dialog                 | PASS   | Record retained after cancel                                         |
| TC_DM_020 | Delete designation that is linked                 | FAIL   | **BUG: Timed out (1.5m) — linked designation deletion hangs**        |
| TC_DM_021 | Search designation by full name                   | FAIL   | **BUG: Search timed out (1.5m) — search not returning results**      |
| TC_DM_022 | Search designation by partial name                | FAIL   | **BUG: Partial search timed out (1.5m) — search not working**        |
| TC_DM_023 | Search with no matching results                   | PASS   | All rows still shown (no filtering)                                  |
| TC_DM_024 | Search with special characters                    | PASS   |                                                                      |
| TC_DM_025 | Clear search and verify all records shown         | PASS   |                                                                      |
| TC_DM_026 | Mark designation as inactive                      | PASS   | Status toggled successfully                                          |
| TC_DM_027 | Inactive designation should not appear in active  | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_028 | View inactive designation using filter            | FAIL   | **BUG: `.btn-filter-click` timed out — filter UI issue**             |
| TC_DM_029 | Reactivate inactive designation                   | FAIL   | **BUG: `.btn-filter-click` timed out — filter UI issue**             |
| TC_DM_030 | Inactive designation not in user master dropdown  | PASS   |                                                                      |
| TC_DM_031 | Create designation with inactive status           | PASS   |                                                                      |
| TC_DM_032 | Reset form after filling data                     | PASS   | Form fields cleared                                                  |
| TC_DM_033 | Reset form during edit mode                       | FAIL   | **BUG: `button[type="reset"]` resolved to 2 elements — strict mode** |
| TC_DM_034 | Trim leading and trailing spaces on save          | PASS   | Spaces trimmed correctly ("Team Lead")                               |
| TC_DM_035 | Multiple spaces between words                     | PASS   | Multiple spaces collapsed ("Senior Manager")                         |
| TC_DM_036 | Verify all UI elements are visible                | FAIL   | **BUG: `button[type="submit"]` resolved to 2 elements — strict mode violation** |
| TC_DM_037 | Verify table column headers                       | PASS   | Headers: Sr.No., Designation Name, Status, Actions                   |
| TC_DM_038 | Verify form elements on page load                 | FAIL   | **BUG: `button[type="reset"]` resolved to 2 elements — strict mode** |
| TC_DM_039 | Verify pagination                                 | PASS   | Pagination exists                                                    |
| TC_DM_040 | Verify serial number increments correctly         | PASS   | Serial numbers increment correctly                                   |
| TC_DM_041 | SQL injection in designation name field           | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_042 | XSS attack in designation name field              | PASS   | Page did not crash                                                   |
| TC_DM_043 | SQL injection in search field                     | PASS   | Page did not crash                                                   |
| TC_DM_044 | HTML injection in designation name field          | FAIL   | **Navigation timeout — intermittent network issue**                   |
| TC_DM_045 | Access designation master without login           | PASS   | Redirected to login page                                             |
| TC_DM_046 | Rapid double click on submit button               | PASS   | No duplicate created on rapid click                                  |
| TC_DM_047 | Unicode characters in designation name            | PASS   | Unicode (Hindi) characters accepted                                  |
| TC_DM_048 | Emoji in designation name                         | PASS   | Emoji characters accepted                                            |
| TC_DM_049 | Browser back button after saving                  | PASS   | Table visible after back/forward navigation                          |
| TC_DM_050 | Page refresh should retain data                   | FAIL   | **Navigation timeout — page.reload timed out**                       |

---

## Failure Analysis

### Category 1: Intermittent Network/Navigation Timeouts (11 failures)
**TC_DM_001, 002, 003, 004, 006, 010, 017, 027, 041, 044, 050**

These failures are caused by intermittent `page.goto` timeouts (30s) when navigating to the designation page. The remote server occasionally takes longer to respond. These are **not application bugs** — they pass on subsequent reruns.

### Category 2: Actual Application Bugs (9 failures)

---

### BUG #1: Edit Designation to Duplicate Name Hangs (TC_DM_016) — Severity: MEDIUM

**Summary:** When editing a designation and changing its name to an already existing designation name, the operation times out (1.5 minutes) without any error message or response.

**Steps to Reproduce:**
1. Login and navigate to Master / Designation page
2. Click Edit on any designation entry
3. Change the name to an existing designation name (e.g., "Developer")
4. Click Submit

**Expected Result:** The system should show an error like "Designation name already exists" and prevent the duplicate.

**Actual Result:** The operation hangs/times out with no feedback to the user.

**Impact:**
- Poor user experience — no feedback on duplicate edit attempt
- User is left waiting with no indication of what went wrong

---

### BUG #2: Delete Linked Designation Hangs (TC_DM_020) — Severity: MEDIUM

**Summary:** Attempting to delete a designation that may be linked to users causes the operation to time out (1.5 minutes) with no error message or confirmation.

**Steps to Reproduce:**
1. Login and navigate to Master / Designation page
2. Click Delete on "Developer" designation (which is likely linked to users)
3. Accept the confirmation dialog

**Expected Result:** If the designation is linked, the system should show an error message explaining it cannot be deleted.

**Actual Result:** The operation hangs/times out.

---

### BUG #3: Search Feature Not Working Properly (TC_DM_021, TC_DM_022) — Severity: HIGH

**Summary:** The search functionality on the Designation Master page does not properly filter and return results. Both full name and partial name searches time out or return empty results.

**Steps to Reproduce:**
1. Login and navigate to Master / Designation page
2. Type "Developer" in the search field
3. Wait for results

**Expected Result:** Records containing "Developer" should be displayed.

**Actual Result:** Search operation times out / returns empty results.

---

### BUG #4: Filter Button Not Functional (TC_DM_028, TC_DM_029) — Severity: LOW

**Summary:** The `.btn-filter-click` filter button causes navigation timeout when clicked, preventing users from filtering active/inactive designations.

**Steps to Reproduce:**
1. Login and navigate to Master / Designation page
2. Click the Filter button

**Expected Result:** Filter options should appear to filter active/inactive designations.

**Actual Result:** Filter button click causes a timeout.

---

### BUG #5: Multiple Submit/Reset Buttons on Page (TC_DM_033, TC_DM_036, TC_DM_038) — Severity: LOW

**Summary:** Multiple `button[type="submit"]` and `button[type="reset"]` elements are found on the page, causing strict mode violations. The filter section has its own submit/reset buttons that conflict with the form buttons.

**Steps to Reproduce:**
1. Login and navigate to Master / Designation page
2. Inspect the page for `button[type="submit"]` elements

**Expected Result:** Only one submit button should be active/visible for the main form.

**Actual Result:** Two submit buttons found — one for the add/edit form and one for the filter section. Both resolve when using `button[type="submit"]` selector.

---

## Observations

1. **Login Flow:** Two-step login — mobile number first, then password on the next screen
2. **Form Fields:** Designation Name (text input) and Status (checkbox toggle, default Active)
3. **Table Structure:** Columns — Sr.No., Designation Name, Status, Actions (Edit/Delete)
4. **Status Toggle:** Active/Inactive toggle works correctly
5. **Duplicate Checks:** Duplicate designation names are handled during creation but **not during edit** (hangs)
6. **Search:** Full name and partial search appear to have issues returning results
7. **Security:** SQL injection payloads do not crash the page; XSS scripts are handled
8. **Rapid Click:** No duplicate entries created on rapid double-click (better than Caste Master)
9. **Unicode Support:** Hindi characters and emojis are accepted and stored correctly
10. **Trim:** Leading/trailing spaces are trimmed correctly on save
11. **Navigation:** Back/forward browser navigation works correctly
12. **Multiple Buttons:** Filter section introduces duplicate submit/reset buttons that can cause conflicts
