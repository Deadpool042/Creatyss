"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminPageBodyAction } from "../actions/update-admin-page-body.action";
import {
  ADMIN_PAGE_BODY_MAX_LENGTH,
  type AdminPageBodyFormState,
} from "../schemas/admin-page-body.schema";

const INITIAL_STATE: AdminPageBodyFormState = { status: "idle" };

type PageBodyFormProps = {
  pageId: string;
  body: string;
};

/**
 * Form d'édition du corps d'une page système — Lot 5b.
 * Texte brut uniquement ; titre/code/slug verrouillés côté serveur.
 */
export function PageBodyForm({ pageId, body }: PageBodyFormProps) {
  const action = updateAdminPageBodyAction.bind(null, pageId);
  const [state, formAction, isPending] = useActionState(action, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldError) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = state.status === "error" ? state.fieldError : undefined;

  return (
    <form action={formAction} className="relative">
      {state.status === "error" && fieldError ? (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      ) : null}
      {state.status === "success" ? (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      ) : null}

      <AdminFormField
        label="Contenu de la page"
        htmlFor="body"
        description="Texte brut, sans mise en forme. Les paragraphes sont séparés par une ligne vide. Laisser vide pour dépublier le contenu."
        error={fieldError}
      >
        <Textarea
          id="body"
          name="body"
          defaultValue={body}
          maxLength={ADMIN_PAGE_BODY_MAX_LENGTH}
          rows={20}
          className={cn(
            "min-h-72 font-normal leading-6",
            fieldError && "border-feedback-error"
          )}
        />
      </AdminFormField>

      {/* ── Sticky footer ────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-surface-border/40 bg-page-background/90 px-0 py-4 backdrop-blur-sm">
        <Button type="submit" disabled={isPending} className="min-w-32 rounded-full">
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
