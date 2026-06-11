import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";

type EditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
  shippingReturnsPolicy: string | null;
};

export function EditorialSection({
  editorialTitle,
  editorialText,
  shippingReturnsPolicy,
}: EditorialSectionProps) {
  return (
    <AdminFormSection
      description="Complétez ensuite le texte éditorial affiché sous la bannière principale."
      eyebrow="Éditorial"
      title="Bloc éditorial"
    >
      <AdminFormField htmlFor="homepage-editorial-title" label="Titre éditorial">
        <Input
          defaultValue={editorialTitle ?? ""}
          id="homepage-editorial-title"
          name="editorialTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField htmlFor="homepage-editorial-text" label="Texte éditorial">
        <Textarea
          defaultValue={editorialText ?? ""}
          id="homepage-editorial-text"
          name="editorialText"
          rows={5}
        />
      </AdminFormField>

      <AdminFormField
        htmlFor="homepage-shipping-returns-policy"
        label="Livraison & retours (fiches produit)"
        hint="Texte court affiché sur les fiches produit dans le bloc Livraison & retours — formulation générale, sans promesse spécifique à un produit. La politique de retour complète se gère dans Contenu > Pages. Champ également éditable dans Réglages > Général."
      >
        <Textarea
          defaultValue={shippingReturnsPolicy ?? ""}
          id="homepage-shipping-returns-policy"
          name="shippingReturnsPolicy"
          rows={4}
        />
      </AdminFormField>
    </AdminFormSection>
  );
}
