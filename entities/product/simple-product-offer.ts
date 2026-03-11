export type SimpleProductOffer = {
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isAvailable: boolean;
};

export type SimpleProductOfferFields = {
  sku: string | null;
  price: string | null;
  compareAtPrice: string | null;
  stockQuantity: number | null;
};

type SimpleProductOfferResolution =
  | {
      source: "native" | "legacy";
      offer: SimpleProductOffer;
    }
  | {
      source: "incoherent";
    };

function normalizeText(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeMoney(value: string | null | undefined): string | null {
  const normalizedValue = normalizeText(value);

  if (normalizedValue === null) {
    return null;
  }

  const canonicalValue = normalizedValue.replace(",", ".");

  if (!/^\d+(?:\.\d{1,2})?$/.test(canonicalValue)) {
    return null;
  }

  const numericValue = Number(canonicalValue);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return numericValue.toFixed(2);
}

function normalizeStockQuantity(value: number | null | undefined): number | null {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function toResolvedOffer(
  fields: SimpleProductOfferFields
): SimpleProductOffer | null {
  const sku = normalizeText(fields.sku);
  const price = normalizeMoney(fields.price);
  const stockQuantity = normalizeStockQuantity(fields.stockQuantity);
  const compareAtPrice =
    fields.compareAtPrice === null
      ? null
      : normalizeMoney(fields.compareAtPrice);

  if (sku === null || price === null || stockQuantity === null) {
    return null;
  }

  if (fields.compareAtPrice !== null && compareAtPrice === null) {
    return null;
  }

  return {
    sku,
    price,
    compareAtPrice,
    stockQuantity,
    isAvailable: stockQuantity > 0
  };
}

function resolveSimpleProductOfferInternal(input: {
  native: SimpleProductOfferFields;
  legacyOffers: readonly SimpleProductOfferFields[];
}): SimpleProductOfferResolution {
  const nativeOffer = toResolvedOffer(input.native);

  if (nativeOffer !== null) {
    return {
      source: "native",
      offer: nativeOffer
    };
  }

  const legacyOffers = input.legacyOffers
    .map((offer) => toResolvedOffer(offer))
    .filter((offer): offer is SimpleProductOffer => offer !== null);

  if (legacyOffers.length === 1) {
    const [legacyOffer] = legacyOffers;

    if (legacyOffer === undefined) {
      return {
        source: "incoherent"
      };
    }

    return {
      source: "legacy",
      offer: legacyOffer
    };
  }

  return {
    source: "incoherent"
  };
}

export function resolveSimpleProductOffer(input: {
  native: SimpleProductOfferFields;
  legacyOffers: readonly SimpleProductOfferFields[];
}): SimpleProductOffer | null {
  const resolution = resolveSimpleProductOfferInternal(input);

  if (resolution.source === "incoherent") {
    return null;
  }

  return resolution.offer;
}
