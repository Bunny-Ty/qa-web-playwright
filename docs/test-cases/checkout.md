# Test Cases: Checkout and Price Calculation (F4, F6)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F4 - Checkout and price calculation, F6 - PDF order receipt |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16).
- Case types: **Positive** (valid input), **Negative** (invalid input, error expected), **Observation** (behavior observed but not confirmable as correct), **Defect candidate** (behavior that looks wrong by common e-commerce conventions; to be documented in `docs/bug-reports`). For a Defect candidate the expected result describes what was observed, not what should happen.
- All cases in this file use `standard_user` and the password `secret_sauce`. Behavior of the other users is covered in `special-users.md`.
- Unless stated otherwise, each case starts from a fresh login with an empty cart. If the cart is not empty, use **Reset App State** from the menu and reload the page.
- The third field on the Your Information page is labeled `Zip/Postal Code`, while its error message says `Postal Code`.
- The SauceCard number and the order date change between orders. Tests must check only that they are present, not their values.
- Expected tax and total must be calculated in the test, never hard-coded.
- Downloaded PDF receipts must not be committed to the repository.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
### Checkout information (fake data only)
 
| Field | Value |
|---|---|
| First Name | `Test` |
| Last Name | `User` |
| Postal Code | `12345` |
 
### Price calculation sets
 
Tax is 8% of the item total, rounded to two decimals. Total is the item total plus tax.
 
| Set | Products in the cart | Item total | Tax | Total |
|---|---|---|---|---|
| P1 | Sauce Labs Backpack, Sauce Labs Bike Light | $39.98 | $3.20 | $43.18 |
| P2 | Sauce Labs Backpack | $29.99 | $2.40 | $32.39 |
| P3 | Sauce Labs Onesie, Sauce Labs Backpack | $37.98 | $3.04 | $41.02 |
| P4 | Sauce Labs Onesie | $7.99 | $0.64 | $8.63 |
| P5 | All six products | $129.94 | $10.40 | $140.34 |
 
## Test cases: Your Information form
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-001 | All three fields empty | Negative | High | Yes | `standard_user` is logged in, `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart, and the cart page is open | 1. Click **Checkout**.<br>2. Leave First Name, Last Name, and Postal Code empty.<br>3. Click **Continue**. | The error message `Error: First Name is required` is displayed in a red banner with a ✕ button. All three fields show a red ✕ icon and a red underline. Only the first missing field is reported. | E-01 |
| TC-CHK-002 | First Name missing | Negative | High | Yes | The Your Information page is open | 1. Leave First Name empty.<br>2. Enter the Last Name `User` and the Postal Code `12345`.<br>3. Click **Continue**. | The error message `Error: First Name is required` is displayed. | E-02 |
| TC-CHK-003 | Last Name missing | Negative | High | Yes | The Your Information page is open | 1. Enter the First Name `Test`.<br>2. Leave Last Name empty.<br>3. Enter the Postal Code `12345`.<br>4. Click **Continue**. | The error message `Error: Last Name is required` is displayed. | E-03 |
| TC-CHK-004 | Postal Code missing | Negative | High | Yes | The Your Information page is open | 1. Enter the First Name `Test` and the Last Name `User`.<br>2. Leave Postal Code empty.<br>3. Click **Continue**. | The error message `Error: Postal Code is required` is displayed. | E-04 |
| TC-CHK-005 | Error banner can be closed with its ✕ button | Positive | Low | Yes | The Your Information page shows an error (for example, after clicking **Continue** with all fields empty) | 1. Click the ✕ button on the red error banner. | The error banner closes. The red ✕ icons and red underlines on the fields are removed. | E-01 |
| TC-CHK-006 | The ✕ icon inside an input field does nothing | Observation | Low | No | The Your Information page shows an error (for example, after clicking **Continue** with all fields empty) | 1. Click the red ✕ icon inside one of the input fields. | Nothing happens. The error banner and the red highlights remain. | E-01 |
| TC-CHK-007 | Cancel on the Your Information page returns to the cart | Positive | Medium | Yes | The Your Information page is open and 2 products are in the cart | 1. Click **Cancel**. | The Your Cart page is displayed. The cart is unchanged (same items and same badge count as before). | E-14 |
 
## Test cases: Overview, price calculation, and completion
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-008 | Overview page shows the order details | Positive | High | Yes | `standard_user` is logged in, `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart, and the Your Information page is open | 1. Enter the First Name `Test`, the Last Name `User`, and the Postal Code `12345`.<br>2. Click **Continue**. | The page title is `Checkout: Overview`. There is one block per product with the quantity, name, description, and price. Payment Information shows a SauceCard number (the value differs between orders). Shipping Information shows `Free Pony Express Delivery!`. The Price Total section shows Item total, Tax, and Total. The **Cancel** and **Finish** buttons are shown. | E-05 |
| TC-CHK-009 | Item total, tax, and total are calculated correctly (data-driven) | Positive | High | Yes | `standard_user` is logged in and the Products page is open | 1. Add the products of one price calculation set (P1 to P5) to the cart.<br>2. Open the cart and click **Checkout**.<br>3. Enter the checkout information and click **Continue**.<br>4. Compare the values in the Price Total section with the set.<br>5. Repeat from a fresh login for each set. | Item total equals the sum of the product prices. Tax is 8% of the item total, rounded to two decimals. Total equals item total plus tax. All values match the table for the set. | E-06 |
| TC-CHK-010 | Finish completes the order | Positive | High | Yes | `standard_user` is logged in and the Checkout: Overview page is open with 2 products | 1. Click **Finish**. | The page title is `Checkout: Complete!`. A green check icon is shown. The heading is `Thank you for your order!`. The text is `Your order has been dispatched, and will arrive just as fast as the pony can get there!`. The **Back Home** and **Generate PDF order** buttons are shown. | E-07 |
| TC-CHK-011 | Cart is empty after the order is completed | Positive | High | Yes | An order has just been completed (the Checkout: Complete! page is open) | 1. Look at the cart icon.<br>2. Click the cart icon. | The cart icon has no badge. The cart page shows no products. | E-08 |
| TC-CHK-012 | Back Home returns to the Products page | Positive | Medium | Yes | The Checkout: Complete! page is open | 1. Click **Back Home**. | The Products page is displayed. The cart is empty. | E-10 |
| TC-CHK-013 | Cancel on the Overview page returns to the Products page | Observation | Low | No | The Checkout: Overview page is open and 2 products are in the cart | 1. Click **Cancel**. | The Products page is displayed (not the Your Cart page, unlike Cancel on the Your Information page). The cart is unchanged (same items and same badge count). No requirement is available to confirm whether this is intended. | E-15 |
 
