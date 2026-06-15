import type { TaxRuleStatus, TaxRuleScopeType } from "@/prisma-generated/client";

export type AdminTaxRuleSummary = {
  id: string;
  code: string;
  name: string;
  status: TaxRuleStatus;
  scopeType: TaxRuleScopeType;
  countryCode: string;
  regionCode: string | null;
  ratePercent: number;
  isIncludedInPrice: boolean;
  createdAt: Date;
};
