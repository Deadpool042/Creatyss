export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="admin-panels">
      <article className="store-card">
        <p className="card-kicker">Fondation admin</p>
        <h2>Espace protege pret pour la suite</h2>
        <p className="card-copy">
          Cette base d&apos;authentification protege deja l&apos;espace admin et
          prepare l&apos;integration des futures pages de gestion des medias.
        </p>
      </article>

      <article className="store-card">
        <p className="card-kicker">Prochaine etape</p>
        <h2>Bibliotheque media</h2>
        <p className="card-copy">
          Les prochains ecrans admin pourront s&apos;ajouter sous
          <code> /admin</code> en reutilisant directement ce layout protege.
        </p>
      </article>
    </div>
  );
}
