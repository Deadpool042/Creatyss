import { AdminPageHeader } from "./admin-page-header";

type AdminSplitPanelHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function AdminSplitPanelHeader({
  eyebrow,
  title,
  description,
}: AdminSplitPanelHeaderProps) {
  return (
    <AdminPageHeader
      className="hidden lg:block lg:px-6 lg:pt-5 lg:pb-1"
      compact
      eyebrow={eyebrow}
      title={title}
      description={description}
    />
  );
}
