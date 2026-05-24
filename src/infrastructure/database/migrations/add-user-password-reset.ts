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
  console.log("Running migration: add reset password columns to users...");

  const tableInfo = await client.execute({ sql: "PRAGMA table_info(users);", args: [] });
  const rows = (tableInfo as any).rows ?? [];

  const hasToken = rows.some((row: any) => row.name === "reset_password_token");
  const hasExpires = rows.some((row: any) => row.name === "reset_password_expires_at");

  if (hasToken && hasExpires) {
    console.log("Reset password columns already exist on users. Migration skipped.");
    return;
  }

  if (!hasToken) {
    console.log("Adding reset_password_token column...");
    await client.execute({
      sql: "ALTER TABLE users ADD COLUMN reset_password_token TEXT;",
      args: [],
    });
  }

  if (!hasExpires) {
    console.log("Adding reset_password_expires_at column...");
    await client.execute({
      sql: "ALTER TABLE users ADD COLUMN reset_password_expires_at INTEGER;",
      args: [],
    });
  }

  console.log("Migration complete: reset password columns added to users.");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
