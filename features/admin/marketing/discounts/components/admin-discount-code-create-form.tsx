"use client";

import { useRef, useTransition } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createDiscountCodeAction } from "@/features/admin/marketing/discounts/actions/create-discount-code.action";

type AdminDiscountCodeCreateFormProps = {
  discountId: string;
  /** Limite par code héritée du Discount parent — affichée comme info. */
  maxRedemptionsPerCode: number | null;
};

export function AdminDiscountCodeCreateForm({
  discountId,
  maxRedemptionsPerCode,
}: AdminDiscountCodeCreateFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createDiscountCodeAction(discountId, formData);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <AdminFormField
        htmlFor="discount-code-code"
        label="Code secondaire"
        required
        hint={
          maxRedemptionsPerCode !== null ? (
            <span>Limite par code héritée de la remise parente : {maxRedemptionsPerCode}</span>
          ) : undefined
        }
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-code-code"
            name="code"
            placeholder="PROMO-ABC123"
            maxLength={40}
            disabled={isPending}
          />
        )}
      </AdminFormField>

      <AdminFormField
        htmlFor="discount-code-max-redemptions"
        label="Limite d'utilisations"
        hint={<span>Laisser vide pour illimité.</span>}
      >
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-code-max-redemptions"
            name="maxRedemptions"
            type="number"
            min={1}
            step={1}
            placeholder="100"
            disabled={isPending}
          />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="discount-code-starts-at" label="Date de début">
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-code-starts-at"
            name="startsAt"
            type="datetime-local"
            disabled={isPending}
          />
        )}
      </AdminFormField>

      <AdminFormField htmlFor="discount-code-ends-at" label="Date de fin">
        {(controlProps) => (
          <Input
            {...controlProps}
            id="discount-code-ends-at"
            name="endsAt"
            type="datetime-local"
            disabled={isPending}
          />
        )}
      </AdminFormField>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Création…" : "Créer le code"}
        </Button>
      </div>
    </form>
  );
}
