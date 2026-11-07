# Test Cases: Special Users (F7)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F7 - Special users (intentionally flawed accounts, recorded as known defects) |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16).
- The users `problem_user`, `error_user`, `visual_user`, and `performance_glitch_user` appear to be flawed on purpose. Case type **Known defect** means the expected result describes the flawed behavior that was observed, which differs from `standard_user`. These cases are kept in this separate file so that they do not make the main suite look broken.
- Cases that compare against `standard_user` refer to the behavior documented in `login.md`, `products.md`, `cart.md`, `checkout.md`, and `menu.md`.
- Tests for these users must use condition-based waiting, never fixed sleeps, especially for `performance_glitch_user`.
- Priority is Low for all cases because these users are not part of the main user flows.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
| Username | Password | Behavior area |
|---|---|---|
| `problem_user` | `secret_sauce` | Images, sorting, cart, product detail, About link, checkout form |
| `error_user` | `secret_sauce` | Cart, sorting, checkout form |
| `visual_user` | `secret_sauce` | Layout |
| `performance_glitch_user` | `secret_sauce` | Login speed |
 
Products that respond to **Add to cart** for `problem_user` and `error_user`: `Sauce Labs Backpack`, `Sauce Labs Bike Light`, `Sauce Labs Onesie`.
Products that do not respond: `Sauce Labs Bolt T-Shirt`, `Sauce Labs Fleece Jacket`, `Test.allTheThings() T-Shirt (Red)`.
 
## Test cases: problem_user
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-USER-001 | All products show the same image | Known defect | Low | No | The login page is open | 1. Log in as `problem_user`.<br>2. Look at the product images on the Products page. | All products show the same image. The names and prices are unchanged. | G-01 |
| TC-USER-002 | Sorting does not work | Known defect | Low | No | `problem_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select a sort option (for example `Price (low to high)`). | The dropdown can be clicked, but the selected option does not change and the product order does not change. | G-02 |
| TC-USER-003 | Product detail page shows a different product | Known defect | Low | No | `problem_user` is logged in and the Products page is open | 1. Click the card (name) of a product. | The detail page of a different product than the one clicked is opened. | G-08 |
| TC-USER-004 | About link leads to an error page | Known defect | Low | No | `problem_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **About**. | The browser navigates to `https://saucelabs.com/error/404`. (For `standard_user` it navigates to `https://saucelabs.com/`.) | G-09 |
| TC-USER-005 | Last Name field cannot be filled | Known defect | Low | No | `problem_user` is logged in, `Sauce Labs Backpack` is in the cart, and the Your Information page is open | 1. Enter the First Name `Test`.<br>2. Click the Last Name field and type `User`.<br>3. Enter the Postal Code `12345`. | Typing in the Last Name field changes the First Name field to a single character. The Last Name field remains empty. The Postal Code field accepts input normally. Checkout cannot be completed because Last Name is required. | G-04 |
 
## Test cases: error_user
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-USER-006 | Sorting shows an error message | Known defect | Low | No | `error_user` is logged in and the Products page is open | 1. Open the sort dropdown.<br>2. Select a sort option. | The error message `Sorting is broken! This error has been reported to Backtrace.` is displayed. | G-10 |
| TC-USER-007 | Order cannot be completed because of the checkout form | Known defect | Low | No | `error_user` is logged in, `Sauce Labs Backpack` is in the cart, and the Your Information page is open | 1. Enter the First Name `Test`.<br>2. Try to type `User` in Last Name.<br>3. Enter the Postal Code `12345`.<br>4. Click **Continue**.<br>5. Click **Finish**. | Last Name cannot be typed into and stays empty. First Name and Postal Code accept input. **Continue** goes to Checkout: Overview with no error. **Finish** is clickable but nothing happens (no page change, no message), so the order cannot be completed. Severity noted during exploration: High (blocks the main purchase flow). | G-11 |
 
## Test cases: problem_user and error_user (shared behavior, data-driven)
 
Run each case once with `problem_user` and once with `error_user`.
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-USER-008 | Only three products can be added to the cart | Known defect | Low | No | The user is logged in, the Products page is open, and the cart is empty | 1. Click **Add to cart** under each of the six products, one by one. | `Sauce Labs Backpack`, `Sauce Labs Bike Light`, and `Sauce Labs Onesie` can be added (the button changes to **Remove** and the cart badge increases). `Sauce Labs Bolt T-Shirt`, `Sauce Labs Fleece Jacket`, and `Test.allTheThings() T-Shirt (Red)` do not respond to **Add to cart**. | G-03, G-06 |
| TC-USER-009 | Remove works in the cart but not on the Products page | Known defect | Low | No | The user is logged in and `Sauce Labs Backpack` has been added to the cart | 1. Click **Remove** under `Sauce Labs Backpack` on the Products page.<br>2. Click the cart icon.<br>3. Click **Remove** on the row of `Sauce Labs Backpack`. | After step 1 nothing happens (the button stays **Remove** and the cart badge is unchanged). After step 3 the product is removed from the cart. | G-03, G-06 |
 
## Test cases: visual_user
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-USER-010 | Layout differs from standard_user | Known defect | Low | No | The login page is open | 1. Log in as `visual_user`.<br>2. Look at the Products page.<br>3. Add a product to the cart and click the cart icon.<br>4. Look at the Your Cart page.<br>5. Reload each page. | The layout differs from `standard_user`: the cart icon is misaligned on the Products page, the **Add to cart** button of one product is displayed outside its card, and on the Your Cart page the **Checkout** button is shifted from its normal position. After reloading, the misplaced elements stay in the same place. | G-07 |
 
## Test cases: performance_glitch_user
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result (observed) | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-USER-011 | Login is delayed | Known defect | Low | Yes | The login page is open | 1. Enter the username `performance_glitch_user` and the password `secret_sauce`.<br>2. Click **Login**.<br>3. Wait until the Products page appears. | Login takes about 5 seconds before redirecting to `https://www.saucedemo.com/inventory.html`. The test must wait for the Products page instead of using a fixed sleep. | G-05 |
 
