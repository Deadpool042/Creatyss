import type { CurrencyCode, PriceListStatus, PriceTargetType, ProductVariantStatus } from "@/prisma-generated/client";

type DecimalLike = {
  toString(): string;
};

type SnapshotPriceList = {
  id: string;
  currencyCode: CurrencyCode;
  status: PriceListStatus;
  isDefault: boolean;
  archivedAt: Date | null;
};

type SnapshotProductPrice = {
  amount: DecimalLike | null;
  isActive: boolean;
  archivedAt: Date | null;
  priceList: SnapshotPriceList;
};

type SnapshotVariantPrice = {
  amount: DecimalLike | null;
  isActive: boolean;
  archivedAt: Date | null;
  priceList: SnapshotPriceList;
};

type SnapshotVariant = {
  status: ProductVariantStatus;
  archivedAt: Date | null;
  prices: SnapshotVariantPrice[];
};

export type CatalogPriceSnapshotInput = {
  prices: SnapshotProductPrice[];
  variants: SnapshotVariant[];
};

export type CatalogPriceSnapshot = {
  catalogPriceCents: number | null;
  catalogPriceCurrencyCode: CurrencyCode | null;
  catalogPriceSource: PriceTargetType | null;
};

type PriceCandidate = {
  cents: number;
  currencyCode: CurrencyCode;
};

function isDefaultActivePriceList(priceList: SnapshotPriceList): boolean {
  return (
    priceList.isDefault &&
    priceList.status === "ACTIVE" &&
    priceList.archivedAt === null
  );
}

function decimalAmountToCents(value: DecimalLike | null): number | null {
  if (value === null) {
    return null;
  }

  const normalized = value.toString().trim();
  const match = normalized.match(/^(\d+)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return null;
  }

  const eurosPart = match[1];

  if (eurosPart === undefined) {
    return null;
  }

  const euros = Number.parseInt(eurosPart, 10);

  if (!Number.isSafeInteger(euros)) {
    return null;
  }

  const decimalsPart = match[2] ?? "";
  const centsPart =
    decimalsPart.length === 0 ? 0 : Number.parseInt(decimalsPart.padEnd(2, "0"), 10);

  if (!Number.isSafeInteger(centsPart)) {
    return null;
  }

  const totalCents = euros * 100 + centsPart;

  return Number.isSafeInteger(totalCents) ? totalCents : null;
}

function pickLowestPriceCandidate(candidates: PriceCandidate[]): PriceCandidate | null {
  if (candidates.length === 0) {
    return null;
  }

  const firstCandidate = candidates[0];

  if (firstCandidate === undefined) {
    return null;
  }

  let selected = firstCandidate;

  for (let index = 1; index < candidates.length; index += 1) {
    const candidate = candidates[index];

    if (candidate !== undefined && candidate.cents < selected.cents) {
      selected = candidate;
    }
  }

  return selected;
}

function toPriceCandidate(
  price: SnapshotProductPrice | SnapshotVariantPrice
): PriceCandidate | null {
  if (!price.isActive || price.archivedAt !== null) {
    return null;
  }

  if (!isDefaultActivePriceList(price.priceList)) {
    return null;
  }

  const cents = decimalAmountToCents(price.amount);

  if (cents === null) {
    return null;
  }

  return {
    cents,
    currencyCode: price.priceList.currencyCode,
  };
}

function buildSnapshotFromCandidate(
  candidate: PriceCandidate,
  source: PriceTargetType
): CatalogPriceSnapshot {
  return {
    catalogPriceCents: candidate.cents,
    catalogPriceCurrencyCode: candidate.currencyCode,
    catalogPriceSource: source,
  };
}

export function computeCatalogPriceSnapshot(
  input: CatalogPriceSnapshotInput
): CatalogPriceSnapshot {
  const productCandidates: PriceCandidate[] = [];

  for (const price of input.prices) {
    const candidate = toPriceCandidate(price);

    if (candidate !== null) {
      productCandidates.push(candidate);
    }
  }

  const productPriceCandidate = pickLowestPriceCandidate(productCandidates);

  if (productPriceCandidate !== null) {
    return buildSnapshotFromCandidate(productPriceCandidate, "PRODUCT");
  }

  const variantCandidates: PriceCandidate[] = [];

  for (const variant of input.variants) {
    if (variant.status !== "ACTIVE" || variant.archivedAt !== null) {
      continue;
    }

    for (const price of variant.prices) {
      const candidate = toPriceCandidate(price);

      if (candidate !== null) {
        variantCandidates.push(candidate);
      }
    }
  }

  const variantPriceCandidate = pickLowestPriceCandidate(variantCandidates);

  if (variantPriceCandidate !== null) {
    return buildSnapshotFromCandidate(variantPriceCandidate, "PRODUCT_VARIANT");
  }

  return {
    catalogPriceCents: null,
    catalogPriceCurrencyCode: null,
    catalogPriceSource: null,
  };
}
