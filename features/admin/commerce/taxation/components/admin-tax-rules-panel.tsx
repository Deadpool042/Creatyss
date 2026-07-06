"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, Upload } from "lucide-react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { Button } from "@/components/ui/button";
import type { AdminTaxRuleSummary } from "@/features/admin/commerce/taxation/types/admin-tax-rule.types";

import { AdminTaxRuleCreateSheet } from "./admin-tax-rule-create-sheet";
import { AdminTaxRulesImportSheet } from "./admin-tax-rules-import-sheet";
import { AdminTaxRulesList } from "./admin-tax-rules-list";

type AdminTaxRulesPanelProps = Readonly<{
  rules: ReadonlyArray<AdminTaxRuleSummary>;
  errorMessage: string | null;
}>;

function matchesTaxRuleSearch(rule: AdminTaxRuleSummary, query: string): boolean {
  return [rule.code, rule.name].some((value) => value.toLocaleLowerCase("fr-FR").includes(query));
}

export function AdminTaxRulesPanel({ rules, errorMessage }: AdminTaxRulesPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const created = searchParams.get("tax_created");

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(errorMessage !== null);
  const [importOpen, setImportOpen] = useState(false);

  // La création redirige avec ?tax_created / ?tax_error : le client component
  // survit à cette navigation, l'état d'ouverture doit donc se resynchroniser
  // sur ces signaux — pendant le rendu, pas dans un effet.
  const [prevCreated, setPrevCreated] = useState(created);
  if (created !== prevCreated) {
    setPrevCreated(created);
    if (created !== null) {
      setCreateOpen(false);
    }
  }

  const [prevError, setPrevError] = useState(errorMessage);
  if (errorMessage !== prevError) {
    setPrevError(errorMessage);
    if (errorMessage !== null) {
      setCreateOpen(true);
    }
  }

  function handleCreateOpenChange(next: boolean) {
    setCreateOpen(next);
    // Purge les signaux de la soumission précédente pour qu'une nouvelle
    // soumission produise un changement d'URL détectable, même à l'identique.
    if (next && (created !== null || errorMessage !== null)) {
      router.replace(pathname);
    }
  }

  const normalizedQuery = search.trim().toLocaleLowerCase("fr-FR");
  const isFiltered = normalizedQuery.length > 0;

  const filteredRules = useMemo(
    () =>
      rules.filter(
        (rule) => normalizedQuery.length === 0 || matchesTaxRuleSearch(rule, normalizedQuery)
      ),
    [rules, normalizedQuery]
  );

  const createTrigger = (
    <Button
      type="button"
      size="sm"
      className="h-8 shrink-0 gap-1.5"
      aria-haspopup="dialog"
      aria-expanded={createOpen}
      onClick={() => handleCreateOpenChange(true)}
    >
      <Plus className="size-3.5" />
      <span className="hidden sm:inline">Nouvelle règle</span>
      <span className="sm:hidden">Nouvelle</span>
    </Button>
  );

  const importTrigger = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 shrink-0 gap-1.5"
      aria-haspopup="dialog"
      aria-expanded={importOpen}
      onClick={() => setImportOpen(true)}
    >
      <Upload className="size-3.5" />
      <span className="hidden sm:inline">Importer CSV</span>
      <span className="sm:hidden">Importer</span>
    </Button>
  );

  return (
    <div className="flex flex-col gap-3">
      <AdminConfigDataTableToolbar
        search={search}
        onSearchChange={setSearch}
        mobileSearchPlaceholder="Rechercher une règle…"
        desktopSearchPlaceholder="Rechercher une règle…"
        mobileTrailing={
          <div className="flex items-center gap-2">
            {importTrigger}
            {createTrigger}
          </div>
        }
        desktopTrailing={
          <div className="flex items-center gap-2">
            {importTrigger}
            {createTrigger}
          </div>
        }
        resultsCount={filteredRules.length}
        resultsFullLabel={(count) => `${count} règle${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} règle${count > 1 ? "s" : ""}`}
      />

      <AdminTaxRulesList
        rules={filteredRules}
        {...(isFiltered ? { emptyMessage: "Aucune règle ne correspond à la recherche." } : {})}
      />

      <AdminTaxRuleCreateSheet
        open={createOpen}
        onOpenChange={handleCreateOpenChange}
        errorMessage={errorMessage}
      />

      <AdminTaxRulesImportSheet open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
}
