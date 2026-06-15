"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createTaxRuleAction } from "@/features/admin/commerce/taxation/actions/create-tax-rule.action";
import { TAXATION_TERRITORY_OPTIONS } from "@/features/admin/commerce/taxation/shared/admin-taxation-routes";

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
);

export function AdminTaxRuleCreateForm() {
  return (
    <form action={createTaxRuleAction} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tax-code">Code</Label>
        <Input id="tax-code" name="code" placeholder="FR-STD-METRO" required maxLength={40} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tax-name">Nom</Label>
        <Input id="tax-name" name="name" placeholder="TVA standard métropole" required maxLength={120} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tax-region">Territoire</Label>
        <select id="tax-region" name="regionCode" className={selectClassName} defaultValue="METRO">
          {TAXATION_TERRITORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tax-rate">Taux (%)</Label>
        <Input
          id="tax-rate"
          name="ratePercent"
          type="number"
          min={0}
          max={100}
          step="0.01"
          placeholder="20"
          required
        />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit">Créer la règle</Button>
      </div>
    </form>
  );
}
