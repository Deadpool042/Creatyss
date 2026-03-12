import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <section className="section">
      <PageHeader
        eyebrow="Administration"
        title="Espace d'administration"
        description="Utilisez la navigation latérale pour accéder aux produits, commandes, médias et paramètres de contenu."
      />

      <div className="admin-panels">
        <div className="store-card">
          <p className="card-kicker">Accès rapide</p>
          <div className="admin-actions">
            <Link className="button" href="/admin/products/new">
              Nouveau produit
            </Link>
            <Link className="button link-subtle" href="/admin/orders">
              Voir les commandes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
