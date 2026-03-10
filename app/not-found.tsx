import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="shell">
      <section className="card">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <p className="lead">
          La page demandee n&apos;est pas disponible sur la boutique publique.
        </p>
        <Link className="link" href="/">
          Retour a l&apos;accueil
        </Link>
      </section>
    </div>
  );
}
