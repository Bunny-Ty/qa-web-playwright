# Bug Report: Empty Cart Checkout Can Be Completed

| Item | Value |
|---|---|
| Bug ID | BUG-CHK-001 |
| Title | Checkout can be completed with an empty cart |
| Severity | High (proposed) |
| Priority | High (proposed) |
| Environment | Sauce Demo (`https://www.saucedemo.com`); browser and OS details were not recorded |
| Related test case | TC-CHK-014 |
| Status | Needs clarification |

## Preconditions

- User is logged in.
- The shopping cart is empty.
- The user is on the Your Cart page.

## Steps to Reproduce

1. Remove all products from the shopping cart.
2. Verify that the cart is empty.
3. Click **Checkout**.
4. Enter the following information:
   - First Name: `Test`
   - Last Name: `User`
   - Postal Code: `12345`
5. Click **Continue**.
6. Click **Finish**.
7. Generate the PDF receipt.

## Actual Result

- The Checkout button opens the Your Information page.
- Clicking Continue opens the Checkout Overview page.
- Item total is displayed as `$0.00`.
- Clicking Finish completes the order and opens the Checkout Complete page.
- The generated PDF receipt contains no items and shows a total of `$0.00`.

## Evidence

### 1. Empty Cart
![Empty cart with Checkout button](https://github.com/user-attachments/assets/ec250458-3f0e-434c-a294-e8ca87bd08e0)

### 2. Checkout Overview - Zero Total
![Checkout overview showing zero total](https://github.com/user-attachments/assets/6bd5246f-4e0b-43bc-9617-d6d3b9972595)

### 3. Checkout Complete
![Checkout completed with an empty cart](https://github.com/user-attachments/assets/06787c31-bd46-488d-a856-e4c3a294dc9e)


### Video Evidence
[Watch BUG-CHK-001 Reproduction Video](https://youtu.be/InuypqmVd58)

## Expected Result

The system should prevent users from proceeding with checkout when the shopping cart is empty. An empty order should not be completed.


## Notes

- No formal requirement document was available. The expected result is based on common e-commerce behavior and requires Product Owner clarification.
- Severity and Priority are proposed values, not values recorded during exploration.
- Do not upload the downloaded PDF receipt to the public repository.

## Related Test Case

- `TC-CHK-014` in `docs/test-cases/checkout.md`

## Discovery Reference

- Initial observation: Empty cart checkout during Sauce Demo exploratory testing.
- Exploration notes were recorded in the PORTFOLIO-16 Jira issue comments.




