"use client";

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
import { toggleDiscountCodeStatusAction } from "@/features/admin/marketing/discounts/actions/toggle-discount-code-status.action";
import type { AdminDiscountCode } from "@/features/admin/marketing/discounts/types/admin-discount.types";

type AdminDiscountCodesListProps = {
  discountId: string;
  codes: ReadonlyArray<AdminDiscountCode>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

function getCodeStatusLabel(status: AdminDiscountCode["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "EXPIRED":
      return "Expiré";
    case "ARCHIVED":
      return "Archivé";
  }
}

function getCodeStatusVariant(
  status: AdminDiscountCode["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "ARCHIVED":
    case "EXPIRED":
      return "destructive";
    case "INACTIVE":
    default:
      return "outline";
  }
}

function DiscountCodeRow({ discountId, code }: { discountId: string; code: AdminDiscountCode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    code.status,
    (_prev: AdminDiscountCode["status"], next: AdminDiscountCode["status"]) => next
  );

  const isActive = optimisticStatus === "ACTIVE";
  const canToggle = optimisticStatus === "ACTIVE" || optimisticStatus === "INACTIVE";

  function handleToggle() {
    startTransition(async () => {
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      await toggleDiscountCodeStatusAction(discountId, code.id);
      router.refresh();
    });
  }

  return (
    <AdminTableRow>
      <AdminTableCell>
        <span className="font-mono text-sm font-semibold text-foreground">{code.code}</span>
      </AdminTableCell>
      <AdminTableCell>
        <Badge variant={getCodeStatusVariant(optimisticStatus)}>
          {getCodeStatusLabel(optimisticStatus)}
        </Badge>
      </AdminTableCell>
      <AdminTableCell className="text-foreground">
        {code.redeemedCount} / {code.maxRedemptions !== null ? code.maxRedemptions : "illimité"}
      </AdminTableCell>
      <AdminTableCell className="text-muted-foreground text-sm">
        {code.startsAt !== null || code.endsAt !== null ? (
          <>
            {code.startsAt !== null ? dateFormatter.format(code.startsAt) : "—"}
            {" → "}
            {code.endsAt !== null ? dateFormatter.format(code.endsAt) : "—"}
          </>
        ) : (
          "Toujours"
        )}
      </AdminTableCell>
      <AdminTableCell className="text-right">
        {canToggle ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleToggle}
          >
            {isActive ? "Désactiver" : "Activer"}
          </Button>
        ) : null}
      </AdminTableCell>
    </AdminTableRow>
  );
}

function DiscountCodeMobileCard({
  discountId,
  code,
}: {
  discountId: string;
  code: AdminDiscountCode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    code.status,
    (_prev: AdminDiscountCode["status"], next: AdminDiscountCode["status"]) => next
  );

  const isActive = optimisticStatus === "ACTIVE";
  const canToggle = optimisticStatus === "ACTIVE" || optimisticStatus === "INACTIVE";

  function handleToggle() {
    startTransition(async () => {
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      await toggleDiscountCodeStatusAction(discountId, code.id);
      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm font-semibold text-foreground">{code.code}</span>
        <Badge variant={getCodeStatusVariant(optimisticStatus)}>
          {getCodeStatusLabel(optimisticStatus)}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Utilisations</span>
          <span className="text-foreground">
            {code.redeemedCount} / {code.maxRedemptions !== null ? code.maxRedemptions : "illimité"}
          </span>
        </div>
        <div className="grid gap-0.5">
          <span className="text-muted-foreground/60">Validité</span>
          <span className="text-foreground">
            {code.startsAt !== null || code.endsAt !== null ? (
              <>
                {code.startsAt !== null ? dateFormatter.format(code.startsAt) : "—"}
                {" → "}
                {code.endsAt !== null ? dateFormatter.format(code.endsAt) : "—"}
              </>
            ) : (
              "Toujours"
            )}
          </span>
        </div>
      </div>
      {canToggle ? (
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleToggle}
          >
            {isActive ? "Désactiver" : "Activer"}
          </Button>
        </div>
      ) : null}
    </article>
  );
}

export function AdminDiscountCodesList({ discountId, codes }: AdminDiscountCodesListProps) {
  if (codes.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Aucun code secondaire pour le moment.
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
              <AdminTableHead>Statut</AdminTableHead>
              <AdminTableHead>Utilisations</AdminTableHead>
              <AdminTableHead>Validité</AdminTableHead>
              <AdminTableHead className="text-right">Action</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {codes.map((code) => (
              <DiscountCodeRow key={code.id} discountId={discountId} code={code} />
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="grid gap-3 md:hidden">
        {codes.map((code) => (
          <DiscountCodeMobileCard key={code.id} discountId={discountId} code={code} />
        ))}
      </div>
    </>
  );
}
