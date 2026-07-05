import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE_BYTES } from "@/core/uploads";

import {
  formatByteSize,
  integerFormatter,
  mediaDateFormatter,
  type MediaLibrarySearchParams,
} from "./admin-media-library-helpers";
import type { AdminMediaLibraryView } from "@/features/admin/media/types/admin-media-list-item.types";
import { AdminMediaUploadForm } from "./admin-media-upload-form";

const acceptedFormatsLabel = [...ACCEPTED_IMAGE_MIME_TYPES]
  .map((mime) => mime.replace("image/", "").toUpperCase())
  .join(", ");

const maxFileSizeMb = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);

type AdminMediaLibraryAsideProps = Readonly<{
  activeAssetCount: number;
  currentPage: number;
  latestImageCreatedAt: Date | null;
  searchState?: Pick<MediaLibrarySearchParams, "format" | "perPage" | "q" | "sort" | "usage" | "view">;
  totalCount: number;
  totalImageBytes: number;
  view: AdminMediaLibraryView;
}>;

export function AdminMediaLibraryAside({
  activeAssetCount,
  currentPage,
  latestImageCreatedAt,
  searchState,
  totalCount,
  totalImageBytes,
  view,
}: AdminMediaLibraryAsideProps) {
  if (view === "trash") {
    return (
      <div className="grid gap-4">
        <InfoTile
          label="Médias archivés"
          value={integerFormatter.format(totalCount)}
          hint="Éléments sortis de la bibliothèque active, encore restaurables."
        />
        <InfoTile
          label="Repères"
          value={`Page ${currentPage}`}
          hint="Restaure un média si tu veux le remettre en circulation, ou supprime-le définitivement depuis l'inspector."
        />
        <div className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
          <AdminFormSection
            eyebrow="Cycle de vie"
            title="Suppression différée"
            description="La corbeille sert de zone tampon avant la suppression définitive des fichiers et de l'enregistrement."
            className="space-y-3"
          >
            <div />
          </AdminFormSection>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <InfoTile
        label="Images actives"
        value={integerFormatter.format(activeAssetCount)}
        hint="Assets actifs disponibles dans la bibliothèque."
      />
      <InfoTile
        label="Poids cumulé"
        value={formatByteSize(totalImageBytes)}
        hint="Volume actuellement servi par la médiathèque."
      />
      <InfoTile
        label="Dernier import"
        value={latestImageCreatedAt ? mediaDateFormatter.format(latestImageCreatedAt) : "Aucun"}
        hint="Dernière image ajoutée à la bibliothèque active."
      />
      <InfoTile
        label="Repères"
        value={`${integerFormatter.format(totalCount)} images`}
        hint={`Page ${currentPage}. Formats acceptés : ${acceptedFormatsLabel}. Taille maximale : ${maxFileSizeMb} MB.`}
      />

      {view === "active" ? (
        <div
          id="admin-media-upload"
          className="scroll-mt-24 rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card"
        >
          <AdminFormSection
            eyebrow="Import"
            title="Ajouter une image"
            description="Le média devient réutilisable immédiatement dans le catalogue et les contenus."
            className="space-y-3"
          >
            <AdminMediaUploadForm searchState={searchState} />
          </AdminFormSection>
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
          <AdminFormSection
            eyebrow="Corbeille"
            title="Suppression différée"
            description="Restaure un média si besoin. La suppression définitive est réservée aux éléments archivés."
            className="space-y-3"
          >
            <div />
          </AdminFormSection>
        </div>
      )}
    </div>
  );
}

function InfoTile({ label, value, hint }: Readonly<{ label: string; value: string; hint: string }>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</p>
    </div>
  );
}
