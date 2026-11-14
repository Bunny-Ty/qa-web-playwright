import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutInformationPage {
    private readonly page: Page;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly continueButton: Locator;
    private readonly cancelButton: Locator;
    private readonly errorBanner: Locator;
    private readonly errorCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.errorBanner = page.getByTestId('error');
        this.errorCloseButton = page.getByTestId('error-button');
    }

    async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continue(): Promise<void> {
        await this.continueButton.click();
    }

    async cancel(): Promise<void> {
        await this.cancelButton.click();
    }

    async closeError(): Promise<void> {
        await this.errorCloseButton.click();
    }

    async expectError(message: string): Promise<void> {
        await expect(this.errorBanner).toHaveText(message);
    } 

    async expectErrorHighlightOnAllFields(): Promise<void> {
        const errorClass = /(^|\s)error(\s|$)/;
        await expect(this.firstNameInput).toHaveClass(errorClass);
        await expect(this.lastNameInput).toHaveClass(errorClass);
        await expect(this.postalCodeInput).toHaveClass(errorClass);
    }

    async expectNoError(): Promise<void> {
        const errorClass = /(^|\s)error(\s|$)/;
        await expect(this.errorBanner).toHaveCount(0);
        await expect(this.firstNameInput).not.toHaveClass(errorClass);
        await expect(this.lastNameInput).not.toHaveClass(errorClass);
        await expect(this.postalCodeInput).not.toHaveClass(errorClass);
    }



}