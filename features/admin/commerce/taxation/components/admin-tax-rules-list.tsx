import { Badge } from "@/components/ui/badge";
import type { AdminTaxRuleSummary } from "@/features/admin/commerce/taxation/types/admin-tax-rule.types";

type AdminTaxRulesListProps = {
  rules: ReadonlyArray<AdminTaxRuleSummary>;
  emptyMessage?: string;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const REGION_LABELS: Readonly<Record<string, string>> = {
  "971": "Guadeloupe",
  "972": "Martinique",
  "973": "Guyane",
  "974": "Réunion",
  "976": "Mayotte",
};

function territoryLabel(rule: AdminTaxRuleSummary): string {
  if (rule.countryCode !== "FR") return rule.countryCode;
  if (rule.regionCode === null) return "Métropole";
  return REGION_LABELS[rule.regionCode] ?? `Région ${rule.regionCode}`;
}

function statusLabel(status: AdminTaxRuleSummary["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "INACTIVE":
      return "Inactive";
    case "ARCHIVED":
      return "Archivée";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function statusVariant(
  status: AdminTaxRuleSummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "ARCHIVED":
      return "destructive";
    default:
      return "outline";
  }
}

export function AdminTaxRulesList({ rules, emptyMessage }: AdminTaxRulesListProps) {
  if (rules.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "Aucune règle de TVA pour le moment."}
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-foreground">{rule.code}</span>
              <Badge variant={statusVariant(rule.status)}>{statusLabel(rule.status)}</Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">{rule.name}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>Territoire : {territoryLabel(rule)}</span>
              <span>{rule.isIncludedInPrice ? "Prix TTC" : "Prix HT"}</span>
              <span>Créée le {dateFormatter.format(new Date(rule.createdAt))}</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground">{rule.ratePercent} %</span>
        </div>
      ))}
    </div>
  );
}
