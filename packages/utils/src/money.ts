const DEFAULT_CURRENCY = "USD";

export function formatMoney(
  amountMinor: number,
  currency: string = DEFAULT_CURRENCY,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}
