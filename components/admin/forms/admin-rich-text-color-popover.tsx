"use client";

import type { Editor } from "@tiptap/react";
import { Highlighter, PaintBucket, RotateCcw } from "lucide-react";

import type { AdminRichTextColorOption } from "@/components/admin/forms/admin-rich-text-colors";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type AdminRichTextColorPopoverMode = "text" | "highlight";

type AdminRichTextColorPopoverProps = {
  editor: Editor | null;
  label: string;
  mode: AdminRichTextColorPopoverMode;
  colors: AdminRichTextColorOption[];
};

function getIsActive(editor: Editor, mode: AdminRichTextColorPopoverMode, color: string): boolean {
  if (mode === "text") {
    return editor.isActive("textStyle", { color });
  }

  return editor.isActive("highlight", { color });
}

export function AdminRichTextColorPopover({
  editor,
  label,
  mode,
  colors,
}: AdminRichTextColorPopoverProps) {
  if (!editor) {
    return null;
  }

  const safeEditor = editor;
  const Icon = mode === "text" ? PaintBucket : Highlighter;

  function handleApply(color: string): void {
    if (mode === "text") {
      safeEditor.chain().focus().setColor(color).run();
      return;
    }

    safeEditor.chain().focus().toggleHighlight({ color }).run();
  }

  function handleReset(): void {
    if (mode === "text") {
      safeEditor.chain().focus().unsetColor().run();
      return;
    }

    safeEditor.chain().focus().unsetHighlight().run();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-2 px-2">
          <Icon className="h-4 w-4" />
          <span className="text-xs font-medium">{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 space-y-3 p-3">
        <div className="space-y-2">
          <p className="text-xs font-medium">{label}</p>

          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => {
              const active = getIsActive(safeEditor, mode, color.value);

              return (
                <button
                  key={`${mode}-${color.label}`}
                  type="button"
                  title={color.label}
                  aria-label={color.label}
                  onClick={() => handleApply(color.value)}
                  className={`h-8 rounded-md border transition-transform hover:scale-[1.03] ${
                    active ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
