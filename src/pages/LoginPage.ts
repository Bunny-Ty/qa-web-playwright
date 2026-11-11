import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorBanner: Locator;
    private readonly errorCloseButton: Locator;

    constructor (private readonly page: Page) {
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.errorBanner = page.getByTestId('error');
        this.errorCloseButton = page.getByTestId('error-button');
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async closeError(): Promise <void> {
        await this.errorCloseButton.click();
    }

    async expectError(message: string): Promise<void> {
        await expect(this.errorBanner).toContainText(message);
    }

    async expectErrorHidden(): Promise<void> {
        await expect(this.errorBanner).toBeHidden();
    }


    async expectErrorMarks(): Promise<void> {
        await expect(this.usernameInput).toHaveClass(/\berror\b/);
        await expect(this.passwordInput).toHaveClass(/\berror\b/);
    }

    async expectNoErrorMarks(): Promise<void> {
        await expect(this.usernameInput).not.toHaveClass(/\berror\b/);
        await expect(this.passwordInput).not.toHaveClass(/\berror\b/);
    }

    async expectOnLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
        await expect(this.loginButton).toBeVisible();
    }

}