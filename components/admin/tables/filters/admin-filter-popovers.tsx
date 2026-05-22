"use client";

import type { ReactNode } from "react";

import { AdminFilterPopover } from "@/components/admin/shared/admin-filter-popover";

export type AdminFilterPopoverItem = {
  key: string;
  label: string;
  count?: number;
  content: ReactNode;
  contentClassName?: string;
};

type AdminFilterPopoversProps = {
  items: AdminFilterPopoverItem[];
  className?: string;
};

export function AdminFilterPopovers({ items, className }: AdminFilterPopoversProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <AdminFilterPopover
          key={item.key}
          label={item.label}
          count={item.count ?? 0}
          contentClassName={item.contentClassName}
        >
          {item.content}
        </AdminFilterPopover>
      ))}
    </div>
  );
}
