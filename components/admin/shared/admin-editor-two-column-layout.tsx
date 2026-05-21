import type { ReactNode } from "react";

type AdminEditorTwoColumnLayoutProps = {
  main: ReactNode;
  sidebar: ReactNode;
};

export function AdminEditorTwoColumnLayout({
  main,
  sidebar,
}: AdminEditorTwoColumnLayoutProps) {
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.95fr)] xl:items-start">
      <div className="space-y-8">{main}</div>
      <div className="space-y-8">{sidebar}</div>
    </div>
  );
}
