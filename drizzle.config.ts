import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  // Use Turso/libSQL in production. The drizzle CLI allows pushing using
  // `push:sqlite --driver turso` so we set the logical driver to "turso" here.
  driver: "turso",
  dbCredentials: {
    url:
      process.env.TURSO_DATABASE_URL ??
      process.env.TURSO_CONNECTION_URL ??
      "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} as unknown as Config;
