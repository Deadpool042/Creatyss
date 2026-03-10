import Link from "next/link";
import { listPublishedProducts } from "@/db/catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listPublishedProducts();

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Boutique</p>
            <h1>Produits publies</h1>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="card-grid">
            {products.map((product) => (
              <article className="store-card" key={product.id}>
                <p className="card-kicker">Produit</p>
                <h3>
                  <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="card-copy">
                  {product.shortDescription ??
                    product.description ??
                    "Aucune description n'est disponible pour ce produit."}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Catalogue vide</p>
            <h2>Aucun produit publie</h2>
            <p className="card-copy">
              Les produits publics apparaitront ici des qu&apos;ils seront
              publies.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
