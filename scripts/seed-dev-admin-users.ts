import { Pool } from "pg";

type SeedAdminDefinition = {
  email: string;
  displayName: string;
  password: string;
  isActive: boolean;
};

type ExistingAdminRow = {
  id: string;
};

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;

  if (!value || value.trim().length === 0) {
    return "postgresql://creatyss:creatyss@db:5432/creatyss";
  }

  return value;
}

const DEV_ADMINS: readonly SeedAdminDefinition[] = [
  {
    email: "admin@creatyss.local",
    displayName: "Admin Creatyss",
    password: "AdminDev123!",
    isActive: true,
  },
  {
    email: "inactive-admin@creatyss.local",
    displayName: "Admin Creatyss Inactive",
    password: "AdminDev123!",
    isActive: false,
  },
];

async function main() {
  const adminAuth = await import(new URL("../lib/admin-auth.ts", import.meta.url).href);

  const pool = new Pool({
    connectionString: readDatabaseUrl(),
  });

  try {
    for (const admin of DEV_ADMINS) {
      const normalizedInput = adminAuth.normalizeAdminBootstrapInput({
        email: admin.email,
        displayName: admin.displayName,
        password: admin.password,
      });

      if (normalizedInput === null) {
        throw new Error(`Invalid seeded admin input for email: ${admin.email}`);
      }

      const existingAdmin = await pool.query<ExistingAdminRow>(
        `
          select id::text as id
          from admin_users
          where lower(email) = lower($1)
          limit 1
        `,
        [normalizedInput.email]
      );

      const passwordHash = await adminAuth.hashAdminPassword(normalizedInput.password);

      if (existingAdmin.rows.length > 0) {
        await pool.query(
          `
            update admin_users
            set
              display_name = $2,
              password_hash = $3,
              is_active = $4,
              updated_at = now()
            where lower(email) = lower($1)
          `,
          [normalizedInput.email, normalizedInput.displayName, passwordHash, admin.isActive]
        );

        process.stdout.write(`Admin user updated for ${normalizedInput.email}.\n`);

        continue;
      }

      await pool.query(
        `
          insert into admin_users (
            email,
            password_hash,
            display_name,
            is_active
          )
          values ($1, $2, $3, $4)
        `,
        [normalizedInput.email, passwordHash, normalizedInput.displayName, admin.isActive]
      );

      process.stdout.write(`Admin user created for ${normalizedInput.email}.\n`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown dev admin seed error.";

  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
