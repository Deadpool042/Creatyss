BEGIN;

TRUNCATE TABLE homepage_featured_blog_posts,
homepage_featured_categories,
homepage_featured_products,
homepage_content,
product_images,
product_variants,
blog_posts,
products,
categories,
admin_users RESTART IDENTITY CASCADE;

-- =========================================================
-- CATEGORIES
-- =========================================================
INSERT INTO
  categories (name, slug, description, is_featured)
VALUES
  (
    'Sacs à Main',
    'sacs-a-main',
    'Des sacs à main artisanaux aux lignes élégantes, pensés pour accompagner le quotidien avec caractère.',
    true
  ),
  (
    'Sacs à Bandoulière',
    'sacs-a-bandouliere',
    'Des modèles souples et féminins, pratiques à porter et réalisés avec soin.',
    true
  ),
  (
    'Mini sacs',
    'mini-sacs',
    'Des formats compacts, légers et raffinés pour emporter l''essentiel.',
    true
  ),
  (
    'Sacs à dos',
    'sacs-a-dos',
    'Des sacs à dos artisanaux, conçus pour allier confort, tenue et style.',
    true
  ),
  (
    'Pochettes & Trousses',
    'pochettes-trousses',
    'Des petits formats utiles et soignés, à glisser dans un sac ou à porter seuls.',
    false
  );

-- =========================================================
-- PRODUCTS
-- SEO volontairement simple : fallback éditable plus tard
-- =========================================================
INSERT INTO
  products (
    name,
    slug,
    short_description,
    description,
    product_type,
    status,
    is_featured,
    seo_title,
    seo_description
  )
