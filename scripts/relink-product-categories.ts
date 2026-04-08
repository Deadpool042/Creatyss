import { createScriptPrismaClient } from "./helpers/prisma-client";
import { relinkProductCategories } from "./helpers/category-relink";

const prisma = createScriptPrismaClient();

async function main() {
  await relinkProductCategories(prisma);
  process.stdout.write("Product category relink completed.\n");
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
