import { expect, test } from '@playwright/test';

import { checkoutInfo } from '../data/checkout';

import { PASSWORD, USERS } from '../data/users';

import { PRODUCTS } from '../data/products';

import { CartPage } from '../pages/CartPage';

import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';

import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';

import { Header } from '../pages/Header';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

import { calculateTotals } from '../utils/price';

import { readPdfText } from '../utils/pdf';

const { backpack, bikeLight} = PRODUCTS;

test.describe('Checkout - Overview and completion', () => {
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);
        const infoPage = new CheckoutInformationPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await productsPage.expectLoaded();
        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await header.openCart();
        await cartPage.expectLoaded();
        await cartPage.checkout();
        await infoPage.fillInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
        await infoPage.continue();
    });

    test('TC-CHK-008: overview page shows the order details @regression', async ({ page }) => {
        const overviewPage = new CheckoutOverviewPage(page);

        await overviewPage.expectLoaded();
        await overviewPage.expectItemCount(2);
        await overviewPage.expectItem(backpack.name, backpack.price);
        await overviewPage.expectItem(bikeLight.name, bikeLight.price);
        await overviewPage.expectPaymentAndShipping();
        await overviewPage.expectPriceTotalSection();
        await overviewPage.expectButtons();
    });

    test ('TC-CHK-010: Finish completes the order @regression', async ({ page}) => {
        const overviewPage = new CheckoutOverviewPage(page);
        const completePage = new CheckoutCompletePage(page);

        await overviewPage.expectLoaded();
        await overviewPage.finish();

        await completePage.expectLoaded();
        await completePage.expectConfirmation();
    });

    test('TC-CHK-011: cart is empty after the order is completed @regression', async ({ page }) => {
        const overviewPage = new CheckoutOverviewPage(page);
        const completePage = new CheckoutCompletePage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);

        await overviewPage.finish();
        await completePage.expectLoaded();

        await header.expectCartEmpty();
        await header.openCart();

        await cartPage.expectLoaded();
        await cartPage.expectEmpty();
    });

    test('TC-CHK-012: Back Home returns to the Products page with an empty cart @regression', async ({ page }) => {
        const overviewPage = new CheckoutOverviewPage(page);
        const completePage = new CheckoutCompletePage(page);
        const productsPage = new ProductsPage(page);
        const header = new Header(page);

        await overviewPage.finish();
        await completePage.expectLoaded();

        await completePage.backHome();

        await productsPage.expectLoaded();
        await header.expectCartEmpty();
    });

        test('TC-CHK-018: PDF order receipt content @regression', async ({ page }, testInfo) => {
        const overviewPage = new CheckoutOverviewPage(page);
        const completePage = new CheckoutCompletePage(page);

        await overviewPage.finish();
        await completePage.expectLoaded();

        const pdfPath = testInfo.outputPath('receipt.pdf');
        const fileName = await completePage.generatePdfOrder(pdfPath);
        const text = await readPdfText(pdfPath);
        const expected = calculateTotals([backpack.price, bikeLight.price]);

        expect(fileName).toMatch(/^swag-labs-order-.*\.pdf$/);
        expect(text).toContain('Swag Labs Order Receipt');
        expect(text).toMatch(/Order Date [A-Za-z]+ \d{1,2}, \d{4} at \d{1,2}:\d{2} [AP]M/);
        expect(text).toContain(`${checkoutInfo.firstName} ${checkoutInfo.lastName} ${checkoutInfo.postalCode}`);
        expect(text).toContain(`${backpack.name} ${backpack.price}`);
        expect(text).toContain(`${bikeLight.name} ${bikeLight.price}`);
        expect(text).toContain(`Item total ${expected.itemTotal}`);
        expect(text).toContain(`Tax ${expected.tax}`);
        expect(text).toContain(`Total ${expected.total}`);
        expect(text).toContain('Thank you for your order!');
    });

});