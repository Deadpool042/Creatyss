import { AdminSplitListItem } from "@/components/admin/layout/admin-split-list-item";
import type { FeatureFamilyNavItem } from "@/features/admin/feature-governance/view-models/settings-advanced/feature-flags-split-view.types";

type FeatureFlagsFamilyItemProps = Readonly<{
  item: FeatureFamilyNavItem;
  active: boolean;
}>;

export function FeatureFlagsFamilyItem({ item, active }: FeatureFlagsFamilyItemProps) {
  return (
    <AdminSplitListItem
      href={item.href}
      active={active}
      className="max-sm:landscape:px-3 max-sm:landscape:py-2.5 "
      tooltipContent={item.label}
    >
      <div className="flex min-h-11 items-start justify-between gap-2 max-sm:landscape:min-h-0 max-sm:landscape:items-center max-sm:landscape:gap-1.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-5 text-foreground max-sm:landscape:text-[12px] max-sm:landscape:leading-4">
            {item.label}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground max-sm:landscape:mt-0 max-sm:landscape:line-clamp-1 max-sm:landscape:text-[10px] max-sm:landscape:leading-4">
            {item.description}
          </p>
        </div>
        <div className="flex shrink-0 items-start gap-1.5 pt-0.5 max-sm:landscape:items-center max-sm:landscape:pt-0">
          <span className="tabular-nums text-[10px] text-muted-foreground max-sm:landscape:text-[9px]">
            {item.activeCount}/{item.totalCount}
          </span>
          {item.warningCount > 0 ? (
            <span className="rounded-full bg-orange-100 px-1.5 text-[9px] text-orange-700 max-sm:landscape:px-1 max-sm:landscape:text-[8px]">
              {item.warningCount}
            </span>
          ) : null}
        </div>
      </div>
    </AdminSplitListItem>
  );
}
