import { test, type Page } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { CATALOG_ORDER } from '../data/dynamicCatalog';

import { LoginPage } from '../pages/LoginPage';

import { Menu } from '../pages/Menu';

import { ProductsPage } from '../pages/ProductsPage';

import { SpinnerPage } from '../pages/SpinnerPage';

async function openSpinnerPage(page: Page): Promise<void> {
    const menu = new Menu(page);
    await menu.open();
    await menu.expandDynamicCatalog();
    await menu.clickSpinner();
    await new SpinnerPage(page).expectLoaded();
}

test.describe('Dynamic Catalog - Spinner', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test('TC-DYN-007: Spinner page opens from the menu @regression', async ({ page }) => {
        const menu = new Menu(page);
        const spinnerPage = new SpinnerPage(page);

        await menu.open();
        await menu.expandDynamicCatalog();
        await menu.clickSpinner();

        await spinnerPage.expectLoaded();
    });

    test('TC-DYN-008: Spinner is replaced by the six products @regression', async ({ page }) => {
        const spinnerPage = new SpinnerPage(page);

        await openSpinnerPage(page);

        await spinnerPage.expectSpinnerShown();
        await spinnerPage.expectProductsShown(CATALOG_ORDER);
    });
});