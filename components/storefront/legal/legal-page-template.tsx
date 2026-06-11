type LegalPageTemplateProps = {
  title: string;
  body: string;
};

/**
 * Gabarit de rendu des pages légales publiques.
 * Composant pur : texte brut découpé en paragraphes sur les lignes vides.
 * Pas de markdown, pas de HTML injecté.
 */
export function LegalPageTemplate({ title, body }: LegalPageTemplateProps) {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Informations légales
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
      </header>

      <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
