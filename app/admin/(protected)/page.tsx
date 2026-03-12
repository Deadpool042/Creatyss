import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="admin-panels">
      <article className="store-card">
        <p className="card-kicker">Administration</p>
        <h2>Espace d&apos;administration</h2>
        <p className="card-copy">
          Cet espace permet déjà de gérer l&apos;accueil, le blog, les
          catégories, les produits, les médias et les commandes depuis une
          base simple et maintenable.
        </p>
      </article>

      <article className="store-card">
        <p className="card-kicker">Accueil</p>
        <h2>Édition de la page d&apos;accueil</h2>
        <p className="card-copy">
          Modifiez la bannière principale, le bloc éditorial et les sélections
          mises en avant depuis une seule page.
        </p>
        <div>
          <Link className="link" href="/admin/homepage">
            Ouvrir la page d&apos;accueil
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Catalogue</p>
        <h2>Gestion des produits</h2>
        <p className="card-copy">
          Créez des produits, rattachez-les aux catégories existantes, puis
          gérez leurs informations et leurs images depuis une fiche détaillée.
        </p>
        <div>
          <Link className="link" href="/admin/products">
            Ouvrir les produits
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Blog</p>
        <h2>Édition des articles</h2>
        <p className="card-copy">
          Créez, publiez et ajustez les articles du blog avec un formulaire
          simple et une image de couverture optionnelle.
        </p>
        <div>
          <Link className="link" href="/admin/blog">
            Ouvrir le blog
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Catégories</p>
        <h2>Structure du catalogue</h2>
        <p className="card-copy">
          Les catégories restent disponibles pour organiser proprement le
          catalogue et alimenter les associations produit.
        </p>
        <div>
          <Link className="link" href="/admin/categories">
            Ouvrir les catégories
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Médias</p>
        <h2>Bibliothèque locale</h2>
        <p className="card-copy">
          La bibliothèque médias reste disponible pour préparer les futures
          éditions produits, blog et page d&apos;accueil.
        </p>
        <div>
          <Link className="link" href="/admin/media">
            Ouvrir la bibliothèque médias
          </Link>
        </div>
      </article>

      <article className="store-card">
        <p className="card-kicker">Commandes</p>
        <h2>Suivi des commandes</h2>
        <p className="card-copy">
          Consultez les commandes créées sur la boutique avec un détail simple
          et les principales informations de suivi.
        </p>
        <div>
          <Link className="link" href="/admin/orders">
            Ouvrir les commandes
          </Link>
        </div>
      </article>
    </div>
  );
}
