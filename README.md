# Sauce Demo Web Test Automation

[![Playwright Tests](https://github.com/Bunny-Ty/qa-web-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Bunny-Ty/qa-web-playwright/actions/workflows/playwright.yml)

End-to-end test automation for the Sauce Demo web shop, built with Playwright and TypeScript using the Page Object Model. The project contains a test plan, 73 manual test cases, 4 bug reports, and an automated suite that runs in GitHub Actions.

## Application Under Test

- App: [Sauce Demo (Swag Labs)](https://www.saucedemo.com), a public demo e-commerce site owned by a third party.
- Scope: login, product list and sorting, product detail, cart, checkout (information form, overview, price calculation, order completion, PDF receipt), menu, special demo users, and Dynamic Catalog (Lazy Load, Spinner, Slider).
- No requirements document exists. Expected results come from exploratory testing of the live site. Behavior that cannot be confirmed as correct is recorded as an observation instead of a defect.

## Tech Stack

- Playwright Test and TypeScript
- Page Object Model (one class per page)
- `pdf-parse` to read the PDF order receipt
- GitHub Actions for CI
- Jira for tickets, linked to commits by ticket key

## Test Design
- Exploratory testing came first: 61 exploration checks on the live site (accounts, login, product list, cart, checkout, menu, special users) were the source of the expected results. They led to 60 test cases, and 13 more were added later for Dynamic Catalog, so the total is 73.
- Techniques: equivalence partitioning and boundary values (checkout form), state-based testing (cart contents and badge), decision table (login), error guessing (empty cart checkout, direct URL access, Cancel buttons).
- Every test case has an ID (for example `TC-CART-001`). The automated test names start with the same ID, so a test can be traced back to its test case.
- Tests are tagged `@smoke` (critical path) or `@regression` (full suite).

## Coverage

| Feature | Test cases | Automated | Not automated |
|---|---|---|---|
| Login | 9 | 8 | 1 |
| Products | 8 | 7 | 1 |
| Cart | 7 | 7 | 0 |
| Checkout | 18 | 12 | 6 |
| Menu | 7 | 4 | 3 |
| Special users | 11 | 1 | 10 |
| Dynamic Catalog | 13 | 9 | 4 |
| **Total** | **73** | **48** | **25** |

The 48 automated cases produce 57 test runs on Chromium, because three cases run once per data set: `TC-LOGIN-001` (5 users), `TC-CHK-009` (5 price data sets), and `TC-DYN-011` (2 dots).

### Cases that are not automated

These cases are marked `Auto = No` in the test case files. They are kept on purpose, not forgotten.

| Type | Count | Cases | Reason |
|---|---|---|---|
| Observation | 10 | TC-LOGIN-009, TC-PROD-008, TC-CHK-006, TC-CHK-013, TC-MENU-006, TC-MENU-007, TC-DYN-005, TC-DYN-006, TC-DYN-012, TC-DYN-013 | The behavior was observed, but no requirement confirms it is correct. Asserting it would only freeze an unconfirmed behavior. |
| Defect candidate | 5 | TC-CHK-014 to TC-CHK-017, TC-MENU-005 | The behavior looks wrong by common e-commerce conventions. It is documented in the test cases, and confirmed defects have a bug report. Automating it would make the suite fail on a known defect. |
| Known defect | 10 | TC-USER-001 to TC-USER-010 | The demo accounts `problem_user`, `error_user`, and `visual_user` are flawed on purpose. These cases are kept in a separate file so they do not make the main suite look broken. |

## Defects Found

Bug reports are in [`docs/bug-reports/`](docs/bug-reports/) with evidence screenshots.

| ID | Summary |
|---|---|
| BUG-CHK-001 | Checkout can be completed with an empty cart |
| BUG-CHK-002 | Postal Code accepts letters |
| BUG-MENU-001 | Reset App State leaves stale Remove buttons until the page is reloaded |
| BUG-USER-001 | `error_user` cannot finish an order |

## Project Structure

- `docs/test-plan/`: test plan
- `docs/test-cases/`: test cases (one file per feature)
- `docs/bug-reports/`: bug reports and evidence
- `src/data/`: test data (users, products, checkout data, Dynamic Catalog data)
- `src/pages/`: page objects
- `src/tests/`: test files
- `src/utils/`: helpers (price calculation, PDF reading)
- `.github/workflows/`: CI workflow

## How to Run

Requirements: Node.js 22.3 or newer (needed by the `pdf-parse` dependency) and Git.

```bash
git clone https://github.com/Bunny-Ty/qa-web-playwright.git
cd qa-web-playwright
npm ci
npx playwright install
```

| Command | What it does |
|---|---|
| `npm test` | Runs the full suite on Chromium |
| `npm run test:smoke` | Runs the `@smoke` tests on Chromium, Firefox, and WebKit |
| `npm run report` | Opens the HTML report of the last run |

## CI

The workflow `.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can also be started by hand. It has two jobs that run in parallel:

- **Smoke**: the `@smoke` tests on Chromium, Firefox, and WebKit (6 test runs).
- **Regression**: the full suite on Chromium (57 test runs).

Each job uploads the Playwright HTML report as an artifact, kept for 14 days, even when tests fail.

## Results

- CI status: see the badge at the top, or the [Actions tab](https://github.com/Bunny-Ty/qa-web-playwright/actions).
- Test plan: [`docs/test-plan/test-plan.md`](docs/test-plan/test-plan.md)

## Commit Convention

Every commit starts with the Jira ticket key: `PROJECT-xx: message`. Early commits use the previous key `PORTFOLIO-xx`.