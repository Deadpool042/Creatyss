"use client";

import type { ComponentType } from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  RemoveFormatting,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import {
  ADMIN_RICH_TEXT_HIGHLIGHT_COLORS,
  ADMIN_RICH_TEXT_TEXT_COLORS,
} from "@/components/admin/forms/admin-rich-text-colors";
import { AdminRichTextColorPopover } from "@/components/admin/forms/admin-rich-text-color-popover";
import { AdminRichTextStyleDropdown } from "@/components/admin/forms/admin-rich-text-style-dropdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminRichTextToolbarPreset = "compact" | "default" | "full";

type AdminRichTextToolbarProps = {
  editor: Editor | null;
  preset?: AdminRichTextToolbarPreset;
  className?: string;
};

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  icon: Icon,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className="h-8 px-2"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-border" />;
}

export function AdminRichTextToolbar({
  editor,
  preset = "default",
  className,
}: AdminRichTextToolbarProps) {
  if (!editor) {
    return null;
  }

  const safeEditor = editor;
  const isCompact = preset === "compact";
  const isFull = preset === "full";

  function handleSetLink(): void {
    const previousUrl = safeEditor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL du lien", previousUrl ?? "");

    if (url === null) {
      return;
    }

    const trimmedUrl = url.trim();

    if (trimmedUrl.length === 0) {
      safeEditor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    safeEditor.chain().focus().extendMarkRange("link").setLink({ href: trimmedUrl }).run();
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1 border-b px-3 py-2", className)}>
      <ToolbarButton
        label="Gras"
        icon={Bold}
        active={safeEditor.isActive("bold")}
        disabled={!safeEditor.can().chain().focus().toggleBold().run()}
        onClick={() => safeEditor.chain().focus().toggleBold().run()}
      />

      <ToolbarButton
        label="Italique"
        icon={Italic}
        active={safeEditor.isActive("italic")}
        disabled={!safeEditor.can().chain().focus().toggleItalic().run()}
        onClick={() => safeEditor.chain().focus().toggleItalic().run()}
      />

      <ToolbarButton
        label="Souligné"
        icon={UnderlineIcon}
        active={safeEditor.isActive("underline")}
        disabled={!safeEditor.can().chain().focus().toggleUnderline().run()}
        onClick={() => safeEditor.chain().focus().toggleUnderline().run()}
      />

      {!isCompact ? (
        <>
          <ToolbarDivider />
          <AdminRichTextStyleDropdown editor={safeEditor} />
        </>
      ) : null}

      {!isCompact ? (
        <>
          <ToolbarDivider />

          <ToolbarButton
            label="Liste à puces"
            icon={List}
            active={safeEditor.isActive("bulletList")}
            disabled={!safeEditor.can().chain().focus().toggleBulletList().run()}
            onClick={() => safeEditor.chain().focus().toggleBulletList().run()}
          />

          <ToolbarButton
            label="Liste numérotée"
            icon={ListOrdered}
            active={safeEditor.isActive("orderedList")}
            disabled={!safeEditor.can().chain().focus().toggleOrderedList().run()}
            onClick={() => safeEditor.chain().focus().toggleOrderedList().run()}
          />
        </>
      ) : null}

      {!isCompact ? (
        <>
          <ToolbarDivider />

          <ToolbarButton
            label="Aligner à gauche"
            icon={AlignLeft}
            active={safeEditor.isActive({ textAlign: "left" })}
            onClick={() => safeEditor.chain().focus().setTextAlign("left").run()}
          />

          <ToolbarButton
            label="Centrer"
            icon={AlignCenter}
            active={safeEditor.isActive({ textAlign: "center" })}
            onClick={() => safeEditor.chain().focus().setTextAlign("center").run()}
          />

          <ToolbarButton
            label="Aligner à droite"
            icon={AlignRight}
            active={safeEditor.isActive({ textAlign: "right" })}
            onClick={() => safeEditor.chain().focus().setTextAlign("right").run()}
          />

          <ToolbarButton
            label="Justifier"
            icon={AlignJustify}
            active={safeEditor.isActive({ textAlign: "justify" })}
            onClick={() => safeEditor.chain().focus().setTextAlign("justify").run()}
          />
        </>
      ) : null}

      {!isCompact ? <ToolbarDivider /> : null}

      <ToolbarButton
        label="Lien"
        icon={LinkIcon}
        active={safeEditor.isActive("link")}
        onClick={handleSetLink}
      />

      {!isCompact ? (
        <AdminRichTextColorPopover
          editor={safeEditor}
          label="Surlignage"
          mode="highlight"
          colors={ADMIN_RICH_TEXT_HIGHLIGHT_COLORS}
        />
      ) : null}

      {isFull ? (
        <AdminRichTextColorPopover
          editor={safeEditor}
          label="Texte"
          mode="text"
          colors={ADMIN_RICH_TEXT_TEXT_COLORS}
        />
      ) : null}

      <ToolbarButton
        label="Effacer le formatage"
        icon={RemoveFormatting}
        onClick={() => safeEditor.chain().focus().clearNodes().unsetAllMarks().run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="Annuler"
        icon={Undo2}
        disabled={!safeEditor.can().chain().focus().undo().run()}
        onClick={() => safeEditor.chain().focus().undo().run()}
      />

      <ToolbarButton
        label="Rétablir"
        icon={Redo2}
        disabled={!safeEditor.can().chain().focus().redo().run()}
        onClick={() => safeEditor.chain().focus().redo().run()}
      />
    </div>
  );
}
