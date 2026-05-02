"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModeToggleProps = {
  size?: "default" | "compact";
};

export function ModeToggle({ size = "default" }: ModeToggleProps) {
  const { setTheme } = useTheme();
  const isCompact = size === "compact";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={isCompact ? "h-8 w-8 p-0 shadow-none" : undefined}
        >
          <Sun
            className={[
              isCompact ? "h-4 w-4" : "h-[1.2rem] w-[1.2rem]",
              "scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90",
            ].join(" ")}
          />
          <Moon
            className={[
              "absolute",
              isCompact ? "h-4 w-4" : "h-[1.2rem] w-[1.2rem]",
              "scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0",
            ].join(" ")}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