VALUES
  (
    'Sac Bandoulière Rouge',
    'sac-bandouliere-rouge',
    'Sac bandoulière rouge fait main, pratique et élégant.',
    'Un sac bandoulière au format souple, pensé pour le quotidien. Sa silhouette féminine, sa présence visuelle forte et sa fabrication artisanale en font une pièce facile à porter et à remarquer.',
    'simple',
    'published',
    true,
    'Sac Bandoulière Rouge',
    'Sac bandoulière rouge fait main, pratique et élégant.'
  ),
  (
    'Sac Bandoulière Sky',
    'sac-bandouliere-sky',
    'Sac bandoulière bleu ciel, souple et fonctionnel.',
    'Une version lumineuse et légère du sac bandoulière Creatyss. Une création artisanale pensée pour accompagner les journées avec confort et simplicité.',
    'simple',
    'published',
    true,
    'Sac Bandoulière Sky',
    'Sac bandoulière bleu ciel, souple et fonctionnel.'
  ),
  (
    'Mini Sac Rouge',
    'mini-sac-rouge',
    'Mini sac rouge compact, pratique et artisanal.',
    'Un mini sac au format compact, conçu pour emporter l''essentiel sans renoncer à l''élégance. Sa fabrication artisanale et ses finitions soignées lui donnent une présence unique.',
    'simple',
    'published',
    true,
    'Mini Sac Rouge',
    'Mini sac rouge compact, pratique et artisanal.'
  ),
  (
    'Mini Sac Cappadocia',
    'mini-sac-cappadocia',
    'Mini sac Cappadocia compact, souple et élégant.',
    'Une création légère et raffinée, pensée pour le quotidien. Son format compact et sa ligne douce en font une pièce facile à porter, discrète et singulière.',
    'simple',
    'published',
    true,
    'Mini Sac Cappadocia',
    'Mini sac Cappadocia compact, souple et élégant.'
  ),
  (
    'Mini Sac Santorini',
    'mini-sac-santorini',
    'Mini sac Santorini au format compact et soigné.',
    'Un mini sac artisanal au style épuré, imaginé pour celles qui aiment les beaux objets utiles. Une pièce légère, féminine et facile à associer.',
    'simple',
    'published',
    true,
    'Mini Sac Santorini',
    'Mini sac Santorini au format compact et soigné.'
  ),
  (
    'Mini Sac Fuschia',
    'mini-sac-fuschia',
    'Mini sac Fuschia fait main, coloré et compact.',
    'Une pièce vive et expressive, réalisée artisanalement. Son petit format en fait un compagnon pratique, tandis que sa teinte lui donne une vraie personnalité.',
    'simple',
    'published',
    false,
    'Mini Sac Fuschia',
    'Mini sac Fuschia fait main, coloré et compact.'
  ),
  (
    'Mini Sac Safran',
    'mini-sac-safran',
    'Mini sac Safran artisanal, compact et lumineux.',
    'Un mini sac au ton chaleureux, conçu dans un esprit artisanal et pensé pour emporter les essentiels avec légèreté.',
    'simple',
    'published',
    false,
    'Mini Sac Safran',
    'Mini sac Safran artisanal, compact et lumineux.'
  ),
  (
    'Sac à Dos Safran',
    'sac-a-dos-safran',
    'Sac à dos Safran fait main, pratique et résistant.',
    'Un sac à dos artisanal pensé pour le quotidien, avec un bon équilibre entre capacité, confort et allure. Une pièce utile, durable et soignée.',
    'simple',
    'published',
    true,
    'Sac à Dos Safran',
    'Sac à dos Safran fait main, pratique et résistant.'
  ),
  (
    'Pochette plate Magenta',
    'pochette-plate-magenta',
    'Pochette plate Magenta, pratique et faite main.',
    'Un petit format souple et utile, parfait pour organiser les essentiels du quotidien avec une touche artisanale.',
    'simple',
    'published',
    false,
    'Pochette plate Magenta',
    'Pochette plate Magenta, pratique et faite main.'
  ),
  (
    'Pochette plate Safran',
    'pochette-plate-safran',
    'Pochette plate Safran, légère et artisanale.',
    'Une pochette discrète et soignée, pensée comme un accessoire simple, utile et facile à intégrer au quotidien.',
    'simple',
    'published',
    false,
    'Pochette plate Safran',
    'Pochette plate Safran, légère et artisanale.'
  ),
  (
    'Trousse Mini Sac Rouge',
    'trousse-mini-sac-rouge',
    'Petit format rouge polyvalent, fait main.',
    'Une création textile polyvalente, à mi-chemin entre trousse et mini sac d''appoint. Pratique, légère et facile à vivre.',
    'simple',
    'published',
    false,
    'Trousse Mini Sac Rouge',
    'Petit format rouge polyvalent, fait main.'
  ),
  (
    'Trousse Mini Sac Curry',
    'trousse-mini-sac-curry',
    'Petit format curry artisanal, pratique et léger.',
    'Un petit format artisanal pensé pour le rangement ou les essentiels du quotidien, avec une belle présence matière et une allure simple.',
    'simple',
    'published',
    false,
    'Trousse Mini Sac Curry',
    'Petit format curry artisanal, pratique et léger.'
  );

