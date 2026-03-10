import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">404</p>
        <h1>Page introuvable</h1>
        <p className="lead">
          Cette route n&apos;existe pas dans la fondation actuelle.
        </p>
        <Link className="link" href="/">
          Retour a l&apos;accueil technique
        </Link>
      </section>
    </main>
  );
}
