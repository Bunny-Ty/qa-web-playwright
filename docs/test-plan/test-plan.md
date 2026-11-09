# Test Plan: Sauce Demo Web Application
 
| | |
|---|---|
| **Project** | qa-web-playwright |
| **Application under test** | Sauce Demo (https://www.saucedemo.com) |
| **Author** | Xuan Hoa |
| **Version** | 1.1 |
| **Last updated** | 2026-11-09 |
| **Status** | Draft |
 
## 1. Introduction
 
Sauce Demo ("Swag Labs") is a public demo e-commerce web application. A user logs in, browses six products, adds them to a cart, and completes a checkout. This document describes how the application will be tested: what is covered, how, with which tools, and when the testing is considered complete.
 
The application is owned by a third party. There is no written requirement document, so expected results in this plan are based on exploratory testing of the live site and on common e-commerce behavior. Where the correct behavior is unclear, the finding is recorded as an **observation** instead of a confirmed defect.
 
## 2. Objectives
 
- Verify that the core purchase flow (login, browse, cart, checkout) works for a standard user.
- Design a clear set of manual test cases covering functional, negative, and boundary scenarios.
- Automate the stable, high-value scenarios with Playwright and TypeScript, using the Page Object Model.
- Run the automated suite in CI (GitHub Actions) and publish an HTML report.
- Document the defects and observations found during testing.
## 3. Scope
 
### 3.1 In scope
 
| Area | Included |
|---|---|
| Login | Valid login, invalid credentials, empty fields, locked-out user, direct access to a protected page, error banner behavior |
| Product list | Product count, sorting (name A-Z/Z-A, price low-high/high-low), product detail page, back navigation |
| Cart | Add, remove, cart badge, cart page content, cart persistence after logout and login, Continue Shopping |
| Checkout | Information form validation, overview page, price calculation (item total, tax, total), order completion, PDF receipt, Cancel behavior, empty cart checkout |
| Menu | All Items, About, Logout, Reset App State |
| Dynamic Catalog | Lazy Load (continuous loading while scrolling), Spinner (6 products), Slider (one product at a time, dots, auto-advance) |
| Special users | Behavior of `problem_user`, `error_user`, `visual_user`, `performance_glitch_user` compared with `standard_user` |
 
### 3.2 Out of scope
 
- Performance and load testing of the public site (covered separately on local apps in other projects).
- Security testing of the public site (not allowed on public systems).
- Accessibility, localization, and mobile device testing.
- Fixing defects (the application is not owned by this project).
## 4. Test Items and Features
 
| ID | Feature | Priority | Notes |
|---|---|---|---|
| FT-01 | Login | High | Entry point of every other flow |
| FT-02 | Product list and sorting | High | Six products, four sort options |
| FT-03 | Product detail | Medium | Opens from product name or image |
| FT-04 | Cart | High | State is kept in the browser session |
| FT-05 | Checkout | High | Three steps: Information, Overview, Complete |
| FT-06 | Menu | Medium | Includes Reset App State |
| FT-07 | Special users | Medium | Intentionally flawed accounts |
| FT-08 | Dynamic Catalog | Low | Lazy Load, Spinner, Slider; automated after the core flows |
 
## 5. Test Approach
 
### 5.1 Exploratory testing (completed)
 
61 exploration checks were performed on the live application, grouped into: test accounts, login, product list, cart, checkout, menu, and special users. The results are the source for expected results in the test cases.
 
### 5.2 Test case design
 
Test cases are written in `docs/test-cases/` using these techniques:
 
- **Equivalence partitioning and boundary value analysis**: checkout form fields (empty, valid, whitespace-only, special characters, very long text).
- **State-based testing**: cart contents and badge after add, remove, logout, login, Reset App State, and order completion.
- **Decision table**: login results by username and password combinations.
- **Error guessing**: empty cart checkout, direct URL access, Cancel button behavior.
Each test case has an ID, title, priority, preconditions, steps, test data, expected result, and automation status.
 
### 5.3 Test automation
 
| Item | Choice |
|---|---|
| Tool | Playwright |
| Language | TypeScript |
| Design pattern | Page Object Model (one class per page, no assertions on locators outside page objects) |
| Test runner | Playwright Test |
| Browsers | Chromium (primary, used for local runs and the full regression suite); Firefox and WebKit run the `@smoke` tests in CI |
| Execution | Local run and GitHub Actions CI |
| Reporting | Playwright HTML report, published as a CI artifact |
| Test tags | `@smoke` for the critical path, `@regression` for the full suite |
 
Automation rules:
 
- Each test is independent: it logs in by itself (or reuses a saved login state) and does not depend on the cart state left by another test.
- Locators prefer `data-test` attributes provided by the application.
- No fixed sleeps: use Playwright auto-waiting and web-first assertions, especially for Lazy Load, Spinner, and the auto-advancing Slider.
- Test names, comments, and commit messages are written in English.
- Known application defects are marked in the code so the suite stays meaningful (for example, expected-failure annotations with a reference to the bug report).
### 5.4 Defect handling
 
- Confirmed defects get a bug report in `docs/bug-reports/` (summary, steps, expected vs actual result, severity, evidence).
- Behavior with no clear expected result is recorded as an **observation** and listed in the test summary.
- Defects are not reported to the application owner; they are kept in this repository as portfolio evidence.
| Severity | Meaning |
|---|---|
| High | Blocks a main flow (for example, order cannot be completed) |
| Medium | Wrong behavior, but a workaround exists |
| Low | Cosmetic or minor inconsistency |
 
## 6. Test Environment
 
| Item | Detail |
|---|---|
| Application | https://www.saucedemo.com (public, no installation) |
| Local machine | Windows, latest stable Chrome |
| Automation runtime | Node.js (LTS), Playwright with bundled browsers |
| IDE | Visual Studio Code with the Playwright Test extension |
| CI | GitHub Actions, Ubuntu runner |
| Test management | Jira (Project Portfolio), commits linked by ticket key |
| Source control | GitHub, public repository |
 
## 7. Test Data
 
The login page publishes the demo accounts. They are public and safe to store in the repository. The password is the same for all users.
 
| Username | Purpose in testing |
|---|---|
| `standard_user` | Baseline user for all main flows |
| `locked_out_user` | Negative login test: locked-out error |
| `problem_user` | Known defects: identical product images, sorting does not work, some products cannot be added, checkout form input error |
| `performance_glitch_user` | Slow login (about 5 seconds): checks timeout handling |
| `error_user` | Known defects: sorting error message, some products cannot be added, checkout cannot be completed |
| `visual_user` | Layout differences compared with `standard_user` |
 
Other data:
 
- Checkout information: fake name and postal code only (for example, "Emily", "White", "12345"). No real personal data is used anywhere in the repository.
- Products: the six items shown on the Products page, with prices from $7.99 to $49.99.
- Tax is 8% of the item total, rounded to two decimals. This rule was confirmed with five checkout data sets (P1 to P5) and is the expected result for price calculation tests.
## 8. Risks and Mitigation
 
| Risk | Impact | Mitigation |
|---|---|---|
| No requirement document | Expected results may be wrong | Base expectations on observation, label unclear cases as observations, and review them before automation |
| Public third-party site may change or be unavailable | Tests fail without a real defect | Keep locators in page objects, re-run before reporting, keep CI results as evidence |
| Intentionally flawed users produce failures | Noisy test results | Use `standard_user` for the regression suite; handle special users in a separate group with clear annotations |
| `performance_glitch_user` is slow | Flaky tests or timeouts | Use an explicit longer timeout only for that user |
| Cart state stays in the browser | Tests affect each other | Use a fresh browser context for each test |
| Reset App State leaves buttons showing "Remove" until reload | False failures in cart tests | Do not combine Reset App State with button-state checks without a reload |
| Checkout accepts almost any input | Hard to define valid and invalid data | Document accepted inputs as observations; test only clear cases (empty fields) as pass/fail |
| Cross-browser differences (Firefox, WebKit) | Failures caused by the browser, not by the application; more maintenance | Run only `@smoke` on Firefox and WebKit; investigate on Chromium first; keep browser-specific workarounds documented |
| Dynamic Catalog pages load content over time and the Slider auto-advances | Flaky tests | Use auto-waiting assertions, check the current slide through the active dot, and avoid timing assumptions |
| Limited time (about 15 hours per week) | Not every case can be automated | Automate by priority: smoke first, then regression |
 
## 9. Entry and Exit Criteria
 
### Entry criteria
 
- Test plan is reviewed and committed.
- The application is reachable and the demo accounts can log in.
- Exploratory results are recorded.
- The repository is created from the project template, with the Playwright setup in place for automation.
### Exit criteria
 
- All high-priority test cases are written, executed, and have a recorded result.
- All `@smoke` automated tests pass on `standard_user` in CI.
- Automated regression covers the login, product list, cart, checkout, menu, and Dynamic Catalog flows.
- `@smoke` tests pass on Chromium, Firefox, and WebKit in CI.
- Every defect found has a bug report; every observation is listed.
- The HTML report, README, and test summary are published.
## 10. Deliverables
 
| Deliverable | Location |
|---|---|
| Test plan | `docs/test-plan/test-plan.md` |
| Test cases | `docs/test-cases/` |
| Bug reports | `docs/bug-reports/` |
| Automation code | `src/` |
| CI workflow | `.github/workflows/` |
| Test report | Playwright HTML report (CI artifact) |
| Project README | `README.md` |
 
## 11. Initial Findings from Exploration
 
These points come from the exploratory session and will be turned into test cases and bug reports.
 
| # | Finding | Type |
|---|---|---|
| 1 | Checkout can be completed with an empty cart; the order total is $0.00 and the PDF receipt has no items | Possible defect (High) |
| 2 | Checkout form only checks that fields are not empty: letters and symbols are accepted in Postal Code, whitespace-only values pass, and input over 255 characters is accepted | Observation |
| 3 | After Reset App State, the cart badge disappears but product buttons still show "Remove" until the page is reloaded; the menu also stays open | Possible defect (Medium) |
| 4 | Cancel on the Overview page goes to the Products page, while Cancel on the Information page goes to the Cart page | Observation |
| 5 | Sort option resets to the default after opening a product and going back | Observation |
| 6 | Login errors show red marks on both fields even when only one field is missing | Observation |
 
