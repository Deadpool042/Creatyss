"use client";

import { useEffect } from "react";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="shell">
      <section className="card">
        <p className="eyebrow">Erreur applicative</p>
        <h1>Une erreur est survenue.</h1>
        <p className="lead">
          Le socle technique a rencontré une erreur inattendue.
        </p>
        <p className="message">{error.message || "Erreur inconnue."}</p>
        <button className="button" type="button" onClick={() => reset()}>
          Recharger cette vue
        </button>
      </section>
    </main>
  );
}
