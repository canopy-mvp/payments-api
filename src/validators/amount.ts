export function validateAmount(amount: number): boolean {
  return amount > 0 && Number.isInteger(amount) && amount <= 99999999;
}
