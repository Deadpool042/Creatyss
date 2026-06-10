"use client";

import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { createAdminUserAction } from "@/features/admin/settings/actions/create-admin-user.action";

type State = { status: "idle" | "success" | "error"; message: string };

const INITIAL: State = { status: "idle", message: "" };

export function CreateAdminUserDrawer() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>(INITIAL);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createAdminUserAction(formData);
      setState(result);
      if (result.status === "success") {
        setOpen(false);
        setState(INITIAL);
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setState(INITIAL);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <UserPlus className="size-3.5" />
          Ajouter un membre
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Ajouter un membre</SheetTitle>
          <SheetDescription>
            Crée un accès admin local. Aucun email d&apos;invitation n&apos;est envoyé — transmettez
            les identifiants manuellement.
          </SheetDescription>
        </SheetHeader>

        <form action={handleSubmit} className="mt-6 flex flex-col gap-5 px-1">
          <AdminFormField label="Adresse email" required>
            {({ ...controlProps }) => (
              <Input
                {...controlProps}
                name="email"
                type="email"
                autoComplete="off"
                placeholder="membre@exemple.com"
                disabled={isPending}
              />
            )}
          </AdminFormField>

          <AdminFormField label="Nom affiché" required>
            {({ ...controlProps }) => (
              <Input
                {...controlProps}
                name="displayName"
                type="text"
                autoComplete="off"
                placeholder="Prénom Nom"
                disabled={isPending}
              />
            )}
          </AdminFormField>

          <AdminFormField
            label="Mot de passe"
            description="Minimum 12 caractères."
            required
          >
            {({ ...controlProps }) => (
              <Input
                {...controlProps}
                name="password"
                type="password"
                autoComplete="new-password"
                disabled={isPending}
              />
            )}
          </AdminFormField>

          <AdminFormField label="Confirmation du mot de passe" required>
            {({ ...controlProps }) => (
              <Input
                {...controlProps}
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={isPending}
              />
            )}
          </AdminFormField>

          {state.status === "error" && (
            <p className="rounded-lg bg-feedback-error-surface/60 px-3 py-2 text-[13px] text-feedback-error-foreground">
              {state.message}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Création…" : "Créer le compte"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
