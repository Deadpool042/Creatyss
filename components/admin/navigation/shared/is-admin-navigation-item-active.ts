export function isAdminNavigationItemActive(
  pathname: string,
  href: string,
  exact = false
): boolean {
  if (exact) {
    return pathname === href;
  }

  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
