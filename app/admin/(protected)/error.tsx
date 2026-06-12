"use client";

import Link from "next/link";
import { useEffect } from "react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Button } from "@/components/ui/button";

type AdminProtectedErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function AdminProtectedErrorPage({
  error,
  reset,
}: AdminProtectedErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AdminPageShell
      title="Une erreur est survenue dans l’administration"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Erreur" },
      ]}
      contentPreset="form"
      scrollBehavior="page"
    >
      <div className="flex flex-1 items-start py-2 md:py-4 lg:py-8">
        <section className="w-full rounded-[1.75rem] border border-surface-border/70 bg-surface-panel/96 p-6 shadow-card sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand/90">
            Administration
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            La page demandée n’a pas pu être affichée. Vous pouvez réessayer ou revenir au
            tableau de bord.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => reset()}>
              Réessayer
            </Button>

            <Button asChild type="button" variant="outline">
              <Link href="/admin">Retour au tableau de bord</Link>
            </Button>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
