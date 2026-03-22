BEGIN;

-- ============================================================
-- 015_premium_schema_core.sql
--
-- Breaking refactor of the local schema to the premium v2 core.
-- This migration is intentionally reset-style for the impacted
-- e-commerce tables. It is suitable for a local/dev rebuild.
-- Advanced partial indexes and CHECK constraints are deferred to
-- 016_premium_schema_constraints.sql.
-- ============================================================
-- ------------------------------------------------------------
-- Drop legacy / overlapping tables first
-- ------------------------------------------------------------
DROP TABLE IF EXISTS refund_lines CASCADE;

DROP TABLE IF EXISTS refunds CASCADE;

DROP TABLE IF EXISTS shipment_lines CASCADE;

DROP TABLE IF EXISTS shipments CASCADE;

DROP TABLE IF EXISTS order_email_events CASCADE;

DROP TABLE IF EXISTS payments CASCADE;

DROP TABLE IF EXISTS order_lines CASCADE;

DROP TABLE IF EXISTS orders CASCADE;

DROP TABLE IF EXISTS guest_checkout_details CASCADE;

DROP TABLE IF EXISTS guest_cart_lines CASCADE;

DROP TABLE IF EXISTS guest_carts CASCADE;

DROP TABLE IF EXISTS cart_checkout_details CASCADE;

DROP TABLE IF EXISTS cart_items CASCADE;

DROP TABLE IF EXISTS carts CASCADE;

DROP TABLE IF EXISTS product_variant_images CASCADE;

DROP TABLE IF EXISTS product_images CASCADE;

DROP TABLE IF EXISTS product_media CASCADE;

DROP TABLE IF EXISTS product_variants CASCADE;

DROP TABLE IF EXISTS product_categories CASCADE;

DROP TABLE IF EXISTS products CASCADE;

DROP TABLE IF EXISTS categories CASCADE;

DROP TABLE IF EXISTS blog_posts CASCADE;

DROP TABLE IF EXISTS pages CASCADE;

DROP TABLE IF EXISTS media_assets CASCADE;

DROP TABLE IF EXISTS email_templates CASCADE;

DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS admin_users CASCADE;

DROP TABLE IF EXISTS homepage_featured_blog_posts CASCADE;

DROP TABLE IF EXISTS homepage_featured_categories CASCADE;

DROP TABLE IF EXISTS homepage_featured_products CASCADE;

DROP TABLE IF EXISTS homepage_content CASCADE;

DROP TABLE IF EXISTS order_items CASCADE;

-- ------------------------------------------------------------
-- Drop enums if they already exist from previous attempts
-- ------------------------------------------------------------
DROP TYPE IF EXISTS user_role CASCADE;

DROP TYPE IF EXISTS user_status CASCADE;

DROP TYPE IF EXISTS page_status CASCADE;

DROP TYPE IF EXISTS page_type CASCADE;

DROP TYPE IF EXISTS category_status CASCADE;

DROP TYPE IF EXISTS product_status CASCADE;

DROP TYPE IF EXISTS product_type CASCADE;

DROP TYPE IF EXISTS product_variant_status CASCADE;

DROP TYPE IF EXISTS blog_post_status CASCADE;

DROP TYPE IF EXISTS order_status CASCADE;

DROP TYPE IF EXISTS order_source CASCADE;

DROP TYPE IF EXISTS shipment_status CASCADE;

DROP TYPE IF EXISTS payment_status CASCADE;

DROP TYPE IF EXISTS payment_provider CASCADE;

DROP TYPE IF EXISTS refund_status CASCADE;

DROP TYPE IF EXISTS order_email_event_status CASCADE;

DROP TYPE IF EXISTS email_template_status CASCADE;

DROP TYPE IF EXISTS email_template_type CASCADE;

DROP TYPE IF EXISTS newsletter_subscriber_status CASCADE;

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TYPE user_status AS ENUM ('active', 'disabled');

CREATE TYPE page_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE page_type AS ENUM ('homepage', 'standard', 'legal', 'landing');

CREATE TYPE category_status AS ENUM ('active', 'hidden');

CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE product_type AS ENUM ('simple', 'variable');

