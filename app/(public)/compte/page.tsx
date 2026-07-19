import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcwIcon, SearchIcon } from "lucide-react";
import { OrderTrackingForm } from "@/features/commerce/checkout/components/order-tracking-form";
import { ReturnEligibilityForm } from "@/features/storefront/returns/components/return-eligibility-form";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const metadata: Metadata = {
  title: "Mon compte — Creatyss",
  description: "Retrouvez vos commandes Creatyss en renseignant votre référence ou votre email.",
  robots: { index: false, follow: false },
};

export default async function ComptePage() {
  const returnsAvailable = await meetsFeatureLevel("commerce.returns", "manual");

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
            <p className="text-sm font-semibold text-foreground">Suivre une commande</p>
            <p className="text-xs text-muted-foreground">Référence au format CRY-XXXXXXXXXX</p>
          </div>
        </div>

        <OrderTrackingForm />
      </div>

      {/* Vérification d'éligibilité au retour */}
      {returnsAvailable ? (
        <div className="mt-6 rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-surface-subtle">
              <RotateCcwIcon className="size-4 text-muted-foreground/60" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Vérifier un retour</p>
              <p className="text-xs text-muted-foreground">
                Indiquez votre référence de commande, votre email et le motif du retour pour
                vérifier si au moins un article peut être retourné.
              </p>
            </div>
          </div>

          <ReturnEligibilityForm />
        </div>
      ) : null}

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
