import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import {
  CUSTOMER_EMAIL_CONSENT_LABEL,
  CUSTOMER_STATUS_LABELS,
  getCustomerEmailOptInLabel,
  getCustomerFullName,
} from "@/entities/customer";
import { CustomerDetailForm } from "@/features/admin/customers/components";
import { getAdminCustomerDetail } from "@/features/admin/customers/queries";
import {
  getAdminCustomerDetailPath,
  getAdminCustomerRouteKey,
  parseAdminCustomerRouteKey,
} from "@/features/admin/customers/shared";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type AdminCustomerDetailPageProps = Readonly<{
  params: Promise<{
    customer: string;
  }>;
}>;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateFormatter.format(value) : "Non renseigne";
}

function formatMoney(value: string, currencyCode: string): string {
  const amount = Number(value);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

function formatAddressName(address: {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
}) {
  return (
    [address.firstName, address.lastName].filter(Boolean).join(" ") || address.company || "Contact"
  );
}

function formatAddressBlock(address: {
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  region: string | null;
  countryCode: string;
}) {
  return [
    address.line1,
    address.line2,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.region,
    address.countryCode,
  ].filter(Boolean);
}

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { customer: routeKey } = await params;
  const customerId = parseAdminCustomerRouteKey(routeKey);
  const customer = await getAdminCustomerDetail(customerId);

  if (customer === null) {
    notFound();
  }

  const fullName = getCustomerFullName(customer) ?? customer.email;
  const canonicalRouteKey = getAdminCustomerRouteKey(customer);

  if (routeKey !== canonicalRouteKey) {
    redirect(getAdminCustomerDetailPath(customer));
  }

  return (
    <AdminPageShell
      title={fullName}
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Clients", href: "/admin/commerce/customers" },
        { label: fullName },
      ]}
      showBreadcrumbsInContent={false}
      contentPreset="detail"
    >
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Clients"
          title={fullName}
          description="Vue admin du client metier : identite, cycle de vie, consentements, adresses et commandes recentes."
          mobileHidden={false}
        />

        <section className="overflow-hidden rounded-[28px] border border-surface-border bg-surface-panel shadow-card">
          <div className="grid gap-0 border-b border-surface-border-subtle md:grid-cols-4">
            <CustomerMetric label="Statut" value={CUSTOMER_STATUS_LABELS[customer.status]} />
            <CustomerMetric
              label={CUSTOMER_EMAIL_CONSENT_LABEL}
              value={getCustomerEmailOptInLabel(customer.acceptsEmail)}
            />
            <CustomerMetric label="Consentement SMS" value={customer.acceptsSms ? "Oui" : "Non"} />
            <CustomerMetric label="Commandes" value={String(customer._count.orders)} />
          </div>

          <CustomerSection
            eyebrow="Profil"
            title="Identite client"
            description="Referentiel metier porte par le domaine customers."
          >
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
              <CustomerDefinitionList
                items={[
                  { label: "Nom complet", value: fullName },
                  { label: "Email", value: customer.email },
                  { label: "Cree le", value: formatDateTime(customer.createdAt) },
                  { label: "Mis a jour le", value: formatDateTime(customer.updatedAt) },
                ]}
              />

              <CustomerDefinitionList
                items={[
                  { label: "Premier passage", value: formatDateTime(customer.firstSeenAt) },
                  { label: "Derniere activite", value: formatDateTime(customer.lastSeenAt) },
                  { label: "Active le", value: formatDateTime(customer.activatedAt) },
                  { label: "Bloque le", value: formatDateTime(customer.blockedAt) },
                ]}
              />
            </div>

            <div className="mt-8 border-t border-surface-border-subtle pt-6">
              <CustomerDetailForm customer={customer} />
            </div>
          </CustomerSection>

          <CustomerSection
            eyebrow="Referentiel"
            title="Adresses"
            description={`${customer._count.addresses} adresse${customer._count.addresses > 1 ? "s" : ""} active${customer._count.addresses > 1 ? "s" : ""}.`}
            className="border-t border-surface-border-subtle"
          >
            {customer.addresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune adresse active enregistree.</p>
            ) : (
              <div className="divide-y divide-surface-border-subtle">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="grid gap-4 py-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {address.label ?? formatAddressName(address)}
                        </p>
                        {address.isDefault ? (
                          <span className="rounded-full border border-surface-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Defaut
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {address.type === "BILLING"
                          ? "Facturation"
                          : address.type === "SHIPPING"
                            ? "Livraison"
                            : "Facturation et livraison"}
                      </p>
                    </div>

                    <div className="space-y-1 text-sm leading-6 text-foreground">
                      {formatAddressBlock(address).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                      {address.phone ? <p>{address.phone}</p> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CustomerSection>

          <CustomerSection
            eyebrow="Commerce"
            title="Commandes recentes"
            description="Acces rapide aux dernieres commandes rattachees a ce client."
            className="border-t border-surface-border-subtle"
          >
            {customer.orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune commande rattachee a ce client.
              </p>
            ) : (
              <div className="divide-y divide-surface-border-subtle">
                {customer.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/commerce/orders/${order.id}`}
                    className="grid gap-3 py-5 transition-colors hover:bg-surface-panel-soft/70 md:grid-cols-[minmax(0,1fr)_auto_auto]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        Commande {order.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.placedAt
                          ? formatDateTime(order.placedAt)
                          : formatDateTime(order.createdAt)}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">{order.status}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {formatMoney(order.totalAmount.toString(), order.currencyCode)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CustomerSection>
        </section>
      </div>
    </AdminPageShell>
  );
}

type CustomerMetricProps = Readonly<{
  label: string;
  value: string;
}>;

function CustomerMetric({ label, value }: CustomerMetricProps) {
  return (
    <div className="px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

type CustomerSectionProps = Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}>;

function CustomerSection({
  eyebrow,
  title,
  description,
  className,
  children,
}: CustomerSectionProps) {
  return (
    <section className={cn("px-6 py-6 md:px-8", className)}>
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}

type CustomerDefinitionItem = Readonly<{
  label: string;
  value: string;
}>;

type CustomerDefinitionListProps = Readonly<{
  items: readonly CustomerDefinitionItem[];
}>;

function CustomerDefinitionList({ items }: CustomerDefinitionListProps) {
  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="space-y-1">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {item.label}
          </dt>
          <dd className="text-sm leading-6 text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
