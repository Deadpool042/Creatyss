import Link from "next/link";
import { FileText, Scale } from "lucide-react";

import { AdminStatusBadge, type AdminStatusVariant } from "@/components/admin/shared/admin-status-badge";
import { cn } from "@/lib/utils";

import type { AdminPagesListItem, AdminPageStatus } from "../types";

const STATUS_VARIANTS: Record<AdminPageStatus, AdminStatusVariant> = {
  DRAFT: "draft",
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

type PagesListProps = {
  pages: ReadonlyArray<AdminPagesListItem>;
};

/**
 * Liste des pages admin. Chaque ligne mène au détail /admin/content/pages/[id].
 */
export function PagesList({ pages }: PagesListProps) {
  return (
    <div className="divide-y divide-surface-border/40">
      {pages.map((page) => {
        const Icon = page.isSystemPage ? Scale : FileText;

        return (
          <div key={page.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            {/* Icône */}
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border",
                page.status === "ACTIVE" && !page.bodyIsEmpty
                  ? "border-feedback-success-border bg-feedback-success-surface/40 text-feedback-success-foreground"
                  : "border-surface-border/60 bg-surface-subtle text-muted-foreground/50"
              )}
            >
              <Icon className="size-4" />
            </div>

            {/* Titre + meta */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/content/pages/${page.id}`}
                  className="text-[13px] font-medium text-foreground hover:underline underline-offset-4"
                >
                  {page.title}
                </Link>
                {page.isSystemPage ? (
                  <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-surface-subtle px-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Page système
                  </span>
                ) : null}
                {page.bodyIsEmpty ? (
                  <span className="inline-flex h-5 shrink-0 items-center rounded-md bg-feedback-warning-surface/60 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-feedback-warning-foreground">
                    À compléter
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                /{page.slug}
                {" · "}
                Modifiée le {dateFormatter.format(new Date(page.updatedAt))}
              </p>
            </div>

            {/* Statut */}
            <AdminStatusBadge status={STATUS_VARIANTS[page.status]} className="mt-1 shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
