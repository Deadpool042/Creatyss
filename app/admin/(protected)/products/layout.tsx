import type { ReactNode } from "react";

type ProductsLayoutProps = {
  children: ReactNode;
  list: ReactNode;
  details: ReactNode;
  editor: ReactNode;
};

function hasRenderableContent(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false;
}

export default function ProductsLayout({ children, list, details, editor }: ProductsLayoutProps) {
  const showDetails = hasRenderableContent(details);
  const showEditor = hasRenderableContent(editor);

  const gridClassName = showDetails
    ? showEditor
      ? "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)]"
      : "grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    : "grid gap-6";

  return (
    <>
      {children}

      <div className={gridClassName}>
        <section className="min-w-0">{list}</section>

        {showDetails ? <section className="min-w-0">{details}</section> : null}

        {showEditor ? <section className="min-w-0">{editor}</section> : null}
      </div>
    </>
  );
}
