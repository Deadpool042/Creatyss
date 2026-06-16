import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { listAdminPriceLists } from "@/features/admin/catalog/queries/list-admin-price-lists.query";

// ─── Router ───────────────────────────────────────────────────────────────────

type FlagGovernancePanelProps = Readonly<{ flagKey: string }>;

/**
 * Server Component — rendu d'un panneau de gouvernance contextuel par flag.
 * Chaque flag peut avoir sa propre section de contexte domaine et de stats live.
 * Retourne null si aucun panneau n'est défini pour ce flag.
 */
export async function FlagGovernancePanel({ flagKey }: FlagGovernancePanelProps) {
  switch (flagKey) {
    case "catalog.products.pricing":
      return <PricingGovernancePanel />;
    default:
      return null;
  }
}

// ─── Pricing governance panel ─────────────────────────────────────────────────

async function PricingGovernancePanel() {
  let priceLists: Awaited<ReturnType<typeof listAdminPriceLists>> = [];

  try {
    priceLists = await listAdminPriceLists();
  } catch {
    return null;
  }

  const activeLists = priceLists.filter((p) => p.status === "ACTIVE");
  const defaultList = priceLists.find((p) => p.isDefault);
  const totalEntries = priceLists.reduce(
    (sum, p) => sum + p.productPricesCount + p.variantPricesCount,
    0
  );

  const stats = [
    { label: "Listes", value: priceLists.length, accent: undefined as string | undefined },
    {
      label: "Actives",
      value: activeLists.length,
      accent: activeLists.length > 0 ? "text-feedback-success-foreground" : undefined,
    },
    { label: "Entrées prix", value: totalEntries, accent: undefined },
  ];

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
        Gouvernance · Tarification
      </p>

      {/* Contexte domaine */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">listes de prix</span>,{" "}
        les <span className="font-medium text-foreground">prix produit</span> et{" "}
        les <span className="font-medium text-foreground">prix variante</span>.
        Les montants sont stockés TTC — la ventilation HT/TVA relève du domaine{" "}
        <code className="font-mono text-[10px]">taxation</code>.
      </p>

      {/* Stats live */}
      {priceLists.length > 0 ? (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-surface-border/60 bg-surface-panel/60 px-3 py-2.5"
              >
                <p className={cn("text-base font-semibold", s.accent ?? "text-foreground")}>
                  {s.value}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {defaultList !== undefined ? (
            <div className="flex items-center gap-2 rounded-xl border border-feedback-success-border/60 bg-feedback-success-surface/20 px-3 py-2.5">
              <Star className="size-3.5 shrink-0 text-feedback-success-foreground" />
              <p className="min-w-0 truncate text-xs font-medium text-foreground">
                {defaultList.name}
              </p>
              <span className="ml-auto shrink-0 text-[11px] text-muted-foreground/60">
                {defaultList.currencyCode}
              </span>
            </div>
          ) : (
            <p className="text-xs italic text-muted-foreground/60">
              Aucune liste par défaut définie.
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs italic text-muted-foreground/60">
          Aucune liste de prix disponible.
        </p>
      )}
    </div>
  );
}
