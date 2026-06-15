/**
 * Détermination du territoire fiscal français à partir d'une adresse.
 *
 * Logique de domaine pure (aucune dépendance Prisma / base / framework).
 * Cf. docs/lots/2026-06-14-commerce-taxation-cadrage.md (D2).
 *
 * Périmètre V1 : France métropolitaine + DOM (Guadeloupe, Martinique, Guyane,
 * Réunion, Mayotte). Les COM (Saint-Pierre-et-Miquelon 975, Saint-Barthélemy /
 * Saint-Martin 977/978, Polynésie, etc.) sont hors champ V1 et renvoient `null`
 * → déclenche le fallback bloquant côté service (pas de TVA à 0 silencieuse).
 */

export type FrenchTaxTerritory =
  | "METROPOLE"
  | "GUADELOUPE"
  | "MARTINIQUE"
  | "GUYANE"
  | "REUNION"
  | "MAYOTTE";

/** Territoires DOM exonérés de TVA (taux non applicable). */
export const VAT_EXEMPT_TERRITORIES: ReadonlySet<FrenchTaxTerritory> = new Set([
  "GUYANE",
  "MAYOTTE",
]);

const DOM_PREFIX_TO_TERRITORY: Readonly<Record<string, FrenchTaxTerritory>> = {
  "971": "GUADELOUPE",
  "972": "MARTINIQUE",
  "973": "GUYANE",
  "974": "REUNION",
  "976": "MAYOTTE",
};

function normalizePostalCode(postalCode: string): string | null {
  const trimmed = postalCode.trim();
  return /^\d{5}$/.test(trimmed) ? trimmed : null;
}

/**
 * Renvoie le territoire fiscal pour un code postal français à 5 chiffres,
 * ou `null` si le code est invalide ou hors champ V1 (COM/TOM).
 */
export function determineFrenchTaxTerritory(postalCode: string): FrenchTaxTerritory | null {
  const normalized = normalizePostalCode(postalCode);

  if (normalized === null) {
    return null;
  }

  const prefix3 = normalized.slice(0, 3);

  if (prefix3 in DOM_PREFIX_TO_TERRITORY) {
    return DOM_PREFIX_TO_TERRITORY[prefix3] ?? null;
  }

  // Métropole : départements 01–95 (Corse 20xxx incluse).
  const prefix2 = Number.parseInt(normalized.slice(0, 2), 10);
  if (prefix2 >= 1 && prefix2 <= 95) {
    return "METROPOLE";
  }

  // 96 inexistant, 97x non-DOM (975 COM), 98x TOM → hors champ V1.
  return null;
}

/** `true` si le territoire est exonéré de TVA (taux non applicable). */
export function isVatExemptTerritory(territory: FrenchTaxTerritory): boolean {
  return VAT_EXEMPT_TERRITORIES.has(territory);
}

const TERRITORY_TO_REGION_CODE: Readonly<Record<FrenchTaxTerritory, string | null>> = {
  METROPOLE: null,
  GUADELOUPE: "971",
  MARTINIQUE: "972",
  GUYANE: "973",
  REUNION: "974",
  MAYOTTE: "976",
};

/** Critères de correspondance d'une `TaxRule` pour un territoire FR. */
export function taxRuleMatchKey(territory: FrenchTaxTerritory): {
  countryCode: string;
  regionCode: string | null;
} {
  return { countryCode: "FR", regionCode: TERRITORY_TO_REGION_CODE[territory] };
}
