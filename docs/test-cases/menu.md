# Test Cases: Menu Actions (F5)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F5 - Menu actions (menu items, Logout, Reset App State, About) |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16).
- Case types: **Positive** (expected flow), **Observation** (behavior observed but not confirmable as correct), **Defect candidate** (behavior that looks wrong by common e-commerce conventions; to be documented in `docs/bug-reports`). For a Defect candidate the expected result describes what was observed, not what should happen.
- All cases in this file use `standard_user` and the password `secret_sauce`. Behavior of the other users is covered in `special-users.md`.
- The pages under **Dynamic Catalog** (Lazy Load, Spinner, Slider) are out of scope for the first version (see the test plan, section 3.2). Only the presence of the menu item is checked here.
- The page behind **About** (`saucelabs.com`) is a third-party site. Tests check only where the link leads, never the content of that site.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
| Menu item | Purpose |
|---|---|
| All Items | Go to the Products page |
| Dynamic Catalog | Expandable item (sub-pages out of scope) |
| About | Link to the Sauce Labs site |
| Logout | End the session |
| Reset App State | Clear the cart |
 
Products used: `Sauce Labs Backpack` and `Sauce Labs Bike Light`.
 
## Test cases
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-MENU-001 | Menu shows all items | Positive | Medium | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡). | The menu opens with a ✕ close button and 5 items: `All Items`, `Dynamic Catalog` (expandable), `About`, `Logout`, `Reset App State`. | F-01 |
| TC-MENU-002 | Logout returns to the Login page | Positive | High | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **Logout**. | The Login page is displayed (`https://www.saucedemo.com/`). | F-04 |
| TC-MENU-003 | About opens the Sauce Labs site | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **About**. | The browser navigates to `https://saucelabs.com/` in the same tab. | F-03 |
| TC-MENU-004 | Reset App State empties the cart | Positive | Medium | Yes | `standard_user` is logged in, the Products page is open, and `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart | 1. Click the menu icon (≡).<br>2. Click **Reset App State**.<br>3. Click the cart icon. | The cart badge is removed. The cart is empty. | F-02 |
| TC-MENU-005 | Reset App State leaves stale Remove buttons until reload | Defect candidate | Medium | No | `standard_user` is logged in, the Products page is open, and `Sauce Labs Backpack` and `Sauce Labs Bike Light` are in the cart | 1. Click the menu icon (≡).<br>2. Click **Reset App State**.<br>3. Look at the buttons of the two products on the Products page.<br>4. Reload the page. | After step 2 the cart badge is removed, but the buttons of the two products still show **Remove** (not **Add to cart**). The menu stays open. After the reload, the menu is closed and all buttons show **Add to cart**. Common behavior would be that the buttons update immediately. | F-02 |
| TC-MENU-006 | All Items on the Products page does nothing | Observation | Low | No | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **All Items**. | Nothing happens. No requirement is available to confirm whether this is intended. | F-05 |
| TC-MENU-007 | All Items leads back to the Products page from other pages (data-driven) | Observation | Low | No | `standard_user` is logged in | 1. Open one of these pages: the Your Cart page, or the detail page of any product.<br>2. Click the menu icon (≡).<br>3. Click **All Items**.<br>4. Repeat for the other page. | The Products page is displayed from both pages. No requirement is available to confirm whether this is intended. | F-05 |
