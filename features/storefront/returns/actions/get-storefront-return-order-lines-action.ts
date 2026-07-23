"use server";

import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { storefrontOrderIdentificationSchema } from "@/features/storefront/returns/schemas/storefront-order-identification.schema";
import {
  getStorefrontReturnOrderLines,
  type StorefrontReturnOrderLine,
} from "@/features/storefront/returns/services/get-storefront-return-order-lines.service";

export type GetStorefrontReturnOrderLinesActionResult =
  | Readonly<{ available: false }>
  | Readonly<{ available: true; lines: ReadonlyArray<StorefrontReturnOrderLine> }>;

const UNAVAILABLE: GetStorefrontReturnOrderLinesActionResult = { available: false };

/**
 * Contrat de sécurité : que la cause soit une feature inactive, une entrée
 * invalide, une commande non identifiée ou l'absence de ligne disponible, la
 * réponse publique est systématiquement `{ available: false }` — jamais de
 * détail permettant de distinguer ces causes.
 */
export async function getStorefrontReturnOrderLinesAction(
  input: unknown
): Promise<GetStorefrontReturnOrderLinesActionResult> {
  const featureActive = await meetsFeatureLevel("commerce.returns", "manual");
  if (!featureActive) {
    return UNAVAILABLE;
  }

  const parsed = storefrontOrderIdentificationSchema.safeParse(input);
  if (!parsed.success) {
    return UNAVAILABLE;
  }

  const result = await getStorefrontReturnOrderLines(parsed.data);
  if (!result.ok) {
    return UNAVAILABLE;
  }

  return { available: true, lines: result.lines };
}
