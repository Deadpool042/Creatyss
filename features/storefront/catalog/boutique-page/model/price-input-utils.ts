/**
 * Convert cents to euros as input value string
 */
export function centsToEurosInputValue(cents: number | null): string {
  if (cents === null) {
    return "";
  }

  return String(Math.trunc(cents / 100));
}

/**
 * Convert euros input string to cents
 */
export function eurosInputToCents(value: string): number | null {
  const normalized = value.trim();

  if (normalized.length === 0 || !/^\d+$/.test(normalized)) {
    return null;
  }

  const euros = Number.parseInt(normalized, 10);

  if (!Number.isSafeInteger(euros) || euros < 0) {
    return null;
  }

  return euros * 100;
}
