import { test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

const SLOW_LOGIN_TIMEOUT = 15_000;

const validUsers = [
    USERS.standard,
    USERS.problem,
    USERS.error,
    USERS.visual,
    USERS.performanceGlitch,
];

const negativeCases = [
    { id: 'TC-LOGIN-002',
      title: 'login fails with a wrong password',
      username: USERS.standard,
      password: 'wrong_password',
      message: 'Epic sadface: Username and password do not match any user in this service',
    },
    
    {
        id: 'TC-LOGIN-003',
        title: 'login fails with an empty username',
        username: '',
        password: PASSWORD,
        message: 'Epic sadface: Username is required',
    },

    {
        id: 'TC-LOGIN-004',
        title: 'login fails with an empty password',
        username: USERS.standard,
        password: '',
        message: 'Epic sadface: Password is required',
    },

    {
        id: 'TC-LOGIN-005',
        title: 'login fails when both fields are empty',
        username: '',
        password: '',
        message: 'Epic sadface: Username is required',
    },

    {
         id: 'TC-LOGIN-006',
        title: 'locked-out user cannot log in',
        username: USERS.lockedOut,
        password: PASSWORD,
        message: 'Epic sadface: Sorry, this user has been locked out.',
    },
];

test.describe('Login', () => {
    for (const username of validUsers) {
    const tag = username === USERS.standard ? '@smoke' : '@regression';

    test(`TC-LOGIN-001: login succeeds with ${username} ${tag}`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const productsPage = new ProductsPage(page);

            await loginPage.goto();
            await loginPage.login(username, PASSWORD);

            const timeout = username === USERS.performanceGlitch ? SLOW_LOGIN_TIMEOUT : undefined;
            await productsPage.expectLoaded(timeout);
        });
    }   
    
    for (const testCase of negativeCases) {
        test(`${testCase.id}: ${testCase.title} @regression`, async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.login(testCase.username, testCase.password);

            await loginPage.expectError(testCase.message);
            await loginPage.expectErrorMarks();
            await loginPage.expectOnLoginPage();
        });
    }

    test('TC-LOGIN-007: protected page cannot be opened without login @regression', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);

        await productsPage.goto();

        await loginPage.expectError("Epic sadface: You can only access '/inventory.html' when you are logged in");
        await loginPage.expectOnLoginPage();
    });

    test('TC-LOGIN-008: error banner can be closed with its X button @regression', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();
        await loginPage.login('', '');
        await loginPage.expectError('Epic sadface: Username is required');
        await loginPage.expectErrorMarks();

        await loginPage.closeError();

        await loginPage.expectErrorHidden();
        await loginPage.expectNoErrorMarks();
    });
    
}); 

