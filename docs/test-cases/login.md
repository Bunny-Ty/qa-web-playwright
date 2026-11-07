# Test Cases: Login and Access Control (F1)
 
| Item | Value |
|---|---|
| Application under test | Sauce Demo (https://www.saucedemo.com) |
| Feature | F1 - Login and access control |
| Related work items | PORTFOLIO-16 (test plan and exploration), PORTFOLIO-17 (test cases) |
| Last updated | 2026-11-07 |
 
## Notes
 
- No requirements document is available. Expected results come from direct observation (see PORTFOLIO-16). Cases of type **Observation** describe behavior that was observed but cannot be confirmed as correct.
- All demo accounts and the shared password `secret_sauce` are published on the login page, so they are safe to store in this public repository.
- **Auto** shows whether the case is a candidate for Playwright automation.
## Test data
 
| Data set | Username | Password |
|---|---|---|
| Valid users | `standard_user`, `problem_user`, `error_user`, `visual_user`, `performance_glitch_user` | `secret_sauce` |
| Locked user | `locked_out_user` | `secret_sauce` |
| Wrong password | `standard_user` | `wrong_password` |
 
## Test cases
 
| ID | Title | Type | Priority | Auto | Precondition | Steps | Expected result | Ref |
|---|---|---|---|---|---|---|---|---|
| TC-LOGIN-001 | Login succeeds with each valid user (data-driven) | Positive | High | Yes | The login page is open and the user is not logged in | 1. Enter the username from the "Valid users" data set.<br>2. Enter the password `secret_sauce`.<br>3. Click **Login**.<br>4. Repeat from a fresh login page for each username in the data set. | The user is redirected to `https://www.saucedemo.com/inventory.html` and the Products page is displayed. For `performance_glitch_user` the redirect takes about 5 seconds, so the test must wait for the Products page instead of using a fixed sleep. | B-01, G-05 |
| TC-LOGIN-002 | Login fails with a wrong password | Negative | High | Yes | The login page is open and the user is not logged in | 1. Enter the username `standard_user`.<br>2. Enter the password `wrong_password`.<br>3. Click **Login**. | The error message `Epic sadface: Username and password do not match any user in this service` is displayed. Both fields show a red ✕ icon and a red underline. The user is not logged in. | B-02 |
| TC-LOGIN-003 | Login fails with an empty username | Negative | Medium | Yes | The login page is open and the user is not logged in | 1. Leave the username empty.<br>2. Enter the password `secret_sauce`.<br>3. Click **Login**. | The error message `Epic sadface: Username is required` is displayed. Both fields show a red ✕ icon and a red underline. The user is not logged in. | B-03 |
| TC-LOGIN-004 | Login fails with an empty password | Negative | Medium | Yes | The login page is open and the user is not logged in | 1. Enter the username `standard_user`.<br>2. Leave the password empty.<br>3. Click **Login**. | The error message `Epic sadface: Password is required` is displayed. Both fields show a red ✕ icon and a red underline. The user is not logged in. | B-04 |
| TC-LOGIN-005 | Login fails when both fields are empty | Negative | Medium | Yes | The login page is open and the user is not logged in | 1. Leave the username and the password empty.<br>2. Click **Login**. | The error message `Epic sadface: Username is required` is displayed (the username error takes priority). Both fields show a red ✕ icon and a red underline. The user is not logged in. | B-05 |
| TC-LOGIN-006 | Locked-out user cannot log in | Negative | High | Yes | The login page is open and the user is not logged in | 1. Enter the username `locked_out_user`.<br>2. Enter the password `secret_sauce`.<br>3. Click **Login**. | The error message `Epic sadface: Sorry, this user has been locked out.` is displayed. Both fields show a red ✕ icon and a red underline. The user is not logged in. | B-06 |
| TC-LOGIN-007 | Protected page cannot be opened without login | Negative | High | Yes | A new browser session with no logged-in user | 1. Type `https://www.saucedemo.com/inventory.html` directly in the address bar and press Enter. | The login page is displayed with the error message `Epic sadface: You can only access '/inventory.html' when you are logged in`. The Products page is not shown. The address bar shows the login page (saucedemo.com), not inventory.html. | B-07 |
| TC-LOGIN-008 | Error banner can be closed with its ✕ button | Positive | Low | Yes | The login page shows an error (for example, after clicking **Login** with both fields empty) | 1. Click the ✕ button on the red error banner. | The error banner closes. The red ✕ icons and red underlines on both fields are removed. | B-09 |
| TC-LOGIN-009 | The ✕ icon inside an input field does nothing | Observation | Low | No | The login page shows an error (for example, after clicking **Login** with both fields empty) | 1. Click the red ✕ icon inside one of the input fields. | Nothing happens. The error banner and the red highlights remain. No requirement is available to confirm whether this is intended. | B-08 |
 
