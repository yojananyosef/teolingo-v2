import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Decide qué variable usar (elige UNA y sé consistente)
const url = process.env.TURSO_DATABASE_URL || process.env.TURSO_CONNECTION_URL;

const authToken = process.env.TURSO_AUTH_TOKEN;

// Logging útil (especialmente en Vercel)
if (!url) {
  console.error("❌ ERROR: TURSO_DATABASE_URL o TURSO_CONNECTION_URL no definidos. El cliente /web requiere una URL remota (libsql:// o https://).");
  throw new Error("Database URL is required for @libsql/client/web");
}

let client;

try {
  client = createClient({
    url,
    authToken,
  });
} catch (e) {
  console.error("❌ Error inicializando Turso client:", e);
  throw e; // importante: fallar rápido
}

export const db = drizzle(client, { schema });
