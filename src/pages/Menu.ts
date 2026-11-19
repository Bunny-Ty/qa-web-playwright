import { expect, type Locator, type Page } from '@playwright/test';

export class Menu {
    private readonly openButton: Locator;
    private readonly closeButton: Locator;
    private readonly allItemsLink: Locator;
    private readonly dynamicCatalogLink: Locator;
    private readonly lazyLoadLink: Locator;
    private readonly spinnerLink: Locator;
    private readonly sliderLink: Locator;
    private readonly aboutLink: Locator;
    private readonly logoutLink: Locator;
    private readonly resetLink: Locator;

    constructor(page: Page) {
        this.openButton = page.getByRole('button', { name: 'Open Menu' });
        this.closeButton = page.getByRole('button', { name: 'Close Menu' });
        this.allItemsLink = page.getByTestId('inventory-sidebar-link');
        this.dynamicCatalogLink = page.getByTestId('dynamic-catalog-sidebar-link');
        this.lazyLoadLink = page.getByTestId('dynamic-catalog-lazy-load-link');
        this.spinnerLink = page.getByTestId('dynamic-catalog-spinner-link');
        this.sliderLink = page.getByTestId('dynamic-catalog-slider-link');
        this.aboutLink = page.getByTestId('about-sidebar-link');
        this.logoutLink = page.getByTestId('logout-sidebar-link');
        this.resetLink = page.getByTestId('reset-sidebar-link');
    }

    async open(): Promise<void> {
        await this.openButton.click();
    }

    async expectOpen(): Promise<void> {
        await expect(this.closeButton).toBeVisible();
        await expect(this.logoutLink).toBeInViewport();
    }

    async expectItems(): Promise<void> {
        await expect(this.allItemsLink).toHaveText('All Items');
        await expect(this.dynamicCatalogLink).toHaveText('Dynamic Catalog');
        await expect(this.dynamicCatalogLink).toHaveAttribute('aria-expanded', 'false');
        await expect(this.aboutLink).toHaveText('About');
        await expect(this.logoutLink).toHaveText('Logout');
        await expect(this.resetLink).toHaveText('Reset App State');
    }

    async clickAbout(): Promise<void> {
        await this.aboutLink.click();
    }

    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }

    async clickResetAppState(): Promise<void> {
        await this.resetLink.click();
    }

    async expandDynamicCatalog(): Promise<void> {
        await this.dynamicCatalogLink.click();
    }

    async expectDynamicCatalogItems(): Promise<void> {
        await expect(this.dynamicCatalogLink).toHaveAttribute('aria-expanded', 'true');
        await expect(this.lazyLoadLink).toBeVisible();
        await expect(this.lazyLoadLink).toHaveText('Lazy Load');
        await expect(this.spinnerLink).toBeVisible();
        await expect(this.spinnerLink).toHaveText('Spinner');
        await expect(this.sliderLink).toBeVisible();
        await expect(this.sliderLink).toHaveText('Slider');
    }

    async clickLazyLoad(): Promise<void> {
        await this.lazyLoadLink.click();
    }

    async clickSpinner(): Promise<void> {
        await this.spinnerLink.click();
    }

    async clickSlider(): Promise<void> {
        await this.sliderLink.click();
    }
}