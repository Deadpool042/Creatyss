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
    <article className="grid gap-3 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Cliente"
        title={customer.fullName}
      />
      <p className="card-copy text-sm leading-6 text-foreground">
        {customer.email}
      </p>
      {customer.phone ? (
        <p className="card-meta text-sm leading-6 text-muted-foreground">
          {customer.phone}
        </p>
      ) : null}
    </article>
  );
}
