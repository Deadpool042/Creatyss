import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="w-full grid min-h-[calc(100vh-8rem)] place-items-center py-8">
      <section className="w-[min(100%,42rem)] p-8 border border-[rgba(31,31,31,0.08)] rounded-[1rem] bg-white/92 shadow-[0_20px_60px_rgba(31,31,31,0.08)]">
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
