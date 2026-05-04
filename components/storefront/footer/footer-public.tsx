export function FooterPublic() {
  return (
    <footer className=" border-t border-surface-border-subtle bg-background/50 px-4 py-6 pb-24 text-center text-sm text-text-muted min-[560px]:max-[1199px]:landscape:pb-18 min-[1200px]:pb-6">
      © {new Date().getFullYear()} Creatyss. Tous droits réservés.
    </footer>
  );
}
