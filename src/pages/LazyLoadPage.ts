import { expect, type Locator, type Page } from '@playwright/test';

export type CatalogCard = {
    name: string;
    price: string;
};

const FIRST_BATCH_SIZE = 12;
const LOAD_TIMEOUT = 10_000;

export class LazyLoadPage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly cards: Locator;
    private readonly images: Locator;
    private readonly names: Locator;
    private readonly prices: Locator;
    private readonly placeholders: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.cards = page.getByTestId(/^lazy-load-item-\d+$/);
        this.images = page.getByTestId(/^lazy-load-item-\d+-img$/);
        this.names = page.getByTestId(/^lazy-load-item-\d+-name$/);
        this.prices = page.getByTestId(/^lazy-load-item-\d+-price$/);
        this.placeholders = page.getByTestId(/^lazy-load-item-\d+-placeholder$/);
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/dynamic-catalog-lazy-load\.html$/);
        await expect(this.title).toHaveText('Dynamic Catalog - Lazy Load');
    }

    async expectFirstBatch(loaded: readonly CatalogCard[]): Promise<void> {
        await expect(this.cards).toHaveCount(FIRST_BATCH_SIZE);
        await expect(this.images).toHaveCount(loaded.length);
        await expect(this.names).toHaveText(loaded.map((card) => card.name));
        await expect(this.prices).toHaveText(loaded.map((card) => card.price));
        await expect(this.placeholders).toHaveCount(FIRST_BATCH_SIZE - loaded.length);
    }

    async scrollToBottom(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    }

    async expectCardCount(count: number): Promise<void> {
        await expect(this.cards).toHaveCount(count, { timeout: LOAD_TIMEOUT });
    }
}