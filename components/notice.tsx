import type { ReactNode } from "react";

type NoticeTone = "success" | "alert" | "note";

type NoticeProps = Readonly<{
  tone: NoticeTone;
  children: ReactNode;
}>;

function getNoticeClassName(tone: NoticeTone): string {
  switch (tone) {
    case "success":
      return "admin-success";
    case "alert":
      return "admin-alert";
    case "note":
    default:
      return "admin-muted-note";
  }
}

export function Notice({ tone, children }: NoticeProps) {
  return (
    <p
      className={getNoticeClassName(tone)}
      role={tone === "alert" ? "alert" : undefined}
    >
      {children}
    </p>
  );
}
