# User Master - Test Execution Report

**URL:** https://acl-webpanel.dokku.accucia.co/user-page
**Date:** 2026-03-28
**Credentials:** 8483013912 / 123123
**Total Test Cases:** 18
**Passed:** 17
**Failed:** 1

---

## Test Results Summary

| TC ID  | Test Case                          | Status | Remarks                          |
|--------|------------------------------------|--------|----------------------------------|
| TC_001 | Create user with valid data        | ✅ PASS |                                  |
| TC_002 | Same as current address checkbox   | ✅ PASS |                                  |
| TC_003 | Create inactive user               | ✅ PASS |                                 |
| TC_004 | Empty form submission              | ✅ PASS | Validation errors shown          |
| TC_005 | Invalid mobile number              | ✅ PASS | Error shown for short mobile     |
| TC_006 | Invalid email                      | ✅ PASS | Error shown for invalid format   |
| TC_007 | Future date validation             | ✅ PASS | Error shown for future DOJ       |
| TC_008 | Empty full name                    | ✅ PASS | Required field error shown       |
| TC_009 | Duplicate email                   | ❌ FAIL | **BUG: Duplicate email accepted** |
| TC_010 | Duplicate mobile                   | ✅ PASS | Duplicate mobile rejected        |
| TC_011 | Duplicate employee number          | ✅ PASS | Duplicate emp number rejected    |
| TC_012 | Default status is active           | ✅ PASS | Checkbox checked by default      |
| TC_013 | Toggle status                      | ✅ PASS | Toggle works correctly           |
| TC_014 | Reset form                         | ✅ PASS | Form fields cleared              |
| TC_015 | Search user                        | ✅ PASS | Search results displayed         |
| TC_016 | SQL Injection in full name         | ✅ PASS | Page did not crash               |
| TC_017 | XSS attack in full name            | ✅ PASS | No script execution              |
| TC_018 | Double submit prevention           | ✅ PASS | No duplicate creation            |

---

## Bugs / Issues Found

### BUG #1: Duplicate Email Allowed (TC_009) — Severity: HIGH

**Summary:** The system allows creating multiple users with the same email address. No duplicate email validation is in place.

**Steps to Reproduce:**
1. Login and navigate to Master / Users page
2. Fill the form with valid data including email `dup_email_xxx@test.com`
3. Submit the form — user is created successfully
4. Navigate back to the Add User form
5. Fill the form again with a **different mobile & employee number** but the **same email**
6. Submit the form

**Expected Result:** The system should show an error like "Email already exists" and prevent the duplicate user creation.

**Actual Result:** The system shows "User has been created successfully" and creates a second user with the same email address.

**Impact:**
- Data integrity issue — multiple users can share the same email
- Can cause problems with password reset, email notifications, and user identification
- Duplicate mobile number and duplicate employee number are correctly validated, but email is not

**Screenshot:** `test-results/user-master-User-Master---Add-User-TC-009---Duplicate-email/test-failed-1.png`

---

## Observations

1. **Login Flow:** Two-step login — mobile number first, then password on the next screen
2. **Form Fields:** All mandatory fields are properly marked with asterisk (*)
3. **Select2 Dropdowns:** Designation and Department use Select2 plugin; Reporting Manager uses native select
4. **Date Picker:** Uses Flatpickr for Date of Joining
5. **Status Toggle:** Active/Inactive toggle switch works correctly, default is Active
6. **Duplicate Checks:** Mobile number and Employee number have server-side duplicate validation, but **email does not**
7. **Security:** SQL injection and XSS payloads do not crash the page — basic protection is in place
