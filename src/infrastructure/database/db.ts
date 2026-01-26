import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Decide qué variable usar (elige UNA y sé consistente)
const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.TURSO_CONNECTION_URL ||
  "file:local.db";

const authToken = process.env.TURSO_AUTH_TOKEN;

// Logging útil (especialmente en Vercel)
if (!process.env.TURSO_DATABASE_URL && !process.env.TURSO_CONNECTION_URL) {
  console.warn(
    "⚠️ TURSO_DATABASE_URL / TURSO_CONNECTION_URL no encontrado. Usando DB local.",
  );
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
