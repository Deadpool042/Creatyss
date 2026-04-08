"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AdminPageTitleNavigation = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type AdminPageTitleState = {
  title: string | null;
  actionNode: ReactNode | null;
  navigation: AdminPageTitleNavigation | null;
  setPageTitle: (title: string | null) => void;
  setPageActionNode: (actionNode: ReactNode | null) => void;
  setPageNavigation: (navigation: AdminPageTitleNavigation | null) => void;
};

const AdminPageTitleContext = createContext<AdminPageTitleState | null>(null);

type AdminPageTitleProviderProps = {
  children: ReactNode;
};

export function AdminPageTitleProvider({ children }: AdminPageTitleProviderProps) {
  const [title, setTitle] = useState<string | null>(null);
  const [actionNode, setActionNode] = useState<ReactNode | null>(null);
  const [navigation, setNavigation] = useState<AdminPageTitleNavigation | null>(null);

  const value = useMemo<AdminPageTitleState>(
    () => ({
      title,
      actionNode,
      navigation,
      setPageTitle: setTitle,
      setPageActionNode: setActionNode,
      setPageNavigation: setNavigation,
    }),
    [title, actionNode, navigation]
  );

  return <AdminPageTitleContext.Provider value={value}>{children}</AdminPageTitleContext.Provider>;
}

export function useAdminPageTitle(): AdminPageTitleState {
  const context = useContext(AdminPageTitleContext);

  if (!context) {
    throw new Error("useAdminPageTitle must be used within AdminPageTitleProvider");
  }

  return context;
}
