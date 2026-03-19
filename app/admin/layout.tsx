import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creatyss Admin",
  description: "Espace d'administration Creatyss.",
};

type AdminLayoutProps = LayoutProps<"/admin">;

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div>{children}</div>;
}
