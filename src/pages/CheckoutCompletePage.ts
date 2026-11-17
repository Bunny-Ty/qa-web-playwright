import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutCompletePage {
    private readonly page: Page;
    private readonly title: Locator;
    private readonly ponyImage: Locator;
    private readonly completeHeader: Locator;
    private readonly completeText: Locator;
    private readonly backHomeButton: Locator;
    private readonly generatePdfButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByTestId('title');
        this.ponyImage = page.getByTestId('pony-express');
        this.completeHeader = page.getByTestId('complete-header');
        this.completeText = page.getByTestId('complete-text');
        this.backHomeButton = page.getByRole('button', { name: 'Back Home'});
        this.generatePdfButton = page.getByRole('button', { name: 'Generate PDF order'});
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
        await expect(this.title).toHaveText('Checkout: Complete!');
    }

    async expectConfirmation(): Promise<void> {
        await expect(this.ponyImage).toBeVisible();
        await expect(this.completeHeader).toHaveText('Thank you for your order!');
        await expect(this.completeText).toHaveText(
            'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
        );
        await expect(this.backHomeButton).toBeVisible();
        await expect(this.generatePdfButton).toBeVisible();
    }

    async backHome(): Promise<void> {
        await this.backHomeButton.click();
    }

    async generatePdfOrder(savePath: string): Promise<string> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.generatePdfButton.click();
        const download = await downloadPromise;
        await download.saveAs(savePath);
        return download.suggestedFilename();
    }

}