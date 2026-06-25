"use server";

import { parse } from "csv-parse/sync";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { csvTaxRuleRowSchema } from "@/features/admin/commerce/taxation/schemas/import-tax-rule.schema";
import { ADMIN_TAXATION_PATH } from "@/features/admin/commerce/taxation/shared/admin-taxation-routes";
import { revalidatePath } from "next/cache";

export type ImportTaxRulesResult = {
  created: number;
  updated: number;
  errors: string[];
};

export async function importTaxRulesAction(
  _prev: ImportTaxRulesResult | null,
  formData: FormData
): Promise<ImportTaxRulesResult> {
  await requireAuthenticatedAdmin();

  const file = formData.get("csvFile");
  if (!(file instanceof File) || file.size === 0) {
    return { created: 0, updated: 0, errors: ["Aucun fichier sélectionné."] };
  }

  const text = await file.text();

  let rawRows: unknown[];
  try {
    rawRows = parse(text, { columns: true, skip_empty_lines: true, trim: true });
  } catch {
    return { created: 0, updated: 0, errors: ["Fichier CSV invalide ou mal formé."] };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { created: 0, updated: 0, errors: ["Aucune boutique trouvée."] };
  }

  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const lineNum = i + 2; // line 1 = header
    const parsed = csvTaxRuleRowSchema.safeParse(rawRows[i]);

    if (!parsed.success) {
      const msg = parsed.error.issues.map((e) => e.message).join(", ");
      errors.push(`Ligne ${lineNum} : ${msg}`);
      continue;
    }

    const row = parsed.data;
    const startsAt = row.startsAt ? new Date(row.startsAt) : null;
    const endsAt = row.endsAt ? new Date(row.endsAt) : null;

    if (
      (startsAt && Number.isNaN(startsAt.getTime())) ||
      (endsAt && Number.isNaN(endsAt.getTime()))
    ) {
      errors.push(`Ligne ${lineNum} (${row.code}) : date invalide.`);
      continue;
    }

    try {
      const existing = await db.taxRule.findUnique({
        where: { storeId_code: { storeId, code: row.code.toUpperCase() } },
        select: { id: true },
      });

      await db.taxRule.upsert({
        where: { storeId_code: { storeId, code: row.code.toUpperCase() } },
        update: {
          name: row.name,
          countryCode: row.countryCode,
          regionCode: row.regionCode,
          ratePercent: row.ratePercent,
          isIncludedInPrice: true,
          startsAt,
          endsAt,
          status: row.status,
        },
        create: {
          storeId,
          code: row.code.toUpperCase(),
          name: row.name,
          countryCode: row.countryCode,
          regionCode: row.regionCode,
          ratePercent: row.ratePercent,
          isIncludedInPrice: true,
          scopeType: "STORE",
          startsAt,
          endsAt,
          status: row.status,
        },
      });

      if (existing) {
        updated++;
      } else {
        created++;
      }
    } catch {
      errors.push(`Ligne ${lineNum} (${row.code}) : erreur base de données.`);
    }
  }

  revalidatePath(ADMIN_TAXATION_PATH);
  return { created, updated, errors };
}
