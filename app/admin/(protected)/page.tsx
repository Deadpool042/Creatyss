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
        <p className="card-kicker">Homepage</p>
        <h2>Edition de la page d'accueil</h2>
        <p className="card-copy">
          Modifiez le hero, le bloc editorial et les selections mises en avant
          depuis une page admin unique et lisible.
        </p>
        <div>
          <Link className="link" href="/admin/homepage">
            Ouvrir la homepage
          </Link>
        </div>
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
        <p className="card-kicker">Blog</p>
        <h2>Edition des articles</h2>
        <p className="card-copy">
          Creez, publiez et ajustez les articles du blog avec un formulaire
          simple et une image de couverture optionnelle.
        </p>
        <div>
          <Link className="link" href="/admin/blog">
            Ouvrir le blog admin
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
