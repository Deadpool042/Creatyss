type AdminFormActionsProps = {
  children: React.ReactNode;
};

export function AdminFormActions({ children }: AdminFormActionsProps) {
  return <div className="admin-actions">{children}</div>;
}
