import type { ReactNode } from "react";

type NoticeTone = "success" | "alert" | "note";

type NoticeProps = Readonly<{
  tone: NoticeTone;
  children: ReactNode;
}>;

function getNoticeClassName(tone: NoticeTone): string {
  switch (tone) {
    case "success":
      return "rounded-xl border border-emerald-600/20 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-emerald-800";
    case "alert":
      return "rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-relaxed text-destructive";
    case "note":
    default:
      return "rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground";
  }
}

export function Notice({ tone, children }: NoticeProps) {
  return (
    <p
      className={getNoticeClassName(tone)}
      role={tone === "alert" ? "alert" : undefined}>
      {children}
    </p>
  );
}
