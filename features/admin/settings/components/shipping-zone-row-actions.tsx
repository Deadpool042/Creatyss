"use client";

import { useRef } from "react";
import { MoreHorizontal, CheckCircle2, XCircle, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminShippingZoneSummary } from "@/features/admin/settings/queries/list-admin-shipping-zones.query";
import { updateShippingZoneStatusAction } from "@/features/admin/settings/actions/update-shipping-zone-status.action";

type ShippingZoneRowActionsProps = Readonly<{ zone: AdminShippingZoneSummary }>;

export function ShippingZoneRowActions({ zone }: ShippingZoneRowActionsProps) {
  const activateRef = useRef<HTMLFormElement>(null);
  const deactivateRef = useRef<HTMLFormElement>(null);
  const archiveRef = useRef<HTMLFormElement>(null);

  const canActivate = zone.status === "INACTIVE";
  const canDeactivate = zone.status === "ACTIVE";
  const canArchive = zone.status === "ACTIVE" || zone.status === "INACTIVE";

  if (zone.status === "ARCHIVED") {
    return null;
  }

  return (
    <>
      <form ref={activateRef} action={updateShippingZoneStatusAction}>
        <input type="hidden" name="id" value={zone.id} />
        <input type="hidden" name="nextStatus" value="ACTIVE" />
      </form>
      <form ref={deactivateRef} action={updateShippingZoneStatusAction}>
        <input type="hidden" name="id" value={zone.id} />
        <input type="hidden" name="nextStatus" value="INACTIVE" />
      </form>
      <form ref={archiveRef} action={updateShippingZoneStatusAction}>
        <input type="hidden" name="id" value={zone.id} />
        <input type="hidden" name="nextStatus" value="ARCHIVED" />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-muted-foreground data-[state=open]:border-control-border-strong data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions {zone.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {canActivate && (
            <DropdownMenuItem onClick={() => activateRef.current?.requestSubmit()}>
              <CheckCircle2 className="mr-2 size-3.5 text-feedback-success-foreground" />
              Activer
            </DropdownMenuItem>
          )}
          {canDeactivate && (
            <DropdownMenuItem onClick={() => deactivateRef.current?.requestSubmit()}>
              <XCircle className="mr-2 size-3.5 text-muted-foreground" />
              Désactiver
            </DropdownMenuItem>
          )}
          {canArchive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => archiveRef.current?.requestSubmit()}
                className="text-destructive focus:text-destructive"
              >
                <Archive className="mr-2 size-3.5" />
                Archiver
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
