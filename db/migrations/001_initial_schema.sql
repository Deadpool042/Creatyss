BEGIN;

CREATE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE admin_users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL,
  short_description text,
  description text,
  status text NOT NULL DEFAULT 'draft',
  is_featured boolean NOT NULL DEFAULT false,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_status_check
    CHECK (status IN ('draft', 'published'))
);

CREATE TABLE product_categories (
  product_id bigint NOT NULL,
  category_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, category_id),
  CONSTRAINT product_categories_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE,
  CONSTRAINT product_categories_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
);

CREATE TABLE product_variants (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id bigint NOT NULL,
  name text NOT NULL,
  color_name text NOT NULL,
  color_hex text,
  sku text NOT NULL,
  price numeric(10, 2) NOT NULL,
  compare_at_price numeric(10, 2),
  is_default boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_variants_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE,
  CONSTRAINT product_variants_status_check
    CHECK (status IN ('draft', 'published')),
  CONSTRAINT product_variants_price_check
    CHECK (price >= 0),
  CONSTRAINT product_variants_compare_at_price_check
    CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  CONSTRAINT product_variants_compare_at_price_gte_price_check
    CHECK (compare_at_price IS NULL OR compare_at_price >= price),
  CONSTRAINT product_variants_product_id_id_key
    UNIQUE (product_id, id)
);

CREATE TABLE product_images (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id bigint NOT NULL,
  variant_id bigint,
  file_path text NOT NULL,
  alt_text text,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_images_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE,
  CONSTRAINT product_images_product_id_variant_id_fkey
    FOREIGN KEY (product_id, variant_id)
    REFERENCES product_variants (product_id, id)
    ON DELETE CASCADE,
  CONSTRAINT product_images_sort_order_check
    CHECK (sort_order >= 0)
);

CREATE TABLE blog_posts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text,
  content text,
  cover_image_path text,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_status_check
    CHECK (status IN ('draft', 'published'))
);

CREATE TABLE homepage_content (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  hero_title text,
  hero_text text,
  hero_image_path text,
  editorial_title text,
  editorial_text text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT homepage_content_status_check
    CHECK (status IN ('draft', 'published'))
);

CREATE TABLE homepage_featured_products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  homepage_content_id bigint NOT NULL,
  product_id bigint NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT homepage_featured_products_homepage_content_id_fkey
    FOREIGN KEY (homepage_content_id)
    REFERENCES homepage_content (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_products_product_id_fkey
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_products_sort_order_check
    CHECK (sort_order >= 0),
  CONSTRAINT homepage_featured_products_homepage_content_id_product_id_key
    UNIQUE (homepage_content_id, product_id),
  CONSTRAINT homepage_featured_products_homepage_content_id_sort_order_key
    UNIQUE (homepage_content_id, sort_order)
);

CREATE TABLE homepage_featured_categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  homepage_content_id bigint NOT NULL,
  category_id bigint NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT homepage_featured_categories_homepage_content_id_fkey
    FOREIGN KEY (homepage_content_id)
    REFERENCES homepage_content (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_categories_category_id_fkey
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_categories_sort_order_check
    CHECK (sort_order >= 0),
  CONSTRAINT homepage_featured_categories_homepage_content_id_category_id_key
    UNIQUE (homepage_content_id, category_id),
  CONSTRAINT homepage_featured_categories_homepage_content_id_sort_order_key
    UNIQUE (homepage_content_id, sort_order)
);

CREATE TABLE homepage_featured_blog_posts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  homepage_content_id bigint NOT NULL,
  blog_post_id bigint NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT homepage_featured_blog_posts_homepage_content_id_fkey
    FOREIGN KEY (homepage_content_id)
    REFERENCES homepage_content (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_blog_posts_blog_post_id_fkey
    FOREIGN KEY (blog_post_id)
    REFERENCES blog_posts (id)
    ON DELETE CASCADE,
  CONSTRAINT homepage_featured_blog_posts_sort_order_check
    CHECK (sort_order >= 0),
  CONSTRAINT homepage_featured_blog_posts_homepage_content_id_blog_post_id_key
    UNIQUE (homepage_content_id, blog_post_id),
  CONSTRAINT homepage_featured_blog_posts_homepage_content_id_sort_order_key
    UNIQUE (homepage_content_id, sort_order)
);

CREATE UNIQUE INDEX admin_users_email_lower_key
  ON admin_users (lower(email));

CREATE UNIQUE INDEX categories_slug_key
  ON categories (slug);

CREATE INDEX categories_is_featured_idx
  ON categories (is_featured);

CREATE UNIQUE INDEX products_slug_key
  ON products (slug);

CREATE INDEX products_status_idx
  ON products (status);

CREATE INDEX products_is_featured_idx
  ON products (is_featured);

CREATE INDEX product_categories_category_id_idx
  ON product_categories (category_id);

CREATE UNIQUE INDEX product_variants_sku_key
  ON product_variants (sku);

CREATE INDEX product_variants_product_id_status_idx
  ON product_variants (product_id, status);

CREATE UNIQUE INDEX product_variants_default_per_product_key
  ON product_variants (product_id)
  WHERE is_default;

CREATE INDEX product_images_variant_id_idx
  ON product_images (variant_id);

CREATE INDEX product_images_product_id_sort_order_idx
  ON product_images (product_id, sort_order, id);

CREATE UNIQUE INDEX product_images_primary_product_key
  ON product_images (product_id)
  WHERE is_primary AND variant_id IS NULL;

CREATE UNIQUE INDEX product_images_primary_variant_key
  ON product_images (variant_id)
  WHERE is_primary AND variant_id IS NOT NULL;

CREATE UNIQUE INDEX blog_posts_slug_key
  ON blog_posts (slug);

CREATE INDEX blog_posts_status_published_at_idx
  ON blog_posts (status, published_at DESC);

CREATE UNIQUE INDEX homepage_content_published_key
  ON homepage_content (status)
  WHERE status = 'published';

CREATE TRIGGER admin_users_set_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER categories_set_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER product_variants_set_updated_at
BEFORE UPDATE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER product_images_set_updated_at
BEFORE UPDATE ON product_images
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER blog_posts_set_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER homepage_content_set_updated_at
BEFORE UPDATE ON homepage_content
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
