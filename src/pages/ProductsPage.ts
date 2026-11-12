import { expect, type Locator, type Page } from '@playwright/test';


export class ProductsPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
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

  private card(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string): Promise<void> {
    await this.card(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.card(name).getByRole('button', { name: 'Remove' }).click();
  }

  async expectInCart(name: string): Promise<void> {
    await expect(this.card(name).getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectNotInCart(name: string): Promise<void> {
    await expect(this.card(name).getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }
}