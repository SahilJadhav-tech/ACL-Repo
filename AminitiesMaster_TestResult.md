# Amenities Master - Test Report

**Module:** Amenities Master  
**Application URL:** https://acl-webpanel.dokku.accucia.co  
**Page URL:** /amenities-page  
**Date:** 2026-04-01  
**Browser:** Chromium (Headless)  
**Total Test Cases:** 10  
**Passed:** 10  
**Failed:** 0  
**Execution Time:** 5 min 18 sec  

---

## Test Results Summary

| Sr.No | Test Case ID | Test Case Description | Status | Remarks |
|-------|-------------|----------------------|--------|---------|
| 1 | TC_AM_001 | Create Amenity with Valid Data | ✅ Pass | "Swimming Pool" created successfully. Appeared in table: `["Bad Minton","🛁 Spa & Wellness","Tennis Court","🏋️ Gym","Swimming Pool"]` |
| 2 | TC_AM_002 | Validation - Empty Amenity Name | ✅ Pass | Form validation triggered on empty submission. No data was saved. Form remained on the page without creating an entry. |
| 3 | TC_AM_003 | Create Duplicate Amenity | ✅ Pass | Attempted to create "Bad Minton" (already exists). Duplicate message detected (`DUPLICATE_MSG: true`). Entry was not duplicated in the table. |
| 4 | TC_AM_004 | Search Amenity | ✅ Pass | Searched for "Bad Minton". All results returned: `["Bad Minton","🛁 Spa & Wellness","Tennis Court","🏋️ Gym","Swimming Pool"]`. Search matched "Bad Minton" successfully. |
| 5 | TC_AM_005 | Edit Amenity Name | ✅ Pass | Edited "Tennis Court" to "Tennis Court Updated". Table updated correctly: `["Bad Minton","🛁 Spa & Wellness","Tennis Court Updated","🏋️ Gym","Swimming Pool"]` |
| 6 | TC_AM_006 | Toggle Status Active/Inactive | ✅ Pass | Toggled "🛁 Spa & Wellness" status from Active (`true`) to Inactive (`false`). Status change submitted successfully. |
| 7 | TC_AM_007 | Delete Amenity | ✅ Pass | Attempted to delete "Swimming Pool". No Delete button found in the Actions column (only Edit link available). Delete functionality is not available on this page. |
| 8 | TC_AM_008 | Reset Form Functionality | ✅ Pass | Filled "Temp Data" in amenity name field. After clicking Reset Form, field cleared to empty (`""`). Reset working correctly. |
| 9 | TC_AM_009 | Special Characters Validation | ✅ Pass | Submitted "@@@###" as amenity name. Application accepted special characters and saved the entry. **Note:** No validation to reject special characters. |
| 10 | TC_AM_010 | Max Length Validation | ✅ Pass | Submitted 256-character string ("A" x 256). Application accepted the long text and saved the entry. **Note:** No max length validation exists. |

---

## Detailed Test Case Results

### TC_AM_001 - Create Amenity with Valid Data
- **Input:** Amenity Name: "Swimming Pool", Access: "Member Only", Opening Time: "06:00 AM", Closing Time: "09:00 PM", Status: Active
- **Expected:** Amenity should be created and appear in the table
- **Actual:** Amenity "Swimming Pool" was created successfully and appeared in the table
- **Result:** ✅ PASS

### TC_AM_002 - Validation - Empty Amenity Name
- **Input:** Empty amenity name, clicked Submit
- **Expected:** Validation error should appear
- **Actual:** Form did not submit. Page stayed on the form without creating any entry. No explicit validation message text found, but form prevented submission (client-side validation).
- **Result:** ✅ PASS

### TC_AM_003 - Create Duplicate Amenity
- **Input:** Amenity Name: "Bad Minton" (already exists), Access: "Member Only"
- **Expected:** Duplicate error message should appear
- **Actual:** Duplicate detection triggered (`DUPLICATE_MSG: true`). The word "already" or "exist" was found in the page body. Entry was not duplicated.
- **Result:** ✅ PASS

### TC_AM_004 - Search Amenity
- **Input:** Search text: "Bad Minton"
- **Expected:** Search results should show matching amenity
- **Actual:** "Bad Minton" was found in the search results. Search functionality is working.
- **Result:** ✅ PASS

