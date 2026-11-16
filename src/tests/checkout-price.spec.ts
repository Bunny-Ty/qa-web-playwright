import { test } from '@playwright/test';

import { checkoutInfo } from '../data/checkout';

import { PASSWORD, USERS } from '../data/users';

import { PRODUCTS } from '../data/products';

import { CartPage } from '../pages/CartPage';

import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';

import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';

import { Header } from '../pages/Header';

import { LoginPage } from '../pages/LoginPage';

import { ProductsPage } from '../pages/ProductsPage';

import { calculateTotals } from '../utils/price';

const { backpack, bikeLight, onesie, boltTShirt, fleeceJacket, redTShirt } = PRODUCTS; 

const priceSets = [
    { id: 'P1', products: [backpack, bikeLight] },
    { id: 'P2', products: [backpack] },
    { id: 'P3', products: [onesie, backpack] },
    { id: 'P4', products: [onesie] },
    { id: 'P5', products: [backpack, bikeLight, onesie, boltTShirt, fleeceJacket, redTShirt] },
];

test.describe('Checkout - Price calculation', () => {
    for (const set of priceSets) {
        test(`TC-CHK-009: item total, tax and total are correct for set ${set.id} @regression`, async ({ page }) => {
            const loginPage = new LoginPage(page);
            const productsPage = new ProductsPage(page);
            const header = new Header(page);
            const cartPage =  new CartPage(page);
            const infoPage = new CheckoutInformationPage(page);
            const overviewPage = new CheckoutOverviewPage(page);

            await loginPage.goto();
            await loginPage.login(USERS.standard, PASSWORD);
            await productsPage.expectLoaded();
            for (const products of set.products) {
                await productsPage.addToCart(products.name);
            }

            await header.openCart();
            await cartPage.expectLoaded();
            await cartPage.checkout();
            await infoPage.fillInformation(checkoutInfo.firstName, checkoutInfo.lastName, checkoutInfo.postalCode);
            await infoPage.continue();

            const expected = calculateTotals(set.products.map((product) => product.price));

            await overviewPage.expectLoaded();
            await overviewPage.expectItemCount(set.products.length);
            await overviewPage.expectTotals(expected.itemTotal, expected.tax, expected.total);
        });
    }
});

