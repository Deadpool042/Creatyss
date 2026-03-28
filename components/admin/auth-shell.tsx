//components/admin/auth-shell.tsx
import type { ReactNode } from "react";

type AuthShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function AuthShell({ sidebar, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      {/* Dark sidebar — hidden on mobile */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.14),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[72px_72px]" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">{sidebar}</div>
      </div>

      {/* Light form area */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted px-6 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.55),transparent_35%,rgba(0,0,0,0.02))]" />
        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
