# Test Cases: Dynamic Catalog (FT-08)

| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | FT-08 - Dynamic Catalog (Lazy Load, Spinner, Slider) |
| Related work items | PROJECT-22 |
| Last updated | 2026-11-19 |

## Notes

- No requirements document is available. Expected results come from direct observation of the live site with a Playwright probe on 2026-11-19. Cases of type **Observation** describe behavior that was observed but cannot be confirmed as correct.
- All cases use `standard_user` and the password `secret_sauce`. The three pages are opened from the menu: **Dynamic Catalog** (expandable), then **Lazy Load**, **Spinner**, or **Slider**.
- The content of these pages appears over time (Lazy Load batches, the Spinner, the auto-advancing Slider). Tests must use condition-based waiting, never fixed sleeps (see the test plan, section 5.3).
- Time values in this file (for example, about 2 seconds per slide) are approximate observations from samples taken every 2 seconds. They must not be asserted.
- The slide shown in the Slider is identified by its active dot (`aria-current="true"`), as described in the test plan (risk table).
- Card counts on the Lazy Load page include cards that still show `Loading…`.
- Not covered in this version: collapsing the **Dynamic Catalog** menu item, other users, and opening these pages by URL without logging in.
- **Auto** shows whether the case is a candidate for Playwright automation.
- Priority is Low for all cases because FT-08 has Low priority in the test plan.

## Test data

Products shown by the Spinner and the Slider (same order in both pages):

| # | Product | Price |
|---|---|---|
| 1 | Sauce Labs Bike Light | $9.99 |
| 2 | Sauce Labs Bolt T-Shirt | $15.99 |
| 3 | Sauce Labs Onesie | $7.99 |
| 4 | Test.allTheThings() T-Shirt (Red) | $15.99 |
| 5 | Sauce Labs Backpack | $29.99 |
| 6 | Sauce Labs Fleece Jacket | $49.99 |

First eight cards of the Lazy Load page:

| # | Product | Price |
|---|---|---|
| 1 | Sauce Labs Bike Light | $9.99 |
| 2 | Sauce Labs Bolt T-Shirt (XS) | $15.99 |
| 3 | Sauce Labs Onesie | $7.99 |
| 4 | Test.allTheThings() T-Shirt (Red) (XS) | $15.99 |
| 5 | Sauce Labs Backpack | $29.99 |
| 6 | Sauce Labs Fleece Jacket (XS) | $49.99 |
| 7 | Sauce Labs Fleece Jacket (S) | $49.99 |
| 8 | Sauce Labs Fleece Jacket (M) | $49.99 |

## Test cases: menu

| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result |
|---|---|---|---|---|---|---|---|
| TC-DYN-001 | Dynamic Catalog shows its three sub-items | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **Dynamic Catalog**. | The sub-items **Lazy Load**, **Spinner**, and **Slider** are displayed under **Dynamic Catalog**. |

## Test cases: Lazy Load

| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result |
|---|---|---|---|---|---|---|---|
| TC-DYN-002 | Lazy Load page opens from the menu | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **Dynamic Catalog**.<br>3. Click **Lazy Load**. | The browser navigates to `https://www.saucedemo.com/dynamic-catalog-lazy-load.html`. The page title shows `Dynamic Catalog - Lazy Load`. |
| TC-DYN-003 | Lazy Load shows the first batch of products | Positive | Low | Yes | `standard_user` is logged in and the Lazy Load page is open | 1. Wait until the first products are displayed. | 12 cards are displayed. The first 8 show an image, a name, and a price as listed in the test data. The other 4 cards show the text `Loading…` and stayed unchanged for at least 3 seconds while the page was not scrolled. |
| TC-DYN-004 | Scrolling to the bottom loads 6 more cards each time | Positive | Low | Yes | The Lazy Load page is open and the first batch is displayed | 1. Scroll to the bottom of the page.<br>2. Scroll to the bottom again.<br>3. Scroll to the bottom again. | After step 1 the page shows 18 cards, after step 2 it shows 24 cards, and after step 3 it shows 30 cards. |
| TC-DYN-005 | Lazy Load keeps loading after many scrolls | Observation | Low | No | The Lazy Load page is open and the first batch is displayed | 1. Scroll to the bottom of the page 12 times, waiting for the new cards each time. | The number of cards grows by 6 after every scroll: 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84. No end of the list was reached. No requirement is available to confirm whether this is intended. |
| TC-DYN-006 | Lazy Load repeats product names and shows one duplicate | Observation | Low | No | The Lazy Load page is open | 1. Scroll to the bottom until 36 cards are displayed.<br>2. Read the names of the cards in order. | From card 23 to card 36 the names repeat the names of cards 1 to 14. In the first sequence the name `Test.allTheThings() T-Shirt (Red) (L)` appears twice in a row (cards 14 and 15). No requirement is available to confirm whether this is intended. |

