type AdminColumnMetaOptions = Readonly<{
  headerClassName?: string | undefined;
  cellClassName?: string | undefined;
  stopRowClick?: boolean | undefined;
}>;

export function buildAdminColumnMeta({
  headerClassName,
  cellClassName,
  stopRowClick,
}: AdminColumnMetaOptions) {
  return {
    ...(headerClassName ? { headerClassName } : {}),
    ...(cellClassName ? { cellClassName } : {}),
    ...(stopRowClick ? { stopRowClick } : {}),
  };
}
