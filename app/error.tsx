"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full grid min-h-[calc(100vh-8rem)] place-items-center py-8">
      <section className="w-[min(100%,42rem)] p-8 border border-[rgba(31,31,31,0.08)] rounded-[1rem] bg-white/92 shadow-[0_20px_60px_rgba(31,31,31,0.08)]">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
          Erreur applicative
        </p>
        <h1>Une erreur est survenue.</h1>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          Le site a rencontré une erreur inattendue.
        </p>
        <p className="text-sm text-muted-foreground">
          {error.message || "Erreur inconnue."}
        </p>
        <Button type="button" onClick={() => reset()}>
          Recharger cette vue
        </Button>
      </section>
    </main>
  );
}
