import { Upload } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { uploadMediaAction } from "./admin-media-library-actions";
import type { MediaLibrarySearchParams } from "./admin-media-library-helpers";

type AdminMediaUploadFormProps = Readonly<{
  searchState?: Pick<
    MediaLibrarySearchParams,
    "format" | "perPage" | "q" | "sort" | "usage" | "view"
  > | undefined;
  submitLabel?: string | undefined;
}>;

export function AdminMediaUploadForm({
  searchState,
  submitLabel = "Importer le média",
}: AdminMediaUploadFormProps) {
  return (
    <form action={uploadMediaAction} className="grid gap-4">
      {searchState?.perPage ? (
        <input type="hidden" name="perPage" value={String(searchState.perPage)} />
      ) : null}
      {searchState?.q ? <input type="hidden" name="q" value={searchState.q} /> : null}
      {searchState?.sort ? <input type="hidden" name="sort" value={searchState.sort} /> : null}
      {searchState?.format ? <input type="hidden" name="format" value={searchState.format} /> : null}
      {searchState?.usage ? <input type="hidden" name="usage" value={searchState.usage} /> : null}
      {searchState?.view ? <input type="hidden" name="view" value={searchState.view} /> : null}

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
        {submitLabel}
      </Button>
    </form>
  );
}
