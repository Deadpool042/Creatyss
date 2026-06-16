"use client";

import { useRef } from "react";
import { MoreHorizontal, Star, CheckCircle2, XCircle, Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminPriceListSummary } from "@/features/admin/catalog/queries/list-admin-price-lists.query";
import { updatePriceListStatusAction } from "@/features/admin/catalog/actions/update-price-list-status.action";
import { setDefaultPriceListAction } from "@/features/admin/catalog/actions/set-default-price-list.action";

type PriceListRowActionsProps = Readonly<{ list: AdminPriceListSummary }>;

export function PriceListRowActions({ list }: PriceListRowActionsProps) {
  const activateRef = useRef<HTMLFormElement>(null);
  const deactivateRef = useRef<HTMLFormElement>(null);
  const archiveRef = useRef<HTMLFormElement>(null);
  const setDefaultRef = useRef<HTMLFormElement>(null);

  const canActivate = list.status === "DRAFT" || list.status === "INACTIVE";
  const canDeactivate = list.status === "ACTIVE";
  const canArchive = list.status === "DRAFT" || list.status === "ACTIVE" || list.status === "INACTIVE";
  const canSetDefault = list.status === "ACTIVE" && !list.isDefault;

  if (list.status === "ARCHIVED") {
    return null;
  }

  return (
    <>
      {/* Hidden forms */}
      <form ref={activateRef} action={updatePriceListStatusAction}>
        <input type="hidden" name="id" value={list.id} />
        <input type="hidden" name="nextStatus" value="ACTIVE" />
      </form>
      <form ref={deactivateRef} action={updatePriceListStatusAction}>
        <input type="hidden" name="id" value={list.id} />
        <input type="hidden" name="nextStatus" value="INACTIVE" />
      </form>
      <form ref={archiveRef} action={updatePriceListStatusAction}>
        <input type="hidden" name="id" value={list.id} />
        <input type="hidden" name="nextStatus" value="ARCHIVED" />
      </form>
      <form ref={setDefaultRef} action={setDefaultPriceListAction}>
        <input type="hidden" name="id" value={list.id} />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-muted-foreground data-[state=open]:border-control-border-strong data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Actions {list.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {canSetDefault && (
            <DropdownMenuItem onClick={() => setDefaultRef.current?.requestSubmit()}>
              <Star className="mr-2 size-3.5 text-feedback-success-foreground" />
              Définir par défaut
            </DropdownMenuItem>
          )}
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
