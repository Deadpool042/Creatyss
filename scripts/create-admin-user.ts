import { randomUUID } from "node:crypto";
import { Pool } from "pg";

type CliArguments = {
  email: string | null;
  displayName: string | null;
  passwordStdin: boolean;
};

type ExistingUserRow = {
  id: string;
};

type CreatedUserRow = {
  id: string;
};

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;

  if (!value || value.trim().length === 0) {
    return "postgresql://creatyss:creatyss@db:5432/creatyss";
  }

  return value;
}

function parseCliArguments(argv: readonly string[]): CliArguments {
  const parsed: CliArguments = {
    email: null,
    displayName: null,
    passwordStdin: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === "--email") {
      parsed.email = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (argument === "--display-name") {
      parsed.displayName = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (argument === "--password-stdin") {
      parsed.passwordStdin = true;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  return parsed;
}

function readPasswordFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let buffer = "";

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk: string) => {
      buffer += chunk;
    });
    process.stdin.on("end", () => {
      resolve(buffer.replace(/[\r\n]+$/, ""));
    });
    process.stdin.on("error", (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = parseCliArguments(process.argv.slice(2));

  if (!args.passwordStdin) {
    throw new Error("Missing required flag: --password-stdin");
  }

  if (args.email === null || args.displayName === null) {
    throw new Error("Usage: --email <email> --display-name <display name> --password-stdin");
  }

  const password = await readPasswordFromStdin();
  const adminAuth = await import(new URL("../lib/admin-auth.ts", import.meta.url).href);

  const normalizedInput = adminAuth.normalizeAdminBootstrapInput({
    email: args.email,
    displayName: args.displayName,
    password,
  });

  if (normalizedInput === null) {
    throw new Error(
      "Invalid input. Email must be valid, display name must be non-empty, and password must contain at least 12 characters."
    );
  }

  const pool = new Pool({
    connectionString: readDatabaseUrl(),
  });

  try {
    const existingUser = await pool.query<ExistingUserRow>(
      `
        select id::text as id
        from users
        where lower(email) = lower($1)
        limit 1
      `,
      [normalizedInput.email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error(`User already exists for email: ${normalizedInput.email}`);
    }

    const passwordHash = await adminAuth.hashAdminPassword(normalizedInput.password);

    const createdUser = await pool.query<CreatedUserRow>(
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
        values ($1, $2, $3, $4, 'admin', 'active', now(), now())
        returning id::text as id
      `,
      [randomUUID(), normalizedInput.email, passwordHash, normalizedInput.displayName]
    );

    const userId = createdUser.rows[0]?.id;

    if (!userId) {
      throw new Error("Failed to create admin user.");
    }

    process.stdout.write(`Admin user created for ${normalizedInput.email} (id: ${userId}).\n`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown admin bootstrap error.";

  process.stderr.write(`${message}\n`);
  process.exit(1);
});
