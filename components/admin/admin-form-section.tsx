type AdminFormSectionProps = {
  children: React.ReactNode;
};

export function AdminFormSection({ children }: AdminFormSectionProps) {
  return (
    <section className="admin-homepage-section">{children}</section>
  );
}
