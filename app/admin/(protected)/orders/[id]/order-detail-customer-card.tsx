import { SectionIntro } from "@/components/section-intro";

type OrderDetailCustomerCardProps = Readonly<{
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
}>;

export function OrderDetailCustomerCard({
  customer
}: OrderDetailCustomerCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          className="grid gap-2"
          eyebrow="Cliente"
          title={customer.fullName}
        />
        <p className="card-copy">{customer.email}</p>
        {customer.phone ? <p className="card-meta">{customer.phone}</p> : null}
      </div>
    </article>
  );
}
