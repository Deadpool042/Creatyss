export function normalizeMoneyToDecimalString(value: string | null | undefined): string | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed.toFixed(2);
}

export function resolveCompareAtAmount(
  currentAmount: string | null,
  regularAmount: string | null
): string | null {
  if (currentAmount === null || regularAmount === null) {
    return null;
  }

  return Number(regularAmount) > Number(currentAmount) ? regularAmount : null;
}
