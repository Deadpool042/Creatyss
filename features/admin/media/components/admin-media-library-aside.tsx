import { Upload } from "lucide-react";

import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE_BYTES } from "@/core/uploads";

import { uploadMediaAction } from "./admin-media-library-actions";
import {
  formatByteSize,
  integerFormatter,
  mediaDateFormatter,
} from "./admin-media-library-helpers";

const acceptedFormatsLabel = [...ACCEPTED_IMAGE_MIME_TYPES]
  .map((mime) => mime.replace("image/", "").toUpperCase())
  .join(", ");

const maxFileSizeMb = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);

type AdminMediaLibraryAsideProps = Readonly<{
  activeAssetCount: number;
  currentPage: number;
  latestImageCreatedAt: Date | null;
  totalCount: number;
  totalImageBytes: number;
}>;

export function AdminMediaLibraryAside({
  activeAssetCount,
  currentPage,
  latestImageCreatedAt,
  totalCount,
  totalImageBytes,
}: AdminMediaLibraryAsideProps) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card shadow-card">
      <div className="grid gap-5 px-5 py-5">
        <AdminFormSection
          eyebrow="Médiathèque"
          title="Vue d'ensemble"
          description={
            <>
            Ce panneau résume la bibliothèque active. Cliquez sur une image pour passer en mode
            détail et gérer ce média.
            </>
          }
          className="space-y-0"
          contentClassName="space-y-3"
        >
          <div className="grid gap-3">
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
          </div>

          <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/20 p-4 text-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Repères
            </p>
            <p className="mt-2 leading-6 text-muted-foreground">
              {integerFormatter.format(totalCount)} image{totalCount > 1 ? "s" : ""} active
              {totalCount > 1 ? "s" : ""} répartie{totalCount > 1 ? "s" : ""} sur la page{" "}
              {currentPage}.
            </p>
            <p className="mt-1 leading-6 text-muted-foreground">
              Formats acceptés : {acceptedFormatsLabel}. Taille maximale : {maxFileSizeMb} MB.
            </p>
          </div>
        </AdminFormSection>

        <div
          id="admin-media-upload"
          className="grid gap-4 scroll-mt-24 border-t border-surface-border/60 pt-5"
        >
          <AdminFormSection
            eyebrow="Import"
            title="Ajouter une image"
            description="Le média devient réutilisable immédiatement dans le catalogue et les contenus."
          >
            <form action={uploadMediaAction} className="grid gap-4">
              <AdminFormField
                htmlFor="media-file"
                label="Image"
                description="JPEG, PNG, WebP ou AVIF. Taille maximale : 10 MB."
                required
              >
                <Input
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="h-11 rounded-2xl border-surface-border bg-card px-3 shadow-none file:mr-3 file:rounded-full file:border file:border-surface-border file:bg-surface-panel file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
                  id="media-file"
                  name="file"
                  required
                  type="file"
                />
              </AdminFormField>

              <Button type="submit" className="w-full">
                <Upload className="size-4" />
                Importer le média
              </Button>
            </form>
          </AdminFormSection>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, hint }: Readonly<{ label: string; value: string; hint: string }>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
