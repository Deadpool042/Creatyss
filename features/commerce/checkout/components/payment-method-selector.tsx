import { selectPaymentMethodFormAction } from "@/features/commerce/checkout/actions/select-payment-method-form.action";
import type { AvailablePaymentMethod } from "@/features/commerce/checkout/queries/get-available-payment-methods.query";
import type { CheckoutPaymentMethod } from "@/features/commerce/checkout/types/checkout-payment-method.types";

type PaymentMethodSelectorProps = {
  readonly currentPaymentMethod: CheckoutPaymentMethod | null;
  readonly methods: ReadonlyArray<AvailablePaymentMethod>;
};

export function PaymentMethodSelector({
  currentPaymentMethod,
  methods,
}: PaymentMethodSelectorProps) {
  if (methods.length === 0) {
    return (
      <section className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-5">
        <div className="grid gap-1">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Paiement</p>
          <h2>Mode de paiement</h2>
        </div>
        <p className="text-sm text-muted-foreground">Aucun mode de paiement disponible.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-5">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Paiement</p>
        <h2>Mode de paiement</h2>
      </div>

      <div className="grid gap-3">
        {methods.map((method) => {
          const isSelected = currentPaymentMethod === method.id;

          return (
            <form action={selectPaymentMethodFormAction} key={method.id}>
              <input name="paymentMethodCode" type="hidden" value={method.id} />
              <button
                className={[
                  "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  isSelected
                    ? "border-brand bg-brand/5 font-medium text-foreground"
                    : "border-surface-border/60 bg-white text-foreground hover:border-brand/40 hover:bg-brand/3",
                ].join(" ")}
                type="submit"
              >
                <span className="flex flex-col gap-1">
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
                    <span className="font-medium">{method.label}</span>
                  </span>
                  {method.instructions !== null ? (
                    <span className="ml-6 text-muted-foreground">{method.instructions}</span>
                  ) : null}
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
