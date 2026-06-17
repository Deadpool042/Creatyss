import type { PageStatus, PrismaClient } from "@/prisma-generated/client";

/**
 * Seed des 4 Pages système légales.
 *
 * Statut clonabilité (Horizon 4 — cadrage « clone à blanc »,
 * `docs/lots/2026-06-13-clone-a-blanc-cadrage.md`) : ce contenu est un
 * **contenu de bootstrap propre à l'instance Creatyss** (texte juridique
 * réel repris de creatyss.com), pas un contrat de socle. Le socle n'impose
 * aucun texte légal : ces pages vivent en DB (`PageSection`/`PageBlock`,
 * domaine `pages`) et sont éditables via l'admin. Un clone du repo doit
 * remplacer ce contenu par ses propres mentions légales/CGV/politique de
 * confidentialité après le premier seed — ne pas publier ce contenu tel
 * quel pour une autre boutique.
 *
 * Sources :
 * - terms-of-sale : https://www.creatyss.com/conditions-generales-de-ventes/ (texte repris tel quel)
 * - privacy-policy : https://www.creatyss.com/politique-confidentialite/ (texte repris tel quel)
 * - legal-notice : composé uniquement à partir des informations confirmées (pas de page source sur l'ancien site)
 * - returns-policy : sections rétractation/échange extraites des CGV de l'ancien site
 *
 * Règles :
 * - idempotent : upsert par storeId + code ;
 * - ne JAMAIS écraser un body non vide déjà présent (contenu édité en admin prioritaire) ;
 * - les passages obsolètes ou placeholders de l'ancien site sont conservés avec une note [TODO ...]
 *   à valider humainement — aucune réécriture juridique ici ;
 * - un body contenant [TODO est seedé en DRAFT (non publié) ; sans TODO, en ACTIVE.
 */

const LEGAL_NOTICE_BODY = `Éditeur du site

Le site est édité par PULERI ROUSSIER / CREATYSS, entreprise individuelle.

SIRET : 382 209 617 00028
TVA intracommunautaire : FR11382209617
Adresse : 4 rue des Bruyères, 42100 Saint-Étienne, France

Contact

E-mail : creatyss@laposte.net
Téléphone : 06 33 52 28 43

Directrice de la publication

Sylvie Puleri.

Hébergement

[TODO : renseigner l'hébergeur du site (raison sociale, adresse, téléphone) avant mise en production — information non disponible dans le repo.]

Propriété intellectuelle

L'ensemble des contenus du site (textes, photographies, créations, logo) est la propriété exclusive de CREATYSS. Toute exploitation non autorisée du site ou de son contenu constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la Propriété Intellectuelle français.`;

