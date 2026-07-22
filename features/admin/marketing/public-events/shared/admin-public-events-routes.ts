export const ADMIN_PUBLIC_EVENTS_PATH = "/admin/marketing/marches";

export function getAdminPublicEventDetailPath(publicEventId: string): string {
  return `/admin/marketing/marches/${publicEventId}`;
}
