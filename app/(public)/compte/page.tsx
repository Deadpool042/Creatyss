import type { Metadata } from "next";
import Link from "next/link";
import { PackageIcon, SearchIcon } from "lucide-react";
import { OrderTrackingForm } from "@/features/commerce/checkout/components/order-tracking-form";

export const metadata: Metadata = {
  title: "Mon compte — Creatyss",
  description: "Retrouvez vos commandes Creatyss en renseignant votre référence ou votre email.",
};

export default function ComptePage() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12 md:px-6 md:py-20">
      {/* Header */}
      <header className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Espace client
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          Mon compte
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Retrouvez une commande par sa référence ou consultez votre historique d'achat.
        </p>
      </header>

      {/* Recherche par référence */}
      <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-surface-subtle">
            <SearchIcon className="size-4 text-muted-foreground/60" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground">Suivre une commande</p>
            <p className="text-xs text-muted-foreground">Référence au format CRY-XXXXXXXXXX</p>
          </div>
        </div>

        <OrderTrackingForm />
      </div>

      {/* Section compte complet — à venir */}
      <div className="mt-6 rounded-2xl border border-surface-border/40 bg-surface-panel/20 p-6">
        <div className="flex items-start gap-3">
          <PackageIcon className="mt-0.5 size-5 shrink-0 text-muted-foreground/30" />
          <div>
            <p className="text-[13px] font-medium text-foreground">
              Espace client complet
              <span className="ml-2 rounded-full bg-surface-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                À venir
              </span>
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Historique complet des commandes, gestion des adresses et préférences. Disponible
              prochainement.
            </p>
          </div>
        </div>
      </div>

      {/* Aide */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Une question ?{" "}
        <Link
          href="/contact"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Contactez-nous
        </Link>
      </p>
    </div>
  );
}