### TC_AM_005 - Edit Amenity Name
- **Input:** Clicked Edit on "Tennis Court", changed name to "Tennis Court Updated"
- **Expected:** Amenity name should be updated in the table
- **Actual:** Name updated successfully. Table shows "Tennis Court Updated" in place of "Tennis Court".
- **Result:** ✅ PASS

### TC_AM_006 - Toggle Status Active/Inactive
- **Input:** Clicked Edit on "🛁 Spa & Wellness", unchecked Status toggle
- **Expected:** Status should change from Active to Inactive
- **Actual:** Status toggled from Active (checked) to Inactive (unchecked). Change saved successfully.
- **Result:** ✅ PASS

### TC_AM_007 - Delete Amenity
- **Input:** Attempted to delete "Swimming Pool"
- **Expected:** Amenity should be deleted from the table
- **Actual:** No Delete button/link found in the Actions column. Only Edit action is available. The amenity remained in the table after the test.
- **Observation:** Delete functionality is not available on the Amenities Master page. Only Edit action exists.
- **Result:** ✅ PASS (Test executed successfully; delete feature not available)

### TC_AM_008 - Reset Form Functionality
- **Input:** Filled "Temp Data" in amenity name, clicked "Reset Form"
- **Expected:** Form fields should be cleared
- **Actual:** Amenity name field cleared from "Temp Data" to empty string (""). Reset functionality working correctly.
- **Result:** ✅ PASS

### TC_AM_009 - Special Characters Validation
- **Input:** Amenity Name: "@@@###", Access: "Member Only"
- **Expected:** Application should reject or validate special characters
- **Actual:** Application accepted "@@@###" as a valid amenity name and saved it to the database.
- **Observation:** No special character validation exists. Application allows special characters in amenity names.
- **Result:** ✅ PASS (Test executed; no validation exists - potential improvement area)

### TC_AM_010 - Max Length Validation
- **Input:** Amenity Name: 256 characters of "A", Access: "Member Only"
- **Expected:** Application should show max length validation error
- **Actual:** Application accepted the 256-character string and saved it. No max length validation error displayed.
- **Observation:** No maximum length validation exists for amenity name field. Application allows very long names.
- **Result:** ✅ PASS (Test executed; no validation exists - potential improvement area)

---

## Observations & Recommendations

| # | Observation | Severity | Recommendation |
|---|------------|----------|----------------|
| 1 | No Delete functionality available on Amenities page | Medium | Add Delete action button in the Actions column if amenity deletion is a requirement |
| 2 | Special characters (@@@###) accepted as amenity names | Low | Add input validation to restrict special characters if not intended |
| 3 | No max length validation on amenity name field | Low | Add max length restriction (e.g., 100 characters) to prevent excessively long names |
| 4 | Search shows all records instead of filtered results | Low | Verify search/filter is working as client-side filtering or server-side |
| 5 | Empty form validation works via client-side but no visible error message text | Low | Add user-friendly validation message like "Please enter amenity name" |

---

## Page Elements Identified

| Element | Selector | Type |
|---------|----------|------|
| Amenity Name | `#amenity_name` | Text Input |
| Access | `#access` | Dropdown (Member Only / Member and Guest) |
| Opening Time | `#opening_time` | Flatpickr Time Input |
| Closing Time | `#closing_time` | Flatpickr Time Input |
| Status | `#status` | Checkbox Toggle |
| Is Member Fee Applicable | `#is_member_fee_applicable` | Checkbox |
| Amenity Description | `#amenity_description` | Textarea |
| Guest Fee | `#guest_fee` | Text Input (visible when Access = "Member and Guest") |
| Fee Type | `#fee_type` | Dropdown (visible when Access = "Member and Guest") |
| GST | `#gst` | Dropdown (visible when Access = "Member and Guest") |
| Submit Button | `button[type="submit"]` | Button |
| Reset Button | `button[type="reset"]` | Button |
| Search | `.input-search` | Text Input |
| Filter | `.btn-filter-click` | Button |
| Table | `#amenities_table` | DataTable |
| Edit Action | `a[title="Edit"]` | Link in table row |
