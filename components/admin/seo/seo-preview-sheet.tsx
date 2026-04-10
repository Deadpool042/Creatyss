"use client";

import type { JSX } from "react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SeoSearchPreview } from "./seo-search-preview";
import { SeoSocialPreview } from "./seo-social-preview";

type SeoPreviewSheetProps = {
  publicPath: string;
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageUrl: string | null;
};

export function SeoPreviewSheet({
  publicPath,
  title,
  description,
  openGraphTitle,
  openGraphDescription,
  openGraphImageUrl,
}: SeoPreviewSheetProps): JSX.Element {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="inline-flex xl:hidden">
          <Eye className="mr-2 h-4 w-4" />
          Aperçus
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full min-h-0 w-full max-w-md flex-col overflow-hidden px-0 pb-0"
      >
        <SheetHeader className="shrink-0 px-4 pt-3 text-left">
          <SheetTitle>Aperçus SEO</SheetTitle>
          <SheetDescription>
            Prévisualisation du rendu moteur de recherche et du partage social.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="grid grid-cols-1 gap-3 pt-3 ">
            <SeoSearchPreview publicPath={publicPath} title={title} description={description} />

            <SeoSocialPreview
              title={openGraphTitle}
              description={openGraphDescription}
              imageUrl={openGraphImageUrl}
              compact
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
