import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Notice } from "@/components/notice";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

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
  mediaAssets
}: HeroSectionProps) {
  return (
    <AdminFormSection
      description="Renseignez ici le titre, le texte et l'image visibles en haut de la page d'accueil."
      eyebrow="Mise en avant principale"
      title="Bannière principale">

      {heroImageUrl ? (
        <div className="admin-homepage-hero-preview">
          <img
            alt={heroTitle ?? "Image principale actuelle"}
            src={heroImageUrl}
          />
        </div>
      ) : (
        <div className="admin-homepage-hero-preview admin-image-placeholder">
          Aucune image principale actuellement
        </div>
      )}

      <AdminFormField
        htmlFor="homepage-hero-title"
        label="Titre principal">
        <Input
          defaultValue={heroTitle ?? ""}
          id="homepage-hero-title"
          name="heroTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="homepage-hero-text"
        label="Texte principal">
        <Textarea
          defaultValue={heroText ?? ""}
          id="homepage-hero-text"
          name="heroText"
          rows={4}
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="homepage-hero-image"
        label="Image principale">
        <select
          className="admin-input"
          defaultValue={heroImageSelectValue}
          id="homepage-hero-image"
          name="heroImageMediaAssetId">
          {heroImagePath !== null && currentHeroMediaAsset === null ? (
            <option value="__keep_current__">
              Conserver l&apos;image actuelle ({heroImagePath})
            </option>
          ) : null}
          <option value="">Aucune image principale</option>
          {mediaAssets.map(mediaAsset => (
            <option
              key={mediaAsset.id}
              value={mediaAsset.id}>
              {mediaAsset.originalName} · {mediaAsset.mimeType}
            </option>
          ))}
        </select>
      </AdminFormField>

      {mediaAssets.length === 0 ? (
        <Notice tone="note">
          Aucun média n&apos;est disponible. Vous pouvez en importer depuis{" "}
          <Link
            className="link"
            href="/admin/media">
            la bibliothèque médias
          </Link>
          .
        </Notice>
      ) : null}
    </AdminFormSection>
  );
}
