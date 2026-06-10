"use client";

import { useState, useTransition } from "react";
import { Check, Copy, KeyRound, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { createApiClientAction } from "@/features/admin/settings/actions/create-api-client.action";

type IdleState = { step: "form"; error?: string };
type SecretState = { step: "secret"; secret: string };
type DrawerState = IdleState | SecretState;

const INITIAL: DrawerState = { step: "form" };

export function CreateApiClientDrawer() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<DrawerState>(INITIAL);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createApiClientAction(formData);
      if (result.status === "error") {
        setState({ step: "form", error: result.message });
      } else if (result.secret) {
        setState({ step: "secret", secret: result.secret });
      }
    });
  }

  function handleCopy() {
    if (state.step !== "secret") return;
    void navigator.clipboard.writeText(state.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setState(INITIAL);
      setCopied(false);
    }
  }

  function handleDone() {
    setOpen(false);
    setState(INITIAL);
    setCopied(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <KeyRound className="size-3.5" />
          Nouvelle clé API
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm">
        {state.step === "form" ? (
          <>
            <SheetHeader>
              <SheetTitle>Nouvelle clé API</SheetTitle>
              <SheetDescription>
                Crée un client API pour une intégration tierce. Le secret ne sera affiché qu&apos;une
                seule fois à la création.
              </SheetDescription>
            </SheetHeader>

            <form action={handleSubmit} className="mt-6 flex flex-col gap-5 px-1">
              <AdminFormField label="Nom" required>
                {({ ...controlProps }) => (
                  <Input
                    {...controlProps}
                    name="name"
                    type="text"
                    autoComplete="off"
                    placeholder="Mon intégration"
                    disabled={isPending}
                  />
                )}
              </AdminFormField>

              <AdminFormField
                label="Code"
                description="Identifiant technique. Lettres minuscules, chiffres, tirets et underscores."
                required
              >
                {({ ...controlProps }) => (
                  <Input
                    {...controlProps}
                    name="code"
                    type="text"
                    autoComplete="off"
                    placeholder="mon-integration"
                    disabled={isPending}
                  />
                )}
              </AdminFormField>

              <AdminFormField label="Description">
                {({ ...controlProps }) => (
                  <Textarea
                    {...controlProps}
                    name="description"
                    rows={3}
                    placeholder="Usage ou contexte (optionnel)"
                    disabled={isPending}
                  />
                )}
              </AdminFormField>

              {state.error && (
                <p className="rounded-lg bg-feedback-error-surface/60 px-3 py-2 text-[13px] text-feedback-error-foreground">
                  {state.error}
                </p>
              )}

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Création…" : "Créer le client"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Secret généré</SheetTitle>
              <SheetDescription>
                Copiez ce secret maintenant. Il ne sera plus affiché.
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-4 px-1">
              <div className="flex items-start gap-2 rounded-lg border border-feedback-warning-border/50 bg-feedback-warning-surface/40 px-3 py-2.5">
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-feedback-warning-foreground" />
                <p className="text-[13px] text-feedback-warning-foreground">
                  Ce secret ne sera plus affiché après fermeture. Conservez-le dans un endroit sécurisé.
                </p>
              </div>

              <div className="rounded-xl border border-surface-border/60 bg-surface-subtle p-3">
                <p className="break-all font-mono text-[12px] leading-relaxed text-foreground select-all">
                  {state.secret}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
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

              <Button type="button" className="w-full" onClick={handleDone}>
                J&apos;ai copié le secret
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
