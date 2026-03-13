//app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { PublicSiteShell } from "@/components/public/public-site-shell";
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
          <PublicSiteShell>{children}</PublicSiteShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
