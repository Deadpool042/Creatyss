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

type AdminFilterCollapsibleBlock = AdminFilterBlockBase & {
  kind: "collapsible";
  description: string;
  summary: string;
  defaultOpen?: boolean;
};

export type AdminFilterBlock = AdminFilterSectionBlock | AdminFilterCollapsibleBlock;

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
              {...(block.defaultOpen === undefined ? {} : { defaultOpen: block.defaultOpen })}
            >
              {block.content}
            </AdminCollapsibleFilterSection>
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
