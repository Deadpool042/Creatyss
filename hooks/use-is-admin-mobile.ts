"use client";

import * as React from "react";

import { ADMIN_SIDEBAR_MOBILE_BREAKPOINT } from "@/lib/breakpoints";

export function useIsAdminMobile(): boolean {
  const [isAdminMobile, setIsAdminMobile] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    const updateIsAdminMobile = () => {
      setIsAdminMobile(window.innerWidth < ADMIN_SIDEBAR_MOBILE_BREAKPOINT);
    };

    updateIsAdminMobile();
    window.addEventListener("resize", updateIsAdminMobile);

    return () => {
      window.removeEventListener("resize", updateIsAdminMobile);
    };
  }, []);

  return Boolean(isAdminMobile);
}
