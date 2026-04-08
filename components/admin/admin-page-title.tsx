"use client";

import { useEffect, type JSX, type ReactNode } from "react";

import { useAdminPageTitle } from "./admin-page-title-context";

type AdminPageTitleProps = {
  title: string;
  actionNode?: ReactNode;
  navigation?: {
    label: string;
    href: string;
    ariaLabel?: string;
  };
};

export function AdminPageTitle({
  title,
  actionNode,
  navigation,
}: AdminPageTitleProps): JSX.Element | null {
  const { setPageTitle, setPageActionNode, setPageNavigation } = useAdminPageTitle();

  useEffect(() => {
    setPageTitle(title);
    setPageActionNode(actionNode ?? null);
    setPageNavigation(navigation ?? null);

    return () => {
      setPageTitle(null);
      setPageActionNode(null);
      setPageNavigation(null);
    };
  }, [actionNode, navigation, setPageActionNode, setPageNavigation, setPageTitle, title]);

  return null;
}
