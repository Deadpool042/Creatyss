"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

import {
  updateMediaMetadataAction,
  type UpdateMediaMetadataActionState,
} from "./admin-media-library-actions";

const INITIAL_STATE: UpdateMediaMetadataActionState = {
  status: "idle",
  message: null,
};

type AdminMediaMetadataFormProps = Readonly<{
  asset: AdminMediaListItem;
}>;

export function AdminMediaMetadataForm({
  asset,
}: AdminMediaMetadataFormProps) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateMediaMetadataAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="assetId" value={asset.id} />

      <AdminFormMessage
        tone={state.status === "error" ? "error" : "success"}
        message={state.status === "idle" ? null : state.message}
      />

      <div className="grid gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          SEO
        </p>
        <h4 className="text-base font-semibold text-foreground">Métadonnées du média</h4>
        <p className="text-sm leading-6 text-muted-foreground">
          Texte alternatif et champs éditoriaux réutilisables dans le catalogue et les partages.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminFormField htmlFor="media-title" label="Titre" error={state.fieldErrors?.title}>
          <Input
            id="media-title"
            name="title"
            defaultValue={asset.title ?? ""}
            maxLength={255}
            placeholder={asset.originalName}
            className="h-10"
          />
        </AdminFormField>

        <AdminFormField htmlFor="media-slug" label="Slug" error={state.fieldErrors?.slug}>
          <Input
            id="media-slug"
            name="slug"
            defaultValue={asset.slug ?? ""}
            maxLength={120}
            placeholder="sac-camel-atelier"
            className="h-10"
          />
        </AdminFormField>
      </div>

      <AdminFormField
        htmlFor="media-alt-text"
        label="Texte alternatif"
        description="Accessibilité et base SEO."
        error={state.fieldErrors?.altText}
      >
        <Textarea
          id="media-alt-text"
          name="altText"
          defaultValue={asset.altText ?? ""}
          maxLength={255}
          rows={3}
          placeholder="Sac cabas camel photographié en atelier sur une table en bois."
          className="min-h-24"
        />
      </AdminFormField>

      <div className="grid gap-3">
        <AdminFormField
          htmlFor="media-caption"
          label="Légende"
          error={state.fieldErrors?.caption}
        >
          <Textarea
            id="media-caption"
            name="caption"
            defaultValue={asset.caption ?? ""}
            maxLength={500}
            rows={2}
            placeholder="Visuel principal de la collection atelier."
            className="min-h-20"
          />
        </AdminFormField>

        <AdminFormField
          htmlFor="media-description"
          label="Description"
          error={state.fieldErrors?.description}
        >
          <Textarea
            id="media-description"
            name="description"
            defaultValue={asset.description ?? ""}
            maxLength={2000}
            rows={3}
            placeholder="Contexte éditorial, intention photo, notes de réutilisation..."
            className="min-h-24"
          />
        </AdminFormField>
      </div>

      <Button type="submit" disabled={pending} className="w-full rounded-full">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
