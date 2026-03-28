"use client";

import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProductToolbar() {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="h-8 pl-8 text-sm"
        />
      </div>
      <Button size="sm" className="h-8 gap-1.5" asChild>
        <Link href="/admin/products/new">
          <Plus className="h-3.5 w-3.5" />
          Nouveau
        </Link>
      </Button>
    </div>
  );
}
