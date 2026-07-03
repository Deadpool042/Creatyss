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
import type { AdminShippingMethodSummary } from "@/features/admin/settings/queries/list-admin-shipping-zones.query";
import { updateShippingMethodStatusAction } from "@/features/admin/settings/actions/update-shipping-method-status.action";

type ShippingMethodRowActionsProps = Readonly<{ method: AdminShippingMethodSummary }>;

export function ShippingMethodRowActions({ method }: ShippingMethodRowActionsProps) {
  const activateRef = useRef<HTMLFormElement>(null);
  const deactivateRef = useRef<HTMLFormElement>(null);
  const archiveRef = useRef<HTMLFormElement>(null);

  const canActivate = method.status === "DRAFT" || method.status === "INACTIVE";
  const canDeactivate = method.status === "ACTIVE";
  const canArchive =
    method.status === "DRAFT" || method.status === "ACTIVE" || method.status === "INACTIVE";

  if (method.status === "ARCHIVED") {
    return null;
  }

  return (
    <>
      <form ref={activateRef} action={updateShippingMethodStatusAction}>
        <input type="hidden" name="id" value={method.id} />
        <input type="hidden" name="nextStatus" value="ACTIVE" />
      </form>
      <form ref={deactivateRef} action={updateShippingMethodStatusAction}>
        <input type="hidden" name="id" value={method.id} />
        <input type="hidden" name="nextStatus" value="INACTIVE" />
      </form>
      <form ref={archiveRef} action={updateShippingMethodStatusAction}>
        <input type="hidden" name="id" value={method.id} />
        <input type="hidden" name="nextStatus" value="ARCHIVED" />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground"
          >
            <MoreHorizontal className="size-3.5" />
            <span className="sr-only">Actions {method.name}</span>
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
