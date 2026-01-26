import type { Config } from "drizzle-kit";

export default {
  schema: "./src/infrastructure/database/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
