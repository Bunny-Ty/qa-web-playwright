import { expect, type Locator, type Page } from '@playwright/test';

export class Header {
    private readonly cartLink: Locator;
    private readonly cartBadge: Locator;
    private readonly menuButton: Locator;
    private readonly logoutLink: Locator;

    constructor(page: Page) {
        this.cartLink = page.getByTestId('shopping-cart-link');
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
         this.logoutLink = page.getByRole('button', { name: 'Logout' });
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    async logout(): Promise<void> {
        await this.menuButton.click();
        await this.logoutLink.click();
    }

    async expectCartCount(count: number): Promise<void> {
        await expect(this.cartBadge).toHaveText(String(count));
    }

}