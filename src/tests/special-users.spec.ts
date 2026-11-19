import { test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

const SLOW_LOGIN_TIMEOUT = 15_000;

test.describe('Special users', () => {
    test('TC-USER-011: performance_glitch_user logs in after a delay @regression', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.performanceGlitch, PASSWORD);

        await productsPage.expectLoaded(SLOW_LOGIN_TIMEOUT);
    });
});