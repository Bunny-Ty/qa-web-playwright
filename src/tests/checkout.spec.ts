import { test } from '@playwright/test';

import { checkoutInfo, checkoutInfoErrors } from '../data/checkout';

import { PASSWORD, USERS } from '../data/users'

import { PRODUCTS } from '../data/products';

import { CartPage } from '../pages/CartPage';

import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';

import { Header } from '../pages/Header';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

const { backpack, bikeLight} = PRODUCTS;

test.describe('Checkout - Your Information', () => {
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await productsPage.expectLoaded();
        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await header.openCart();
        await cartPage.expectLoaded();
        await cartPage.checkout();
    });

    test('TC-CHK-001: all three fields empty @regression', async ({ page })=> {
        const infoPage = new CheckoutInformationPage(page);

        await infoPage.continue();

        await infoPage.expectError(checkoutInfoErrors.firstName);
        await infoPage.expectErrorHighlightOnAllFields();
    });

    test('TC-CHK-002: first name missing @regression', async ({ page }) => {
        const infoPage = new CheckoutInformationPage(page);
        
        await infoPage.fillInformation('', checkoutInfo.lastName, checkoutInfo.postalCode);
        await infoPage.continue();

        await infoPage.expectError(checkoutInfoErrors.firstName);
    });

    test('TC-CHK-003: last name missing @regression', async ({ page}) => {
        const infoPage = new CheckoutInformationPage(page);

        await infoPage.fillInformation(checkoutInfo.firstName, '', checkoutInfo.postalCode);
        await infoPage.continue();

        await infoPage.expectError(checkoutInfoErrors.lastName);
    });

    test('TC-CHK-004: postal code missing @regression', async ({ page }) =>{
        const infoPage = new CheckoutInformationPage(page);

        await infoPage.fillInformation(checkoutInfo.firstName, checkoutInfo.lastName,'');
        await infoPage.continue();

        await infoPage.expectError(checkoutInfoErrors.postalCode);
    })

    test('TC-CHK-005: error banner can be closed with its X button @regression', async ({ page }) =>{
        const infoPage = new CheckoutInformationPage(page);

        await infoPage.continue();
        await infoPage.expectError(checkoutInfoErrors.firstName);

        await infoPage.closeError();

        await infoPage.expectNoError();
    });

    test('TC-CHK-007: Cancel returns to the cart with the cart unchanged @regression', async ({ page }) =>{
        const infoPage = new CheckoutInformationPage(page);
        const cartPage = new CartPage(page);
        const header = new Header(page);

        await infoPage.cancel();

        await cartPage.expectLoaded();
        await cartPage.expectItem(backpack.name, backpack.price);
        await cartPage.expectItem(bikeLight.name, bikeLight.price);
        await header.expectCartCount(2)
    });



})