const TERMS_OF_SALE_BODY = `Les présentes conditions générales de vente s'appliquent entre Creatyss et toute personne effectuant un achat sur le site.

1. Commandes

1.1. Caractéristiques des articles

Creatyss s'efforce de donner le plus de détails possibles sur les articles présentés. Les photos des articles figurant sur le site sont conformes au produit fini. Toutefois, en fonction de l'éclairage, de la résolution des écrans de chacun, les nuances de couleurs peuvent varier légèrement.
L'acheteur ne peut en aucun cas en rendre responsable l'entreprise.

1.2. Disponibilités des articles

Les articles sont fournis dans la limite des stocks disponibles. Dans le cas de non disponibilité d'un article, l'acheteur en sera tenu informé dans les plus brefs délais. Il s'agit de pièces uniques disponibles dans plusieurs e-shops en même temps. La priorité sera donnée à l'ordre d'arrivée des commandes.

1.3. La commande

Vous pouvez passer commande sur notre site en sélectionnant les produits de votre choix, que vous ajouterez à votre panier en cliquant sur le bouton correspondant. Le panier ne constitue pas en soi une commande pouvant engager la société.

Le client s'engage à ce que les informations qu'il communique à la société soient exactes et à jour. Par ailleurs, si le client a fourni des informations incomplètes ou inexactes, Creatyss se réserve le droit d'annuler purement et simplement la commande sans préjudice pour le client.

Le client peut librement remplir son panier : ajouter un produit, supprimer un article qu'il avait sélectionné et modifier les quantités à sa convenance en cliquant sur les boutons correspondants. Au cours d'une même séance, le client peut accéder à tout moment au contenu de son panier, tant que la commande n'est pas définitivement validée, de manière à corriger d'éventuelles erreurs.

Le client doit ensuite procéder à la validation de son adresse de facturation, du lieu de livraison ainsi que du mode de paiement choisi. Une fois ces informations saisies et les conditions générales approuvées, le client peut cliquer sur le bouton « VALIDER » ; son bon de commande est directement transmis au service logistique de Creatyss.

Conformément aux dispositions du Code Civil sur la conclusion des contrats en ligne, le contrat sera conclu lorsque vous cliquerez sur le bouton vous permettant de confirmer votre commande après avoir visualisé le détail de celle-ci, en particulier son prix total, et avoir eu la possibilité de corriger d'éventuelles erreurs. Le client en est averti par un courrier électronique et peut être averti également sur son téléphone mobile via 3D-Secure.

2. Paiement et règlement du prix

Les prix figurant sur le site sont en euros TTC. Creatyss, en sa qualité d'auto-entrepreneur, n'est pas assujetti à la TVA.
TVA non applicable – article 293 B du CGI.

[TODO : passage à valider — le numéro de TVA intracommunautaire FR11382209617 est désormais renseigné pour l'entreprise ; vérifier si la mention « TVA non applicable – article 293 B du CGI » est toujours exacte.]

Le prix de l'article est payé lors de son acquisition par l'acheteur sur Creatyss. Les prix indiqués sur le site internet sont en euros toutes taxes comprises (TTC). Les frais de port éventuels sont en sus et indiqués dans le bon de commande en fonction du type de livraison choisi. Le client pourra bénéficier, pendant certaines périodes définies par la société, d'offres promotionnelles sur certains produits notifiés sur le site internet.

Le paiement s'effectue en ligne au moment de la commande par carte bancaire (VISA, EUROCARD MASTERCARD) ou PayPal.

[TODO : passage à valider — les moyens de paiement listés correspondent à l'ancien site ; aligner sur les moyens de paiement réellement proposés par la nouvelle boutique.]

Afin d'assurer la sécurité des paiements, les données confidentielles (numéro de carte à 16 chiffres, date d'expiration, cryptogramme visuel) sont transmises cryptées sur des serveurs utilisant le système de sécurité SSL.

Conformément à la loi n°78/17 du 6 janvier 1978 relative à l'informatique et aux libertés, l'acheteur dispose d'un droit d'accès et de rectification de ses données personnelles. Pour cela, il doit adresser sa demande soit par courrier à l'adresse suivante : Sylvie Puleri, 4 rue des Bruyères, 42100 Saint-Étienne, soit par courrier électronique à l'adresse suivante : creatyss@laposte.net.

S'agissant des informations communiquées au titre du paiement par carte bancaire, le vendeur garantit à l'acheteur qu'elles ne sont pas conservées par celui-ci. Par ailleurs, les informations concernant le client ne sont en aucun cas divulguées à des tiers.

3. Exercice du droit de rétractation

Conformément aux dispositions légales du droit français, le client dispose d'un délai de 14 jours calendaires à compter de la réception des produits pour exercer son droit de rétractation auprès de Creatyss, sans avoir à justifier de motifs ni à payer de pénalité. Le client doit ensuite renvoyer ou restituer les produits à Creatyss dans un délai maximum de 14 jours calendaires suivant la communication de sa décision de se rétracter.

Attention : conformément à l'article L.121-21-8 du Code de la consommation, le droit de rétractation, de même que toute demande de remboursement, ne peut être exercé lorsque le produit a été fabriqué, modifié, ajusté ou personnalisé à la demande du client, par exemple dans le cas d'une mise à la taille demandée par le client.

Afin d'exercer son droit de rétractation, le client devra envoyer, par courrier électronique, une déclaration de rétractation dénuée d'ambiguïté, ou une lettre envoyée par la poste. La déclaration papier devra être adressée à : Sylvie Puleri, 4 rue des Bruyères, 42100 Saint-Étienne.

Si le client utilise la voie électronique, Creatyss lui enverra sans délai un accusé de réception de la rétractation sur un support durable (par courriel).

Les produits rayés, incomplets, abîmés, endommagés, portés ou salis par le client, tels qu'ils ne permettent pas une nouvelle commercialisation par Creatyss, ne pourront faire l'objet d'une rétractation valable et ne seront ni repris, ni échangés.

LE CLIENT DEVRA PRENDRE EN CHARGE LES FRAIS DIRECTS DE RENVOI DU BIEN, EN COURRIER SUIVI, AFIN D'ASSURER LA TRAÇABILITÉ DE L'OBJET.

En cas d'exercice du droit de rétractation, le remboursement interviendra au plus tard dans un délai de 30 jours suivant la date à laquelle le droit de rétractation a été exercé. Passé le délai de 14 jours, tout article livré sera considéré comme accepté par le client et conforme à sa commande et ne pourra plus faire l'objet d'un retour ou d'un remboursement (30 jours en cas d'échange). En cas d'erreur de l'entreprise, tout article adressé à l'acheteur par erreur pourra être retourné en vue d'un échange ou d'un remboursement ; dans ce cas, les frais de retour seront à la charge de l'entreprise.

Creatyss procédera au remboursement en utilisant le même moyen de paiement que celui que le client aura utilisé pour la transaction initiale.

4. Échange

Creatyss peut procéder à un échange des produits commandés sur le site dans un délai de 30 jours ouvrés à réception de la commande par le client.

Les produits doivent :
– être dans leur état d'origine (ne pas avoir été portés de façon quotidienne, ne présenter ni endommagement, ni altération dus à une mauvaise utilisation) ;
– être présentés dans leur emballage d'origine.

À réception de l'article, un avoir sera mis en place. L'acheteur peut régler un nouvel achat en partie à l'aide de son avoir (et éventuellement le complément en numéraire si le montant de l'avoir est inférieur au montant de l'achat).

Toute reprise acceptée par Creatyss, après vérification qualitative et quantitative des articles retournés, entraînera au bénéfice exclusif du client le droit à l'obtention d'un avoir ou l'échange. L'avoir émis au profit du client devra être utilisé dans un délai d'un (1) mois maximum.

Les modèles personnalisés, raccourcis ou mis à taille spécifiquement ne pourront être ni échangés, ni bénéficier d'un avoir ou d'un échange.

Les cartes cadeaux et autres bons d'achat, ne constituant pas des valeurs monétaires, ne peuvent être ni remboursés ni échangés.

5. Responsabilité

La société Creatyss est soucieuse de diffuser des informations complètes et exactes mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le site, et ne saurait en aucun cas être tenue responsable en cas d'erreur ou d'inexactitude contenue sur son site, ni garantir que l'utilisation de son site ne porte atteinte aux droits de tiers. Toute utilisation du site est faite aux risques et périls de l'utilisateur.

Creatyss n'engage aucunement sa responsabilité en ce qui concerne le fonctionnement technique de l'hébergeur, et ne garantit en aucun cas l'absence totale de virus ou d'autres éléments néfastes sur son site et sur les serveurs permettant d'y accéder.

Creatyss décline toute responsabilité :
– pour toute imprécision, inexactitude ou omission liées aux informations publiées sur le site ;
– pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations diffusées sur le site.

Creatyss ne saurait être tenue pour responsable de retards de livraison en raison d'erreurs ou de perturbations imputables aux transporteurs (y compris notamment en cas de grève totale ou partielle, notamment des services postaux et moyens de transport et/ou communications).

6. Garanties

6.1. Garantie légale

Tous les produits fournis sur le site bénéficient de la garantie légale de conformité prévue aux articles L. 211-4 à L. 211-14 du Code de la consommation et de la garantie légale des vices cachés prévue aux articles 1641 à 1649 du Code civil, pour autant que l'utilisation en ait été normale et que les conseils d'entretien aient été suivis.

Au titre de ces garanties, Creatyss s'engage, au choix du consommateur, à lui rembourser ou à lui échanger les produits défectueux ou ne correspondant pas à sa commande.

Indépendamment de la garantie commerciale prévue au paragraphe suivant, le vendeur professionnel reste tenu, conformément à l'article L. 211-15 du Code de la consommation, des défauts de conformité et des vices cachés du produit.

6.2. Garantie commerciale

Les produits sont vendus sous la garantie commerciale du vendeur professionnel.

Creatyss s'engage à remettre en état ou à remplacer dans des conditions déterminées le produit si un défaut apparaît dans un délai de 30 jours après la vente.

En vertu de l'article L. 211-16 du Code de la consommation, toute période d'immobilisation d'au moins sept jours due à la réparation du produit couvert par la garantie s'ajoute à la durée de la garantie consentie initialement.

Pour toute demande de remboursement, celui-ci interviendra dans un délai de 14 jours après réception et vérification du produit.

Aucun remboursement en cas de personnalisation.

6.3. Service après-vente

Les réclamations faites au titre des garanties doivent être adressées par courriel au service après-vente : creatyss@laposte.net, ou à l'adresse postale : Sylvie Puleri, 4 rue des Bruyères, 42100 Saint-Étienne.

Les frais de retour seront à la charge du client, et ne seront remboursés que si la responsabilité de Creatyss est engagée, c'est-à-dire pour tout défaut de conception ou vice caché.

6.4. Usage professionnel

Il est rappelé qu'en cas d'achat à titre professionnel, alors que le client est informé de sa qualité déclarée de consommateur, Creatyss ne pourra être tenue responsable pour tout dommage qui pourrait survenir du fait de l'achat ou de l'utilisation des produits dans un contexte d'usage professionnel si Creatyss n'a pas été prévenue au préalable, par exemple dans le contexte d'un shooting photo professionnel où les articles pourraient être malmenés par des modèles, mannequins photo ou une tierce personne.

[TODO : passage à valider — le texte d'origine mentionnait « les bijoux », vestige d'une ancienne activité ; reformulé en « les articles ». À confirmer.]

7. Informatique et libertés

La communication d'informations nominatives dans le cadre de la vente à distance est obligatoire, ces informations étant nécessaires pour le traitement et la livraison des commandes ainsi que pour l'établissement des factures.

Ces informations sont strictement confidentielles et traitées dans le respect de la loi « informatique et libertés » du 6 janvier 1978 modifiée, dans les conditions visées dans la Politique de confidentialité.

[TODO : passage à valider — le texte d'origine indiquait que les données bancaires sont collectées par « XXXX notre prestataire en matière de paiement », sous-traité à « la société XXX » certifiée « XXXX » (placeholders jamais remplis sur l'ancien site). Renseigner le prestataire de paiement réel de la nouvelle boutique avant publication. Le texte d'origine indiquait aussi une conservation des données de paiement pendant 18 mois à compter du traitement.]

Conformément aux dispositions susvisées, le client bénéficie d'un droit d'accès et de rectification aux informations qui le concernent. Le client peut également, pour des motifs légitimes, s'opposer au traitement des données. Le client peut exercer ces droits : sur le site internet via son compte client (modification à tout moment de son adresse de facturation et de livraison, de sa civilité et de son mot de passe), ou via l'appel ou l'e-mail au service client (modification de ses coordonnées personnelles : nom, prénom, date de naissance, adresse e-mail).

8. Preuve, conservation et archivage des transactions

Creatyss recommande au client de conserver une trace, papier ou sur support informatique fiable, de toutes les données relatives à sa commande.

Les registres informatisés, conservés dans les systèmes informatiques de Creatyss dans des conditions raisonnables de sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les parties.

L'archivage des factures est effectué sur un support fiable et durable de manière à correspondre à une copie fidèle et durable.

En outre, et conformément à l'article L.134-2 du Code de la consommation, Creatyss s'engage à conserver et à archiver sur tous supports, pendant 10 ans, les contrats conclus entre le client et Creatyss d'une valeur supérieure ou égale à 100 €, et à en garantir à tout moment l'accès par le client. L'exercice de ce droit d'accès pourra être exercé en s'adressant à : Sylvie Puleri, 4 rue des Bruyères, 42100 Saint-Étienne.

9. Propriété intellectuelle

Toute exploitation non autorisée du site ou de son contenu constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la Propriété Intellectuelle français.

Toute personne possédant un site Internet à titre personnel et souhaitant placer sur son site un lien renvoyant vers le site Creatyss doit en demander l'autorisation préalable et écrite. Tout lien non autorisé devra être retiré sur simple demande de Creatyss.`;

