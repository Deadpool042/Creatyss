import { SectionIntro } from "@/components/section-intro";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

type EditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
};

export function EditorialSection({
  editorialTitle,
  editorialText
}: EditorialSectionProps) {
  return (
    <AdminFormSection>
      <SectionIntro
        className="stack"
        description="Complétez ensuite le texte éditorial affiché sous la bannière principale."
        eyebrow="Éditorial"
        title="Bloc éditorial"
      />

      <AdminFormField label="Titre éditorial">
        <input
          className="admin-input"
          defaultValue={editorialTitle ?? ""}
          name="editorialTitle"
          type="text"
        />
      </AdminFormField>

      <AdminFormField label="Texte éditorial">
        <textarea
          className="admin-input admin-textarea"
          defaultValue={editorialText ?? ""}
          name="editorialText"
          rows={5}
        />
      </AdminFormField>
    </AdminFormSection>
  );
}
