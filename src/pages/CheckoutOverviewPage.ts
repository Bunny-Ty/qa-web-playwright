import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly items: Locator;
    private readonly paymentLabel: Locator;
    private readonly paymentValue: Locator;
    private readonly shippingLabel: Locator;
    private readonly shippingValue: Locator;
    private readonly priceTotalLabel: Locator;
    private readonly itemTotalLabel: Locator;
    private readonly taxLabel: Locator;
    private readonly totalLabel: Locator;
    private readonly cancelButton: Locator;
    private readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.paymentLabel = page.getByTestId('payment-info-label');
        this.paymentValue = page.getByTestId('payment-info-value');
        this.shippingLabel = page.getByTestId('shipping-info-label');
        this.shippingValue = page.getByTestId('shipping-info-value');
        this.priceTotalLabel = page.getByTestId('total-info-label');
        this.itemTotalLabel = page.getByTestId('subtotal-label');
        this.taxLabel = page.getByTestId('tax-label');
        this.totalLabel = page.getByTestId('total-label');
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
    }

    private row(name: string): Locator {
        return this.items.filter({ hasText: name });
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
        await expect(this.title).toHaveText('Checkout: Overview');
    }

    async expectItem(name: string, price: string): Promise<void> {
        const row = this.row(name);
        await expect(row).toHaveCount(1);
        await expect(row.getByTestId('item-quantity')).toHaveText('1');
        await expect(row.getByTestId('inventory-item-name')).toHaveText(name);
        await expect(row.getByTestId('inventory-item-desc')).toHaveText(/\S+/);
        await expect(row.getByTestId('inventory-item-price')).toHaveText(price);
    }

    async expectItemCount(count: number): Promise<void> {
        await expect(this.items).toHaveCount(count);
    }

    async expectPaymentAndShipping(): Promise<void> {
        await expect(this.paymentLabel).toHaveText('Payment Information:');
        await expect(this.paymentValue).toHaveText(/SauceCard #\d+/);
        await expect(this.shippingLabel).toHaveText('Shipping Information:');
        await expect(this.shippingValue).toHaveText('Free Pony Express Delivery!');
    }

    async expectPriceTotalSection(): Promise<void> {
        await expect(this.priceTotalLabel).toHaveText('Price Total');
        await expect(this.itemTotalLabel).toBeVisible();
        await expect(this.taxLabel).toBeVisible();
        await expect(this.totalLabel).toBeVisible();
    }

    async expectButtons(): Promise<void> {
        await expect(this.cancelButton).toBeVisible();
        await expect(this.finishButton).toBeVisible();
    }

    async expectTotals(itemTotal: string, tax: string, total: string): Promise<void> {
        await expect(this.itemTotalLabel).toHaveText(`Item total: ${itemTotal}`);
        await expect(this.taxLabel).toHaveText(`Tax: ${tax}`);
        await expect(this.totalLabel).toHaveText(`Total: ${total}`);
    }

    async finish(): Promise<void> {
        await this.finishButton.click();
    }
}