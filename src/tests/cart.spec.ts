import { test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { PRODUCTS } from '../data/products';

import { CartPage } from '../pages/CartPage';

import { Header } from '../pages/Header';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

const { backpack, bikeLight, onesie } = PRODUCTS;

test.describe('Cart', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test('TC-CART-001: add one product to the cart @smoke', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);

        await productsPage.addToCart(backpack.name);

        await header.expectCartCount(1);
        await productsPage.expectInCart(backpack.name);
    });

    test('TC-CART-002: cart badge shows the number of added products @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await productsPage.addToCart(onesie.name);

        await header.expectCartCount(3);
    });

    test('TC-CART-003: remove a product from the Products page @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await productsPage.addToCart(onesie.name);
        await header.expectCartCount(3);

        await productsPage.removeFromCart(onesie.name);

        await header.expectCartCount(2);
        await productsPage.expectNotInCart(onesie.name);
    });

    test('TC-CART-004: cart page shows the added products @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);

        await header.openCart();

        await cartPage.expectLoaded();
        await cartPage.expectLayout();
        await cartPage.expectItem(backpack.name, backpack.price);
        await cartPage.expectItem(bikeLight.name, bikeLight.price);
    });

    test('TC-CART-005: remove a product from the cart page @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await header.openCart();
        await cartPage.expectLoaded();

        await cartPage.removeItem(bikeLight.name);

        await cartPage.expectItemAbsent(bikeLight.name);
        await header.expectCartCount(1);
    });

    test('TC-CART-006: cart content is kept after logout and login @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const loginPage = new LoginPage(page);
        const cartPage = new CartPage(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);

        await header.logout();
        await loginPage.expectOnLoginPage();
        await loginPage.login(USERS.standard, PASSWORD);
        await productsPage.expectLoaded();
        await header.openCart();

        await cartPage.expectLoaded();
        await cartPage.expectItem(backpack.name, backpack.price);
        await cartPage.expectItem(bikeLight.name, bikeLight.price);
        await header.expectCartCount(2);
    });

    test('TC-CART-007: Continue Shopping returns to the Products page with the cart unchanged @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await header.openCart();
        await cartPage.expectLoaded();

        await cartPage.continueShopping();

        await productsPage.expectLoaded();
        await header.expectCartCount(2);
        await productsPage.expectInCart(backpack.name);
        await productsPage.expectInCart(bikeLight.name);
    });
});

