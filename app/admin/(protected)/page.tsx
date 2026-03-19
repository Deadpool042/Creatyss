import Link from "next/link";
import { cn } from "@/lib/utils";
import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listAdminOrders } from "@/db/repositories/order.repository";
import { listAdminProducts } from "@/db/repositories/admin-product.repository";
import { getOrderStatusLabel } from "@/entities/order/order-status-presentation";

export const dynamic = "force-dynamic";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });

export default async function AdminHomePage() {
  const [orders, products] = await Promise.all([listAdminOrders(), listAdminProducts()]);

  const ordersToProcessCount = orders.filter(
    (o) => o.status === "pending" || o.status === "paid" || o.status === "preparing"
  ).length;

  const unpaidActiveOrdersCount = orders.filter(
    (o) => o.paymentStatus !== "succeeded" && o.status !== "cancelled"
  ).length;

  const draftProductCount = products.filter((p) => p.status === "draft").length;

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthRevenueCents = orders
    .filter((o) => o.status !== "cancelled" && new Date(o.createdAt) >= firstDayOfMonth)
    .reduce((sum, o) => sum + Math.round(parseFloat(o.totalAmount) * 100), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminPageShell
      actions={
        <Button asChild variant="outline">
          <Link href="/" target="_blank">
            Aller sur le site
          </Link>
        </Button>
      }
      description="État de la boutique en ce moment."
      eyebrow="Administration"
      title="Tableau de bord"
    >
      {/* Signal grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">À traiter</CardTitle>
            <CardAction>
              <Button asChild size="sm" variant="ghost">
                <Link href="/admin/orders">Voir →</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-4">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                ordersToProcessCount > 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {ordersToProcessCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              commandes en attente, payées ou en préparation
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements en attente
            </CardTitle>
            <CardAction>
              <Button asChild size="sm" variant="ghost">
                <Link href="/admin/orders">Voir →</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-4">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                unpaidActiveOrdersCount > 0 ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {unpaidActiveOrdersCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">commandes non encore payées</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produits brouillon
            </CardTitle>
            <CardAction>
              <Button asChild size="sm" variant="ghost">
                <Link href="/admin/products">Voir →</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="pb-4">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                draftProductCount > 0 ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {draftProductCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">non publiés sur la boutique</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total du mois
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-3xl font-semibold tabular-nums">
              {currencyFormatter.format(monthRevenueCents / 100)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">hors commandes annulées</p>
          </CardContent>
        </Card>
      </div>

      {/* Commandes récentes */}
      <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-2 border-b border-border/60">
          <CardTitle>Commandes récentes</CardTitle>
          <CardAction>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/orders">Toutes les commandes</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length > 0 ? (
            <ul role="list" className="divide-y divide-border/50">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <Link
                      className="text-sm font-medium hover:underline"
                      href={`/admin/orders/${order.id}`}
                    >
                      {order.reference}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {order.customerFirstName} {order.customerLastName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge className="hidden sm:flex" variant="outline">
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                    <span className="text-sm font-medium tabular-nums">
                      {currencyFormatter.format(parseFloat(order.totalAmount))}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {dateFormatter.format(new Date(order.createdAt))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Aucune commande pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Accès rapides */}
      <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-2 border-b border-border/60 bg-muted/10">
          <CardTitle>Accès rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href="/admin/products/new">Nouveau produit</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Commandes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">Produits</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/blog">Articles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/media">Médias</Link>
          </Button>
        </CardContent>
      </Card>
    </AdminPageShell>
  );
}
