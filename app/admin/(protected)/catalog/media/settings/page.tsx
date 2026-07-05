import { HardDrive, Image as ImageIcon, Library, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { serverEnv } from "@/core/config/env/server";
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  IMAGE_MAX_DIMENSION_PX,
  IMAGE_OUTPUT_FORMAT,
  IMAGE_WEBP_QUALITY,
  getUploadsPublicPath,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/core/uploads";
import { MediaRouteNav } from "@/features/admin/media/components/media-route-nav";
import { getAdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

export const dynamic = "force-dynamic";

export default async function AdminCatalogMediaSettingsPage() {
  await requireAdminCapability("admin.settings.media.read");

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
  const storageHealthLabel = uploadsDir ? "Opérationnel" : "À vérifier";
  const libraryDensityLabel =
    stats.activeAssetCount > 0
      ? `${stats.activeAssetCount.toLocaleString("fr-FR")} actifs`
      : "Bibliothèque vide";

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Médias"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Médias", href: "/admin/catalog/media" },
        { label: "Configuration" },
      ]}
      contentPreset="table"
    >
      <MediaRouteNav />
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Configuration du stockage et du traitement des images. Ces paramètres sont définis dans
            l&apos;environnement et ne sont pas modifiables ici.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MediaStatCard
              label="Stockage"
              value={storageHealthLabel}
              hint={uploadsDir ? "Répertoire local résolu côté serveur." : "Variable uploadsDir absente."}
            />
            <MediaStatCard
              label="URL publique"
              value={publicPath}
              hint="Chemin servi au storefront et à l'admin."
              mono
            />
            <MediaStatCard
              label="Sortie image"
              value={`${IMAGE_OUTPUT_FORMAT.toUpperCase()} · Q${IMAGE_WEBP_QUALITY}`}
              hint={`Max ${IMAGE_MAX_DIMENSION_PX}px · ${maxFileSizeMb} Mo`}
            />
            <MediaStatCard
              label="Bibliothèque"
              value={libraryDensityLabel}
              hint="Nombre d'assets actifs actuellement exposés."
            />
          </div>
        </div>

        <section className="rounded-3xl border border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_94%,white)_0%,color-mix(in_srgb,var(--surface-panel)_78%,var(--shell-surface))_100%)] p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background/80 shadow-sm">
              <ShieldCheck className="size-5 text-foreground/80" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Gouvernance
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                Paramètres pilotés par l’environnement
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Cette page documente l’état effectif du stockage local et du pipeline image. Les
                changements se font côté infra ou variables serveur, pas depuis l’admin.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <MediaConfigSection
            icon={<HardDrive className="size-4 text-muted-foreground" />}
            eyebrow="Infrastructure"
            title="Stockage"
            description="Lecture des chemins résolus réellement côté serveur."
          >
            <MediaInfoRow label="Type de stockage" value="Système de fichiers local" readOnly />
            <MediaInfoRow
              label="Répertoire effectif"
              value={uploadsDir ?? "Non configuré"}
              mono
              readOnly
            />
            <MediaInfoRow label="URL publique" value={publicPath} mono readOnly />
          </MediaConfigSection>

          <MediaConfigSection
            icon={<Sparkles className="size-4 text-muted-foreground" />}
            eyebrow="Lecture rapide"
            title="Repères d’exploitation"
            description="Ce qu’il faut vérifier en priorité avant diagnostic."
          >
            <MediaBullet>
              Les uploads admin et les visuels storefront dépendent du même répertoire public.
            </MediaBullet>
            <MediaBullet>
              Une valeur vide sur le répertoire effectif signale un cadrage infra incomplet.
            </MediaBullet>
            <MediaBullet>
              Le format de sortie et la qualité WebP impactent directement poids et netteté.
            </MediaBullet>
          </MediaConfigSection>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <MediaConfigSection
            icon={<ImageIcon className="size-4 text-muted-foreground" />}
            eyebrow="Pipeline image"
            title="Traitement des images"
            description="Contraintes appliquées lors de l’import et de la génération des assets."
          >
            <MediaInfoRow label="Format de sortie" value={IMAGE_OUTPUT_FORMAT.toUpperCase()} readOnly />
            <MediaInfoRow label="Taille maximale acceptée" value={`${maxFileSizeMb} Mo`} readOnly />
            <MediaInfoRow
              label="Dimensions maximales"
              value={`${IMAGE_MAX_DIMENSION_PX} × ${IMAGE_MAX_DIMENSION_PX} px`}
              readOnly
            />
            <MediaInfoRow label="Qualité WebP" value={String(IMAGE_WEBP_QUALITY)} readOnly />
            <MediaInfoRow label="Formats acceptés en entrée" value={acceptedFormats} readOnly />
          </MediaConfigSection>

          <MediaConfigSection
            icon={<Library className="size-4 text-muted-foreground" />}
            eyebrow="Bibliothèque"
            title="État courant"
            description="Synthèse de la médiathèque active visible dans l’admin."
          >
            <MediaInfoRow
              label="Assets actifs"
              value={stats.activeAssetCount.toLocaleString("fr-FR")}
            />
            <MediaInfoRow label="Formats en entrée" value={acceptedFormats} readOnly />
          </MediaConfigSection>
        </div>
      </div>
    </AdminPageShell>
  );
}

type MediaConfigSectionProps = Readonly<{
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}>;

function MediaConfigSection({
  icon,
  eyebrow,
  title,
  description,
  children,
}: MediaConfigSectionProps) {
  return (
    <section className="rounded-2xl border border-surface-border/60 bg-card p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-subtle/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-surface-border/60">
        {children}
      </div>
    </section>
  );
}

function MediaStatCard({
  label,
  value,
  hint,
  mono = false,
}: Readonly<{
  label: string;
  value: string;
  hint: string;
  mono?: boolean;
}>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className={mono ? "mt-2 break-all font-mono text-sm text-foreground" : "mt-2 text-lg font-semibold text-foreground"}>
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{hint}</p>
    </div>
  );
}

type MediaInfoRowProps = {
  label: string;
  value: string;
  mono?: boolean;
  readOnly?: boolean;
};

function MediaInfoRow({ label, value, mono = false, readOnly = false }: MediaInfoRowProps) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {readOnly && (
          <Badge
            variant="outline"
            className="shrink-0 text-[10px] font-normal text-muted-foreground"
          >
            Non configurable
          </Badge>
        )}
        <span
          className={
            mono
              ? "min-w-0 break-all text-sm font-mono text-foreground sm:max-w-65 sm:text-right"
              : "text-sm font-medium text-foreground sm:text-right"
          }
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function MediaBullet({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex gap-3 border-b border-surface-border/60 px-4 py-3 last:border-b-0">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/70" />
      <p className="text-sm leading-6 text-foreground/85">{children}</p>
    </div>
  );
}
