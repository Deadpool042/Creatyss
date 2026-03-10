import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="admin-panels">
      <article className="store-card">
        <p className="card-kicker">Fondation admin</p>
        <h2>Espace protege pret pour la suite</h2>
        <p className="card-copy">
          Cette base d&apos;authentification protege deja l&apos;espace admin et
          accueille maintenant des verticales categories, produits et media
          simples et maintenables.
        </p>
      </article>

      <article className="store-card">
        <p className="card-kicker">Catalogue</p>
        <h2>Gestion des produits</h2>
        <p className="card-copy">
          Creez des produits parents, rattachez-les aux categories existantes,
          puis gerez variantes et images depuis une page detail unique.
        </p>
        <div>
          <Link className="link" href="/admin/products">
            Ouvrir les produits
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Categories</p>
        <h2>Structure du catalogue</h2>
        <p className="card-copy">
          Les categories restent disponibles pour organiser proprement le
          catalogue et alimenter les associations produit.
        </p>
        <div>
          <Link className="link" href="/admin/categories">
            Ouvrir les categories
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Media</p>
        <h2>Bibliotheque locale</h2>
        <p className="card-copy">
          La bibliotheque media reste disponible pour preparer les futures
          editions produits, blog et homepage.
        </p>
        <div>
          <Link className="link" href="/admin/media">
            Ouvrir la bibliotheque media
          </Link>
        </div>
      </article>
    </div>
  );
}
