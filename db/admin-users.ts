import { queryFirst } from "./client";

type TimestampValue = Date | string;

type AdminUserRow = {
  id: string;
  email: string;
  display_name: string;
  is_active: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminUserWithPasswordRow = AdminUserRow & {
  password_hash: string;
};

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserWithPassword = AdminUser & {
  passwordHash: string;
};

type CreateAdminUserInput = {
  email: string;
  displayName: string;
  passwordHash: string;
};

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminUser(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    isActive: row.is_active,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapAdminUserWithPassword(
  row: AdminUserWithPasswordRow
): AdminUserWithPassword {
  return {
    ...mapAdminUser(row),
    passwordHash: row.password_hash
  };
}

export async function findAdminUserByEmail(
  email: string
): Promise<AdminUserWithPassword | null> {
  const row = await queryFirst<AdminUserWithPasswordRow>(
    `
      select
        id::text as id,
        email,
        password_hash,
        display_name,
        is_active,
        created_at,
        updated_at
      from admin_users
      where lower(email) = lower($1)
      limit 1
    `,
    [email]
  );

  if (row === null) {
    return null;
  }

  return mapAdminUserWithPassword(row);
}

export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const row = await queryFirst<AdminUserRow>(
    `
      select
        id::text as id,
        email,
        display_name,
        is_active,
        created_at,
        updated_at
      from admin_users
      where id = $1::bigint
      limit 1
    `,
    [id]
  );

  if (row === null) {
    return null;
  }

  return mapAdminUser(row);
}

export async function createAdminUser(
  input: CreateAdminUserInput
): Promise<AdminUser> {
  const row = await queryFirst<AdminUserRow>(
    `
      insert into admin_users (
        email,
        password_hash,
        display_name
      )
      values ($1, $2, $3)
      returning
        id::text as id,
        email,
        display_name,
        is_active,
        created_at,
        updated_at
    `,
    [input.email, input.passwordHash, input.displayName]
  );

  if (row === null) {
    throw new Error("Failed to create admin user.");
  }

  return mapAdminUser(row);
}
