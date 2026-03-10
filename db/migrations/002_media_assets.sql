BEGIN;

CREATE TABLE media_assets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  file_path text NOT NULL,
  original_name text NOT NULL,
  mime_type text NOT NULL,
  byte_size bigint NOT NULL,
  image_width integer,
  image_height integer,
  uploaded_by_admin_user_id bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT media_assets_uploaded_by_admin_user_id_fkey
    FOREIGN KEY (uploaded_by_admin_user_id)
    REFERENCES admin_users (id)
    ON DELETE SET NULL,
  CONSTRAINT media_assets_byte_size_check
    CHECK (byte_size > 0),
  CONSTRAINT media_assets_image_width_check
    CHECK (image_width IS NULL OR image_width > 0),
  CONSTRAINT media_assets_image_height_check
    CHECK (image_height IS NULL OR image_height > 0)
);

CREATE UNIQUE INDEX media_assets_file_path_key
  ON media_assets (file_path);

CREATE INDEX media_assets_uploaded_by_admin_user_id_idx
  ON media_assets (uploaded_by_admin_user_id);

CREATE INDEX media_assets_created_at_idx
  ON media_assets (created_at DESC, id DESC);

CREATE TRIGGER media_assets_set_updated_at
BEFORE UPDATE ON media_assets
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
