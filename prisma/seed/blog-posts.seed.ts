import type { PrismaClient } from "@/prisma-generated/client";

const BLOG_POSTS = [
  {
    slug: "naissance-dun-sac-unique",
    title: "Dans l'atelier : naissance d'un sac unique",
    excerpt:
      "Du premier croquis à la dernière piqûre, chaque sac Creatyss naît d'une intention. Retour sur les étapes d'une fabrication entièrement faite main.",
    body: `Un sac ne commence pas par une machine. Il commence par une feuille blanche, un crayon, et quelques lignes qui cherchent leur équilibre.

Dans l'atelier, chaque création démarre par une phase de dessin. Je griffonne les proportions, les formes d'anses, les ouvertures possibles. Certains croquis restent dans le cahier. D'autres méritent d'aller plus loin.

La sélection de la matière vient ensuite. J'ai appris à écouter les tissus — leur tombé, leur réponse à la coupe, leur comportement dans le temps. Un coton épais peut sembler austère sur le rouleau et révéler un caractère surprenant une fois assemblé.

La découpe est un moment de concentration. Une erreur à cette étape n'est pas récupérable sans perdre de la matière. C'est là que l'expérience remplace les calculs : on sent la bonne position, on ajuste d'un millimètre.

La couture est l'étape la plus longue. Les angles, les doublures, les renforts d'anses. Chaque point compte. Je reprends toujours à la main les finitions intérieures — une habitude que j'ai prise au début et que je n'ai jamais abandonnée.

À la fin, quand le sac est retourné et prend sa forme définitive, c'est toujours un moment un peu solennel. Une chose qui n'existait pas existe maintenant.`,
    publishedAt: new Date("2025-12-10"),
  },
  {
    slug: "choisir-son-sac-pour-le-quotidien",
    title: "Comment choisir son sac pour le quotidien",
    excerpt:
      "Taille, matière, fermeture, nombre de poches — quelques repères pratiques pour trouver le sac qui s'adapte vraiment à votre vie.",
    body: `La question revient souvent : quel sac choisir quand on veut à la fois du style et de la praticité ? La réponse dépend de votre quotidien, pas d'une tendance.

Commencez par lister ce que vous portez vraiment. Un porte-monnaie, des clés, un téléphone — et peut-être un livre ou un carnet. Ce petit inventaire change tout : il révèle si vous avez besoin d'un sac structuré ou souple, grand ou compact.

La fermeture est un détail sous-estimé. Une fermeture magnétique est rapide mais moins sécurisée. Une glissière prend une seconde de plus et rassure en transport en commun. Un rabat avec bouton pression est élégant mais peut être contraignant si vous cherchez souvent dans votre sac.

La matière influence la durabilité et l'entretien. Un coton épais est léger et se lave facilement. Un tissu enduit résiste mieux à la pluie mais chauffe davantage. Un cuir vegan bien choisi vieillira bien si on le conditionne régulièrement.

Les anses méritent une attention particulière. Une anse courte est chic mais oblige à porter le sac au creux du coude. Une bandoulière longue libère les mains. Certains modèles Creatyss proposent les deux — c'est souvent la meilleure solution pour un sac polyvalent.

Enfin, choisissez une couleur que vous aimez vraiment, pas une couleur neutre par défaut. Un sac qu'on aime, on le prend tous les jours.`,
    publishedAt: new Date("2026-01-15"),
  },
  {
    slug: "matieres-couleurs-gestes-de-fabrication",
    title: "Matières, couleurs et gestes de fabrication",
    excerpt:
      "Un sac artisanal n'est pas seulement un objet — c'est le résultat d'un ensemble de choix. Focus sur les décisions qui font la différence.",
    body: `Chaque sac Creatyss est le produit de décisions successives. La matière d'abord, la couleur ensuite, puis les gestes qui transforment l'une et l'autre en un objet fini.

Les matières que j'utilise sont sélectionnées pour leur résistance et leur toucher. Je travaille principalement des cotons épais, des toiles de lin, et quelques velours pour les pièces d'hiver. Je ne travaille pas le cuir — par choix personnel et par souci de cohérence avec une fabrication locale et responsable.

Les couleurs changent selon les saisons, mais certaines teintes reviennent : les terracotta chauds, les verts kaki, les beiges naturels. Ces couleurs s'associent facilement entre elles et vieillissent bien — elles ne fatiguent pas.

Les gestes de fabrication sont le résultat de l'apprentissage. J'ai appris en autodidacte, en défaisant des sacs achetés dans des vide-greniers pour comprendre comment ils étaient construits. Certaines techniques que j'ai ainsi découvertes sont devenues ma signature : les coutures en double surpiqûre, les soufflets latéraux qui donnent du volume sans alourdir, les doublures ton sur ton.

Ce que je recherche avant tout, c'est un objet qui durera. Un sac qu'on n'a pas envie de jeter parce qu'il est bien construit et qu'il a une âme.`,
    publishedAt: new Date("2026-02-03"),
  },
  {
    slug: "marches-stephanois-et-rencontres-locales",
    title: "Marchés stéphanois et rencontres locales",
    excerpt:
      "Les marchés sont plus qu'un canal de vente — ce sont des moments d'échange et de rencontre avec des personnes qui cherchent quelque chose d'unique.",
    body: `Quand je pose mes sacs sur un marché pour la première fois, il y a toujours ce moment de doute. Est-ce que ça va intéresser quelqu'un ?

Et puis une personne s'arrête. Elle prend un sac en main, elle le retourne, elle ouvre la fermeture, elle passe les doigts sur la couture intérieure. Cette curiosité-là, c'est ce que j'attends.

Les marchés de Saint-Étienne ont une particularité : les gens y viennent avec le temps. Ils ne regardent pas distraitement — ils cherchent vraiment. J'ai eu des conversations de vingt minutes sur la façon dont je fixe les anses, ou sur pourquoi j'ai choisi ce coloris particulier.

Ces échanges ont façonné ma façon de créer. Une cliente m'a dit qu'elle rêvait d'un sac à bandoulière qui puisse passer en sac à main. J'ai réfléchi à ce problème pendant plusieurs semaines. Le résultat est l'un de mes modèles préférés aujourd'hui.

Les marchés sont aussi un observatoire. Je vois ce que les gens portent, comment ils choisissent, ce qui les fait hésiter. Ces observations alimentent mon travail autant que mes propres envies.

Je continue les marchés même maintenant, même quand les commandes en ligne occupent beaucoup de mon temps. Parce que ces rencontres directes sont irremplaçables.`,
    publishedAt: new Date("2026-02-28"),
  },
  {
    slug: "entretenir-son-sac-creatyss",
    title: "Entretenir son sac Creatyss",
    excerpt:
      "Un sac bien entretenu dure des années. Voici quelques conseils simples pour prendre soin de votre pièce au fil du temps.",
    body: `Un sac artisanal mérite un entretien attentif — pas compliqué, juste régulier.

Les cotons et toiles de lin supportent très bien le lavage à la main à l'eau froide avec un savon doux. Pour les taches localisées, un chiffon humide suffit souvent. Évitez le sèche-linge : la chaleur peut déformer les renforts et rétrécir la matière.

Pour les fermetures éclair, un petit passage de cire de bougie ou de savon sec tous les quelques mois les garde fluides. C'est un geste simple qui évite l'usure prématurée.

Quand votre sac est mouillé, laissez-le sécher à plat ou suspendu à l'air libre, jamais directement sur un radiateur. La chaleur concentrée sur une surface est l'ennemie des coutures.

Pour conserver la forme de votre sac entre deux utilisations, vous pouvez le rembourrer légèrement avec du papier de soie. C'est particulièrement utile pour les modèles structurés.

Si une couture lâche, ne tirez pas dessus. Rentrez le fil lâche avec une aiguille et fixez-le avec un peu de colle textile. Si la dégradation est plus importante, n'hésitez pas à me contacter — je peux souvent réparer ou reconsolider une pièce que j'ai fabriquée.

Un sac qu'on entretient raconte l'histoire de ceux qui l'ont porté. C'est ce qui fait la différence entre un objet de consommation et une pièce qui accompagne vraiment une vie.`,
    publishedAt: new Date("2026-03-20"),
  },
  {
    slug: "pourquoi-chaque-piece-est-unique",
    title: "Pourquoi chaque pièce est unique",
    excerpt:
      "Il n'y a pas deux sacs Creatyss identiques. Ce n'est pas un argument marketing — c'est la conséquence directe d'une fabrication entièrement à la main.",
    body: `Quand je dis que chaque pièce est unique, je ne veux pas dire qu'elle est limitée à un certain nombre d'exemplaires. Je veux dire qu'il n'en existera jamais deux exactement pareilles.

La raison est simple : je travaille à la main, sans gabarit rigide, sans machine programmable. Chaque coupe est légèrement différente. Chaque point de couture porte la trace de la pression exercée ce jour-là, de la fatigue des yeux en fin d'après-midi, ou d'une légère hésitation à l'angle d'un soufflet.

Ces variations mineures ne sont pas des défauts — ce sont des preuves d'authenticité. Elles sont ce qui distingue un objet artisanal d'un objet industriel.

Il y a aussi les variations de matière. Un tissu toile acheté en plusieurs mètres n'est jamais parfaitement homogène. Le fil peut être légèrement plus serré d'un côté, la teinture légèrement plus dense vers le centre du rouleau. Ces nuances passent inaperçues sur la machine, mais elles deviennent visibles dans un objet fini.

Enfin, je travaille en séries très courtes — parfois en exemplaire unique. Ce n'est pas un choix stratégique. C'est une limite physique : je travaille seule, et le temps que demande chaque pièce est incompressible.

Cette unicité a un corollaire : si vous aimez un sac que vous voyez, il ne sera peut-être plus là demain. Et c'est bien ainsi.`,
    publishedAt: new Date("2026-04-05"),
  },
];

export async function seedBlogPosts(prisma: PrismaClient, storeId: string): Promise<void> {
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: {
        storeId_slug: {
          storeId,
          slug: post.slug,
        },
      },
      create: {
        storeId,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        status: "ACTIVE",
        publishedAt: post.publishedAt,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        status: "ACTIVE",
        publishedAt: post.publishedAt,
      },
    });
  }

  console.warn(`✓ Blog posts seeded (${BLOG_POSTS.length} articles)`);
}
