import { test, type Page } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { LAZY_LOAD_FIRST_BATCH } from '../data/dynamicCatalog';

import { LazyLoadPage } from '../pages/LazyLoadPage';

import { LoginPage } from '../pages/LoginPage';

import { Menu } from '../pages/Menu';

import { ProductsPage } from '../pages/ProductsPage';

async function openLazyLoadPage(page: Page): Promise<void> {
    const menu = new Menu(page);
    await menu.open();
    await menu.expandDynamicCatalog();
    await menu.clickLazyLoad();
    await new LazyLoadPage(page).expectLoaded();
}

test.describe('Dynamic Catalog - Menu and Lazy Load', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test('TC-DYN-001: Dynamic Catalog shows its three sub-items @regression', async ({ page }) => {
        const menu = new Menu(page);

        await menu.open();
        await menu.expandDynamicCatalog();

        await menu.expectDynamicCatalogItems();
    });

    test('TC-DYN-002: Lazy Load page opens from the menu @regression', async ({ page }) => {
        const menu = new Menu(page);
        const lazyLoadPage = new LazyLoadPage(page);

        await menu.open();
        await menu.expandDynamicCatalog();
        await menu.clickLazyLoad();

        await lazyLoadPage.expectLoaded();
    });

    test('TC-DYN-003: Lazy Load shows the first batch of products @regression', async ({ page }) => {
        const lazyLoadPage = new LazyLoadPage(page);

        await openLazyLoadPage(page);

        await lazyLoadPage.expectFirstBatch(LAZY_LOAD_FIRST_BATCH);
    });

    test('TC-DYN-004: scrolling to the bottom loads 6 more cards each time @regression', async ({ page }) => {
        const lazyLoadPage = new LazyLoadPage(page);

        await openLazyLoadPage(page);
        await lazyLoadPage.expectCardCount(12);

        await lazyLoadPage.scrollToBottom();
        await lazyLoadPage.expectCardCount(18);

        await lazyLoadPage.scrollToBottom();
        await lazyLoadPage.expectCardCount(24);

        await lazyLoadPage.scrollToBottom();
        await lazyLoadPage.expectCardCount(30);
    });
});