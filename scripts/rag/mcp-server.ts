import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { CORPUS_VALUES, FORMAT_VALUES } from "./creatyss-rag.config";
import { buildCreatyssContextOutput, searchCreatyssContext } from "./rag-search";

const server = new McpServer({
  name: "creatyss-rag",
  version: "1.0.0",
});

server.registerTool(
  "search_context",
  {
    description:
      "Recherche du contexte documentaire Creatyss (doctrine, architecture, Prisma, code).",
    inputSchema: z.object({
      query: z.string().min(1, "La requête ne peut pas être vide"),
      corpus: z.enum(CORPUS_VALUES).optional().default("all"),
      format: z.enum(FORMAT_VALUES).optional().default("prompt"),
    }),
  },
  async ({ query, corpus, format }) => {
    const results = searchCreatyssContext({ query, corpus });
    const output = buildCreatyssContextOutput({ results, query, corpus, format });
    return {
      content: [{ type: "text" as const, text: output }],
    };
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("Erreur fatale MCP server :", error);
  process.exit(1);
});
