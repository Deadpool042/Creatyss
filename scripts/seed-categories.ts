import { seedCreatyssCategories } from "./helpers/category-seed";
import { createScriptPrismaClient } from "./helpers/prisma-client";

const prisma = createScriptPrismaClient();

async function main() {
  await seedCreatyssCategories(prisma);
  process.stdout.write("Category seed completed.\n");
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
