# Test Cases: Cart (F3)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F3 - Cart |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16).
- All cases in this file use `standard_user` and the password `secret_sauce`. Behavior of the other users is covered in `special-users.md`.
- Each case starts from a fresh login with an empty cart. If the cart is not empty, use **Reset App State** from the menu and reload the page.
- Products are identified by name, never by list position.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Onesie | $7.99 |
 
## Test cases
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-CART-001 | Add one product to the cart | Positive | High | Yes | `standard_user` is logged in, the Products page is open, and the cart is empty | 1. Click **Add to cart** under `Sauce Labs Backpack`. | The cart badge shows 1. The button of that product changes from **Add to cart** to **Remove** (red outline, red text). | D-01 |
| TC-CART-002 | Cart badge shows the number of added products | Positive | Medium | Yes | `standard_user` is logged in, the Products page is open, and the cart is empty | 1. Click **Add to cart** under `Sauce Labs Backpack`.<br>2. Click **Add to cart** under `Sauce Labs Bike Light`.<br>3. Click **Add to cart** under `Sauce Labs Onesie`. | The cart badge shows 3 (the number of products added). | D-02 |
| TC-CART-003 | Remove a product from the Products page | Positive | Medium | Yes | `standard_user` is logged in and 3 products are in the cart (see TC-CART-002) | 1. Click **Remove** under `Sauce Labs Onesie`. | The cart badge decreases by 1, from 3 to 2. | D-03 |
| TC-CART-004 | Cart page shows the added products | Positive | High | Yes | `standard_user` is logged in and `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart | 1. Click the cart icon. | The page title is `Your Cart`. The columns QTY and Description are shown. Each row shows the quantity, name, description, price, and a **Remove** button. The **Continue Shopping** and **Checkout** buttons are shown. | D-04 |
| TC-CART-005 | Remove a product from the cart page | Positive | High | Yes | `standard_user` is logged in, `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart, and the cart page is open | 1. Click **Remove** on the row of `Sauce Labs Bike Light`. | The row of `Sauce Labs Bike Light` disappears from the cart list. The cart badge decreases by 1, from 2 to 1. | D-05 |
| TC-CART-006 | Cart content is kept after logout and login | Positive | High | Yes | `standard_user` is logged in and `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart | 1. Open the menu and click **Logout**.<br>2. Log in again as `standard_user`.<br>3. Click the cart icon. | The same products are still in the cart. The cart badge shows 2. | D-06 |
| TC-CART-007 | Continue Shopping returns to the Products page with the cart unchanged | Positive | Medium | Yes | `standard_user` is logged in, `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart, and the cart page is open | 1. Click **Continue Shopping**. | The Products page is displayed. The cart badge shows the same count (2). The added products still show **Remove**. | D-07 |
 
