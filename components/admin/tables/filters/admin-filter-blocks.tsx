"use client";

import type { ReactNode } from "react";

import { AdminCollapsibleFilterSection } from "./admin-collapsible-filter-section";
import { AdminFilterSection } from "./admin-filter-section";

type AdminFilterBlockBase = {
  key: string;
  title: string;
  content: ReactNode;
};

type AdminFilterSectionBlock = AdminFilterBlockBase & {
  kind: "section";
};

type AdminFilterPanelBlock = AdminFilterBlockBase & {
  kind: "panel";
  panelClassName?: string;
};

type AdminFilterCollapsibleBlock = AdminFilterBlockBase & {
  kind: "collapsible";
  description: string;
  summary: string;
  defaultOpen?: boolean;
};

export type AdminFilterBlock =
  | AdminFilterSectionBlock
  | AdminFilterPanelBlock
  | AdminFilterCollapsibleBlock;

type AdminFilterBlocksProps = {
  blocks: AdminFilterBlock[];
  className?: string;
};

export function AdminFilterBlocks({ blocks, className }: AdminFilterBlocksProps) {
  return (
    <div className={className}>
      {blocks.map((block) => {
        if (block.kind === "collapsible") {
          return (
            <AdminCollapsibleFilterSection
              key={block.key}
              title={block.title}
              description={block.description}
              summary={block.summary}
              defaultOpen={block.defaultOpen}
            >
              {block.content}
            </AdminCollapsibleFilterSection>
          );
        }

        if (block.kind === "panel") {
          return (
            <section
              key={block.key}
              className={
                block.panelClassName ??
                "space-y-2.5 rounded-xl border border-surface-border bg-surface-panel-soft p-3 [@media(max-height:480px)]:space-y-2"
              }
            >
              <AdminFilterSection title={block.title}>{block.content}</AdminFilterSection>
            </section>
          );
        }

        return (
          <AdminFilterSection key={block.key} title={block.title}>
            {block.content}
          </AdminFilterSection>
        );
      })}
    </div>
  );
}
