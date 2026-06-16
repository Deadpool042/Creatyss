"use client";

import { useActionState, useEffect, useRef, useState, type JSX } from "react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SeoSuggestionHistoryEntry } from "@/features/ai-assistance/queries";
import type { BlogPostSeoSuggestionActionState } from "@/features/admin/blog/actions/request-blog-post-seo-suggestion.action";
import { ProductSectionEyebrow } from "@/features/admin/products/components/shared/product-section-eyebrow";

type BlogSeoSuggestionAction = (
  prevState: BlogPostSeoSuggestionActionState,
  formData: FormData
) => Promise<BlogPostSeoSuggestionActionState>;

type BlogSeoFieldsWithAiProps = {
  postId: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  aiSuggestionEnabled: boolean;
  aiSuggestionAutomationEnabled: boolean;
  aiSuggestionHistoryEnabled: boolean;
  aiSuggestionHistory: SeoSuggestionHistoryEntry[];
  aiSuggestionAction: BlogSeoSuggestionAction;
};

const blogSeoSuggestionActionInitialState: BlogPostSeoSuggestionActionState = {
  status: "idle",
  message: null,
  suggestionTitle: "",
  suggestionDescription: "",
  taskId: null,
  strategy: null,
};

function BlogSeoSuggestionPanel({
  enabled,
  automationEnabled,
  formId,
  pending,
  state,
  onApplySuggestion,
}: {
  enabled: boolean;
  automationEnabled: boolean;
  formId: string;
  pending: boolean;
  state: BlogPostSeoSuggestionActionState;
  onApplySuggestion: (input: { title: string; description: string }) => void;
}): JSX.Element | null {
  if (!enabled) {
    return null;
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-brand/15 bg-brand/[0.03] p-4">
      <div className="grid gap-1">
        <ProductSectionEyebrow>Suggestion assistee</ProductSectionEyebrow>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Proposition SEO IA pour l&apos;article
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Genere une proposition manuelle pour le titre et la description SEO.
          Rien n&apos;est enregistre tant que vous n&apos;appliquez pas puis ne sauvegardez pas
          explicitement le formulaire.
        </p>
        {automationEnabled ? (
          <p className="text-xs leading-5 text-muted-foreground">
            En niveau automation, une premiere suggestion est preparee automatiquement
            quand aucun historique n&apos;existe encore pour cet article.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="secondary" size="sm" disabled={pending} form={formId}>
          {pending ? "Generation..." : "Suggérer avec l'IA"}
        </Button>
        {state.taskId ? (
          <p className="text-[11px] text-muted-foreground">Trace AiTask : {state.taskId}</p>
        ) : null}
      </div>

      <AdminFormMessage
        tone={state.status === "success" ? "success" : "error"}
        message={state.message}
      />

      {state.status === "success" &&
      state.suggestionTitle.trim().length > 0 &&
      state.suggestionDescription.trim().length > 0 ? (
        <div className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-4">
          <div className="grid gap-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Proposition
            </p>
            <p className="text-sm font-medium text-foreground">{state.suggestionTitle}</p>
            <p className="text-sm leading-6 text-muted-foreground">
              {state.suggestionDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={() =>
                onApplySuggestion({
                  title: state.suggestionTitle,
                  description: state.suggestionDescription,
                })
              }
            >
              Remplir les champs
            </Button>
            {state.strategy ? (
              <p className="text-[11px] text-muted-foreground">Strategie : {state.strategy}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function BlogSeoSuggestionHistory({
  enabled,
  entries,
  onApplySuggestion,
}: {
  enabled: boolean;
  entries: SeoSuggestionHistoryEntry[];
  onApplySuggestion: (input: { title: string; description: string }) => void;
}): JSX.Element | null {
  if (!enabled) {
    return null;
  }

  return (
    <section className="grid gap-4 rounded-2xl border border-surface-border/70 bg-background p-4">
      <div className="grid gap-1">
        <ProductSectionEyebrow>Historique assiste</ProductSectionEyebrow>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Suggestions SEO precedentes
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Reprenez une suggestion deja produite pour cet article, sans regeneration.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune suggestion SEO tracee pour cet article.
        </p>
      ) : (
        <div className="grid gap-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="grid gap-3 rounded-xl border border-surface-border/60 bg-surface/20 p-3"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span>{entry.createdAt.toLocaleString("fr-FR")}</span>
                <span>Statut : {entry.status}</span>
                {entry.strategy ? <span>Strategie : {entry.strategy}</span> : null}
                {entry.requestedByEmail ? <span>Par : {entry.requestedByEmail}</span> : null}
              </div>

              <div className="grid gap-1">
                <p className="text-sm font-medium text-foreground">{entry.seoTitle}</p>
                <p className="text-sm leading-6 text-muted-foreground">{entry.seoDescription}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onApplySuggestion({
                      title: entry.seoTitle,
                      description: entry.seoDescription,
                    })
                  }
                >
                  Reutiliser
                </Button>
                {entry.reviewRequired ? (
                  <p className="text-[11px] text-muted-foreground">
                    Validation editoriale requise avant enregistrement.
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function BlogSeoFieldsWithAi({
  postId,
  defaultSeoTitle,
  defaultSeoDescription,
  aiSuggestionEnabled,
  aiSuggestionAutomationEnabled,
  aiSuggestionHistoryEnabled,
  aiSuggestionHistory,
  aiSuggestionAction,
}: BlogSeoFieldsWithAiProps): JSX.Element {
  const [seoTitle, setSeoTitle] = useState(defaultSeoTitle);
  const [seoDescription, setSeoDescription] = useState(defaultSeoDescription);
  const [aiSuggestionState, aiSuggestionFormAction, aiSuggestionPending] = useActionState(
    aiSuggestionAction,
    blogSeoSuggestionActionInitialState
  );
  const aiSuggestionFormId = `blog-seo-ai-suggestion-${postId}`;
  const aiSuggestionAutoTriggeredRef = useRef(false);

  useEffect(() => {
    if (
      !aiSuggestionAutomationEnabled ||
      aiSuggestionAutoTriggeredRef.current ||
      aiSuggestionHistory.length > 0 ||
      aiSuggestionPending
    ) {
      return;
    }

    aiSuggestionAutoTriggeredRef.current = true;
    const formData = new FormData();
    formData.set("postId", postId);
    aiSuggestionFormAction(formData);
  }, [
    aiSuggestionAutomationEnabled,
    aiSuggestionFormAction,
    aiSuggestionHistory.length,
    aiSuggestionPending,
    postId,
  ]);

  return (
    <>
      <form id={aiSuggestionFormId} action={aiSuggestionFormAction}>
        <input type="hidden" name="postId" value={postId} />
      </form>

      <BlogSeoSuggestionPanel
        enabled={aiSuggestionEnabled}
        automationEnabled={aiSuggestionAutomationEnabled}
        formId={aiSuggestionFormId}
        pending={aiSuggestionPending}
        state={aiSuggestionState}
        onApplySuggestion={({ title, description }) => {
          setSeoTitle(title);
          setSeoDescription(description);
        }}
      />

      <BlogSeoSuggestionHistory
        enabled={aiSuggestionHistoryEnabled}
        entries={aiSuggestionHistory}
        onApplySuggestion={({ title, description }) => {
          setSeoTitle(title);
          setSeoDescription(description);
        }}
      />

      <AdminFormField htmlFor="blog-seo-title" label="Titre SEO">
        <Input
          id="blog-seo-title"
          name="seoTitle"
          type="text"
          value={seoTitle}
          onChange={(event) => setSeoTitle(event.target.value)}
        />
      </AdminFormField>

      <AdminFormField htmlFor="blog-seo-description" label="Description SEO">
        <Textarea
          id="blog-seo-description"
          name="seoDescription"
          rows={3}
          value={seoDescription}
          onChange={(event) => setSeoDescription(event.target.value)}
        />
      </AdminFormField>
    </>
  );
}
