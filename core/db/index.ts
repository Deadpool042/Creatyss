//core/db/index.ts
export { db } from "./client";
export { checkDatabaseHealth } from "./health";
export { withTransaction } from "./transactions/with-transaction";

export type { DbExecutor } from "./types";
export type { DbTx } from "./transactions/with-transaction";
