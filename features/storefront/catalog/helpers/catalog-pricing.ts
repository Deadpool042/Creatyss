export function formatCatalogMoney(value: { toString(): string } | null): string {
  if (value === null) {
    return "";
  }

  const parsed = Number.parseFloat(value.toString());

  if (!Number.isFinite(parsed)) {
    return value.toString();
  }

  return `${parsed.toFixed(2)} €`;
}

export function formatCatalogMoneyFromCents(
  cents: number | null,
  currencyCode: string | null
): string {
  if (cents === null || !Number.isFinite(cents)) {
    return "";
  }

  const safeCents = Math.trunc(cents);
  const amount = safeCents / 100;
  const normalizedCurrency = currencyCode?.trim().toUpperCase() ?? "EUR";

  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} €`;
  }
}
