import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL ?? process.env.TURSO_CONNECTION_URL ?? "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error("Database URL is required to run migrations.");
}

const client = createClient({
  url,
  authToken,
});

async function main() {
  console.log("Running migration: add catedra_control and catedra_exceptions...");

  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS catedra_control (
        id TEXT PRIMARY KEY NOT NULL,
        is_paused INTEGER NOT NULL DEFAULT 0,
        paused_by TEXT,
        paused_at INTEGER,
        updated_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `,
    args: [],
  });

  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS catedra_exceptions (
        id TEXT PRIMARY KEY NOT NULL,
        student_id TEXT NOT NULL,
        active_until INTEGER NOT NULL,
        granted_by TEXT,
        created_at INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    `,
    args: [],
  });

  await client.execute({
    sql: `
      INSERT OR IGNORE INTO catedra_control (id, is_paused, updated_at)
      VALUES ('global', 0, CURRENT_TIMESTAMP);
    `,
    args: [],
  });

  console.log("Migration complete: catedra_control and catedra_exceptions tables ready.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});