"use client";

import { useState, useTransition } from "react";
import { TriangleAlert, Copy, Check, Webhook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { createWebhookEndpointAction } from "@/features/admin/settings/webhooks/actions/create-webhook-endpoint.action";

type WebhookEndpointCreateFormProps = {
  initialSecret?: string | undefined;
};

export function WebhookEndpointCreateForm({ initialSecret }: WebhookEndpointCreateFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createWebhookEndpointAction(formData);
      // Si on reçoit un résultat, c'est que la création a échoué (le succès déclenche un redirect)
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  function handleCopy() {
    if (!initialSecret) return;
    void navigator.clipboard.writeText(initialSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Webhook className="size-4 text-primary/70" />
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Nouvel endpoint webhook
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Crée un endpoint sortant. Le secret HMAC ne sera affiché qu&apos;une seule fois à la
        création.
      </p>

      {initialSecret ? (
        <div className="mt-5 flex flex-col gap-3">
          <div className="flex items-start gap-2 rounded-lg border border-feedback-warning-border/50 bg-feedback-warning-surface/40 px-3 py-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-feedback-warning-foreground" />
            <p className="text-[13px] text-feedback-warning-foreground">
              Copiez ce secret maintenant — il ne sera plus affiché.
            </p>
          </div>
          <div className="rounded-xl border border-surface-border/60 bg-surface-subtle p-3">
            <p className="break-all font-mono text-[12px] leading-relaxed text-foreground select-all">
              {initialSecret}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-2"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-feedback-success-foreground" />
                Copié
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copier le secret
              </>
            )}
          </Button>
        </div>
      ) : null}

      <form action={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-3">
        <AdminFormField label="Nom" required>
          {({ ...controlProps }) => (
            <Input
              {...controlProps}
              name="name"
              type="text"
              autoComplete="off"
              placeholder="Mon endpoint"
              disabled={isPending}
            />
          )}
        </AdminFormField>

        <AdminFormField label="URL cible" required>
          {({ ...controlProps }) => (
            <Input
              {...controlProps}
              name="targetUrl"
              type="url"
              autoComplete="off"
              placeholder="https://example.com/webhook"
              disabled={isPending}
            />
          )}
        </AdminFormField>

        <AdminFormField label="Type d'événement" description='Ex : "order.created"' required>
          {({ ...controlProps }) => (
            <Input
              {...controlProps}
              name="eventType"
              type="text"
              autoComplete="off"
              placeholder="order.created"
              disabled={isPending}
            />
          )}
        </AdminFormField>

        {error ? (
          <p className="sm:col-span-3 rounded-lg border border-feedback-error-border bg-feedback-error-surface/60 px-3 py-2 text-[13px] text-feedback-error-foreground">
            {error}
          </p>
        ) : null}

        <div className="sm:col-span-3">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Création…" : "Créer l'endpoint"}
          </Button>
        </div>
      </form>
    </section>
  );
}
