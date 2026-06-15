import { Badge } from "@/components/ui/badge";
import type { AdminSearchDocumentSummary, AdminSearchDocumentsSnapshot } from "@/features/admin/settings/queries/list-admin-search-documents.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getStatusVariant(status: AdminSearchDocumentSummary["status"]): "secondary" | "outline" {
  return status === "ACTIVE" ? "secondary" : "outline";
}

function getStatusLabel(status: AdminSearchDocumentSummary["status"]): string {
  switch (status) {
    case "INACTIVE":
      return "Inactif";
    case "ARCHIVED":
      return "Archive";
    case "ACTIVE":
    default:
      return "Actif";
  }
}

function OverviewCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function SearchDocumentRow({ document }: { document: AdminSearchDocumentSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {document.subjectType}
        </span>
        <Badge variant={getStatusVariant(document.status)}>{getStatusLabel(document.status)}</Badge>
        <Badge variant="outline">{document.localeCode ?? "Locale par defaut"}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>SubjectId : {document.subjectId}</span>
        <span>Maj : {formatDateTime(document.updatedAt)}</span>
        <span>Publication : {formatDateTime(document.publishedAt)}</span>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{document.indexedTextPreview}</p>
    </div>
  );
}

type SearchDocumentsPanelProps = {
  snapshot: AdminSearchDocumentsSnapshot;
};

export function SearchDocumentsPanel({ snapshot }: SearchDocumentsPanelProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module satellite
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Recherche indexee
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecture admin du referentiel <code>SearchDocument</code>. Aucun moteur externe,
          aucune indexation automatique et aucune recherche storefront ne sont ajoutes dans ce lot.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="Documents"
            value={snapshot.overview.totalDocuments}
            hint="Documents indexes non archives"
          />
          <OverviewCard
            label="Actifs"
            value={snapshot.overview.activeDocuments}
            hint="Entrees visibles cote index"
          />
          <OverviewCard
            label="Localises"
            value={snapshot.overview.localizedDocuments}
            hint="Documents avec locale explicite"
          />
          <OverviewCard
            label="Types"
            value={snapshot.overview.indexedSubjectTypes}
            hint="Familles de sujets indexees"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Derniers documents indexes
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          24 dernieres entrees de la boutique courante, triees par date de mise a jour.
        </p>

        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.documents.length > 0 ? (
            snapshot.documents.map((document) => (
              <SearchDocumentRow key={document.id} document={document} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun document de recherche n&apos;est present en base pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
