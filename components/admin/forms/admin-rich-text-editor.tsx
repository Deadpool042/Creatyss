"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import { AdminCharCounter } from "@/components/admin/forms/admin-char-counter";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import {
  AdminRichTextToolbar,
  type AdminRichTextToolbarPreset,
} from "@/components/admin/forms/admin-rich-text-toolbar";
import { cn } from "@/lib/utils";

export type AdminRichTextEditorPreset = AdminRichTextToolbarPreset;

type AdminRichTextEditorProps = {
  name: string;
  label: string;
  initialValue?: string | null;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean;
  htmlFor?: string | undefined;
  className?: string | undefined;
  editorClassName?: string | undefined;
  minHeightClassName?: string;
  preset?: AdminRichTextEditorPreset;
  counter?: { min: number; max: number; visibleText?: boolean };
};

function getVisibleTextLength(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export function AdminRichTextEditor({
  name,
  label,
  initialValue,
  hint,
  error,
  required = false,
  htmlFor,
  className,
  editorClassName,
  minHeightClassName = "min-h-[240px]",
  preset = "default",
  counter,
}: AdminRichTextEditorProps) {
  const initialHtml = useMemo(() => initialValue ?? "", [initialValue]);
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: preset === "compact" ? [] : [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https", "mailto"],
        HTMLAttributes: {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none px-4 py-3 outline-none",
          "prose-p:my-2 prose-headings:mb-2 prose-headings:mt-4 prose-ul:my-2 prose-ol:my-2",
          minHeightClassName,
          editorClassName
        ),
      },
    },
    onUpdate({ editor: currentEditor }) {
      setHtml(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (currentHtml !== initialHtml) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  return (
    <AdminFormField
      label={label}
      required={required}
      {...(htmlFor ? { htmlFor } : {})}
      {...(hint ? { hint } : {})}
      {...(error ? { error } : {})}
      {...(className ? { className } : {})}
    >
      <input type="hidden" name={name} value={html} />

      <div className="overflow-hidden rounded-xl border border-surface-border bg-card shadow-card">
        <AdminRichTextToolbar editor={editor} preset={preset} />
        <EditorContent editor={editor} />
      </div>
      {counter ? (
        <div className="flex items-center justify-end">
          <AdminCharCounter
            {...(counter.visibleText
              ? { length: getVisibleTextLength(html) }
              : { value: html })}
            min={counter.min}
            max={counter.max}
          />
        </div>
      ) : null}
    </AdminFormField>
  );
}
