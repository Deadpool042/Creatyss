import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="admin-panels">
      <article className="store-card">
        <p className="card-kicker">Administration</p>
        <h2>Espace d&apos;administration</h2>
        <p className="card-copy">
          Gérez l&apos;accueil, le blog, les catégories, les produits, les
          médias et les commandes depuis un seul espace.
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
          Organisez le catalogue et reliez les produits aux catégories déjà
          créées.
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
          Importez des images puis réutilisez-les dans les produits, le blog et
          la page d&apos;accueil.
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
