"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { Plus } from "lucide-react";

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
import { togglePublicEventStatusAction } from "@/features/admin/marketing/public-events/actions/toggle-public-event-status.action";
import { getAdminPublicEventDetailPath } from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";
import type { AdminPublicEventSummary } from "@/features/admin/marketing/public-events/queries/list-admin-public-events.query";

type AdminPublicEventsPanelProps = Readonly<{
  publicEvents: ReadonlyArray<AdminPublicEventSummary>;
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

type StatusBadgeVariant = "secondary" | "outline" | "destructive" | "default";

function getStatusLabel(status: AdminPublicEventSummary["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "CANCELLED":
      return "Annulé";
    case "COMPLETED":
      return "Terminé";
    case "ARCHIVED":
      return "Archivé";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getStatusBadgeVariant(status: AdminPublicEventSummary["status"]): StatusBadgeVariant {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "CANCELLED":
    case "ARCHIVED":
      return "destructive";
    default:
      return "outline";
  }
}

function getValidityLabel(publicEvent: AdminPublicEventSummary): string {
  if (publicEvent.endsAt === null) {
    return dateFormatter.format(publicEvent.startsAt);
  }

  return `${dateFormatter.format(publicEvent.startsAt)} → ${dateFormatter.format(publicEvent.endsAt)}`;
}

function PublicEventStatusBadge({ status }: { status: AdminPublicEventSummary["status"] }) {
  return <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>;
}

function PublicEventToggleButton({ publicEvent }: { publicEvent: AdminPublicEventSummary }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    publicEvent.status,
    (_prev: AdminPublicEventSummary["status"], next: AdminPublicEventSummary["status"]) => next
  );

  const isActive = optimisticStatus === "ACTIVE";

  function handleToggle() {
    startTransition(async () => {
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      await togglePublicEventStatusAction(publicEvent.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <PublicEventStatusBadge status={optimisticStatus} />
      <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleToggle}>
        {isActive ? "Désactiver" : "Activer"}
      </Button>
    </div>
  );
}

export function AdminPublicEventsPanel({ publicEvents }: AdminPublicEventsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/admin/marketing/marches/nouveau">
            <Plus className="size-3.5" />
            Nouveau marché
          </Link>
        </Button>
      </div>

      {publicEvents.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Aucun marché pour le moment.
        </p>
      ) : (
        <>
          <div className="hidden md:block">
            <AdminTable
              className="min-w-full"
              wrapperClassName="rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm"
            >
              <AdminTableHeader>
                <AdminTableRow className="hover:bg-transparent">
                  <AdminTableHead>Titre</AdminTableHead>
                  <AdminTableHead>Dates</AdminTableHead>
                  <AdminTableHead>Lieu</AdminTableHead>
                  <AdminTableHead>Statut</AdminTableHead>
                  <AdminTableHead className="text-right">Action</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {publicEvents.map((publicEvent) => (
                  <AdminTableRow key={publicEvent.id}>
                    <AdminTableCell>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{publicEvent.title}</p>
                        {publicEvent.hasSpecialConditions ? (
                          <Badge variant="outline" className="mt-1">
                            Conditions spéciales
                          </Badge>
                        ) : null}
                      </div>
                    </AdminTableCell>
                    <AdminTableCell className="text-muted-foreground">
                      {getValidityLabel(publicEvent)}
                    </AdminTableCell>
                    <AdminTableCell className="text-foreground">
                      {publicEvent.locationName ?? "—"}
                    </AdminTableCell>
                    <AdminTableCell>
                      <PublicEventStatusBadge status={publicEvent.status} />
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild type="button" variant="secondary" size="sm">
                          <Link href={getAdminPublicEventDetailPath(publicEvent.id)}>Detail</Link>
                        </Button>
                        <PublicEventToggleButton publicEvent={publicEvent} />
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          </div>

          <div className="grid gap-3 md:hidden">
            {publicEvents.map((publicEvent) => (
              <article
                key={publicEvent.id}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{publicEvent.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getValidityLabel(publicEvent)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {publicEvent.locationName ?? "—"}
                    </p>
                  </div>
                  <PublicEventStatusBadge status={publicEvent.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild type="button" variant="secondary" size="sm">
                    <Link href={getAdminPublicEventDetailPath(publicEvent.id)}>Voir le détail</Link>
                  </Button>
                  <PublicEventToggleButton publicEvent={publicEvent} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
