import type { JSX, ReactNode } from "react";

type ProductsShellProps = {
  toolbar: ReactNode;
  children: ReactNode;
};

export function ProductsShell({ toolbar, children }: ProductsShellProps): JSX.Element {
  return (
    <div className="rounded-2xl border bg-card">
      {toolbar}
      <div>{children}</div>
    </div>
  );
}