## Test cases: Checkout validation gaps (defect candidates)
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-014 | Checkout can be completed with an empty cart | Defect candidate | Medium | No | `standard_user` is logged in and the cart is empty | 1. Open the cart page and click **Checkout**.<br>2. Enter the First Name `Test`, the Last Name `User`, and the Postal Code `12345`.<br>3. Click **Continue**.<br>4. Click **Finish**.<br>5. Click **Generate PDF order**. | Checkout is not blocked. The Overview page opens with Item total $0.00. **Finish** completes the order. The PDF receipt has no products and shows $0.00. Common e-commerce behavior would be to prevent checkout of an empty cart. | E-09 |
| TC-CHK-015 | Postal Code accepts letters and symbols | Defect candidate | Medium | No | The Your Information page is open and 2 products are in the cart | 1. Enter the First Name `Test` and the Last Name `User`.<br>2. Enter the Postal Code `abc` (repeat with `@#$`).<br>3. Click **Continue**. | No error is shown. The Checkout: Overview page opens. The validation appears to check only that the fields are not empty. | E-12 |
| TC-CHK-016 | Fields containing only a space are accepted | Defect candidate | Medium | No | The Your Information page is open and 2 products are in the cart | 1. Enter a single space in First Name, Last Name, and Postal Code.<br>2. Click **Continue**. | No error is shown. The Checkout: Overview page opens. Whitespace is not trimmed. | E-13 |
| TC-CHK-017 | Very long input is accepted without a limit | Defect candidate | Low | No | The Your Information page is open and 2 products are in the cart | 1. Enter more than 255 characters (for example, 300) in First Name, Last Name, and Postal Code.<br>2. Click **Continue**.<br>3. Click **Finish**.<br>4. Click **Generate PDF order**. | No error is shown and the order completes. The PDF shows the long text in Ship To without truncation. The totals are still correct. | E-16 |
 
## Test cases: PDF order receipt
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-CHK-018 | PDF order receipt content | Positive | Low | Yes | An order with 2 products has just been completed (the Checkout: Complete! page is open) | 1. Click **Generate PDF order**.<br>2. Open the downloaded PDF. | A PDF file is downloaded. It contains the title `Swag Labs Order Receipt`, the order date and time, Ship To with the entered name and postal code, the selected products with their prices, and Item total, Tax, and Total matching the Overview page. The footer starts with `Thank you for your order!`. | E-11 |
 
