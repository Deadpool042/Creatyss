import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminSelectField } from "@/components/admin/forms/admin-select-field";
import { CATEGORY_FIELD_COPY } from "../../config";
import type { CategoryPickerItem } from "../../list";

type CategoryParentFieldProps = Readonly<{
  items: CategoryPickerItem[];
  selectedParentId?: string | null;
  currentCategoryId?: string | null;
  disabled?: boolean;
}>;

type CategoryParentOption = {
  id: string;
  label: string;
};

function buildParentOptions(
  items: CategoryPickerItem[],
  currentCategoryId: string | null | undefined
): CategoryParentOption[] {
  const availableItems =
    currentCategoryId === undefined || currentCategoryId === null
      ? items
      : items.filter((item) => item.id !== currentCategoryId);

  const itemIds = new Set(availableItems.map((item) => item.id));
  const childrenByParentId: Record<string, CategoryPickerItem[]> = {};
  const roots: CategoryPickerItem[] = [];

  for (const item of availableItems) {
    if (item.parentId && itemIds.has(item.parentId)) {
      (childrenByParentId[item.parentId] ??= []).push(item);
      continue;
    }

    roots.push(item);
  }

  const options: CategoryParentOption[] = [];
  const seen = new Set<string>();

  function visit(item: CategoryPickerItem, depth: number) {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    options.push({
      id: item.id,
      label: `${depth > 0 ? `${"-- ".repeat(depth)}` : ""}${item.name}`,
    });

    for (const child of childrenByParentId[item.id] ?? []) {
      visit(child, depth + 1);
    }
  }

  for (const root of roots) {
    visit(root, 0);
  }

  for (const item of availableItems) {
    visit(item, 0);
  }

  return options;
}

export function CategoryParentField({
  items,
  selectedParentId = null,
  currentCategoryId,
  disabled = false,
}: CategoryParentFieldProps) {
  const options = buildParentOptions(items, currentCategoryId);

  return (
    <AdminFormField htmlFor="cat-parent" label={CATEGORY_FIELD_COPY.parentLabel}>
      <AdminSelectField
        defaultValue={selectedParentId ?? ""}
        disabled={disabled}
        id="cat-parent"
        name="parentId"
      >
        <option value="">{CATEGORY_FIELD_COPY.parentNoneOptionLabel}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </AdminSelectField>
    </AdminFormField>
  );
}
