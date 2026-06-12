import { Notice } from "@/components/shared/feedback";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import {
  CATEGORY_ARCHIVED_NOTICE_COPY,
  CATEGORY_FIELD_COPY,
  CATEGORY_GENERAL_SECTION_COPY,
  CATEGORY_RESTORE_SECTION_COPY,
} from "../../config";
import type { AdminCategoryDetail } from "../../types";
import { CategoryRestoreButton } from "./category-restore-button";

type CategoryArchivedPanelProps = Readonly<{
  category: AdminCategoryDetail;
}>;

function renderParentValue(value: string | null): string {
  if (value === null) return CATEGORY_FIELD_COPY.parentNoneOptionLabel;

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : CATEGORY_FIELD_COPY.parentNoneOptionLabel;
}

function renderDescription(value: string | null): string {
  if (value === null) return "Aucune description";

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : "Aucune description";
}

export function CategoryArchivedPanel({ category }: CategoryArchivedPanelProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.92fr)] xl:items-start">
      <div className="space-y-6">
        <Notice tone="note">{CATEGORY_ARCHIVED_NOTICE_COPY}</Notice>

        <AdminSplitDetailSectionCard>
          <AdminSplitDetailSectionHeader
            eyebrow={CATEGORY_GENERAL_SECTION_COPY.eyebrow}
            title={CATEGORY_GENERAL_SECTION_COPY.title}
            description="Consultez les informations existantes, puis restaurez la catégorie pour reprendre les modifications."
          />

          <dl className="grid gap-4 text-sm leading-6 text-muted-foreground">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/75">
                {CATEGORY_FIELD_COPY.nameLabel}
              </dt>
              <dd className="mt-1 text-foreground">{category.name}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/75">
                {CATEGORY_FIELD_COPY.slugLabel}
              </dt>
              <dd className="mt-1 text-foreground">{category.slug}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/75">
                {CATEGORY_FIELD_COPY.parentLabel}
              </dt>
              <dd className="mt-1 text-foreground">{renderParentValue(category.parentName)}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/75">
                {CATEGORY_FIELD_COPY.descriptionLabel}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-foreground">
                {renderDescription(category.description)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground/75">
                Statut
              </dt>
              <dd className="mt-1 text-foreground">Archivée</dd>
            </div>
          </dl>
        </AdminSplitDetailSectionCard>
      </div>

      <div className="space-y-6 xl:sticky xl:top-10 2xl:top-12">
        <AdminSplitDetailSectionCard tone="secondary">
          <AdminSplitDetailSectionHeader
            eyebrow={CATEGORY_RESTORE_SECTION_COPY.eyebrow}
            title={CATEGORY_RESTORE_SECTION_COPY.title}
            description={CATEGORY_RESTORE_SECTION_COPY.description}
          />
          <CategoryRestoreButton categoryId={category.id} categoryName={category.name} />
        </AdminSplitDetailSectionCard>
      </div>
    </div>
  );
}
