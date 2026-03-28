import Link from "next/link";

export default function AdminSessionInvalidPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Session invalide</h1>
        <p className="text-sm text-muted-foreground">
          Votre session a expiré ou n’est plus valide. Veuillez vous reconnecter.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
