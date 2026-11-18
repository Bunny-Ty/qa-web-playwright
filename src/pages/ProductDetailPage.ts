import { expect, type Locator, type Page } from '@playwright/test';
import type { ProductInfo } from './ProductsPage';

export class ProductDetailPage {
  private readonly page: Page;
  private readonly name: Locator;
  private readonly description: Locator;
  private readonly price: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.backButton = page.getByTestId('back-to-products');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/inventory-item\.html\?id=\d+$/);
    await expect(this.name).toHaveCount(1);
  }

  async expectDetails(info: ProductInfo): Promise<void> {
    await expect(this.name).toHaveText(info.name);
    await expect(this.description).toHaveText(info.description);
    await expect(this.price).toHaveText(info.price);
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}