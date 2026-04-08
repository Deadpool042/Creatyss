"use client";

import type { Editor } from "@tiptap/react";
import { Check, ChevronDown, Heading1, Heading2, Heading3, Pilcrow } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AdminRichTextStyleDropdownProps = {
  editor: Editor | null;
};

function getCurrentStyleLabel(editor: Editor): string {
  if (editor.isActive("heading", { level: 1 })) {
    return "H1";
  }

  if (editor.isActive("heading", { level: 2 })) {
    return "H2";
  }

  if (editor.isActive("heading", { level: 3 })) {
    return "H3";
  }

  return "Paragraphe";
}

export function AdminRichTextStyleDropdown({ editor }: AdminRichTextStyleDropdownProps) {
  if (!editor) {
    return null;
  }

  const currentLabel = getCurrentStyleLabel(editor);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 gap-2 px-2">
          <span className="text-xs font-medium">{currentLabel}</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-44">
        <DropdownMenuCheckboxItem
          checked={editor.isActive("paragraph")}
          onCheckedChange={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="mr-2 h-4 w-4" />
          Paragraphe
          {editor.isActive("paragraph") ? <Check className="ml-auto h-4 w-4" /> : null}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={editor.isActive("heading", { level: 1 })}
          onCheckedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="mr-2 h-4 w-4" />
          Titre 1
          {editor.isActive("heading", { level: 1 }) ? <Check className="ml-auto h-4 w-4" /> : null}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={editor.isActive("heading", { level: 2 })}
          onCheckedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="mr-2 h-4 w-4" />
          Titre 2
          {editor.isActive("heading", { level: 2 }) ? <Check className="ml-auto h-4 w-4" /> : null}
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={editor.isActive("heading", { level: 3 })}
          onCheckedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="mr-2 h-4 w-4" />
          Titre 3
          {editor.isActive("heading", { level: 3 }) ? <Check className="ml-auto h-4 w-4" /> : null}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
