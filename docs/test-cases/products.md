# Test Cases: Product List, Sorting, Product Detail (F2)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F2 - Product list, sorting, product detail |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16). Cases of type **Observation** describe behavior that was observed but cannot be confirmed as correct.
- All cases in this file use `standard_user`. Behavior of the other users is covered in `special-users.md`.
- Products are identified by name, never by list position or by the `id` in the URL (the id is a product code and does not match the display order).
- Two products have the same price ($15.99). Tests must not depend on their relative order. In the observed run, Sauce Labs Bolt T-Shirt always appeared before Test.allTheThings() T-Shirt (Red) in both price sort directions.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
| Product | Price |
|---|---|
| Sauce Labs Onesie | $7.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Fleece Jacket | $49.99 |
 
Sort options: `Name (A to Z)` (default), `Name (Z to A)`, `Price (low to high)`, `Price (high to low)`.
 
## Test cases
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-PROD-001 | Products page shows all six products | Positive | High | Yes | `standard_user` is logged in | 1. Log in as `standard_user` with the password `secret_sauce`.<br>2. Look at the Products page. | 6 products are displayed. Each product shows an image, a name, a price, and an **Add to cart** button. The names and prices match the product list in the test data. | C-01, C-04 |
| TC-PROD-002 | Sort by Name (A to Z) | Positive | Medium | Yes | `standard_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select `Name (A to Z)`. | The products are listed in this order: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red). | C-02 |
| TC-PROD-003 | Sort by Name (Z to A) | Positive | Medium | Yes | `standard_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select `Name (Z to A)`. | The products are listed in this order: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack. | C-03 |
| TC-PROD-004 | Sort by Price (low to high) | Positive | Medium | Yes | `standard_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select `Price (low to high)`. | The prices are listed in ascending order: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99. The two $15.99 products may appear in either order. | C-04 |
| TC-PROD-005 | Sort by Price (high to low) | Positive | Medium | Yes | `standard_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select `Price (high to low)`. | The prices are listed in descending order: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99. The two $15.99 products may appear in either order. | C-05 |
| TC-PROD-006 | Product detail page matches the product list | Positive | High | Yes | `standard_user` is logged in and the Products page is open | 1. Note the name, description, and price of `Sauce Labs Backpack` in the list.<br>2. Click the product name. | The product detail page opens. Its name, description, and price match the values shown in the list. | C-06 |
| TC-PROD-007 | Back to products returns to the Products page | Positive | Medium | Yes | `standard_user` is logged in and the detail page of a product is open | 1. Click **Back to products**. | The Products page is displayed. | C-07 |
| TC-PROD-008 | Sort option resets after opening a product and going back | Observation | Low | No | `standard_user` is logged in and the Products page is open | 1. Select `Price (high to low)` in the sort dropdown.<br>2. Click the name of any product.<br>3. Click **Back to products**. | The Products page is displayed and the sort option is back to the default `Name (A to Z)` and the list is sorted accordingly (Sauce Labs Backpack is first). No requirement is available to confirm whether this is intended. | C-07 |
 
