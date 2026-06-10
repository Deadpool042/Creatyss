import { selectPaymentMethodFormAction } from "@/features/commerce/checkout/actions/select-payment-method-form.action";
import type { CheckoutPaymentMethod } from "@/features/commerce/checkout/types/checkout-payment-method.types";

type PaymentMethodOption = {
  readonly code: CheckoutPaymentMethod;
  readonly name: string;
  readonly description: string;
};

const PAYMENT_METHOD_OPTIONS: ReadonlyArray<PaymentMethodOption> = [
  {
    code: "bank_transfer",
    name: "Virement bancaire",
    description:
      "Les instructions de virement seront envoyées après validation de la commande.",
  },
  {
    code: "cash_on_delivery",
    name: "Paiement à l'atelier",
    description: "Paiement lors du retrait ou de la remise du produit.",
  },
];

type PaymentMethodSelectorProps = {
  readonly currentPaymentMethod: CheckoutPaymentMethod | null;
  readonly hasDraft: boolean;
};

export function PaymentMethodSelector({
  currentPaymentMethod,
  hasDraft,
}: PaymentMethodSelectorProps) {
  if (!hasDraft) {
    return (
      <section className="grid gap-4 rounded-xl border border-surface-border/60 bg-white/80 p-5">
        <div className="grid gap-1">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">Paiement</p>
          <h2>Mode de paiement</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Renseignez vos informations avant de choisir un mode de paiement.
        </p>
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
        {PAYMENT_METHOD_OPTIONS.map((method) => {
          const isSelected = currentPaymentMethod === method.code;

          return (
            <form action={selectPaymentMethodFormAction} key={method.code}>
              <input name="paymentMethodCode" type="hidden" value={method.code} />
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
                      {isSelected ? (
                        <span className="size-1.5 rounded-full bg-white" />
                      ) : null}
                    </span>
                    <span className="font-medium">{method.name}</span>
                  </span>
                  <span className="ml-6 text-muted-foreground">{method.description}</span>
                </span>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
