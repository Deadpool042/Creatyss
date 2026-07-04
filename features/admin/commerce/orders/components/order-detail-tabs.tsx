"use client";

import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OrderDetailTabsProps = Readonly<{
  details: ReactNode;
  processing?: ReactNode;
  history: ReactNode;
}>;

export function OrderDetailTabs({ details, processing, history }: OrderDetailTabsProps) {
  return (
    <Tabs defaultValue="details" className="space-y-5">
      <TabsList className="inline-flex h-auto w-fit max-w-full flex-wrap gap-1 rounded-full border border-surface-border/60 bg-surface-panel-soft/80 p-1 shadow-none">
        <TabsTrigger value="details" className="rounded-full">
          Client &amp; livraison
        </TabsTrigger>
        {processing !== undefined ? (
          <TabsTrigger value="processing" className="rounded-full">
            Traitement
          </TabsTrigger>
        ) : null}
        <TabsTrigger value="history" className="rounded-full">
          Historique
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-6">
        {details}
      </TabsContent>

      {processing !== undefined ? (
        <TabsContent value="processing" className="space-y-6">
          {processing}
        </TabsContent>
      ) : null}

      <TabsContent value="history" className="space-y-6">
        {history}
      </TabsContent>
    </Tabs>
  );
}
