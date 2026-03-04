export function convertCurrency(amount: number, rate: number): number {
  return Math.round(amount * rate);
}
