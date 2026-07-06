import { AdminSplitListPane } from "@/components/admin/layout/admin-split-list-pane";
import { AdminSplitOverviewItem } from "@/components/admin/layout/admin-split-overview-item";
import type {
  FeatureFamilyNavItem,
  FeatureFamilySlug,
} from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.types";
import { FeatureFlagsFamilyItem } from "./feature-flags-family-item";

type FeatureFlagsFamiliesListProps = Readonly<{
  items: readonly FeatureFamilyNavItem[];
  activeSlug: FeatureFamilySlug;
}>;

export function FeatureFlagsFamiliesList({ items, activeSlug }: FeatureFlagsFamiliesListProps) {
  const overviewItem = items.find((item) => item.slug === "overview");
  const familyItems = items.filter((item) => item.slug !== "overview");
  const isEmpty = overviewItem === undefined && familyItems.length === 0;

  return (
    <AdminSplitListPane
      title="Gouvernance"
      resultCount={familyItems.length}
      overview={
        overviewItem ? (
          <AdminSplitOverviewItem
            href={overviewItem.href}
            active={activeSlug === "overview"}
            title={overviewItem.label}
            description={overviewItem.description}
            meta={
              <span className="tabular-nums">
                {overviewItem.activeCount}/{overviewItem.totalCount}
              </span>
            }
            warning={
              overviewItem.warningCount > 0 ? `${overviewItem.warningCount} alertes` : undefined
            }
          />
        ) : undefined
      }
      isEmpty={isEmpty}
      emptyState={
        <p className="py-4 text-center text-sm text-muted-foreground">Aucune famille disponible.</p>
      }
    >
      <ul className="flex flex-col gap-y-0.5 ">
        {familyItems.map((item) => (
          <li key={item.slug}>
            <FeatureFlagsFamilyItem item={item} active={item.slug === activeSlug} />
          </li>
        ))}
      </ul>
    </AdminSplitListPane>
  );
}
