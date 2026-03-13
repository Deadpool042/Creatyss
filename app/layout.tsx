import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";
import Image from "next/image";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Creatyss",
  description: "Boutique publique minimale de Creatyss."
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="fr"
      className={cn("font-sans", geist.variable)}>
      <body>
        <TooltipProvider>
          <div className="site">
            <header className="site-header">
              <div className="site-header-inner ">
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
                  <Link href="/panier">Panier</Link>
                </nav>
              </div>
            </header>

            <main className="site-main">{children}</main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
