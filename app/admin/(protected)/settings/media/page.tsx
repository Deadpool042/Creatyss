import { HardDrive, Image, Library } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { serverEnv } from "@/core/config/env/server";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  getUploadsPublicPath,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/core/uploads";
import { getAdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

export const dynamic = "force-dynamic";

export default async function AdminSettingsMediaPage() {
  let stats = { activeAssetCount: 0 };

  try {
    stats = await getAdminMediaStats();
  } catch {
    // DB non disponible — valeur par défaut
  }

  const uploadsDir = serverEnv.uploadsDir || null;
  const publicPath = getUploadsPublicPath();

  const maxFileSizeMb = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);
  const acceptedFormats = [...ACCEPTED_IMAGE_MIME_TYPES]
    .map((mime) => mime.replace("image/", "").toUpperCase())
    .join(", ");

  return (
    <AdminPageShell
      scrollMode="area"
      title="Médias"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Médias" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-8">
        {/* En-tête */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Médias</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuration du stockage et du traitement des images. Ces paramètres sont définis dans
            l&apos;environnement et ne sont pas modifiables ici.
          </p>
        </div>

        {/* Section Stockage */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HardDrive className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Stockage</h2>
          </div>

          <div className="divide-y divide-border rounded-lg border bg-card">
            <MediaInfoRow
              label="Type de stockage"
              value="Système de fichiers local"
              readOnly
            />
            <MediaInfoRow
              label="Répertoire effectif"
              value={uploadsDir ?? "Non configuré"}
              mono
              readOnly
            />
            <MediaInfoRow
              label="URL publique"
              value={publicPath}
              mono
              readOnly
            />
          </div>
        </section>

        {/* Section Traitement des images */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Image className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Traitement des images</h2>
          </div>

          <div className="divide-y divide-border rounded-lg border bg-card">
            <MediaInfoRow
              label="Format de sortie"
              value="WebP"
              // Source : core/uploads/image-processing.ts — mimeType: "image/webp"
              readOnly
            />
            <MediaInfoRow
              label="Taille maximale acceptée"
              value={`${maxFileSizeMb} Mo`}
              readOnly
            />
            <MediaInfoRow
              label="Dimensions maximales"
              value="2000 × 2000 px"
              // Source : core/uploads/image-processing.ts — resize({ width: 2000, height: 2000 })
              // Note : valeurs littérales dans processImageToWebp, pas des constantes exportées
              readOnly
            />
            <MediaInfoRow
              label="Qualité WebP"
              value="82"
              // Source : core/uploads/image-processing.ts — .webp({ quality: 82 })
              // Note : valeur littérale dans processImageToWebp, pas une constante exportée
              readOnly
            />
            <MediaInfoRow
              label="Formats acceptés en entrée"
              value={acceptedFormats}
              readOnly
            />
          </div>
        </section>

        {/* Section Bibliothèque */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Library className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Bibliothèque</h2>
          </div>

          <div className="divide-y divide-border rounded-lg border bg-card">
            <MediaInfoRow
              label="Assets actifs"
              value={stats.activeAssetCount.toLocaleString("fr-FR")}
            />
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}

// ---------------------------------------------------------------------------
// Composant interne — affichage d'une ligne info lecture seule
// ---------------------------------------------------------------------------

type MediaInfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
  readOnly?: boolean;
};

function MediaInfoRow({ label, value, mono = false, readOnly = false }: MediaInfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {readOnly && (
          <Badge variant="outline" className="shrink-0 text-[10px] font-normal text-muted-foreground">
            Non configurable
          </Badge>
        )}
        <span
          className={
            mono
              ? "max-w-65 truncate text-right text-sm font-mono text-foreground"
              : "text-right text-sm font-medium text-foreground"
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
}
