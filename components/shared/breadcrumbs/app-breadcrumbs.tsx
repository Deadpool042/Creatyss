import Link from "next/link";
import { Fragment, type JSX } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type AppBreadcrumbItem = {
  label: string;
  href?: string;
};

type AppBreadcrumbsProps = {
  items: ReadonlyArray<AppBreadcrumbItem>;
  className?: string;
};

export function AppBreadcrumbs({ items, className }: AppBreadcrumbsProps): JSX.Element | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Breadcrumb>
        <BreadcrumbList className="min-w-max flex-nowrap gap-y-1 text-[11px] text-text-muted-strong sm:flex-wrap [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:text-[10px]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {item.href && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>

                {!isLast ? (
                  <BreadcrumbSeparator className="text-text-muted-soft/70 [&>svg]:size-3" />
                ) : null}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
