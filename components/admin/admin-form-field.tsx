type AdminFormFieldProps = {
  label: string;
  children: React.ReactNode;
};

export function AdminFormField({ label, children }: AdminFormFieldProps) {
  return (
    <label className="admin-field">
      <span className="meta-label">{label}</span>
      {children}
    </label>
  );
}
