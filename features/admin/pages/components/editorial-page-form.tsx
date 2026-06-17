"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminEditorialPageAction } from "../actions/update-admin-editorial-page.action";
import { toggleAdminEditorialPageStatusAction } from "../actions/toggle-admin-editorial-page-status.action";
import {
  ADMIN_EDITORIAL_PAGE_BODY_MAX_LENGTH,
  ADMIN_EDITORIAL_PAGE_TITLE_MAX_LENGTH,
  ADMIN_EDITORIAL_PAGE_SLUG_MAX_LENGTH,
  ADMIN_EDITORIAL_PAGE_EXCERPT_MAX_LENGTH,
  type AdminEditorialPageFormState,
} from "../schemas/admin-editorial-page.schema";
import type { AdminPageBodyFormState } from "../schemas/admin-page-body.schema";
import type { AdminPageStatus } from "../types";

const INITIAL_EDIT_STATE: AdminEditorialPageFormState = { status: "idle" };
const INITIAL_TOGGLE_STATE: AdminPageBodyFormState = { status: "idle" };

type EditorialPageFormProps = {
  pageId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: AdminPageStatus;
};

/**
 * Formulaire d'édition d'une page éditoriale (non système).
 * Champs éditables : title, slug, excerpt, body.
 * Toggle de publication inclus.
 */
export function EditorialPageForm({
  pageId,
  title,
  slug,
  excerpt,
  body,
  status,
}: EditorialPageFormProps) {
  const editAction = updateAdminEditorialPageAction.bind(null, pageId);
  const toggleAction = toggleAdminEditorialPageStatusAction.bind(null, pageId);

  const [editState, formAction, isEditPending] = useActionState(editAction, INITIAL_EDIT_STATE);
  const [toggleState, toggleFormAction, isTogglePending] = useActionState(
    toggleAction,
    INITIAL_TOGGLE_STATE
  );

  useEffect(() => {
    if (editState.status === "success") {
      toast.success(editState.message);
    } else if (editState.status === "error" && !editState.fieldErrors) {
      toast.error(editState.message);
    }
  }, [editState]);

  useEffect(() => {
    if (toggleState.status === "success") {
      toast.success(toggleState.message);
    } else if (toggleState.status === "error") {
      toast.error(toggleState.message);
    }
  }, [toggleState]);

  const fieldErrors =
    editState.status === "error" ? (editState.fieldErrors ?? {}) : {};

  const isActive = status === "ACTIVE";

  return (
    <div className="space-y-8">
      {/* Formulaire principal */}
      <form action={formAction}>
        {editState.status === "error" && !editState.fieldErrors ? (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
            <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
            <p className="text-sm text-feedback-error-foreground">{editState.message}</p>
          </div>
        ) : null}
        {editState.status === "success" ? (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
            <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
            <p className="text-sm text-feedback-success-foreground">{editState.message}</p>
          </div>
        ) : null}

        <div className="space-y-6">
          {/* Titre */}
          <AdminFormField
            label="Titre"
            htmlFor="title"
            error={fieldErrors.title}
          >
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={title}
              maxLength={ADMIN_EDITORIAL_PAGE_TITLE_MAX_LENGTH}
              placeholder="Ma page"
              className={cn(
                "h-9 w-full rounded-lg border border-control-border bg-control-surface px-3 text-sm shadow-control",
                "placeholder:text-muted-foreground/40 outline-none",
                "hover:border-control-border-strong hover:bg-control-surface-hover",
                "focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50",
                fieldErrors.title && "border-feedback-error"
              )}
            />
          </AdminFormField>

          {/* Slug */}
          <AdminFormField
            label="Slug"
            htmlFor="slug"
            description="URL de la page : minuscules, chiffres et tirets uniquement (ex. ma-page)."
            error={fieldErrors.slug}
          >
            <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-control-border bg-control-surface shadow-control focus-within:border-focus-ring focus-within:ring-3 focus-within:ring-focus-ring/50">
              <span className="shrink-0 border-r border-control-border/60 bg-surface-subtle px-3 py-2 text-sm text-muted-foreground/70 select-none">
                /
              </span>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={slug}
                maxLength={ADMIN_EDITORIAL_PAGE_SLUG_MAX_LENGTH}
                placeholder="ma-page"
                className={cn(
                  "h-9 flex-1 bg-transparent px-3 text-sm outline-none",
                  "placeholder:text-muted-foreground/40",
                  fieldErrors.slug && "border-feedback-error"
                )}
              />
            </div>
          </AdminFormField>

          {/* Résumé */}
          <AdminFormField
            label={
              <span>
                Résumé{" "}
                <span className="ml-1 text-[11px] font-normal text-muted-foreground/60">
                  (optionnel)
                </span>
              </span>
            }
            htmlFor="excerpt"
            description="Court texte d'accroche affiché dans les listes ou en meta description."
            error={fieldErrors.excerpt}
          >
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={excerpt ?? ""}
              maxLength={ADMIN_EDITORIAL_PAGE_EXCERPT_MAX_LENGTH}
              rows={3}
              placeholder="Un court résumé de la page…"
              className={cn(
                "resize-none",
                fieldErrors.excerpt && "border-feedback-error"
              )}
            />
          </AdminFormField>

          {/* Corps */}
          <AdminFormField
            label="Contenu"
            htmlFor="body"
            description="Texte brut. Les paragraphes sont séparés par une ligne vide. Laisser vide pour ne pas afficher de contenu."
            error={fieldErrors.body}
          >
            <Textarea
              id="body"
              name="body"
              defaultValue={body ?? ""}
              maxLength={ADMIN_EDITORIAL_PAGE_BODY_MAX_LENGTH}
              rows={20}
              className={cn(
                "min-h-72 font-normal leading-6",
                fieldErrors.body && "border-feedback-error"
              )}
            />
          </AdminFormField>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-surface-border/40 bg-page-background/90 px-0 py-4 backdrop-blur-sm">
          <Button type="submit" disabled={isEditPending} className="min-w-32 rounded-full">
            {isEditPending ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </form>

      {/* Zone publication */}
      <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Publication</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isActive
                ? "Cette page est actuellement publiée et visible publiquement."
                : "Cette page est en brouillon et non visible publiquement."}
            </p>
          </div>
          <form action={toggleFormAction} className="shrink-0">
            <Button
              type="submit"
              size="sm"
              variant={isActive ? "outline" : "default"}
              disabled={isTogglePending}
              className="rounded-full"
            >
              {isTogglePending ? "…" : isActive ? "Dépublier" : "Publier"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