const PRIVACY_POLICY_BODY = `Utilisation des données personnelles collectées

Nous recueillons des informations lorsque vous visitez notre site. Les informations recueillies incluent :
– la page que vous visitez (pour connaître notre trafic et donc améliorer notre site web) ;
– votre e-mail (lorsque vous nous envoyez un e-mail via les formulaires de contact, afin de vous répondre).

Médias

Nos médias ne contiennent pas de données EXIF de coordonnées GPS.

Formulaires de contact

Nous conservons les soumissions d'un formulaire de contact pendant une période donnée de trois ans pour les questions liées au service client.
Nous ne les utilisons pas à des fins commerciales, seulement pour répondre à vos messages envoyés via les formulaires.
Si à n'importe quel moment vous souhaitez que votre adresse e-mail soit supprimée, des instructions de suppression détaillées sont incluses en bas de chaque e-mail de réponse.

Cookies

Nos cookies améliorent l'accès à notre site et identifient les visiteurs réguliers.
En outre, nos cookies améliorent l'expérience utilisateur grâce au suivi sur les pages. Cependant, cette utilisation des cookies n'est en aucune façon liée à des informations personnelles identifiables sur notre site.

[TODO : passage à valider — le texte d'origine mentionnait les cookies WordPress (connexion utilisateur) et les cookies Google Analytics avec bandeau de consentement. À aligner sur les cookies et la solution de mesure d'audience réellement utilisés par la nouvelle boutique.]

Contenu embarqué depuis d'autres sites

Les articles de ce site peuvent inclure des contenus intégrés (par exemple des vidéos, images, articles…). Le contenu intégré depuis d'autres sites se comporte de la même manière que si le visiteur se rendait sur cet autre site. Ces sites web pourraient collecter des données sur vous, utiliser des cookies, embarquer des outils de suivi tiers, suivre vos interactions avec ces contenus embarqués si vous disposez d'un compte connecté sur leur site web.

Utilisation et transmission de vos données personnelles

Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierces parties de confiance qui nous aident à exploiter notre site web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.

Nous pensons qu'il est nécessaire de partager des informations afin d'enquêter, de prévenir ou de prendre des mesures concernant des activités illégales, fraudes présumées, situations impliquant des menaces potentielles à la sécurité physique de toute personne, violations de nos conditions d'utilisation, ou quand la loi nous y contraint.

Durées de stockage de vos données

Nous utilisons l'adresse e-mail que vous fournissez pour vous renvoyer des informations. Si à n'importe quel moment vous souhaitez que votre adresse e-mail soit supprimée, des instructions de suppression détaillées sont incluses en bas de chaque e-mail de réponse.
Le temps de stockage des données est de 3 ans maximum.

Les droits que vous avez sur vos données

Vous pouvez demander la suppression des données personnelles vous concernant. Cela ne prend pas en compte les données stockées à des fins administratives, légales ou pour des raisons de sécurité.

Protection de vos données

Nous mettons en œuvre plusieurs mesures de sécurité pour préserver la sécurité de vos informations personnelles, et nous protégeons également vos informations hors ligne.
Seules les personnes qui ont besoin de vous répondre ou d'analyser les statistiques du site ont accès aux informations personnelles identifiables.
Les ordinateurs et serveurs utilisés pour stocker des informations personnelles identifiables sont conservés dans un environnement sécurisé ; notre hébergeur détient ses serveurs dans l'Union européenne.

[TODO : passage à valider — le texte d'origine détaillait des mesures de sécurité spécifiques à WordPress (préfixes wp_, modules, thèmes, maintenance WordPress), obsolètes pour la nouvelle boutique. À remplacer par une description des mesures réelles (HTTPS, hébergement, sauvegardes).]

Informations de contact

Vous pouvez nous contacter via le formulaire de contact pour toute demande concernant la vie privée.
Délégué à la Protection des Données : CREATYSS — creatyss@laposte.net.

[TODO : passage à valider — l'ancien site indiquait l'adresse sylvie.creatyss@gmail.com pour le DPO ; remplacée ici par l'adresse de contact confirmée creatyss@laposte.net. À confirmer.]

Procédures mises en œuvre en cas de fuite de données

En cas de fuite de données, les procédures suivantes sont engagées dans la journée :
– prévenir la CNIL de la fuite ;
– nettoyer le site compromis ;
– une fois le site totalement sain, modifier les identifiants et mots de passe.

Services tiers et profilage

Aucun service tiers ne nous transmet de données.
Aucune opération de marketing automatisé n'est mise en place, hormis les newsletters acceptées par les clients.
Aucun profilage n'est réalisé.

[TODO : passage à valider — le texte d'origine contenait un paragraphe sur des newsletters de « maintenance de sites Internet » manifestement copié depuis la politique du prestataire web de l'ancien site ; il a été retiré. Décrire ici la newsletter réelle de la boutique si elle existe.]`;

