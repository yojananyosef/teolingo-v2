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
  console.log("Running migration: add time_limit_seconds to quizzes...");

  const tableInfo = await client.execute({ sql: "PRAGMA table_info(quizzes);", args: [] });
  const rows = (tableInfo as any).rows ?? [];

  const hasTimeLimit = rows.some((row: any) => row.name === "time_limit_seconds");

  if (hasTimeLimit) {
    console.log("Column time_limit_seconds already exists on quizzes. Migration skipped.");
    return;
  }

  console.log("Adding time_limit_seconds column to quizzes...");
  await client.execute({
    sql: "ALTER TABLE quizzes ADD COLUMN time_limit_seconds INTEGER NOT NULL DEFAULT 300;",
    args: [],
  });

  console.log("Migration complete: time_limit_seconds column added to quizzes.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
