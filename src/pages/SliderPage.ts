import { expect, type Locator, type Page } from '@playwright/test';
import type { CatalogCard } from './LazyLoadPage';

const SYNC_TIMEOUT = 10_000;
const ADVANCE_TIMEOUT = 8_000;

export class SliderPage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly items: Locator;
    private readonly itemName: Locator;
    private readonly itemPrice: Locator;
    private readonly dots: Locator;
    private readonly activeDots: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('dynamic-catalog-slider-item');
        this.itemName = page.getByTestId('dynamic-catalog-slider-item-name');
        this.itemPrice = page.getByTestId('dynamic-catalog-slider-item-price');
        this.dots = page.getByTestId(/^dynamic-catalog-slider-dot-\d+$/);
        this.activeDots = page.locator('[data-test^="dynamic-catalog-slider-dot-"][aria-current="true"]');
    }

    private dot(index: number): Locator {
        return this.page.getByTestId(`dynamic-catalog-slider-dot-${index}`);
    }

    private async activeDotIndex(): Promise<number> {
        const states = await this.dots.evaluateAll((elements) =>
            elements.map((element) => element.getAttribute('aria-current')),
        );
        return states.indexOf('true');
    }

    private productAt(products: readonly CatalogCard[], index: number): CatalogCard {
        const product = products[index];
        if (!product) {
            throw new Error(`No product found for dot index ${index}`);
        }
        return product;
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/dynamic-catalog-slider\.html$/);
        await expect(this.title).toHaveText('Dynamic Catalog - Slider');
    }

    async expectOneProductWithDots(products: readonly CatalogCard[]): Promise<void> {
        await expect(this.items).toHaveCount(1);
        await expect(this.dots).toHaveCount(products.length);
        for (const [index, product] of products.entries()) {
            await expect(this.dot(index)).toHaveAttribute('aria-label', `Show ${product.name}`);
        }
        await expect(this.activeDots).toHaveCount(1);
        await this.expectShownMatchesActiveDot(products);
    }

    async expectShownMatchesActiveDot(products: readonly CatalogCard[]): Promise<void> {
        await expect(async () => {
            const index = await this.activeDotIndex();
            const product = this.productAt(products, index);
            await expect(this.itemName).toHaveText(product.name, { timeout: 500 });
            await expect(this.itemPrice).toHaveText(product.price, { timeout: 500 });
        }).toPass({ timeout: SYNC_TIMEOUT });
    }

    async expectAdvancesInOrder(products: readonly CatalogCard[], steps: number): Promise<void> {
        await expect.poll(() => this.activeDotIndex(), { timeout: SYNC_TIMEOUT }).toBeGreaterThanOrEqual(0);
        let current = await this.activeDotIndex();

        for (let step = 1; step <= steps; step++) {
            current = (current + 1) % products.length;
            const product = this.productAt(products, current);
            await expect(this.itemName).toHaveText(product.name, { timeout: ADVANCE_TIMEOUT });
            await expect(this.dot(current)).toHaveAttribute('aria-current', 'true');
        }
    }

    async clickDot(index: number): Promise<void> {
        await this.dot(index).click();
    }

    async expectShowing(products: readonly CatalogCard[], index: number): Promise<void> {
        const product = this.productAt(products, index);
        await expect(this.itemName).toHaveText(product.name);
        await expect(this.itemPrice).toHaveText(product.price);
        await expect(this.dot(index)).toHaveAttribute('aria-current', 'true');
        await expect(this.activeDots).toHaveCount(1);
    }
}