-- =========================================================
-- VARIANTS
-- =========================================================
INSERT INTO
  product_variants (
    product_id,
    name,
    color_name,
    color_hex,
    sku,
    price,
    compare_at_price,
    stock_quantity,
    is_default,
    status
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-rouge'
    ),
    'Rouge',
    'Rouge',
    '#B23A48',
    'SBR-001',
    64.00,
    NULL,
    8,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-sky'
    ),
    'Sky',
    'Sky',
    '#87BFD8',
    'SBS-001',
    64.00,
    NULL,
    6,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-rouge'
    ),
    'Rouge',
    'Rouge',
    '#C0392B',
    'MSR-001',
    57.00,
    NULL,
    10,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-cappadocia'
    ),
    'Cappadocia',
    'Cappadocia',
    '#C97B63',
    'MSC-001',
    57.00,
    NULL,
    9,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-santorini'
    ),
    'Santorini',
    'Santorini',
    '#5FA8D3',
    'MSS-001',
    57.00,
    NULL,
    7,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-fuschia'
    ),
    'Fuschia',
    'Fuschia',
    '#D94F8A',
    'MSF-001',
    50.00,
    NULL,
    5,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-safran'
    ),
    'Safran',
    'Safran',
    '#D9A441',
    'MSSF-001',
    57.00,
    NULL,
    6,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-a-dos-safran'
    ),
    'Safran',
    'Safran',
    '#D9A441',
    'SDS-001',
    64.00,
    NULL,
    4,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-magenta'
    ),
    'Magenta',
    'Magenta',
    '#C2185B',
    'PPM-001',
    44.00,
    NULL,
    8,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-safran'
    ),
    'Safran',
    'Safran',
    '#D9A441',
    'PPS-001',
    44.00,
    NULL,
    8,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-rouge'
    ),
    'Rouge',
    'Rouge',
    '#B23A48',
    'TMSR-001',
    30.00,
    NULL,
    12,
    true,
    'published'
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-curry'
    ),
    'Curry',
    'Curry',
    '#C68A2B',
    'TMSC-001',
    30.00,
    NULL,
    11,
    true,
    'published'
  );

UPDATE products p
SET
  simple_sku = pv.sku,
  simple_price = pv.price,
  simple_compare_at_price = pv.compare_at_price,
  simple_stock_quantity = pv.stock_quantity
FROM
  product_variants pv
WHERE
  p.product_type = 'simple'
  AND pv.id = (
    SELECT
      pv2.id
    FROM
      product_variants pv2
    WHERE
      pv2.product_id = p.id
    ORDER BY
      pv2.is_default DESC,
      pv2.id ASC
    LIMIT
      1
  );

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================
INSERT INTO
  product_images (
    product_id,
    variant_id,
    file_path,
    alt_text,
    sort_order,
    is_primary
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-rouge'
    ),
    NULL,
    'creatyss.webp',
    'Sac Bandoulière Rouge Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-sky'
    ),
    NULL,
    'creatyss.webp',
    'Sac Bandoulière Sky Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-rouge'
    ),
    NULL,
    'creatyss.webp',
    'Mini Sac Rouge Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-cappadocia'
    ),
    NULL,
    'creatyss.webp',
    'Mini Sac Cappadocia Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-santorini'
    ),
    NULL,
    'creatyss.webp',
    'Mini Sac Santorini Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-fuschia'
    ),
    NULL,
    'creatyss.webp',
    'Mini Sac Fuschia Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-safran'
    ),
    NULL,
    'creatyss.webp',
    'Mini Sac Safran Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-a-dos-safran'
    ),
    NULL,
    'creatyss.webp',
    'Sac à Dos Safran Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-magenta'
    ),
    NULL,
    'creatyss.webp',
    'Pochette plate Magenta Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-safran'
    ),
    NULL,
    'creatyss.webp',
    'Pochette plate Safran Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-rouge'
    ),
    NULL,
    'creatyss.webp',
    'Trousse Mini Sac Rouge Creatyss',
    0,
    true
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-curry'
    ),
    NULL,
    'creatyss.webp',
    'Trousse Mini Sac Curry Creatyss',
    0,
    true
  );

-- =========================================================
-- PRODUCT CATEGORIES
-- =========================================================
INSERT INTO
  product_categories (product_id, category_id)
VALUES
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-rouge'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-bandouliere'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-sky'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-bandouliere'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-rouge'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-cappadocia'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-santorini'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-fuschia'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-safran'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-a-dos-safran'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-dos'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-magenta'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'pochettes-trousses'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'pochette-plate-safran'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'pochettes-trousses'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-rouge'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'pochettes-trousses'
    )
  ),
  (
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'trousse-mini-sac-curry'
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'pochettes-trousses'
    )
  );

-- =========================================================
-- BLOG POSTS
-- =========================================================
INSERT INTO
  blog_posts (
    title,
    slug,
    excerpt,
    content,
    cover_image_path,
    status,
    published_at,
    seo_title,
    seo_description
  )
