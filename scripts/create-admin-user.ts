import { ensureDefaultAdminRole, ensureDefaultStore } from "./helpers/store-bootstrap.ts";
import { upsertAdminUser } from "./helpers/admin-bootstrap.ts";
import { createScriptPrismaClient } from "./helpers/prisma-client.ts";

type CliArguments = {
  email: string | null;
  displayName: string | null;
  passwordStdin: boolean;
};

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
  const prisma = createScriptPrismaClient();

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: args.email.trim().toLowerCase(),
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      throw new Error(`User already exists for email: ${args.email}`);
    }

    const store = await ensureDefaultStore(prisma);
    const role = await ensureDefaultAdminRole(prisma, store.id);
    const user = await upsertAdminUser(
      prisma,
      {
        email: args.email,
        displayName: args.displayName,
        password,
        status: "active",
      },
      store.id,
      role.id
    );

    process.stdout.write(`Admin user created for ${user.email} (id: ${user.id}).\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown admin bootstrap error.";

  process.stderr.write(`${message}\n`);
  process.exit(1);
});
