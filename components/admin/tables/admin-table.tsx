import type { ComponentProps } from "react";

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// AdminTable — wrapper principal avec styles visuels et scroll interne
//
// wrapperClassName : classes de positionnement appliquées au wrapper outer
//   (ex : "flex-1 min-h-0 flex flex-col" dans un contexte flex)
// className : classes appliquées à l'élément <table> natif
// viewportClassName : classes appliquées au conteneur de scroll interne
//
// Note : AdminTable utilise un <table> natif (pas le composant Table shadcn)
// pour éviter le double conteneur overflow-auto. Le seul scroll container
// est le div interne overflow-auto d'AdminTable lui-même.
// ---------------------------------------------------------------------------

type AdminTableProps = ComponentProps<"table"> & {
  /** Classes appliquées au wrapper outer (positionnement, layout) */
  wrapperClassName?: string;
  /** Classes appliquées au viewport scroll interne */
  viewportClassName?: string;
};

export function AdminTable({
  wrapperClassName,
  viewportClassName,
  className,
  children,
  ...props
}: Readonly<AdminTableProps>) {
  return (
    <div
      className={cn(
        "flex w-full min-h-0 flex-col overflow-hidden",
        wrapperClassName
      )}
    >
      <div
        className={cn(
          "min-h-0 flex-1 overflow-auto overscroll-contain [scrollbar-gutter:stable]",
          viewportClassName
        )}
      >
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminTableHeader — en-tête sticky avec fond légèrement distinct
// ---------------------------------------------------------------------------

type AdminTableHeaderProps = ComponentProps<typeof TableHeader> & {
  className?: string;
};

export function AdminTableHeader({ className, ...props }: Readonly<AdminTableHeaderProps>) {
  return (
    <TableHeader
      className={cn(
        "sticky top-0 z-10 bg-page-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-page-background/65",
        className
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// AdminTableBody
// ---------------------------------------------------------------------------

type AdminTableBodyProps = ComponentProps<typeof TableBody> & {
  className?: string;
};

export function AdminTableBody({ className, ...props }: Readonly<AdminTableBodyProps>) {
  return <TableBody className={cn(className)} {...props} />;
}

// ---------------------------------------------------------------------------
// AdminTableHead — cellule d'en-tête sobre, uppercase discret
// ---------------------------------------------------------------------------

type AdminTableHeadProps = ComponentProps<typeof TableHead> & {
  className?: string;
};

export function AdminTableHead({ className, ...props }: Readonly<AdminTableHeadProps>) {
  return (
    <TableHead
      className={cn(
        "text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase",
        className
      )}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// AdminTableRow — ligne avec hover sobre et transition
// ---------------------------------------------------------------------------

type AdminTableRowProps = ComponentProps<typeof TableRow> & {
  className?: string;
};

export function AdminTableRow({ className, ...props }: Readonly<AdminTableRowProps>) {
  return (
    <TableRow
      className={cn("transition-colors hover:bg-surface-subtle/25", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// AdminTableCell — cellule avec padding dense
// ---------------------------------------------------------------------------

type AdminTableCellProps = ComponentProps<typeof TableCell> & {
  className?: string;
};

export function AdminTableCell({ className, ...props }: Readonly<AdminTableCellProps>) {
  return <TableCell className={cn("px-3 py-3", className)} {...props} />;
}