## Test cases: Spinner

| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result |
|---|---|---|---|---|---|---|---|
| TC-DYN-007 | Spinner page opens from the menu | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **Dynamic Catalog**.<br>3. Click **Spinner**. | The browser navigates to `https://www.saucedemo.com/dynamic-catalog-spinner.html`. The page heading shows `Dynamic Catalog - Spinner`. |
| TC-DYN-008 | Spinner is replaced by the six products | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Open the Spinner page and look at it right away.<br>2. Wait until the spinner disappears. | In step 1 a loading spinner (labeled `Loading`) is displayed and no product is shown. After the spinner disappears, 6 products are displayed in the order of the test data, each with its name and price. In the observed run this took between 2 and 4 seconds. |

## Test cases: Slider

| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result |
|---|---|---|---|---|---|---|---|
| TC-DYN-009 | Slider page opens and shows one product with six dots | Positive | Low | Yes | `standard_user` is logged in and the Products page is open | 1. Click the menu icon (≡).<br>2. Click **Dynamic Catalog**.<br>3. Click **Slider**. | The browser navigates to `https://www.saucedemo.com/dynamic-catalog-slider.html`. The page heading shows `Dynamic Catalog - Slider`. One product is displayed with its name and price, and 6 dots are displayed below it. Exactly one dot is active, and the dots are labeled `Show <product name>` in the order of the test data. In the observed run the first product shown was `Sauce Labs Bike Light` with the first dot active. |
| TC-DYN-010 | Slider advances automatically in list order | Positive | Low | Yes | The Slider page is open | 1. Do nothing and watch the slider for one full cycle. | The slider shows the next product on its own and the matching dot becomes active, in this order: Bike Light, Bolt T-Shirt, Onesie, Test.allTheThings() T-Shirt (Red), Backpack, Fleece Jacket. After Fleece Jacket the slider shows Bike Light again. About 2 seconds per slide were observed. |
| TC-DYN-011 | Clicking a dot shows the matching product (data-driven) | Positive | Low | Yes | The Slider page is open | 1. Click the fourth dot.<br>2. Click the second dot. | After step 1 the slider shows `Test.allTheThings() T-Shirt (Red)` right away and the fourth dot is active. After step 2 it shows `Sauce Labs Bolt T-Shirt` right away and the second dot is active. |
| TC-DYN-012 | Slider keeps advancing after a dot is clicked | Observation | Low | No | The Slider page is open | 1. Click the fourth dot.<br>2. Wait and watch the slider. | The slider continues from the clicked slide: after `Test.allTheThings() T-Shirt (Red)` it shows `Sauce Labs Backpack`, then `Sauce Labs Fleece Jacket`. No requirement is available to confirm whether this is intended. |
| TC-DYN-013 | Slider does not pause when the mouse is over it | Observation | Low | No | The Slider page is open | 1. Move the mouse over the displayed product.<br>2. Keep the mouse there and watch the slider. | The slider keeps advancing while the mouse stays over the product (two slides in about 5 seconds in the observed run). No requirement is available to confirm whether this is intended. |