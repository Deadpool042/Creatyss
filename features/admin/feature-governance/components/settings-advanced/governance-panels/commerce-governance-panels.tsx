import {
  getDiscountsGovernanceData,
  getDocumentsGovernanceData,
  getFulfillmentGovernanceData,
  getReturnsGovernanceData,
  getShippingGovernanceData,
  getTaxationGovernanceData,
} from "@/features/admin/feature-governance/queries/get-commerce-governance-data.query";
import { getPaymentsGovernanceData } from "@/features/admin/feature-governance/queries/get-payments-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function PaymentsGovernancePanel() {
  const data = await getPaymentsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Paiements", value: data.total },
    makeStat(
      "Capturés",
      data.captured,
      data.captured > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Échoués",
      data.failed,
      data.failed > 0 ? "text-feedback-error-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Paiements">
      <GovernanceDomainContext>
        Ce flag gouverne l'ensemble du{" "}
        <span className="font-medium text-foreground">module paiements</span>. Le niveau{" "}
        <code className="font-mono text-[10px]">read</code> ouvre la lecture admin,{" "}
        <code className="font-mono text-[10px]">manual</code> autorise les transitions
        manuelles sur paiements en attente, et{" "}
        <code className="font-mono text-[10px]">online</code> débloque le paiement carte au
        checkout si Stripe est configuré.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun paiement enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function DiscountsGovernancePanel() {
  const data = await getDiscountsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Remises", value: data.total },
    makeStat(
      "Actives",
      data.active,
      data.active > 0 ? "text-feedback-success-foreground" : undefined
    ),
    { label: "Archivées", value: data.archived },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Remises">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">remises commerciales</span> (pourcentage,
        montant fixe). Le niveau <code className="font-mono text-[10px]">rules</code> active
        l'application automatique au checkout via code promo.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune remise enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function ShippingGovernancePanel() {
  const data = await getShippingGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Expéditions", value: data.total },
    { label: "En transit", value: data.shipped },
    makeStat(
      "Livrées",
      data.delivered,
      data.delivered > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Expédition">
      <GovernanceDomainContext>
        Ce flag gouverne le suivi des{" "}
        <span className="font-medium text-foreground">expéditions</span>. Le niveau{" "}
        <code className="font-mono text-[10px]">read</code> ouvre la lecture admin,{" "}
        <code className="font-mono text-[10px]">dispatch</code> autorise le marquage expédié avec
        suivi manuel, et <code className="font-mono text-[10px]">delivery</code> autorise la
        confirmation de livraison.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune expédition enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function FulfillmentGovernancePanel() {
  const data = await getFulfillmentGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Préparations", value: data.total },
    { label: "En cours", value: data.pending },
    makeStat(
      "Complètes",
      data.fulfilled,
      data.fulfilled > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Fulfillment">
      <GovernanceDomainContext>
        Ce flag gouverne la{" "}
        <span className="font-medium text-foreground">préparation logistique</span> des commandes
        — indépendant de l'expédition, sans impact sur le stock. Transitions : PENDING → READY →
        FULFILLED / CANCELLED.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune préparation enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function ReturnsGovernancePanel() {
  const data = await getReturnsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Retours", value: data.total },
    makeStat(
      "Ouverts",
      data.open,
      data.open > 0 ? "text-feedback-warning-foreground" : undefined
    ),
    makeStat(
      "Clôturés",
      data.closed,
      data.closed > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Retours">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">demandes de retour</span> avec workflow de
        décision. Le remboursement est déclaratif dans cette version — sans débit bancaire ni
        restock automatique.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune demande de retour enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function TaxationGovernancePanel() {
  const data = await getTaxationGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Règles TVA", value: data.totalRules },
    makeStat(
      "Actives",
      data.activeRules,
      data.activeRules > 0 ? "text-feedback-success-foreground" : undefined
    ),
    { label: "Pays", value: data.countries },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Taxation">
      <GovernanceDomainContext>
        Ce flag gouverne le <span className="font-medium text-foreground">moteur TVA</span> par
        territoire (métropole + DOM). Les taux sont capturés à la création de commande et stockés
        par ligne. Les prix catalogue restent TTC.
      </GovernanceDomainContext>
      {data.totalRules > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune règle de taxation enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function DocumentsGovernancePanel() {
  const data = await getDocumentsGovernanceData();

  if (data === null) {
    return null;
  }

  return (
    <GovernancePanelShell label="Gouvernance · Documents">
      <GovernanceDomainContext>
        Ce flag gouverne la génération de{" "}
        <span className="font-medium text-foreground">documents commerciaux</span> (confirmation
        de commande, bon de préparation). Pas de génération PDF réelle dans cette version —
        modèles déclaratifs uniquement.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid
          stats={[{ label: "Documents", value: data.total }]}
          columns={2}
        />
      ) : (
        <GovernanceEmptyState message="Aucun document enregistré." />
      )}
    </GovernancePanelShell>
  );
}