const RETURNS_POLICY_BODY = `Cette politique de retour reprend les conditions de rétractation et d'échange applicables aux commandes passées sur le site. Elle est extraite des conditions générales de vente, qui prévalent en cas de divergence.

Droit de rétractation

Conformément aux dispositions légales du droit français, le client dispose d'un délai de 14 jours calendaires à compter de la réception des produits pour exercer son droit de rétractation auprès de Creatyss, sans avoir à justifier de motifs ni à payer de pénalité. Le client doit ensuite renvoyer ou restituer les produits à Creatyss dans un délai maximum de 14 jours calendaires suivant la communication de sa décision de se rétracter.

Attention : conformément à l'article L.121-21-8 du Code de la consommation, le droit de rétractation, de même que toute demande de remboursement, ne peut être exercé lorsque le produit a été fabriqué, modifié, ajusté ou personnalisé à la demande du client, par exemple dans le cas d'une mise à la taille demandée par le client.

Afin d'exercer son droit de rétractation, le client devra envoyer, par courrier électronique, une déclaration de rétractation dénuée d'ambiguïté, ou une lettre envoyée par la poste à : Sylvie Puleri, 4 rue des Bruyères, 42100 Saint-Étienne.

Les produits rayés, incomplets, abîmés, endommagés, portés ou salis par le client, tels qu'ils ne permettent pas une nouvelle commercialisation par Creatyss, ne pourront faire l'objet d'une rétractation valable et ne seront ni repris, ni échangés.

Le client devra prendre en charge les frais directs de renvoi du bien, en courrier suivi, afin d'assurer la traçabilité de l'objet.

Remboursement

En cas d'exercice du droit de rétractation, le remboursement interviendra au plus tard dans un délai de 30 jours suivant la date à laquelle le droit de rétractation a été exercé. Creatyss procédera au remboursement en utilisant le même moyen de paiement que celui que le client aura utilisé pour la transaction initiale.

Passé le délai de 14 jours, tout article livré sera considéré comme accepté par le client et conforme à sa commande, et ne pourra plus faire l'objet d'un retour ou d'un remboursement (30 jours en cas d'échange). En cas d'erreur de l'entreprise, tout article adressé à l'acheteur par erreur pourra être retourné en vue d'un échange ou d'un remboursement ; dans ce cas, les frais de retour seront à la charge de l'entreprise.

Échange

Creatyss peut procéder à un échange des produits commandés sur le site dans un délai de 30 jours ouvrés à réception de la commande par le client.

Les produits doivent :
– être dans leur état d'origine (ne pas avoir été portés de façon quotidienne, ne présenter ni endommagement, ni altération dus à une mauvaise utilisation) ;
– être présentés dans leur emballage d'origine.

À réception de l'article, un avoir sera mis en place. L'acheteur peut régler un nouvel achat en partie à l'aide de son avoir (et éventuellement le complément en numéraire si le montant de l'avoir est inférieur au montant de l'achat). L'avoir émis au profit du client devra être utilisé dans un délai d'un (1) mois maximum.

Les modèles personnalisés, raccourcis ou mis à taille spécifiquement ne pourront être ni échangés, ni bénéficier d'un avoir ou d'un échange.

Les cartes cadeaux et autres bons d'achat, ne constituant pas des valeurs monétaires, ne peuvent être ni remboursés ni échangés.`;

