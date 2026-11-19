import { PRODUCTS } from './products';

/** Order in which the Spinner and Slider pages show the six products. */
export const CATALOG_ORDER = [
    PRODUCTS.bikeLight,
    PRODUCTS.boltTShirt,
    PRODUCTS.onesie,
    PRODUCTS.redTShirt,
    PRODUCTS.backpack,
    PRODUCTS.fleeceJacket,
] as const;

/** First eight cards of the Lazy Load page. The other four cards show a placeholder. */
export const LAZY_LOAD_FIRST_BATCH = [
    { name: 'Sauce Labs Bike Light', price: '$9.99' },
    { name: 'Sauce Labs Bolt T-Shirt (XS)', price: '$15.99' },
    { name: 'Sauce Labs Onesie', price: '$7.99' },
    { name: 'Test.allTheThings() T-Shirt (Red) (XS)', price: '$15.99' },
    { name: 'Sauce Labs Backpack', price: '$29.99' },
    { name: 'Sauce Labs Fleece Jacket (XS)', price: '$49.99' },
    { name: 'Sauce Labs Fleece Jacket (S)', price: '$49.99' },
    { name: 'Sauce Labs Fleece Jacket (M)', price: '$49.99' },
] as const;