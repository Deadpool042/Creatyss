"use client";

import { usePathname } from "next/navigation";
import type { JSX } from "react";

import { AppBreadcrumbs, type AppBreadcrumbItem } from "@/components/shared/breadcrumbs";

import {
  ADMIN_BREADCRUMB_DYNAMIC_PATTERNS,
  ADMIN_BREADCRUMB_SEGMENT_HREFS,
  ADMIN_BREADCRUMB_SEGMENT_LABELS,
} from "./admin-breadcrumbs.config";

function resolveDynamicLabel(pathname: string): string | null {
  for (const { pattern, label } of ADMIN_BREADCRUMB_DYNAMIC_PATTERNS) {
    if (pattern.test(pathname)) {
      return label;
    }
  }
  return null;
}

function buildBreadcrumbItems(pathname: string): AppBreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: AppBreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment === undefined) continue;

    const cumulativePath = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;

    // Résolution du label
    let label: string;

    if (isLast) {
      const dynamicLabel = resolveDynamicLabel(pathname);
      label = dynamicLabel ?? ADMIN_BREADCRUMB_SEGMENT_LABELS[segment] ?? segment;
    } else {
      label = ADMIN_BREADCRUMB_SEGMENT_LABELS[segment] ?? segment;
    }

    // Résolution du lien : pas de href sur le dernier item
    if (isLast) {
      items.push({ label });
    } else {
      const href = ADMIN_BREADCRUMB_SEGMENT_HREFS[cumulativePath] ?? cumulativePath;
      items.push({ label, href });
    }
  }

  return items;
}

export function AdminRouteBreadcrumbs(): JSX.Element {
  const pathname = usePathname();
  const items = buildBreadcrumbItems(pathname);

  return (
    <div className="hidden lg:block">
      <AppBreadcrumbs items={items} />
    </div>
  );
}
