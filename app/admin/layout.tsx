import { type Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "Creatyss Admin",
  description: "Espace d'administration Creatyss.",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div>{children}</div>;
}
