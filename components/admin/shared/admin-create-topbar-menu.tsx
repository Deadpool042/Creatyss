"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminCreateTopbarMenuProps = Readonly<{
  triggerLabel: string;
  createLabel: string;
  createHref: string;
}>;

export function AdminCreateTopbarMenu({
  triggerLabel,
  createLabel,
  createHref,
}: AdminCreateTopbarMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <Plus className="sm:mr-2 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{triggerLabel}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={createHref}>{createLabel}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
