import { Mail, Package, Users } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";
import { listAdminCustomers } from "@/features/admin/customers/queries/list-admin-customers.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const STATUS_LABELS: Record<string, string> = {
  LEAD: "Prospect",
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
};

const STATUS_CLASSES: Record<string, string> = {
  LEAD: "bg-surface-subtle text-muted-foreground",
  ACTIVE: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  INACTIVE: "bg-surface-subtle text-muted-foreground/70",
};

export default async function AdminCommerceCustomersPage() {
  let customers: Awaited<ReturnType<typeof listAdminCustomers>> = [];
  let moduleUnavailable = false;

  try {
    customers = await listAdminCustomers();
  } catch {
    moduleUnavailable = true;
  }

  const activeCount = customers.filter((c) => c.status === "ACTIVE").length;
  const emailOptIn = customers.filter((c) => c.acceptsEmail).length;

  return (
    <AdminPageShell
      scrollMode="area"
      title="Clients"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Clients" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      {moduleUnavailable ? (
        <AdminEmptyState
          eyebrow="Module indisponible"
          title="Clients non accessibles"
          description="Le module clients est en cours d'activation."
        />
      ) : customers.length === 0 ? (
        <AdminEmptyState
          eyebrow="Aucun client"
          title="Aucun client enregistré"
          description="Les clients créés lors du passage en commande apparaîtront ici."
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: customers.length, icon: Users, accent: undefined },
              { label: "Actifs", value: activeCount, icon: Package, accent: activeCount > 0 ? "text-feedback-success-foreground" : undefined },
              { label: "Email opt-in", value: emailOptIn, icon: Mail, accent: undefined },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm"
              >
                <p className={cn("text-2xl font-semibold tracking-tight", s.accent ?? "text-foreground")}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Liste clients */}
          <div className="divide-y divide-surface-border/40">
            {customers.map((customer) => {
              const fullName =
                [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
                customer.displayName ||
                null;

              return (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  {/* Avatar */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border/60 bg-surface-subtle text-[13px] font-semibold text-muted-foreground">
                    {(fullName ?? customer.email).charAt(0).toUpperCase()}
                  </div>

                  {/* Identité */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {fullName ?? <span className="text-muted-foreground/70">Sans nom</span>}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                  </div>

                  {/* Commandes */}
                  {customer.ordersCount > 0 ? (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                      {customer.ordersCount} commande{customer.ordersCount > 1 ? "s" : ""}
                    </span>
                  ) : null}

                  {/* Date */}
                  <span className="hidden shrink-0 text-xs text-muted-foreground/60 lg:inline">
                    {dateFormatter.format(new Date(customer.createdAt))}
                  </span>

                  {/* Statut */}
                  <span
                    className={cn(
                      "shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                      STATUS_CLASSES[customer.status] ?? "bg-surface-subtle text-muted-foreground"
                    )}
                  >
                    {STATUS_LABELS[customer.status] ?? customer.status}
                  </span>
                </div>
              );
            })}
          </div>

          {customers.length >= 200 ? (
            <p className="text-center text-xs text-muted-foreground/60">
              200 premiers clients affichés — pagination et filtres à venir.
            </p>
          ) : null}
        </>
      )}
    </AdminPageShell>
  );
}
