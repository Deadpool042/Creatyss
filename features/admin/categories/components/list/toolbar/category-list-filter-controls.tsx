"use client";

import { AdminFilterPopover } from "@/components/admin/shared/admin-filter-popover";
import { AdminCheckboxFilterList } from "@/components/admin/tables/filters";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CATEGORY_FEATURED_OPTIONS,
  CATEGORY_LIST_COPY,
  CATEGORY_STATUS_OPTIONS,
} from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/list/types/admin-category-card-item.types";
import type {
  CategoryFeaturedFilter,
  CategoryPickerItem,
} from "@/features/admin/categories/list/queries/list-admin-categories.query";

function CategoryHierarchyPicker({
  items,
  selected,
  onChange,
}: {
  items: CategoryPickerItem[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const roots = items.filter((c) => c.parentId === null);
  const childrenByParentId: Record<string, CategoryPickerItem[]> = {};
  for (const c of items) {
    if (c.parentId) {
      (childrenByParentId[c.parentId] ??= []).push(c);
    }
  }
  const orphans = roots.filter((r) => !childrenByParentId[r.id]);
  const parents = roots.filter((r) => childrenByParentId[r.id]);

  function toggle(slug: string) {
    onChange(selected.includes(slug) ? selected.filter((v) => v !== slug) : [...selected, slug]);
  }

  if (items.length === 0) {
    return <p className="text-xs text-muted-foreground">{CATEGORY_LIST_COPY.filterCategoriesEmptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      {parents.map((parent) => (
        <div key={parent.id}>
          <label className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm font-medium hover:bg-muted/50">
            <Checkbox
              checked={selected.includes(parent.slug)}
              onCheckedChange={() => toggle(parent.slug)}
            />
            {parent.name}
          </label>
          {childrenByParentId[parent.id]?.map((child) => (
            <label
              key={child.id}
              className="flex cursor-pointer items-center gap-2.5 rounded py-1.5 pl-7 pr-1 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Checkbox
                checked={selected.includes(child.slug)}
                onCheckedChange={() => toggle(child.slug)}
              />
              <span className="mr-0.5 text-[0.7rem] text-brand/60">›</span>
              {child.name}
            </label>
          ))}
        </div>
      ))}
      {orphans.length > 0 && parents.length > 0 && (
        <div className="my-1 border-t border-surface-border" />
      )}
      {orphans.map((cat) => (
        <label
          key={cat.id}
          className="flex cursor-pointer items-center gap-2.5 rounded px-1 py-1.5 text-sm hover:bg-muted/50"
        >
          <Checkbox
            checked={selected.includes(cat.slug)}
            onCheckedChange={() => toggle(cat.slug)}
          />
          {cat.name}
        </label>
      ))}
    </div>
  );
}

type CategoryListFilterControlsProps = {
  categoriesForPicker: CategoryPickerItem[];
  status: AdminCategoryStatus[];
  featured: CategoryFeaturedFilter[];
  categorySlugs: string[];
  onStatusChange: (next: AdminCategoryStatus[]) => void;
  onFeaturedChange: (next: CategoryFeaturedFilter[]) => void;
  onCategorySlugsChange: (next: string[]) => void;
};

export function CategoryListFilterControls({
  categoriesForPicker,
  status,
  featured,
  categorySlugs,
  onStatusChange,
  onFeaturedChange,
  onCategorySlugsChange,
}: CategoryListFilterControlsProps) {
  return (
    <div className="hidden lg:flex lg:items-center lg:gap-2">
      <AdminFilterPopover label={CATEGORY_LIST_COPY.filterCategoriesLabel} count={categorySlugs.length}>
        <CategoryHierarchyPicker
          items={categoriesForPicker}
          selected={categorySlugs}
          onChange={onCategorySlugsChange}
        />
      </AdminFilterPopover>
      <AdminFilterPopover label={CATEGORY_LIST_COPY.filterStatusLabel} count={status.length}>
        <AdminCheckboxFilterList
          options={CATEGORY_STATUS_OPTIONS}
          selected={status}
          onChange={onStatusChange}
        />
      </AdminFilterPopover>
      <AdminFilterPopover label={CATEGORY_LIST_COPY.filterFeaturedLabel} count={featured.length}>
        <AdminCheckboxFilterList
          options={CATEGORY_FEATURED_OPTIONS}
          selected={featured}
          onChange={onFeaturedChange}
        />
      </AdminFilterPopover>
    </div>
  );
}

export function CategoryHierarchyFilter({
  categoriesForPicker,
  categorySlugs,
  onCategorySlugsChange,
}: {
  categoriesForPicker: CategoryPickerItem[];
  categorySlugs: string[];
  onCategorySlugsChange: (next: string[]) => void;
}) {
  return (
    <CategoryHierarchyPicker
      items={categoriesForPicker}
      selected={categorySlugs}
      onChange={onCategorySlugsChange}
    />
  );
}

export function CategoryStatusFilter({
  status,
  onStatusChange,
}: {
  status: AdminCategoryStatus[];
  onStatusChange: (next: AdminCategoryStatus[]) => void;
}) {
  return (
    <AdminCheckboxFilterList
      options={CATEGORY_STATUS_OPTIONS}
      selected={status}
      onChange={onStatusChange}
    />
  );
}

export function CategoryFeaturedFilterControl({
  featured,
  onFeaturedChange,
}: {
  featured: CategoryFeaturedFilter[];
  onFeaturedChange: (next: CategoryFeaturedFilter[]) => void;
}) {
  return (
    <AdminCheckboxFilterList
      options={CATEGORY_FEATURED_OPTIONS}
      selected={featured}
      onChange={onFeaturedChange}
    />
  );
}
