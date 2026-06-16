"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createDiscountAction } from "@/features/admin/marketing/discounts/actions/create-discount.action";

const selectClassName = cn(
  "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
);

type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

type AdminDiscountCreateFormProps = {
  automationEnabled: boolean;
};

export function AdminDiscountCreateForm({ automationEnabled }: AdminDiscountCreateFormProps) {
  const [type, setType] = useState<DiscountType>("PERCENTAGE");

  return (
    <form action={createDiscountAction} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="discount-code">Code</Label>
        <Input
          id="discount-code"
          name="code"
          placeholder={automationEnabled ? "PROMO-ETE-AUTO" : "ETE2026"}
          required
          maxLength={40}
        />
        {automationEnabled ? (
          <p className="text-xs text-muted-foreground">
            Référence interne unique. Une remise automatique n&apos;est pas saisie par le client.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="discount-name">Nom</Label>
        <Input id="discount-name" name="name" placeholder="Promo été" required maxLength={120} />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="discount-description">Description (optionnel)</Label>
        <Textarea id="discount-description" name="description" rows={2} maxLength={500} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="discount-type">Type de remise</Label>
        <select
          id="discount-type"
          name="type"
          className={selectClassName}
          value={type}
          onChange={(event) => setType(event.target.value as DiscountType)}
        >
          <option value="PERCENTAGE">Pourcentage</option>
          <option value="FIXED_AMOUNT">Montant fixe</option>
        </select>
      </div>

      {type === "PERCENTAGE" ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-percentage">Pourcentage</Label>
          <Input
            id="discount-percentage"
            name="percentageValue"
            type="number"
            min={0}
            max={100}
            step="0.01"
            placeholder="10"
            required
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discount-fixed-amount">Montant</Label>
          <Input
            id="discount-fixed-amount"
            name="fixedAmountValue"
            type="number"
            min={0}
            step="0.01"
            placeholder="10"
            required
          />
        </div>
      )}

      {automationEnabled ? (
        <label className="flex items-start gap-3 rounded-xl border border-surface-border/60 bg-white/70 p-3 text-sm text-foreground sm:col-span-2">
          <input className="mt-0.5 size-4" name="isAutomatic" type="checkbox" value="true" />
          <span>
            Application automatique
            <span className="block text-xs text-muted-foreground">
              Applique cette remise automatiquement au checkout si aucun code manuel valide n&apos;est utilisé.
            </span>
          </span>
        </label>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit">{automationEnabled ? "Créer la remise" : "Créer le code promo"}</Button>
      </div>
    </form>
  );
}
