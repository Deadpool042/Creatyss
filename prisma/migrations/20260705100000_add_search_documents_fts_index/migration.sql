-- Index FTS français pour la recherche storefront (lot H4 search-storefront).
-- Index fonctionnel GIN : non modélisable dans le schéma Prisma, rédigé à la main.
CREATE INDEX "search_documents_indexedText_fts_idx"
  ON "search_documents"
  USING GIN (to_tsvector('french', "indexedText"));
