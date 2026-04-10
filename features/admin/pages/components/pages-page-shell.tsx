import type { ReactNode } from "react";

type PagesPageShellProps = {
  children: ReactNode;
};

export function PagesPageShell({ children }: PagesPageShellProps) {
  return <div className="space-y-6 p-6">{children}</div>;
}
