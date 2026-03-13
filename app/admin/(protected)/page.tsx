import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <section className="space-y-6 [&_.page-header]:mb-0">
      <PageHeader
        eyebrow="Administration"
        title="Espace d'administration"
        description="Utilisez la navigation latérale pour accéder aux produits, commandes, médias et paramètres de contenu."
      />

      <Card className="rounded-2xl border border-border/70 bg-card/95 shadow-sm">
        <CardHeader className="gap-2 border-b border-border/60 bg-muted/10">
          <CardTitle>Accès rapide</CardTitle>
          <CardDescription>
            Le tableau de bord reste volontairement léger. La navigation
            persistante permet d'accéder directement aux sections de gestion.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href="/admin/products/new">Nouveau produit</Link>
          </Button>

          <Button
            asChild
            variant="outline">
            <Link href="/admin/orders">Voir les commandes</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
