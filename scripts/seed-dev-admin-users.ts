import { randomUUID } from "node:crypto";
import { Pool } from "pg";

type SeedAdminDefinition = {
  email: string;
  displayName: string;
  password: string;
  status: "active" | "disabled";
};

type ExistingUserRow = {
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
    status: "active",
  },
  {
    email: "inactive-admin@creatyss.local",
    displayName: "Admin Creatyss Inactive",
    password: "AdminDev123!",
    status: "disabled",
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

      const existingUser = await pool.query<ExistingUserRow>(
        `
          select id::text as id
          from users
          where lower(email) = lower($1)
          limit 1
        `,
        [normalizedInput.email]
      );

      const passwordHash = await adminAuth.hashAdminPassword(normalizedInput.password);

      if (existingUser.rows.length > 0) {
        await pool.query(
          `
            update users
            set
              display_name = $2,
              password_hash = $3,
              role = 'admin',
              status = $4,
              updated_at = now()
            where lower(email) = lower($1)
          `,
          [normalizedInput.email, normalizedInput.displayName, passwordHash, admin.status]
        );

        process.stdout.write(`Admin user updated for ${normalizedInput.email}.\n`);
        continue;
      }

      await pool.query(
        `
          insert into users (
            id,
            email,
            password_hash,
            display_name,
            role,
            status,
            created_at,
            updated_at
          )
          values ($1, $2, $3, $4, 'admin', $5, now(), now())
        `,
        [
          randomUUID(),
          normalizedInput.email,
          passwordHash,
          normalizedInput.displayName,
          admin.status,
        ]
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
