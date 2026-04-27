export type OfferVariantOptionValue = {
  optionId: string;
  optionName: string;
  valueId: string;
  valueLabel: string;
};

/**
 * Représentation normalisée d'un variant pour la PDP storefront.
 * Type frontière non-UI : utilisable par model/composition/components.
 */
export type OfferVariant = {
  id: string;
  name: string;
  /** Prix formaté — peut être chaîne vide si non renseigné. */
  price: string;
  compareAtPrice: string | null;
  isAvailable: boolean;
  isDefault: boolean;
  sku: string | null;
  colorName: string | null;
  colorHex: string | null;
  displayImage: { src: string; alt: string } | null;
  images: { src: string; alt: string | null }[];
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  optionValues: OfferVariantOptionValue[];
};
