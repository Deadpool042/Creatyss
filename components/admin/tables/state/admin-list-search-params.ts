function isValidAdminListValue<TValue extends string>(
  value: string,
  validSet: ReadonlySet<string>
): value is TValue {
  return validSet.has(value);
}

export function parseAdminListArrayParam<TValue extends string>(
  value: string | null | undefined,
  validValues: readonly TValue[]
): TValue[] {
  if (!value) return [];

  const validSet = new Set<string>(validValues);

  return value.split(",").filter((item): item is TValue => isValidAdminListValue(item, validSet));
}

export function parseAdminListStringArrayParam(value: string | null | undefined): string[] {
  if (!value) return [];

  return value.split(",").filter(Boolean);
}

export function parseAdminListSortParam<TValue extends string>(
  value: string | null | undefined,
  validValues: readonly TValue[],
  fallback: TValue
): TValue {
  if (!value) {
    return fallback;
  }

  const validSet = new Set<string>(validValues);
  return isValidAdminListValue(value, validSet) ? (value as TValue) : fallback;
}

export function parseAdminListPageParam(value: string | null | undefined): number {
  const next = Number(value);

  return Number.isInteger(next) && next >= 1 ? next : 1;
}

export function parseAdminListPerPageParam(
  value: string | null | undefined,
  validValues: readonly number[],
  fallback: number
): number {
  const next = Number(value);

  return validValues.includes(next) ? next : fallback;
}

export function formatAdminListArrayParam<TValue extends string>(
  values: readonly TValue[]
): string | null {
  return values.length > 0 ? values.join(",") : null;
}

export function formatAdminListDefaultParam<TValue extends string | number>(
  value: TValue,
  defaultValue: TValue
): string | null {
  return value === defaultValue ? null : String(value);
}

export function formatAdminListPageParam(value: number): string | null {
  return formatAdminListDefaultParam(value, 1);
}
