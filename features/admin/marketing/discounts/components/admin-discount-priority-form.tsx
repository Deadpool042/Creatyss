"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateDiscountPriorityAction } from "@/features/admin/marketing/discounts/actions/update-discount-priority.action";

type AdminDiscountPriorityFormProps = {
  discountId: string;
  currentPriority: number;
};

export function AdminDiscountPriorityForm({
  discountId,
  currentPriority,
}: AdminDiscountPriorityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [optimisticPriority, setOptimisticPriority] = useOptimistic(
    currentPriority,
    (_prev: number, next: number) => next
  );

  function handleSubmit(formData: FormData) {
    const raw = String(formData.get("priority") ?? "").trim();
    const value = parseInt(raw, 10);

    if (!Number.isInteger(value) || value < 0) {
      setErrorMessage("La priorité doit être un entier positif ou nul.");
      return;
    }

    startTransition(async () => {
      setErrorMessage(null);
      setOptimisticPriority(value);
      const result = await updateDiscountPriorityAction(discountId, value);

      if (!result.ok) {
        setErrorMessage(result.error);
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="grid gap-2">
      <div className="flex items-center gap-3">
        <Input
          type="number"
          name="priority"
          defaultValue={optimisticPriority}
          min={0}
          step={1}
          className="w-24"
          aria-label="Priorité de la remise"
          disabled={isPending}
        />
        <Button type="submit" variant="outline" size="sm" disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
    </form>
  );
}
