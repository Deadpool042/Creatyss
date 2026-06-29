import { formatCatalogMoneyFromCents } from "@/features/storefront/catalog/helpers/catalog-pricing";
import { selectShippingMethodFormAction } from "@/features/commerce/checkout/actions/select-shipping-method-form.action";
import type { AvailableShippingMethod } from "@/features/commerce/checkout/queries/get-available-shipping-methods.query";

type ShippingMethodSelectorProps = {
  readonly availableMethods: ReadonlyArray<AvailableShippingMethod>;
  readonly selectedCode: string | null;
};

export function ShippingMethodSelector({
  availableMethods,
  selectedCode,
}: ShippingMethodSelectorProps) {
  if (availableMethods.length === 0) {
    return (
      <section className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-5">
        <div className="grid gap-1">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Livraison</p>
          <h2>Méthode de livraison</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Aucune méthode de livraison disponible pour votre commande.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-5">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Livraison</p>
        <h2>Méthode de livraison</h2>
      </div>

      <div className="grid gap-3">
        {availableMethods.map((method) => {
          const isSelected = selectedCode === method.code;
          const amountLabel =
            method.amountCents === 0
              ? "Offert"
              : formatCatalogMoneyFromCents(method.amountCents, method.currencyCode);

          return (
            <form action={selectShippingMethodFormAction} key={method.code}>
              <input name="shippingMethodCode" type="hidden" value={method.code} />
              <button
                className={[
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  isSelected
                    ? "border-brand bg-brand/5 font-medium text-foreground"
                    : "border-surface-border/60 bg-white text-foreground hover:border-brand/40 hover:bg-brand/3",
                ].join(" ")}
                type="submit"
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <span
                      aria-checked={isSelected}
                      className={[
                        "inline-flex size-4 shrink-0 items-center justify-center rounded-full border",
                        isSelected ? "border-brand bg-brand" : "border-muted-foreground/40",
                      ].join(" ")}
                      role="radio"
                    >
                      {isSelected ? <span className="size-1.5 rounded-full bg-white" /> : null}
                    </span>
                    <span>{method.name}</span>
                  </span>
                  <span className={isSelected ? "text-brand" : "text-muted-foreground"}>
                    {amountLabel}
                  </span>
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
