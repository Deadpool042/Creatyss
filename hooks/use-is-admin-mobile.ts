"use client";

import * as React from "react";

const ADMIN_MOBILE_QUERY = "(max-width: 1023px)";
const COMPACT_LANDSCAPE_QUERY =
  "(pointer: coarse) and (orientation: landscape) and (max-height: 480px)";

export function useIsAdminMobile(): boolean {
  const [isAdminMobile, setIsAdminMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mqlMobile = window.matchMedia(ADMIN_MOBILE_QUERY);
    const mqlCompact = window.matchMedia(COMPACT_LANDSCAPE_QUERY);

    const update = () => {
      setIsAdminMobile(mqlMobile.matches || mqlCompact.matches);
    };

    mqlMobile.addEventListener("change", update);
    mqlCompact.addEventListener("change", update);
    update();

    return () => {
      mqlMobile.removeEventListener("change", update);
      mqlCompact.removeEventListener("change", update);
    };
  }, []);

  return Boolean(isAdminMobile);
}
