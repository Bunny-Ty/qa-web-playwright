import { test, type Page } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { CATALOG_ORDER, LAZY_LOAD_FIRST_BATCH } from '../data/dynamicCatalog';

import { LazyLoadPage } from '../pages/LazyLoadPage';

import { LoginPage } from '../pages/LoginPage';

import { Menu } from '../pages/Menu';

import { ProductsPage } from '../pages/ProductsPage';

import { SliderPage } from '../pages/SliderPage';

import { SpinnerPage } from '../pages/SpinnerPage';

const DOTS_TO_CLICK = [3, 1];

async function openLazyLoadPage(page: Page): Promise<void> {
    const menu = new Menu(page);
    await menu.open();
    await menu.expandDynamicCatalog();
    await menu.clickLazyLoad();
    await new LazyLoadPage(page).expectLoaded();
}

async function openSpinnerPage(page: Page): Promise<void> {
    const menu = new Menu(page);
    await menu.open();
    await menu.expandDynamicCatalog();
    await menu.clickSpinner();
    await new SpinnerPage(page).expectLoaded();
}

async function openSliderPage(page: Page): Promise<void> {
    const menu = new Menu(page);
    await menu.open();
    await menu.expandDynamicCatalog();
    await menu.clickSlider();
    await new SliderPage(page).expectLoaded();
}

test.describe('Dynamic Catalog', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test.describe('Menu', () => {
        test('TC-DYN-001: Dynamic Catalog shows its three sub-items @regression', async ({ page }) => {
            const menu = new Menu(page);

            await menu.open();
            await menu.expandDynamicCatalog();

            await menu.expectDynamicCatalogItems();
        });
    });

    test.describe('Lazy Load', () => {
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

    test.describe('Spinner', () => {
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

    test.describe('Slider', () => {
        test('TC-DYN-009: Slider page opens and shows one product with six dots @regression', async ({ page }) => {
            const sliderPage = new SliderPage(page);

            await openSliderPage(page);

            await sliderPage.expectOneProductWithDots(CATALOG_ORDER);
        });

        test('TC-DYN-010: Slider advances automatically in list order @regression', async ({ page }) => {
            test.setTimeout(60_000);
            const sliderPage = new SliderPage(page);

            await openSliderPage(page);

            await sliderPage.expectAdvancesInOrder(CATALOG_ORDER, CATALOG_ORDER.length);
        });

        for (const index of DOTS_TO_CLICK) {
            test(`TC-DYN-011: clicking dot ${index + 1} shows the matching product @regression`, async ({ page }) => {
                const sliderPage = new SliderPage(page);

                await openSliderPage(page);
                await sliderPage.clickDot(index);

                await sliderPage.expectShowing(CATALOG_ORDER, index);
            });
        }
    });
});