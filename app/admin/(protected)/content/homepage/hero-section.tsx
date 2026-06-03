import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/shared/feedback";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminSelectField } from "@/components/admin/forms/admin-select-field";

type MediaAsset = {
  id: string;
  originalName: string;
  mimeType: string;
};

type HeroSectionProps = {
  heroImageUrl: string | null;
  heroTitle: string | null;
  heroText: string | null;
  heroImageSelectValue: string;
  heroImagePath: string | null;
  currentHeroMediaAsset: { id: string } | null;
  mediaAssets: MediaAsset[];
};

export function HeroSection({
  heroImageUrl,
  heroTitle,
  heroText,
  heroImageSelectValue,
  heroImagePath,
  currentHeroMediaAsset,
  mediaAssets,
}: HeroSectionProps) {
  return (
    <AdminFormSection
      contentClassName="gap-5"
      description="Renseignez ici le titre, le texte et l'image visibles en haut de la page d'accueil."
      eyebrow="Mise en avant principale"
      title="Bannière principale"
    >
      {heroImageUrl ? (
        <div className="overflow-hidden rounded-xl border border-surface-border/60 bg-surface-subtle/20 shadow-xs">
          <Image
            alt={heroTitle ?? "Image principale actuelle"}
            className="aspect-[16/7] w-full object-cover"
            src={heroImageUrl}
            width={1600}
            height={700}
          />
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-surface-border/60 bg-surface-subtle/20 px-6 text-center text-sm leading-6 text-muted-foreground">
          Aucune image principale actuellement
        </div>
      )}

      <AdminFormField htmlFor="homepage-hero-title" label="Titre principal">
        <Input
          defaultValue={heroTitle ?? ""}
          id="homepage-hero-title"
          name="heroTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField htmlFor="homepage-hero-text" label="Texte principal">
        <Textarea defaultValue={heroText ?? ""} id="homepage-hero-text" name="heroText" rows={4} />
      </AdminFormField>

      <AdminFormField htmlFor="homepage-hero-image" label="Image principale">
        <AdminSelectField
          defaultValue={heroImageSelectValue}
          id="homepage-hero-image"
          name="heroImageMediaAssetId"
        >
          {heroImagePath !== null && currentHeroMediaAsset === null ? (
            <option value="__keep_current__">
              Conserver l&apos;image actuelle ({heroImagePath})
            </option>
          ) : null}
          <option value="">Aucune image principale</option>
          {mediaAssets.map((mediaAsset) => (
            <option key={mediaAsset.id} value={mediaAsset.id}>
              {mediaAsset.originalName} · {mediaAsset.mimeType}
            </option>
          ))}
        </AdminSelectField>
      </AdminFormField>

      {mediaAssets.length === 0 ? (
        <Notice tone="note">
          Aucun média n&apos;est disponible. Vous pouvez en importer depuis{" "}
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            href="/admin/media"
          >
            la bibliothèque médias
          </Link>
          .
        </Notice>
      ) : null}
    </AdminFormSection>
  );
}
