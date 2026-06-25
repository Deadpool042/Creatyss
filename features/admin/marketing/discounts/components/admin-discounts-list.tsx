"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/tables/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleDiscountStatusAction } from "@/features/admin/marketing/discounts/actions/toggle-discount-status.action";
import { getAdminDiscountDetailPath } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import type { AdminDiscountSummary } from "@/features/admin/marketing/discounts/types/admin-discount.types";
import { cn } from "@/lib/utils";

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

function getValidityLabel(discount: AdminDiscountSummary): string {
  if (discount.startsAt === null && discount.endsAt === null) {
    return "Toujours";
  }

  if (discount.startsAt !== null && discount.endsAt !== null) {
    return `${dateFormatter.format(discount.startsAt)} → ${dateFormatter.format(discount.endsAt)}`;
  }

  if (discount.startsAt !== null) {
    return `À partir du ${dateFormatter.format(discount.startsAt)}`;
  }

  return `Jusqu'au ${dateFormatter.format(discount.endsAt!)}`;
}

function getUsageLabel(discount: AdminDiscountSummary): string {
  if (discount.maxRedemptions === null) {
    return `${discount.redemptionsCount} / illimité`;
  }

  return `${discount.redemptionsCount} / ${discount.maxRedemptions}`;
}

function DiscountStatusBadge({
  status,
}: {
  status: AdminDiscountSummary["status"];
}) {
  return <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>;
}

function DiscountToggleButton({ discount }: { discount: AdminDiscountSummary }) {
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
    <div className="flex items-center gap-2">
      <DiscountStatusBadge status={optimisticStatus} />
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
        {isActive ? "Désactiver" : "Activer"}
      </Button>
    </div>
  );
}

function DiscountMobileCard({ discount }: { discount: AdminDiscountSummary }) {
  return (
    <article className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-sm font-semibold text-foreground">{discount.code}</p>
            <Badge variant="outline">{discount.isAutomatic ? "Automatique" : "Code manuel"}</Badge>
            {discount.isAutomatic ? (
              <Badge variant="outline">Priorité {discount.priority}</Badge>
            ) : null}
            {discount.codesCount > 0 ? (
              <Badge variant="outline">
                {discount.codesCount} code{discount.codesCount > 1 ? "s" : ""} secondaire{discount.codesCount > 1 ? "s" : ""}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-foreground">{discount.name}</p>
        </div>
        <DiscountStatusBadge status={discount.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Type</span>
          <span className="text-foreground">{discount.type === "FREE_SHIPPING" ? "Livraison" : discount.type === "FIXED_AMOUNT" ? "Montant fixe" : "Pourcentage"}</span>
        </div>
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Valeur</span>
          <span className="text-foreground">{getTypeLabel(discount)}</span>
        </div>
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Validité</span>
          <span className="text-foreground">{getValidityLabel(discount)}</span>
        </div>
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Utilisations</span>
          <span className="text-foreground">{getUsageLabel(discount)}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          <Button asChild type="button" variant="secondary" size="sm">
            <Link href={getAdminDiscountDetailPath(discount.id)}>Voir le detail</Link>
          </Button>
          <DiscountToggleButton discount={discount} />
        </div>
      </div>
    </article>
  );
}

export function AdminDiscountsList({ discounts }: AdminDiscountsListProps) {
  if (discounts.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune remise pour le moment.
      </p>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <AdminTable
          className="min-w-full"
          wrapperClassName="rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm"
        >
          <AdminTableHeader>
            <AdminTableRow className="hover:bg-transparent">
              <AdminTableHead>Code</AdminTableHead>
              <AdminTableHead>Type</AdminTableHead>
              <AdminTableHead>Valeur</AdminTableHead>
              <AdminTableHead>Validité</AdminTableHead>
              <AdminTableHead>Statut</AdminTableHead>
              <AdminTableHead>Utilisations</AdminTableHead>
              <AdminTableHead className="text-right">Action</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {discounts.map((discount) => (
              <AdminTableRow key={discount.id}>
                <AdminTableCell>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {discount.code}
                      </span>
                      <Badge variant="outline">
                        {discount.isAutomatic ? "Automatique" : "Code manuel"}
                      </Badge>
                      {discount.isAutomatic ? (
                        <Badge variant="outline">Priorité {discount.priority}</Badge>
                      ) : null}
                      {discount.codesCount > 0 ? (
                        <Badge variant="outline">
                          {discount.codesCount} code{discount.codesCount > 1 ? "s" : ""} secondaire{discount.codesCount > 1 ? "s" : ""}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{discount.name}</p>
                  </div>
                </AdminTableCell>
                <AdminTableCell className="text-foreground">
                  {discount.type === "FREE_SHIPPING"
                    ? "Livraison"
                    : discount.type === "FIXED_AMOUNT"
                      ? "Montant fixe"
                      : "Pourcentage"}
                </AdminTableCell>
                <AdminTableCell className="text-foreground">{getTypeLabel(discount)}</AdminTableCell>
                <AdminTableCell className="text-muted-foreground">
                  <div className="grid gap-1">
                    <span>{getValidityLabel(discount)}</span>
                    {discount.maxRedemptions !== null ? (
                      <span className="text-xs">Limite totale : {discount.maxRedemptions}</span>
                    ) : null}
                    {discount.maxRedemptionsPerCode !== null ? (
                      <span className="text-xs">Limite par code : {discount.maxRedemptionsPerCode}</span>
                    ) : null}
                    {discount.maxRedemptionsPerUser !== null ? (
                      <span className="text-xs">Limite par client : {discount.maxRedemptionsPerUser}</span>
                    ) : null}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <DiscountStatusBadge status={discount.status} />
                </AdminTableCell>
                <AdminTableCell className="text-foreground">{getUsageLabel(discount)}</AdminTableCell>
                <AdminTableCell className="text-right">
                  <div className={cn("flex justify-end gap-2")}>
                    <Button asChild type="button" variant="secondary" size="sm">
                      <Link href={getAdminDiscountDetailPath(discount.id)}>Detail</Link>
                    </Button>
                    <DiscountToggleButton discount={discount} />
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="grid gap-3 md:hidden">
        {discounts.map((discount) => (
          <DiscountMobileCard key={discount.id} discount={discount} />
        ))}
      </div>
    </>
  );
}
