import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";

type EditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
};

export function EditorialSection({ editorialTitle, editorialText }: EditorialSectionProps) {
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
    </AdminFormSection>
  );
}
