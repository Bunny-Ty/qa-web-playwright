import { expect, type Locator, type Page } from '@playwright/test';
import type { CatalogCard } from './LazyLoadPage';

const LOAD_TIMEOUT = 10_000;

export class SpinnerPage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly spinner: Locator;
    private readonly cards: Locator;
    private readonly images: Locator;
    private readonly names: Locator;
    private readonly prices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.spinner = page.getByTestId('dynamic-catalog-spinner');
        this.cards = page.getByTestId(/^spinner-item-\d+$/);
        this.images = page.getByTestId(/^spinner-item-\d+-img$/);
        this.names = page.getByTestId(/^spinner-item-\d+-name$/);
        this.prices = page.getByTestId(/^spinner-item-\d+-price$/);
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/dynamic-catalog-spinner\.html$/);
        await expect(this.title).toHaveText('Dynamic Catalog - Spinner');
    }

    async expectSpinnerShown(): Promise<void> {
        await expect(this.spinner).toBeVisible();
        await expect(this.spinner).toHaveAttribute('aria-label', 'Loading');
        await expect(this.cards).toHaveCount(0);
    }

    async expectProductsShown(products: readonly CatalogCard[]): Promise<void> {
        await expect(this.spinner).toBeHidden({ timeout: LOAD_TIMEOUT });
        await expect(this.cards).toHaveCount(products.length);
        await expect(this.images).toHaveCount(products.length);
        await expect(this.names).toHaveText(products.map((product) => product.name));
        await expect(this.prices).toHaveText(products.map((product) => product.price));
    }
}