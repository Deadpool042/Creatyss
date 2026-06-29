"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared";
import {
  uploadStoreLogoAction,
  removeStoreLogoAction,
  type StoreLogoActionState,
} from "@/features/admin/settings/actions/update-store-logo.action";

const IDLE: StoreLogoActionState = { status: "idle" };

type Props = {
  logoUrl: string | null;
  storeName: string;
};

export function StoreLogoSection({ logoUrl, storeName }: Props) {
  const router = useRouter();
  const [uploadState, uploadAction, isUploading] = useActionState(uploadStoreLogoAction, IDLE);
  const [removeState, removeAction, isRemoving] = useActionState(removeStoreLogoAction, IDLE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadState.status === "success") {
      toast.success(uploadState.message);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } else if (uploadState.status === "error") {
      toast.error(uploadState.message);
    }
  }, [uploadState, router]);

  useEffect(() => {
    if (removeState.status === "success") {
      toast.success(removeState.message);
      router.refresh();
    } else if (removeState.status === "error") {
      toast.error(removeState.message);
    }
  }, [removeState, router]);

  return (
    <AdminFormSection
      eyebrow="Identité visuelle"
      title="Logo"
      description="Affiché dans le header, le footer et la page de connexion."
      className="py-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex h-24 w-64 max-w-full items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-surface-subtle">
          {logoUrl !== null ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={256}
              height={96}
              unoptimized
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <span className="text-xs text-muted-foreground">Aucun logo configuré</span>
          )}
        </div>

        <div className="flex flex-col gap-2 self-start">
          <form action={uploadAction}>
            <label className="flex cursor-pointer flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                name="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                onChange={(e) => {
                  if (e.currentTarget.files?.[0]) {
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading
                  ? "Envoi…"
                  : logoUrl !== null
                    ? "Changer le logo"
                    : "Téléverser un logo"}
              </Button>
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, WebP ou AVIF · max 10 Mo
            </p>
          </form>

          {logoUrl !== null && (
            <form action={removeAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                disabled={isRemoving}
                className="text-muted-foreground hover:text-destructive"
              >
                {isRemoving ? "Retrait…" : "Retirer le logo"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AdminFormSection>
  );
}
