// components/admin/navigation/topbar/admin-topbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Moon } from "lucide-react";
import type { JSX } from "react";

import { ModeToggle } from "@/components/shared/theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

type AdminTopbarProps = {
  displayName: string;
  email: string;
  logoUrl?: string | null;
};

export function AdminTopbar({ displayName, email, logoUrl = null }: AdminTopbarProps): JSX.Element {
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header
      className={[
        "site-header-blur z-40 shrink-0",
        "border-b border-shell-border/40",
        "admin-topbar-height",
        "sticky top-0 w-full",
      ].join(" ")}
    >
      <div className="safe-px-layout flex h-full w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-2">
          <SidebarTrigger className="size-8 shrink-0 rounded-xl border border-surface-border/50 bg-surface-panel/72 text-foreground/68 shadow-control backdrop-blur-xl hover:bg-surface-panel hover:text-foreground lg:hidden [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:size-7.5" />

          <Link
            href="/admin"
            aria-label="Administration Creatyss"
            className="inline-flex min-w-0 items-center gap-2.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-2"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-surface-border/60 bg-surface-panel/72 shadow-control backdrop-blur-xl [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:size-7.5">
              {logoUrl !== null ? (
                <Image
                  src={logoUrl}
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="size-4 object-contain"
                />
              ) : (
                <span className="text-[11px] font-semibold tracking-[0.1em] text-foreground/70">
                  C
                </span>
              )}
            </span>
            <span className="grid min-w-0 text-left leading-tight">
              <span className="truncate text-[15px] font-semibold tracking-tight text-foreground [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:text-[14px]">
                Creatyss
              </span>
              <span className="truncate text-[10px] uppercase tracking-[0.18em] text-foreground/54 max-md:hidden [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:hidden">
                Administration
              </span>
            </span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Centre de notifications à venir"
            className="rounded-xl border border-surface-border/60 bg-surface-panel/72 text-foreground/62 shadow-control backdrop-blur-xl hover:bg-surface-panel hover:text-foreground [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:size-8"
          >
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Profil administrateur"
                className="h-9 shrink-0 gap-2 rounded-xl border border-surface-border/60 bg-surface-panel/72 px-1.5 text-foreground shadow-control backdrop-blur-xl hover:bg-surface-panel [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:h-8 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-1.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:px-1"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-surface-border/70 bg-shell-surface text-[13px] font-semibold text-foreground [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:size-6.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:text-[12px]">
                  {initial}
                </span>
                <span className="hidden min-w-0 text-left leading-tight xl:grid">
                  <span className="truncate text-[13px] font-medium text-foreground">
                    {displayName}
                  </span>
                  <span className="truncate text-[11px] text-foreground/52">{email}</span>
                </span>
                <ChevronDown className="hidden size-4 text-foreground/44 xl:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="min-w-56 rounded-2xl p-2">
              <DropdownMenuLabel className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-shell-surface text-sm font-semibold text-foreground">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-foreground">
                      {displayName}
                    </p>
                    <p className="truncate text-[11px] text-foreground/52">{email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className="justify-between rounded-xl px-2 py-2 text-[13px]"
                onSelect={(event) => event.preventDefault()}
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="size-4 shrink-0" />
                  <div className="leading-tight">
                    <p className="font-medium text-foreground">Apparence</p>
                    <p className="text-[11px] text-foreground/52">Mode clair ou sombre</p>
                  </div>
                </div>
                <div className="rounded-full border border-surface-border/70 bg-surface-panel p-0.5 shadow-control">
                  <ModeToggle size="compact" />
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <form action="/admin/logout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] text-foreground/70 transition-colors hover:bg-surface-subtle hover:text-foreground"
                >
                  <LogOut className="size-4 shrink-0" />
                  Se déconnecter
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
