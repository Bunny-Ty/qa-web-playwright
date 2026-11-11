import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
    private readonly title: Locator;
    private readonly items: Locator;  

    constructor(private readonly page: Page) {
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
    }

    async goto(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    async expectLoaded(timeout?: number): Promise<void> {
        await expect(this.page).toHaveURL(/\/inventory\.html$/, { timeout });
        await expect(this.title).toHaveText('Products', { timeout });
        await expect(this.items).toHaveCount(6, { timeout });
    }


}