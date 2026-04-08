import { cleanupCreatyssCategories } from "./helpers/category-cleanup";
import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

async function main() {
  await cleanupCreatyssCategories(prisma);
  process.stdout.write("Category cleanup completed.\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
