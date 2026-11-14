import { expect, type Locator, type Page } from '@playwright/test';


export class CartPage {
  private readonly page: Page;
  private readonly title: Locator;
  private readonly items: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  private row(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.title).toHaveText('Your Cart');
  }

  
  async expectLayout(): Promise<void> {
    await expect(this.page.getByText('QTY', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Description', { exact: true })).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  
  async expectItem(name: string, price: string): Promise<void> {
    const row = this.row(name);
    await expect(row).toHaveCount(1);
    await expect(row.getByTestId('item-quantity')).toHaveText('1');
    await expect(row.getByTestId('inventory-item-name')).toHaveText(name);
    await expect(row.getByTestId('inventory-item-desc')).toHaveText(/\S+/);
    await expect(row.getByTestId('inventory-item-price')).toHaveText(price);
    await expect(row.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  async expectItemAbsent(name: string): Promise<void> {
    await expect(this.row(name)).toHaveCount(0);
  }

  async removeItem(name: string): Promise<void> {
    await this.row(name).getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}