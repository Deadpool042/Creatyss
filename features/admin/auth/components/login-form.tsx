import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/components/theme/auth/auth-shell";
import Image from "next/image";

type LoginFormProps = {
  action: (formData: FormData) => Promise<void>;
  showError?: boolean;
};

function LoginSidebar() {
  return (
    <>
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-2 backdrop-blur">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/10 text-xs font-semibold tracking-[0.18em]">
            C
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/60">
              Administration
            </p>
            <p className="text-sm font-medium text-primary-foreground">
              Creatyss
            </p>
          </div>
        </div>

        <div className="max-w-xl space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/40">
            Espace interne
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary-foreground xl:text-5xl">
            Une interface sobre pour piloter la boutique avec clarté.
          </h1>
          <p className="max-w-lg text-base leading-7 text-primary-foreground/70">
            Gérez les produits, les contenus et les commandes depuis un espace
            pensé pour rester lisible, rapide et rassurant au quotidien.
          </p>
        </div>
      </div>

      <div className="grid max-w-xl gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/40">
            Catalogue
          </p>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
            Produits, variantes, médias et catégories.
          </p>
        </div>

        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/40">
            Contenu
          </p>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
            Page d'accueil éditable et blog administrable.
          </p>
        </div>

        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary-foreground/40">
            Opérations
          </p>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
            Suivi des commandes et workflows simples.
          </p>
        </div>
      </div>
    </>
  );
}

export function LoginForm({ action, showError = false }: LoginFormProps) {
  return (
    <AuthShell sidebar={<LoginSidebar />}>
      <Card className="overflow-hidden rounded-[28px] border border-border/80 bg-card/92 shadow-[0_20px_70px_-24px_rgba(0,0,0,0.22)] backdrop-blur-sm">
        <div className="h-1 w-full bg-linear-to-r from-foreground via-foreground/70 to-brand" />

        <CardHeader className="space-y-4 px-8 pb-6 pt-8">
          <div className="flex justify-center">
            <Image
              src="/uploads/logo.svg"
              alt="Creatyss Logo"
              width={150}
              height={150}
            />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
              Connexion sécurisée
            </p>
            <CardTitle className="text-3xl font-semibold tracking-tight text-foreground">
              Connexion
            </CardTitle>
            <CardDescription className="text-[15px] leading-7 text-muted-foreground">
              Connectez-vous pour accéder à l&apos;espace d&apos;administration
              Creatyss.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form
            action={action}
            className="space-y-6">
            <FieldGroup className="space-y-5">
              <Field className="space-y-2.5">
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-medium text-foreground">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 rounded-2xl border-border bg-background px-4 text-sm shadow-sm transition focus-visible:border-ring focus-visible:ring-ring"
                />
              </Field>

              <Field className="space-y-2.5">
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-medium text-foreground">
                  Mot de passe
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 rounded-2xl border-border bg-background px-4 text-sm shadow-sm transition focus-visible:border-ring focus-visible:ring-ring"
                />
              </Field>

              {showError ? (
                <FieldDescription
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                  Identifiants invalides.
                </FieldDescription>
              ) : null}

              <Field className="pt-2">
                <Button
                  type="submit"
                  className="h-12 w-full rounded-2xl bg-primary text-sm font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90">
                  Se connecter
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
