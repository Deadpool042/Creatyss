import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="shell">
      <section className="card">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
          404
        </p>
        <h1>Page introuvable</h1>
        <p className="mt-1 leading-relaxed text-muted-foreground">
          La page demandée n&apos;est pas disponible sur la boutique.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </section>
    </div>
  );
}
