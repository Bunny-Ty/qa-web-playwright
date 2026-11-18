import { test } from '@playwright/test';

import { PASSWORD, USERS } from '../data/users';

import { PRODUCTS } from '../data/products';

import { LoginPage } from '../pages/LoginPage';

import { ProductDetailPage } from '../pages/ProductDetailPage';

import { ProductsPage } from '../pages/ProductsPage';

const { backpack, bikeLight, boltTShirt, fleeceJacket, onesie, redTShirt } = PRODUCTS;

test.describe('Products', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(USERS.standard, PASSWORD);
        await new ProductsPage(page).expectLoaded();
    });

    test('TC-PROD-001: Products page shows all six products @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        for (const product of Object.values(PRODUCTS)) {
            await productsPage.expectProductShown(product.name, product.price);
        }
    });

    test('TC-PROD-002: sort by Name (A to Z) @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.sortBy('Name (A to Z)');

        await productsPage.expectNamesInOrder([
            backpack.name,
            bikeLight.name,
            boltTShirt.name,
            fleeceJacket.name,
            onesie.name,
            redTShirt.name,
        ]);
    });

    test('TC-PROD-003: sort by Name (Z to A) @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.sortBy('Name (Z to A)');

        await productsPage.expectNamesInOrder([
            redTShirt.name,
            onesie.name,
            fleeceJacket.name,
            boltTShirt.name,
            bikeLight.name,
            backpack.name,
        ]);
    });

    test('TC-PROD-004: sort by Price (low to high) @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.sortBy('Price (low to high)');

        await productsPage.expectPricesInOrder([
            onesie.price,
            bikeLight.price,
            boltTShirt.price,
            redTShirt.price,
            backpack.price,
            fleeceJacket.price,
        ]);
    });

    test('TC-PROD-005: sort by Price (high to low) @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);

        await productsPage.sortBy('Price (high to low)');

        await productsPage.expectPricesInOrder([
            fleeceJacket.price,
            backpack.price,
            boltTShirt.price,
            redTShirt.price,
            bikeLight.price,
            onesie.price,
        ]);
    });

    test('TC-PROD-006: product detail page matches the product list @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const detailPage = new ProductDetailPage(page);

        const listInfo = await productsPage.getProductInfo(backpack.name);
        await productsPage.openProduct(backpack.name);

        await detailPage.expectLoaded();
        await detailPage.expectDetails(listInfo);
    });

    test('TC-PROD-007: Back to products returns to the Products page @regression', async ({ page }) => {
        const productsPage = new ProductsPage(page);
        const detailPage = new ProductDetailPage(page);

        await productsPage.openProduct(backpack.name);
        await detailPage.expectLoaded();

        await detailPage.backToProducts();

        await productsPage.expectLoaded();
    });
});