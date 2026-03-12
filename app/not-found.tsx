import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="shell">
      <section className="card">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <p className="lead">
          La page demandée n&apos;est pas disponible sur la boutique.
        </p>
        <Link className="link" href="/">
          Retour à l&apos;accueil
        </Link>
      </section>
    </div>
  );
}
