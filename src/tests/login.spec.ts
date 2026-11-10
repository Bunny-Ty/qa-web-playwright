import { test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

test.describe('Login', () => {
    test('TC-LOG-001: login with a valid user @smoke', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);

        await productsPage.expectLoaded();
    })
})