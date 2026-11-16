const TAX_RATE = 0.08;

function toCents(price: string): number {
    return Math.round(parseFloat(price.replace('$', '')) * 100);
}

function toDollars(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

export function calculateTotals(prices: readonly string[]): { itemTotal: string; tax: string; total: string } {
    const itemCents = prices.reduce((sum, price) => sum + toCents(price), 0);
    const taxCents = Math.round(itemCents * TAX_RATE);

    return {
        itemTotal: toDollars(itemCents),
        tax: toDollars(taxCents),
        total: toDollars(itemCents + taxCents),
    };
}