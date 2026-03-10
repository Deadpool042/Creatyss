import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Creatyss",
  description: "Boutique publique minimale de Creatyss."
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <div className="site">
          <header className="site-header">
            <div className="site-header-inner">
              <Link
                className="site-brand"
                href="/">
                Creatyss
              </Link>
              <Image
                src="/uploads/logo.svg"
                alt="Creatyss Logo"
                width={50}
                height={50}
              />

              <nav
                aria-label="Navigation principale"
                className="site-nav">
                <Link href="/admin">Admin</Link>
                <Link href="/">Accueil</Link>
                <Link href="/boutique">Boutique</Link>
                <Link href="/blog">Blog</Link>
              </nav>
            </div>
          </header>

          <main className="site-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
