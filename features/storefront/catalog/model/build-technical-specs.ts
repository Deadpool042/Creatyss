type TechnicalVariant = {
  sku: string;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
};

function formatWeight(weightGrams: number): string {
  if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
    return "";
  }

  if (weightGrams >= 1000) {
    const kg = weightGrams / 1000;
    const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(2);
    return `${formatted} kg`;
  }

  return `${Math.round(weightGrams)} g`;
}

function formatDimensions(input: {
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
}): string {
  const { widthMm, heightMm, depthMm } = input;
  const hasAll = widthMm !== null && heightMm !== null && depthMm !== null;

  if (hasAll) {
    return `${widthMm} × ${heightMm} × ${depthMm} mm`;
  }

  const parts: string[] = [];
  if (widthMm !== null) parts.push(`L ${widthMm} mm`);
  if (heightMm !== null) parts.push(`H ${heightMm} mm`);
  if (depthMm !== null) parts.push(`P ${depthMm} mm`);

  return parts.join(" · ");
}

export function buildTechnicalSpecs(
  referenceVariant: TechnicalVariant | null
): Array<{ label: string; value: string }> {
  if (!referenceVariant) {
    return [];
  }

  const specs: Array<{ label: string; value: string }> = [];

  if (referenceVariant.sku.trim().length > 0) {
    specs.push({ label: "Référence (SKU)", value: referenceVariant.sku });
  }

  if (referenceVariant.barcode && referenceVariant.barcode.trim().length > 0) {
    specs.push({ label: "Code-barres", value: referenceVariant.barcode });
  }

  if (
    referenceVariant.externalReference &&
    referenceVariant.externalReference.trim().length > 0
  ) {
    specs.push({ label: "Référence externe", value: referenceVariant.externalReference });
  }

  if (referenceVariant.weightGrams !== null) {
    const weight = formatWeight(referenceVariant.weightGrams);
    if (weight.length > 0) {
      specs.push({ label: "Poids", value: weight });
    }
  }

  const dimensions = formatDimensions(referenceVariant);
  if (dimensions.length > 0) {
    specs.push({ label: "Dimensions", value: dimensions });
  }

  return specs;
}
