import type { ReactNode } from "react";
import { HardDrive, Image as ImageIcon, Library, Upload } from "lucide-react";

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
        <div className="grid gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
            Médiathèque
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Vue d'ensemble
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Ce panneau résume la bibliothèque active. Cliquez sur une image pour passer en mode
            détail et gérer ce média.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <InfoTile
            icon={<Library className="size-4" />}
            label="Images actives"
            value={integerFormatter.format(activeAssetCount)}
          />
          <InfoTile
            icon={<ImageIcon className="size-4" />}
            label="Poids cumulé"
            value={formatByteSize(totalImageBytes)}
          />
          <InfoTile
            icon={<HardDrive className="size-4" />}
            label="Dernier import"
            value={
              latestImageCreatedAt ? mediaDateFormatter.format(latestImageCreatedAt) : "Aucun"
            }
          />
        </div>

        <div className="grid gap-2 rounded-2xl border border-surface-border/60 bg-surface-panel/25 px-4 py-4 text-sm">
          <p className="font-medium text-foreground">Repères bibliothèque</p>
          <p className="leading-6 text-muted-foreground">
            {integerFormatter.format(totalCount)} image{totalCount > 1 ? "s" : ""} active
            {totalCount > 1 ? "s" : ""} répartie{totalCount > 1 ? "s" : ""} sur la page{" "}
            {currentPage}.
          </p>
          <p className="leading-6 text-muted-foreground">
            Formats acceptés : {acceptedFormatsLabel}. Taille maximale : {maxFileSizeMb} MB.
          </p>
        </div>

        <div
          id="admin-media-upload"
          className="grid gap-4 scroll-mt-24 border-t border-surface-border/60 pt-5"
        >
          <div className="grid gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Import
            </p>
            <h4 className="text-base font-semibold text-foreground">Ajouter une image</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              Le média devient réutilisable immédiatement dans le catalogue et les contenus.
            </p>
          </div>

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
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: Readonly<{
  icon: ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/25 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">{icon}</div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
