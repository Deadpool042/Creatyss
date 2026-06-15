"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleDiscountStatusAction } from "@/features/admin/marketing/discounts/actions/toggle-discount-status.action";
import type { AdminDiscountSummary } from "@/features/admin/marketing/discounts/types/admin-discount.types";

type AdminDiscountsListProps = {
  discounts: ReadonlyArray<AdminDiscountSummary>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

type DiscountBadgeVariant = "secondary" | "outline" | "destructive" | "default";

function getStatusLabel(status: AdminDiscountSummary["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archivé";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getStatusBadgeVariant(status: AdminDiscountSummary["status"]): DiscountBadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "ARCHIVED":
      return "destructive";
    case "INACTIVE":
    case "DRAFT":
    default:
      return "outline";
  }
}

function getTypeLabel(discount: AdminDiscountSummary): string {
  if (discount.type === "PERCENTAGE") {
    return `${discount.percentageValue ?? 0}%`;
  }

  if (discount.type === "FIXED_AMOUNT") {
    return `${(discount.fixedAmountValue ?? 0).toFixed(2)} ${discount.currencyCode ?? ""}`.trim();
  }

  return "Livraison offerte";
}

function DiscountRow({ discount }: { discount: AdminDiscountSummary }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    discount.status,
    (_prev: AdminDiscountSummary["status"], next: AdminDiscountSummary["status"]) => next
  );

  const isActive = optimisticStatus === "ACTIVE";

  function handleToggle() {
    startTransition(async () => {
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      await toggleDiscountStatusAction(discount.id);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-semibold text-foreground">{discount.code}</span>
          <Badge variant={getStatusBadgeVariant(optimisticStatus)}>{getStatusLabel(optimisticStatus)}</Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{discount.name}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Remise : {getTypeLabel(discount)}</span>
          <span>Créé le {dateFormatter.format(new Date(discount.createdAt))}</span>
        </div>
      </div>
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
        {isActive ? "Désactiver" : "Activer"}
      </Button>
    </div>
  );
}

export function AdminDiscountsList({ discounts }: AdminDiscountsListProps) {
  if (discounts.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucun code promo pour le moment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {discounts.map((discount) => (
        <DiscountRow key={discount.id} discount={discount} />
      ))}
    </div>
  );
}
