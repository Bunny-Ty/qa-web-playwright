import { expect, test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { PRODUCTS } from '../data/products';

import { CartPage } from '../pages/CartPage';

import { Header } from '../pages/Header';

import { LoginPage } from '../pages/LoginPage';

import { Menu } from '../pages/Menu';

import { ProductsPage } from '../pages/ProductsPage';

const { backpack, bikeLight } = PRODUCTS;

test.describe('Menu', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test('TC-MENU-001: menu shows all items @regression', async ({ page }) => {
        const menu = new Menu(page);

        await menu.open();

        await menu.expectOpen();
        await menu.expectItems();
    });

    test('TC-MENU-002: Logout returns to the Login page @regression', async ({ page }) => {
        const menu = new Menu(page);
        const loginPage = new LoginPage(page);

        await menu.open();
        await menu.clickLogout();

        await loginPage.expectOnLoginPage();
    });

    test('TC-MENU-003: About opens the Sauce Labs site @regression', async ({ page }) => {
        test.setTimeout(60_000);
        const menu = new Menu(page);

        await menu.open();
        await menu.clickAbout();

        await expect(page).toHaveURL(/^https:\/\/saucelabs\.com\/?$/, { timeout: 30_000 });
        expect(page.context().pages()).toHaveLength(1);
    });

    test('TC-MENU-004: Reset App State empties the cart @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const header = new Header(page);
        const cartPage = new CartPage(page);
        const menu = new Menu(page);

        await productsPage.addToCart(backpack.name);
        await productsPage.addToCart(bikeLight.name);
        await header.expectCartCount(2);

        await menu.open();
        await menu.clickResetAppState();

        await header.expectCartEmpty();
        await header.openCart();
        await cartPage.expectLoaded();
        await cartPage.expectEmpty();
    });
});