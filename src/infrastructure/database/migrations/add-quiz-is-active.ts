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
  console.log("Running migration: add is_active to quizzes...");

  const tableInfo = await client.execute({ sql: "PRAGMA table_info(quizzes);", args: [] });
  const rows = (tableInfo as any).rows ?? [];

  if (rows.some((row: any) => row.name === "is_active")) {
    console.log("Column is_active already exists on quizzes. Migration skipped.");
    return;
  }

  await client.execute({
    sql: "ALTER TABLE quizzes ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;",
    args: [],
  });

  console.log("Migration complete: is_active added to quizzes.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
