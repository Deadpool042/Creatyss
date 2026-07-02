"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, Languages, PencilLine, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";

type ContentPageTranslationFieldState = {
  fieldName: string;
  label: string;
  group: string;
  multiline: boolean;
  sourceValue: string;
  translatedValue: string | null;
};

type ContentPageTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

type ContentPageTranslationsAction = (
  prevState: ContentPageTranslationsFormState,
  formData: FormData
) => Promise<ContentPageTranslationsFormState>;

type Props = {
  action: ContentPageTranslationsAction;
  targetLocaleName: string;
  fields: readonly ContentPageTranslationFieldState[];
};

const INITIAL: ContentPageTranslationsFormState = { status: "idle", message: "" };

function groupFields(
  fields: readonly ContentPageTranslationFieldState[]
): { group: string; fields: ContentPageTranslationFieldState[] }[] {
  const groups: { group: string; fields: ContentPageTranslationFieldState[] }[] = [];

  for (const field of fields) {
    const existing = groups.find((entry) => entry.group === field.group);

    if (existing) {
      existing.fields.push(field);
    } else {
      groups.push({ group: field.group, fields: [field] });
    }
  }

  return groups;
}

export function ContentPageTranslationsForm({ action, targetLocaleName, fields }: Props) {
  const [state, formAction, isPending] = useActionState(action, INITIAL);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    else if (state.status === "error") toast.error(state.message);
  }, [state]);

  const groups = groupFields(fields);
  const translatedCount = fields.filter(
    (field) => field.translatedValue !== null && field.translatedValue.trim() !== ""
  ).length;
  const emptyCount = fields.length - translatedCount;

  return (
    <form action={formAction} className="relative">
      {state.status === "success" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      )}
      {state.status === "error" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      )}

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Target locale
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {targetLocaleName}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Langue cible actuellement editee.
          </p>
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Strings translated
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {translatedCount}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Champs avec une valeur traduite enregistree.
          </p>
        </section>

        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-4 shadow-sm backdrop-blur-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Remaining
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{emptyCount}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Champs encore vides, qui retomberont sur la source.
          </p>
        </section>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {groups.map(({ group, fields: groupFieldsList }) => {
          const groupTranslatedCount = groupFieldsList.filter(
            (field) => field.translatedValue !== null && field.translatedValue.trim() !== ""
          ).length;

          return (
            <div
              key={group}
              className="rounded-full border border-surface-border/60 bg-surface-panel/60 px-3 py-1.5 text-xs text-muted-foreground shadow-sm"
            >
              <span className="font-medium text-foreground">{group}</span>
              <span className="mx-1 text-muted-foreground/40">·</span>
              <span>
                {groupTranslatedCount}/{groupFieldsList.length}
              </span>
            </div>
          );
        })}
      </div>

      <div className="divide-y divide-surface-border/40">
        {groups.map(({ group, fields: groupFieldsList }, index) => (
          <AdminFormSection
            key={group}
            eyebrow={`Section ${group}`}
            title={group}
            className={index === 0 ? "py-6 first:pt-0" : "py-6"}
          >
            {groupFieldsList.map((field) => (
              <AdminFormField
                key={field.fieldName}
                label={field.label}
                htmlFor={field.fieldName}
                description={
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      Cle: <code className="font-mono">{field.fieldName}</code>
                    </span>
                    {field.multiline ? (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Texte long
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Texte court
                      </Badge>
                    )}
                    {field.translatedValue && field.translatedValue.trim() !== "" ? (
                      <Badge
                        variant="outline"
                        className="border-feedback-success-border/60 bg-feedback-success-surface/30 text-feedback-success-foreground"
                      >
                        Traduit
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Fallback source
                      </Badge>
                    )}
                  </div>
                }
                className="rounded-2xl border border-surface-border/50 bg-surface-panel/40 p-4"
              >
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-2xl border border-surface-border/50 bg-surface-subtle/20 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Languages className="size-4 text-muted-foreground" />
                      <p className="text-xs font-medium text-foreground">Source</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {field.sourceValue || "Aucune valeur source."}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl border p-3",
                      field.translatedValue && field.translatedValue.trim() !== ""
                        ? "border-feedback-success-border/40 bg-feedback-success-surface/10"
                        : "border-surface-border/50 bg-surface-panel/20"
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <PencilLine className="size-4 text-muted-foreground" />
                      <p className="text-xs font-medium text-foreground">
                        Traduction ({targetLocaleName})
                      </p>
                    </div>
                    {field.multiline ? (
                      <Textarea
                        id={field.fieldName}
                        name={field.fieldName}
                        defaultValue={field.translatedValue ?? ""}
                        placeholder={`Traduction (${targetLocaleName})`}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={field.fieldName}
                        name={field.fieldName}
                        defaultValue={field.translatedValue ?? ""}
                        placeholder={`Traduction (${targetLocaleName})`}
                      />
                    )}
                  </div>
                </div>
              </AdminFormField>
            ))}
          </AdminFormSection>
        ))}
      </div>

      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-surface-border/40 bg-page-background/90 py-4 backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">
          Les champs vides utilisent automatiquement la valeur source.
        </p>
        <Button type="submit" disabled={isPending} className="min-w-32 rounded-full">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