VALUES
  (
    'Journal Atelier',
    'journal-atelier',
    'Dans les coulisses de l''atelier Creatyss, entre matières, gestes et créations.',
    'Dans l''atelier Creatyss, chaque pièce prend le temps d''exister. Entre le choix des matières, la coupe, l''assemblage et les finitions, le fait main impose un rythme juste. Ce journal ouvre une fenêtre sur ce travail patient, sur les inspirations du moment et sur les pièces qui naissent au fil des jours.',
    NULL,
    'published',
    NOW (),
    'Journal Atelier',
    'Dans les coulisses de l''atelier Creatyss, entre matières, gestes et créations.'
  ),
  (
    'Matières, détails et finitions',
    'matieres-details-finitions',
    'Ce qui donne à une pièce artisanale sa tenue, son toucher et son caractère.',
    'Une création réussie tient autant à sa ligne qu''à la qualité de ses détails. Les matières, la souplesse, la tenue, les coutures, les associations de textures et la précision des finitions participent à la personnalité de chaque pièce.',
    NULL,
    'published',
    NOW () - INTERVAL '10 days',
    'Matières, détails et finitions',
    'Ce qui donne à une pièce artisanale sa tenue, son toucher et son caractère.'
  );

-- =========================================================
-- HOMEPAGE CONTENT
-- =========================================================
INSERT INTO
  homepage_content (
    hero_title,
    hero_text,
    hero_image_path,
    editorial_title,
    editorial_text,
    status
  )
VALUES
  (
    'Des sacs faits main, nulle part ailleurs.',
    'Chez Creatyss, chaque pièce est imaginée et réalisée artisanalement dans un esprit de fabrication locale, de soin du détail et d''élégance au quotidien.',
    NULL,
    'L''atelier Creatyss, entre savoir-faire et créations uniques',
    'Mini sacs, bandoulières, sacs à dos et pochettes prennent forme dans un travail artisanal attentif aux matières, aux finitions et au juste rythme de fabrication.',
    'published'
  );

-- =========================================================
-- HOMEPAGE FEATURED PRODUCTS
-- =========================================================
INSERT INTO
  homepage_featured_products (homepage_content_id, product_id, sort_order)
VALUES
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'sac-bandouliere-rouge'
      LIMIT
        1
    ),
    0
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-rouge'
      LIMIT
        1
    ),
    1
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-cappadocia'
      LIMIT
        1
    ),
    2
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        products
      WHERE
        slug = 'mini-sac-santorini'
      LIMIT
        1
    ),
    3
  );

-- =========================================================
-- HOMEPAGE FEATURED CATEGORIES
-- =========================================================
INSERT INTO
  homepage_featured_categories (homepage_content_id, category_id, sort_order)
VALUES
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-main'
      LIMIT
        1
    ),
    0
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-bandouliere'
      LIMIT
        1
    ),
    1
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'mini-sacs'
      LIMIT
        1
    ),
    2
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'pochettes-trousses'
      LIMIT
        1
    ),
    3
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        categories
      WHERE
        slug = 'sacs-a-dos'
      LIMIT
        1
    ),
    4
  );

-- =========================================================
-- HOMEPAGE FEATURED BLOG POSTS
-- =========================================================
INSERT INTO
  homepage_featured_blog_posts (homepage_content_id, blog_post_id, sort_order)
VALUES
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        blog_posts
      WHERE
        slug = 'journal-atelier'
      LIMIT
        1
    ),
    0
  ),
  (
    (
      SELECT
        id
      FROM
        homepage_content
      WHERE
        status = 'published'
      LIMIT
        1
    ),
    (
      SELECT
        id
      FROM
        blog_posts
      WHERE
        slug = 'matieres-details-finitions'
      LIMIT
        1
    ),
    1
  );

COMMIT;
