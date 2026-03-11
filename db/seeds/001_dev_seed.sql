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

insert into
  categories (name, slug, description, is_featured)
values
  (
    'Sacs iconiques',
    'sacs-iconiques',
    'Collection phare',
    false
  ),
  (
    'Edition atelier',
    'edition-atelier',
    'Edition limitee',
    true
  );

insert into
  products (
    name,
    slug,
    short_description,
    description,
    status,
    is_featured,
    seo_title,
    seo_description
  )
values
  (
    'Sac Camel',
    'sac-camel',
    'Sac publie',
    'Description publique',
    'published',
    true,
    'SEO Sac Camel',
    'Meta Sac Camel'
  ),
  (
    'Cabas Moka',
    'cabas-moka',
    'Grand cabas quotidien',
    'Cabas structure pour le quotidien, pense pour un port confortable et une silhouette sobre.',
    'published',
    true,
    'SEO Cabas Moka',
    'Meta Cabas Moka'
  ),
  (
    'Pochette Sable',
    'pochette-sable',
    'Pochette legere et epuree',
    'Pochette compacte a porter main ou glissee dans un grand cabas.',
    'published',
    false,
    'SEO Pochette Sable',
    'Meta Pochette Sable'
  ),
  (
    'Besace Nuit',
    'besace-nuit',
    'Besace souple pour la ville',
    'Besace souple a rabat, avec une allure plus urbaine et un volume intermediaire.',
    'published',
    false,
    'SEO Besace Nuit',
    'Meta Besace Nuit'
  ),
  (
    'Sac Brouillon',
    'sac-brouillon',
    'Sac brouillon',
    'Description brouillon',
    'draft',
    false,
    null,
    null
  );

insert into
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
values
  (
    (
      select
        id
      from
        products
      where
        slug = 'sac-camel'
    ),
    'Camel',
    'Camel',
    '#C19A6B',
    'SAC-CAMEL-001',
    129.00,
    149.00,
    5,
    true,
    'published'
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'sac-camel'
    ),
    'Prototype',
    'Prototype',
    '#555555',
    'SAC-CAMEL-DRAFT',
    139.00,
    null,
    2,
    false,
    'draft'
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'cabas-moka'
    ),
    'Moka',
    'Moka',
    '#6B4F3A',
    'CABAS-MOKA-001',
    159.00,
    179.00,
    8,
    true,
    'published'
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'cabas-moka'
    ),
    'Espresso',
    'Espresso',
    '#4A3426',
    'CABAS-MOKA-002',
    169.00,
    189.00,
    3,
    false,
    'published'
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'pochette-sable'
    ),
    'Sable',
    'Sable',
    '#D8C3A5',
    'POCHETTE-SABLE-001',
    89.00,
    null,
    12,
    true,
    'published'
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'besace-nuit'
    ),
    'Nuit',
    'Nuit',
    '#1F2A44',
    'BESACE-NUIT-001',
    149.00,
    169.00,
    0,
    true,
    'published'
  );

insert into
  product_images (
    product_id,
    variant_id,
    file_path,
    alt_text,
    sort_order,
    is_primary
  )
values
  (
    (
      select
        id
      from
        products
      where
        slug = 'sac-camel'
    ),
    null,
    'creatyss.webp',
    'Visuel principal Creatyss',
    0,
    true
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'cabas-moka'
    ),
    null,
    'creatyss.webp',
    'Visuel principal Cabas Moka',
    0,
    true
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'pochette-sable'
    ),
    null,
    'creatyss.webp',
    'Visuel principal Pochette Sable',
    0,
    true
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'besace-nuit'
    ),
    null,
    'creatyss.webp',
    'Visuel principal Besace Nuit',
    0,
    true
  );

insert into
  product_categories (product_id, category_id)
values
  (
    (
      select
        id
      from
        products
      where
        slug = 'sac-camel'
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'sacs-iconiques'
    )
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'cabas-moka'
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'sacs-iconiques'
    )
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'cabas-moka'
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'edition-atelier'
    )
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'pochette-sable'
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'edition-atelier'
    )
  ),
  (
    (
      select
        id
      from
        products
      where
        slug = 'besace-nuit'
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'sacs-iconiques'
    )
  );

insert into
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
values
  (
    'Journal Atelier',
    'journal-atelier',
    'Extrait public',
    'Contenu public',
    'creatyss.webp',
    'published',
    now (),
    'SEO Journal Atelier',
    'Meta Journal Atelier'
  ),
  (
    'Journal Brouillon',
    'journal-brouillon',
    'Extrait brouillon',
    'Contenu brouillon',
    null,
    'draft',
    null,
    null,
    null
  );

insert into
  homepage_content (
    hero_title,
    hero_text,
    hero_image_path,
    editorial_title,
    editorial_text,
    status
  )
values
  (
    'Hero Creatyss',
    'Texte hero',
    'creatyss.webp',
    'Editorial Creatyss',
    'Texte editorial',
    'published'
  );

insert into
  homepage_featured_products (homepage_content_id, product_id, sort_order)
values
  (
    (
      select
        id
      from
        homepage_content
      where
        status = 'published'
      limit
        1
    ),
    (
      select
        id
      from
        products
      where
        slug = 'sac-camel'
      limit
        1
    ),
    0
  );

insert into
  homepage_featured_categories (homepage_content_id, category_id, sort_order)
values
  (
    (
      select
        id
      from
        homepage_content
      where
        status = 'published'
      limit
        1
    ),
    (
      select
        id
      from
        categories
      where
        slug = 'sacs-iconiques'
      limit
        1
    ),
    0
  );

insert into
  homepage_featured_blog_posts (homepage_content_id, blog_post_id, sort_order)
values
  (
    (
      select
        id
      from
        homepage_content
      where
        status = 'published'
      limit
        1
    ),
    (
      select
        id
      from
        blog_posts
      where
        slug = 'journal-atelier'
      limit
        1
    ),
    0
  );

COMMIT;
