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
  console.log("Running migration: add updated metadata to quizzes...");

  const tableInfo = await client.execute({ sql: "PRAGMA table_info(quizzes);", args: [] });
  const rows = (tableInfo as any).rows ?? [];

  if (!rows.some((row: any) => row.name === "updated_by_name")) {
    await client.execute({
      sql: "ALTER TABLE quizzes ADD COLUMN updated_by_name TEXT;",
      args: [],
    });
    console.log("Added updated_by_name column.");
  } else {
    console.log("Column updated_by_name already exists. Skipping.");
  }

  if (!rows.some((row: any) => row.name === "updated_at")) {
    await client.execute({
      sql: "ALTER TABLE quizzes ADD COLUMN updated_at INTEGER;",
      args: [],
    });
    console.log("Added updated_at column.");
  } else {
    console.log("Column updated_at already exists. Skipping.");
  }

  console.log("Migration complete: updated metadata fields added to quizzes.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
