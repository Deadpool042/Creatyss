"use client";

import type { ReactNode } from "react";

import { AdminDataTableDesktopLayout } from "./admin-data-table-desktop-layout";
import { AdminDataTableMobileLayout } from "./admin-data-table-mobile-layout";

type AdminConfigDataTableFrameProps = {
  toolbar: ReactNode;
  desktopContent: ReactNode;
  mobileContent: ReactNode;
  pagination?: ReactNode;
  floatingBar?: ReactNode;
  desktopClassName?: string;
  desktopContentClassName?: string;
  mobileClassName?: string;
  mobileContentClassName?: string;
};

export function AdminConfigDataTableFrame({
  toolbar,
  desktopContent,
  mobileContent,
  pagination,
  floatingBar,
  desktopClassName,
  desktopContentClassName,
  mobileClassName,
  mobileContentClassName,
}: AdminConfigDataTableFrameProps) {
  return (
    <>
      <AdminDataTableDesktopLayout
        toolbar={toolbar}
        content={desktopContent}
        pagination={pagination}
        floatingBar={floatingBar}
        {...(desktopClassName === undefined ? {} : { className: desktopClassName })}
        {...(desktopContentClassName === undefined
          ? {}
          : { contentClassName: desktopContentClassName })}
      />

      <AdminDataTableMobileLayout
        toolbar={toolbar}
        content={mobileContent}
        {...(mobileClassName === undefined ? {} : { className: mobileClassName })}
        {...(mobileContentClassName === undefined
          ? {}
          : { contentClassName: mobileContentClassName })}
      />
    </>
  );
}
