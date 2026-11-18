import { expect, type Locator, type Page } from '@playwright/test';

export type ProductInfo = {
  name: string;
  description: string;
  price: string;
};

export class ProductsPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly items: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.sortDropdown = page.getByTestId('product-sort-container');
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

  async expectProductShown(name: string, price: string): Promise<void> {
    const card = this.card(name);
    await expect(card).toHaveCount(1);
    await expect(card.locator('img')).toBeVisible();
    await expect(card.getByTestId('inventory-item-name')).toHaveText(name);
    await expect(card.getByTestId('inventory-item-price')).toHaveText(price);
    await expect(card.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }

  async expectNamesInOrder(names: string[]): Promise<void> {
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(names);
  }

  async expectPricesInOrder(prices: string[]): Promise<void> {
    await expect(this.items.getByTestId('inventory-item-price')).toHaveText(prices);
  }

  async getProductInfo(name: string): Promise<ProductInfo> {
    const card = this.card(name);
    return {
      name: (await card.getByTestId('inventory-item-name').textContent()) ?? '',
      description: (await card.getByTestId('inventory-item-desc').textContent()) ?? '',
      price: (await card.getByTestId('inventory-item-price').textContent()) ?? '',
    };
  }

  async openProduct(name: string): Promise<void> {
    await this.card(name).getByTestId('inventory-item-name').click();
  }
}