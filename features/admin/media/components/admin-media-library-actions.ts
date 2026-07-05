"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  deleteAdminMediaPermanently,
  DeleteAdminMediaPermanentlyError,
  MediaUploadError,
  restoreAdminMedia,
  UpdateAdminMediaMetadataError,
  updateAdminMediaMetadata,
  uploadAdminMedia,
} from "@/features/admin/media";
import { archiveAdminMedia } from "@/features/admin/media/services/archive-admin-media.service";

import {
  buildMediaLibraryHref,
  getSingleSearchParam,
  parseAdminMediaFormatFilter,
  parseAdminMediaLibraryView,
  parseAdminMediaSortOption,
  parseAdminMediaUsageFilter,
  parseOptionalPositiveInt,
  parsePositiveInt,
} from "./admin-media-library-helpers";

const mediaMetadataSchema = z.object({
  assetId: z.string().trim().min(1, "Média invalide."),
  slug: z
    .string()
    .trim()
    .max(120, "120 caractères maximum.")
    .regex(/^[a-z0-9-]*$/, "Utilisez seulement des lettres minuscules, chiffres et tirets.")
    .optional()
    .or(z.literal("")),
  title: z.string().trim().max(255, "255 caractères maximum.").optional().or(z.literal("")),
  altText: z.string().trim().max(255, "255 caractères maximum.").optional().or(z.literal("")),
  caption: z.string().trim().max(500, "500 caractères maximum.").optional().or(z.literal("")),
  description: z.string().trim().max(2000, "2000 caractères maximum.").optional().or(z.literal("")),
});

export type UpdateMediaMetadataActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<"slug" | "title" | "altText" | "caption" | "description", string>>;
};

const INITIAL_UPDATE_MEDIA_METADATA_STATE: UpdateMediaMetadataActionState = {
  status: "idle",
  message: null,
};

export async function archiveMediaAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  const assetId = formData.get("assetId");
  const page = parsePositiveInt(formData.get("page"));
  const perPage = parseOptionalPositiveInt(formData.get("perPage"));
  const q = getSingleSearchParam(String(formData.get("q") ?? "").trim() || undefined);
  const sortRaw = getSingleSearchParam(String(formData.get("sort") ?? "").trim() || undefined);
  const formatRaw = getSingleSearchParam(String(formData.get("format") ?? "").trim() || undefined);
  const usageRaw = getSingleSearchParam(String(formData.get("usage") ?? "").trim() || undefined);
  const viewRaw = getSingleSearchParam(String(formData.get("view") ?? "").trim() || undefined);
  const sort = sortRaw ? parseAdminMediaSortOption(sortRaw) : undefined;
  const format = formatRaw ? parseAdminMediaFormatFilter(formatRaw) : undefined;
  const usage = usageRaw ? parseAdminMediaUsageFilter(usageRaw) : undefined;
  const view = viewRaw ? parseAdminMediaLibraryView(viewRaw) : undefined;

  if (typeof assetId === "string" && assetId.trim().length > 0) {
    await archiveAdminMedia({ assetId: assetId.trim() });
  }

  redirect(
    buildMediaLibraryHref({
      ...(format ? { format } : {}),
      page,
      ...(perPage ? { perPage } : {}),
      ...(q ? { q } : {}),
      ...(sort ? { sort } : {}),
      ...(usage ? { usage } : {}),
      status: "archived",
      ...(view ? { view } : {}),
    })
  );
}

export async function restoreMediaAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  const assetId = String(formData.get("assetId") ?? "").trim();
  const perPage = parseOptionalPositiveInt(formData.get("perPage"));
  const q = getSingleSearchParam(String(formData.get("q") ?? "").trim() || undefined);
  const sortRaw = getSingleSearchParam(String(formData.get("sort") ?? "").trim() || undefined);
  const formatRaw = getSingleSearchParam(String(formData.get("format") ?? "").trim() || undefined);
  const usageRaw = getSingleSearchParam(String(formData.get("usage") ?? "").trim() || undefined);
  const sort = sortRaw ? parseAdminMediaSortOption(sortRaw) : undefined;
  const format = formatRaw ? parseAdminMediaFormatFilter(formatRaw) : undefined;
  const usage = usageRaw ? parseAdminMediaUsageFilter(usageRaw) : undefined;

  try {
    if (assetId.length > 0) {
      await restoreAdminMedia({ assetId });
    }
  } catch {
    redirect(
      buildMediaLibraryHref({
        ...(format ? { format } : {}),
        ...(perPage ? { perPage } : {}),
        ...(q ? { q } : {}),
        ...(sort ? { sort } : {}),
        ...(usage ? { usage } : {}),
        view: "trash",
        error: "restore_failed",
      })
    );
  }

  redirect(
    buildMediaLibraryHref({
      ...(format ? { format } : {}),
      ...(perPage ? { perPage } : {}),
      ...(q ? { q } : {}),
      ...(sort ? { sort } : {}),
      ...(usage ? { usage } : {}),
      view: "trash",
      status: "restored",
    })
  );
}

export async function deleteMediaPermanentlyAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  const assetId = String(formData.get("assetId") ?? "").trim();
  const perPage = parseOptionalPositiveInt(formData.get("perPage"));
  const q = getSingleSearchParam(String(formData.get("q") ?? "").trim() || undefined);
  const sortRaw = getSingleSearchParam(String(formData.get("sort") ?? "").trim() || undefined);
  const formatRaw = getSingleSearchParam(String(formData.get("format") ?? "").trim() || undefined);
  const usageRaw = getSingleSearchParam(String(formData.get("usage") ?? "").trim() || undefined);
  const sort = sortRaw ? parseAdminMediaSortOption(sortRaw) : undefined;
  const format = formatRaw ? parseAdminMediaFormatFilter(formatRaw) : undefined;
  const usage = usageRaw ? parseAdminMediaUsageFilter(usageRaw) : undefined;

  try {
    if (assetId.length > 0) {
      await deleteAdminMediaPermanently({ assetId });
    }
  } catch (error) {
    if (error instanceof DeleteAdminMediaPermanentlyError) {
      redirect(
        buildMediaLibraryHref({
          ...(format ? { format } : {}),
          ...(perPage ? { perPage } : {}),
          ...(q ? { q } : {}),
          ...(sort ? { sort } : {}),
          ...(usage ? { usage } : {}),
          view: "trash",
          error: "delete_failed",
        })
      );
    }

    redirect(
      buildMediaLibraryHref({
        ...(format ? { format } : {}),
        ...(perPage ? { perPage } : {}),
        ...(q ? { q } : {}),
        ...(sort ? { sort } : {}),
        ...(usage ? { usage } : {}),
        view: "trash",
        error: "delete_failed",
      })
    );
  }

  redirect(
    buildMediaLibraryHref({
      ...(format ? { format } : {}),
      ...(perPage ? { perPage } : {}),
      ...(q ? { q } : {}),
      ...(sort ? { sort } : {}),
      ...(usage ? { usage } : {}),
      view: "trash",
      status: "deleted",
    })
  );
}

export async function uploadMediaAction(formData: FormData) {
  await requireAuthenticatedAdmin();

  const perPage = parseOptionalPositiveInt(formData.get("perPage"));
  const q = getSingleSearchParam(String(formData.get("q") ?? "").trim() || undefined);
  const sortRaw = getSingleSearchParam(String(formData.get("sort") ?? "").trim() || undefined);
  const formatRaw = getSingleSearchParam(String(formData.get("format") ?? "").trim() || undefined);
  const usageRaw = getSingleSearchParam(String(formData.get("usage") ?? "").trim() || undefined);
  const viewRaw = getSingleSearchParam(String(formData.get("view") ?? "").trim() || undefined);
  const sort = sortRaw ? parseAdminMediaSortOption(sortRaw) : undefined;
  const format = formatRaw ? parseAdminMediaFormatFilter(formatRaw) : undefined;
  const usage = usageRaw ? parseAdminMediaUsageFilter(usageRaw) : undefined;
  const view = viewRaw ? parseAdminMediaLibraryView(viewRaw) : undefined;

  try {
    const asset = await uploadAdminMedia({
      file: formData.get("file"),
    });

    redirect(
      buildMediaLibraryHref({
        assetId: asset.id,
        ...(format ? { format } : {}),
        ...(perPage ? { perPage } : {}),
        ...(q ? { q } : {}),
        ...(sort ? { sort } : {}),
        ...(usage ? { usage } : {}),
        status: "uploaded",
        ...(view ? { view } : {}),
      })
    );
  } catch (error) {
    const errorCode = error instanceof MediaUploadError ? error.code : "upload_failed";
    redirect(
      buildMediaLibraryHref({
        error: errorCode,
        ...(format ? { format } : {}),
        ...(perPage ? { perPage } : {}),
        ...(q ? { q } : {}),
        ...(sort ? { sort } : {}),
        ...(usage ? { usage } : {}),
        ...(view ? { view } : {}),
      })
    );
  }
}

export async function updateMediaMetadataAction(
  _prevState: UpdateMediaMetadataActionState = INITIAL_UPDATE_MEDIA_METADATA_STATE,
  formData: FormData
): Promise<UpdateMediaMetadataActionState> {
  await requireAuthenticatedAdmin();

  const parsed = mediaMetadataSchema.safeParse({
    assetId: formData.get("assetId"),
    slug: formData.get("slug") ?? "",
    title: formData.get("title") ?? "",
    altText: formData.get("altText") ?? "",
    caption: formData.get("caption") ?? "",
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Corrigez les champs invalides.",
      fieldErrors: {
        ...(flat.slug?.[0] ? { slug: flat.slug[0] } : {}),
        ...(flat.title?.[0] ? { title: flat.title[0] } : {}),
        ...(flat.altText?.[0] ? { altText: flat.altText[0] } : {}),
        ...(flat.caption?.[0] ? { caption: flat.caption[0] } : {}),
        ...(flat.description?.[0] ? { description: flat.description[0] } : {}),
      },
    };
  }

  try {
    await updateAdminMediaMetadata({
      assetId: parsed.data.assetId,
      slug: parsed.data.slug || null,
      title: parsed.data.title || null,
      altText: parsed.data.altText || null,
      caption: parsed.data.caption || null,
      description: parsed.data.description || null,
    });

    return {
      status: "success",
      message: "Métadonnées du média mises à jour.",
    };
  } catch (error) {
    if (error instanceof UpdateAdminMediaMetadataError && error.code === "slug_conflict") {
      return {
        status: "error",
        message: "Le slug est déjà utilisé.",
        fieldErrors: {
          slug: "Ce slug existe déjà.",
        },
      };
    }

    return {
      status: "error",
      message: "La mise à jour du média a échoué.",
    };
  }
}
