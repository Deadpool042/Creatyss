"use client";

import * as React from "react";

// Aligné avec app/styles/theme.css : --breakpoint-laptop (1024px = Tailwind lg)
const ADMIN_MOBILE_BREAKPOINT = 1024;

export function useIsAdminMobile(): boolean {
  const [isAdminMobile, setIsAdminMobile] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    const updateIsAdminMobile = () => {
      setIsAdminMobile(window.innerWidth < ADMIN_MOBILE_BREAKPOINT);
    };

    updateIsAdminMobile();
    window.addEventListener("resize", updateIsAdminMobile);

    return () => {
      window.removeEventListener("resize", updateIsAdminMobile);
    };
  }, []);

  return Boolean(isAdminMobile);
}