const LEGAL_PAGES = [
  { code: "legal-notice", title: "Mentions légales", body: LEGAL_NOTICE_BODY },
  { code: "terms-of-sale", title: "Conditions générales de vente", body: TERMS_OF_SALE_BODY },
  { code: "privacy-policy", title: "Politique de confidentialité", body: PRIVACY_POLICY_BODY },
  { code: "returns-policy", title: "Politique de retour", body: RETURNS_POLICY_BODY },
] as const;

/**
 * Un texte contenant un marqueur [TODO ...] n'est pas publiable :
 * la page est seedée en DRAFT (invisible des routes publiques, qui ne
 * servent que les pages ACTIVE). Elle sera passée en ACTIVE après
 * validation humaine des TODO via l'admin.
 */
export function resolveLegalPageStatus(body: string): PageStatus {
  return body.includes("[TODO") ? "DRAFT" : "ACTIVE";
}

export async function seedLegalPages(prisma: PrismaClient, storeId: string): Promise<void> {
  for (const page of LEGAL_PAGES) {
    const existing = await prisma.page.findUnique({
      where: { storeId_code: { storeId, code: page.code } },
      select: { id: true, body: true },
    });

    if (existing !== null && (existing.body?.trim() ?? "") !== "") {
      // Contenu déjà présent (probablement édité en admin) : ne pas écraser.
      console.warn(`[legal-pages] ${page.code} : body existant conservé (skip)`);
      continue;
    }

    const status = resolveLegalPageStatus(page.body);
    console.warn(
      `[legal-pages] ${page.code} : ${existing === null ? "création" : "mise à jour"} en ${status}`
    );

    await prisma.page.upsert({
      where: { storeId_code: { storeId, code: page.code } },
      update: {
        body: page.body,
        isSystemPage: true,
        status,
      },
      create: {
        storeId,
        code: page.code,
        slug: page.code,
        title: page.title,
        body: page.body,
        status,
        isSystemPage: true,
        publishedAt: status === "ACTIVE" ? new Date() : null,
      },
    });
  }
}
