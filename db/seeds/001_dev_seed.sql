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
