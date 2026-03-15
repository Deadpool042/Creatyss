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
import { cn } from "@/lib/utils";
import Image from "next/image";

type LoginFormProps = React.ComponentProps<"div"> & {
  action: (formData: FormData) => Promise<void>;
  showError?: boolean;
};

export function LoginForm({
  className,
  action,
  showError = false,
  ...props
}: LoginFormProps) {
  return (
    <div
      className={cn("grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]", className)}
      {...props}>
      <div className="relative hidden overflow-hidden bg-stone-950 text-stone-100 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.14),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[72px_72px]" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-semibold tracking-[0.18em]">
                C
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-stone-300">
                  Administration
                </p>
                <p className="text-sm font-medium text-white">Creatyss</p>
              </div>
            </div>

            <div className="max-w-xl space-y-5">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">
                Espace interne
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white xl:text-5xl">
                Une interface sobre pour piloter la boutique avec clarté.
              </h1>
              <p className="max-w-lg text-base leading-7 text-stone-300">
                Gérez les produits, les contenus et les commandes depuis un
                espace pensé pour rester lisible, rapide et rassurant au
                quotidien.
              </p>
            </div>
          </div>

          <div className="grid max-w-xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
                Catalogue
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Produits, variantes, médias et catégories.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
                Contenu
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Homepage éditable et blog administrable.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
                Opérations
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Suivi des commandes et workflows simples.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-stone-100 px-6 py-10 sm:px-8 lg:bg-stone-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent_35%,rgba(0,0,0,0.02))]" />

        <div className="relative w-full max-w-md">
          <Card className="overflow-hidden rounded-[28px] border border-stone-200/80 bg-white/92 shadow-[0_20px_70px_-24px_rgba(0,0,0,0.22)] backdrop-blur-sm">
            <div className="h-1 w-full bg-linear-to-r from-stone-900 via-stone-700 to-amber-700" />

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
                <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-stone-500">
                  Connexion sécurisée
                </p>
                <CardTitle className="text-3xl font-semibold tracking-tight text-stone-950">
                  Connexion
                </CardTitle>
                <CardDescription className="text-[15px] leading-7 text-stone-600">
                  Connectez-vous pour accéder à l&apos;espace
                  d&apos;administration Creatyss.
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
                      className="text-sm font-medium text-stone-800">
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="h-12 rounded-2xl border-stone-200 bg-stone-50/80 px-4 text-sm shadow-sm transition focus-visible:border-stone-400 focus-visible:ring-stone-300"
                    />
                  </Field>

                  <Field className="space-y-2.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-stone-800">
                      Mot de passe
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="h-12 rounded-2xl border-stone-200 bg-stone-50/80 px-4 text-sm shadow-sm transition focus-visible:border-stone-400 focus-visible:ring-stone-300"
                    />
                  </Field>

                  {showError ? (
                    <FieldDescription
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      Identifiants invalides.
                    </FieldDescription>
                  ) : null}

                  <Field className="pt-2">
                    <Button
                      type="submit"
                      className="h-12 w-full rounded-2xl bg-stone-950 text-sm font-medium text-white shadow-lg shadow-stone-950/15 transition hover:bg-stone-800">
                      Se connecter
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