CREATE TYPE product_variant_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE blog_post_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE order_status AS ENUM (
  'pending',
  'paid',
  'preparing',
  'partially_shipped',
  'shipped',
  'completed',
  'cancelled',
  'partially_refunded',
  'refunded'
);

CREATE TYPE order_source AS ENUM ('guest', 'customer', 'admin');

CREATE TYPE shipment_status AS ENUM (
  'pending',
  'ready',
  'shipped',
  'delivered',
  'returned',
  'cancelled'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'authorized',
  'paid',
  'failed',
  'cancelled',
  'partially_refunded',
  'refunded'
);

CREATE TYPE payment_provider AS ENUM ('stripe', 'manual');

CREATE TYPE refund_status AS ENUM ('pending', 'succeeded', 'failed', 'cancelled');

CREATE TYPE order_email_event_status AS ENUM ('pending', 'sent', 'failed');

CREATE TYPE email_template_status AS ENUM ('draft', 'active', 'archived');

CREATE TYPE email_template_type AS ENUM ('transactional', 'newsletter');

CREATE TYPE newsletter_subscriber_status AS ENUM ('pending', 'subscribed', 'unsubscribed');

-- ------------------------------------------------------------
-- Core tables
-- ------------------------------------------------------------
CREATE TABLE
  users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    role user_role NOT NULL,
    status user_status NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMPTZ (6),
    last_login_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  media_assets (
    id TEXT PRIMARY KEY,
    storage_key TEXT NOT NULL UNIQUE,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    byte_size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    checksum_sha256 TEXT UNIQUE,
    uploaded_by_user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    page_type page_type NOT NULL DEFAULT 'standard',
    status page_status NOT NULL DEFAULT 'draft',
    summary TEXT,
    content_json JSONB NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    is_indexed BOOLEAN NOT NULL DEFAULT TRUE,
    published_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    status category_status NOT NULL DEFAULT 'active',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    representative_media_id TEXT REFERENCES media_assets (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    status product_status NOT NULL DEFAULT 'draft',
    product_type product_type NOT NULL DEFAULT 'variable',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ (6),
    simple_sku TEXT UNIQUE,
    simple_price_cents INTEGER,
    simple_compare_at_cents INTEGER,
    simple_stock_quantity INTEGER,
    track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color_name TEXT,
    color_hex TEXT,
    sku TEXT UNIQUE,
    price_cents INTEGER,
    compare_at_cents INTEGER,
    stock_quantity INTEGER,
    track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    status product_variant_status NOT NULL DEFAULT 'draft',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    media_asset_id TEXT NOT NULL REFERENCES media_assets (id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  product_variant_images (
    id TEXT PRIMARY KEY,
    product_variant_id TEXT NOT NULL REFERENCES product_variants (id) ON DELETE CASCADE,
    media_asset_id TEXT NOT NULL REFERENCES media_assets (id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  product_categories (
    product_id TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    PRIMARY KEY (product_id, category_id)
  );

CREATE TABLE
  blog_posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    status blog_post_status NOT NULL DEFAULT 'draft',
    cover_media_id TEXT REFERENCES media_assets (id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    published_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  guest_carts (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    currency TEXT NOT NULL DEFAULT 'EUR',
    expires_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  guest_cart_lines (
    id TEXT PRIMARY KEY,
    guest_cart_id TEXT NOT NULL REFERENCES guest_carts (id) ON DELETE CASCADE,
    item_key TEXT NOT NULL,
    product_id TEXT NOT NULL REFERENCES products (id),
    product_variant_id TEXT REFERENCES product_variants (id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    UNIQUE (guest_cart_id, item_key)
  );

CREATE TABLE
  guest_checkout_details (
    id TEXT PRIMARY KEY,
    guest_cart_id TEXT NOT NULL UNIQUE REFERENCES guest_carts (id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    shipping_address_line_1 TEXT NOT NULL,
    shipping_address_line_2 TEXT,
    shipping_postal_code TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_country_code TEXT NOT NULL,
    billing_same_as_shipping BOOLEAN NOT NULL DEFAULT TRUE,
    billing_first_name TEXT,
    billing_last_name TEXT,
    billing_phone TEXT,
    billing_address_line_1 TEXT,
    billing_address_line_2 TEXT,
    billing_postal_code TEXT,
    billing_city TEXT,
    billing_country_code TEXT,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  orders (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    source order_source NOT NULL DEFAULT 'guest',
    user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
    status order_status NOT NULL DEFAULT 'pending',
    currency TEXT NOT NULL DEFAULT 'EUR',
    customer_email TEXT NOT NULL,
    customer_first_name TEXT NOT NULL,
    customer_last_name TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address_line_1 TEXT NOT NULL,
    shipping_address_line_2 TEXT,
    shipping_postal_code TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_country_code TEXT NOT NULL,
    billing_same_as_shipping BOOLEAN NOT NULL DEFAULT TRUE,
    billing_first_name TEXT,
    billing_last_name TEXT,
    billing_phone TEXT,
    billing_address_line_1 TEXT,
    billing_address_line_2 TEXT,
    billing_postal_code TEXT,
    billing_city TEXT,
    billing_country_code TEXT,
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    notes TEXT,
    placed_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  order_lines (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products (id) ON DELETE SET NULL,
    product_variant_id TEXT REFERENCES product_variants (id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_slug TEXT,
    variant_name TEXT,
    color_name TEXT,
    color_hex TEXT,
    sku TEXT,
    quantity INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    line_subtotal_cents INTEGER NOT NULL,
    line_total_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  shipments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    status shipment_status NOT NULL DEFAULT 'pending',
    carrier TEXT,
    service TEXT,
    tracking_number TEXT,
    tracking_url TEXT,
    label_url TEXT,
    shipped_at TIMESTAMPTZ (6),
    delivered_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  shipment_lines (
    id TEXT PRIMARY KEY,
    shipment_id TEXT NOT NULL REFERENCES shipments (id) ON DELETE CASCADE,
    order_line_id TEXT NOT NULL REFERENCES order_lines (id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  payments (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    method TEXT NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    currency TEXT NOT NULL DEFAULT 'EUR',
    amount_cents INTEGER NOT NULL,
    provider_payment_id TEXT UNIQUE,
    provider_intent_id TEXT UNIQUE,
    provider_checkout_id TEXT UNIQUE,
    metadata_json JSONB,
    paid_at TIMESTAMPTZ (6),
    failed_at TIMESTAMPTZ (6),
    failure_code TEXT,
    failure_reason TEXT,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  refunds (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    payment_id TEXT REFERENCES payments (id) ON DELETE SET NULL,
    status refund_status NOT NULL DEFAULT 'pending',
    amount_cents INTEGER NOT NULL,
    reason TEXT,
    provider_refund_id TEXT UNIQUE,
    processed_at TIMESTAMPTZ (6),
    failure_reason TEXT,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  refund_lines (
    id TEXT PRIMARY KEY,
    refund_id TEXT NOT NULL REFERENCES refunds (id) ON DELETE CASCADE,
    order_line_id TEXT NOT NULL REFERENCES order_lines (id) ON DELETE CASCADE,
    quantity INTEGER,
    amount_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  email_templates (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type email_template_type NOT NULL DEFAULT 'transactional',
    subject_template TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    status email_template_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  order_email_events (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    email_template_id TEXT REFERENCES email_templates (id) ON DELETE SET NULL,
    template_key TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    status order_email_event_status NOT NULL DEFAULT 'pending',
    provider TEXT,
    provider_message_id TEXT,
    payload_json JSONB,
    last_error TEXT,
    sent_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

CREATE TABLE
  newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    status newsletter_subscriber_status NOT NULL DEFAULT 'pending',
    source TEXT,
    confirmation_token TEXT UNIQUE,
    subscribed_at TIMESTAMPTZ (6),
    unsubscribed_at TIMESTAMPTZ (6),
    created_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ (6) NOT NULL DEFAULT NOW ()
  );

-- ------------------------------------------------------------
-- Core indexes mirroring the Prisma schema
-- ------------------------------------------------------------
CREATE INDEX users_role_status_idx ON users (role, status);

CREATE INDEX media_assets_uploaded_by_user_id_idx ON media_assets (uploaded_by_user_id);

CREATE INDEX pages_page_type_status_idx ON pages (page_type, status);

CREATE INDEX pages_status_published_at_idx ON pages (status, published_at);

CREATE INDEX categories_status_idx ON categories (status);

CREATE INDEX categories_is_featured_idx ON categories (is_featured);

CREATE INDEX categories_display_order_idx ON categories (display_order);

CREATE INDEX categories_representative_media_id_idx ON categories (representative_media_id);

CREATE INDEX products_status_idx ON products (status);

CREATE INDEX products_is_featured_idx ON products (is_featured);

CREATE INDEX products_product_type_idx ON products (product_type);

CREATE INDEX products_published_at_idx ON products (published_at);

CREATE INDEX product_variants_product_id_idx ON product_variants (product_id);

CREATE INDEX product_variants_status_idx ON product_variants (status);

CREATE INDEX product_variants_sort_order_idx ON product_variants (sort_order);

CREATE INDEX product_images_product_id_idx ON product_images (product_id);

CREATE INDEX product_images_media_asset_id_idx ON product_images (media_asset_id);

CREATE INDEX product_images_sort_order_idx ON product_images (sort_order);

CREATE INDEX product_variant_images_product_variant_id_idx ON product_variant_images (product_variant_id);

CREATE INDEX product_variant_images_media_asset_id_idx ON product_variant_images (media_asset_id);

CREATE INDEX product_variant_images_sort_order_idx ON product_variant_images (sort_order);

CREATE INDEX product_categories_category_id_idx ON product_categories (category_id);

CREATE INDEX blog_posts_status_published_at_idx ON blog_posts (status, published_at);

CREATE INDEX blog_posts_cover_media_id_idx ON blog_posts (cover_media_id);

CREATE INDEX guest_carts_expires_at_idx ON guest_carts (expires_at);

CREATE INDEX guest_cart_lines_guest_cart_id_idx ON guest_cart_lines (guest_cart_id);

CREATE INDEX guest_cart_lines_product_id_idx ON guest_cart_lines (product_id);

CREATE INDEX guest_cart_lines_product_variant_id_idx ON guest_cart_lines (product_variant_id);

CREATE INDEX orders_user_id_idx ON orders (user_id);

CREATE INDEX orders_source_idx ON orders (source);

CREATE INDEX orders_status_idx ON orders (status);

CREATE INDEX orders_placed_at_idx ON orders (placed_at);

CREATE INDEX orders_customer_email_idx ON orders (customer_email);

CREATE INDEX order_lines_order_id_idx ON order_lines (order_id);

CREATE INDEX order_lines_product_id_idx ON order_lines (product_id);

CREATE INDEX order_lines_product_variant_id_idx ON order_lines (product_variant_id);

CREATE INDEX shipments_order_id_idx ON shipments (order_id);

CREATE INDEX shipments_status_idx ON shipments (status);

CREATE INDEX shipment_lines_shipment_id_idx ON shipment_lines (shipment_id);

CREATE INDEX shipment_lines_order_line_id_idx ON shipment_lines (order_line_id);

CREATE INDEX payments_order_id_idx ON payments (order_id);

CREATE INDEX payments_status_idx ON payments (status);

CREATE INDEX refunds_order_id_idx ON refunds (order_id);

CREATE INDEX refunds_payment_id_idx ON refunds (payment_id);

CREATE INDEX refunds_status_idx ON refunds (status);

CREATE INDEX refund_lines_refund_id_idx ON refund_lines (refund_id);

CREATE INDEX refund_lines_order_line_id_idx ON refund_lines (order_line_id);

CREATE INDEX order_email_events_order_id_idx ON order_email_events (order_id);

CREATE INDEX order_email_events_email_template_id_idx ON order_email_events (email_template_id);

CREATE INDEX order_email_events_status_idx ON order_email_events (status);

CREATE INDEX email_templates_type_status_idx ON email_templates (type, status);

CREATE INDEX newsletter_subscribers_status_idx ON newsletter_subscribers (status);

COMMIT;
