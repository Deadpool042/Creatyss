-- Niveaux fonctionnels gradués (réconciliation de dérive : colonnes présentes
-- en base sans migration, ajoutées initialement via db push).
ALTER TABLE "feature_flags" ADD COLUMN "allowedLevels" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "feature_flags" ADD COLUMN "defaultLevel" TEXT;
ALTER TABLE "feature_flag_overrides" ADD COLUMN "level" TEXT;
