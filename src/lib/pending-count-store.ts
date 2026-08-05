"use client";

export interface PendingCountData {
  count: number;
  catedraCount: number;
  catedraStats: Record<
    string,
    { count: number; bestScore: number | null; avgScore: number | null }
  >;
  catedraAccess: Record<
    number,
    {
      isPaused: boolean;
      pausedAt: string | null;
      exceptionActiveUntil: string | null;
      accessGranted: boolean;
    }
  >;
}

const CACHE_TTL_MS = 30_000;

let cachedData: PendingCountData | null = null;
let cacheFetchedAt = 0;
let inFlight: Promise<PendingCountData> | null = null;
let refreshPromise: Promise<void> | null = null;
const listeners = new Set<(data: PendingCountData) => void>();

const EMPTY: PendingCountData = {
  count: 0,
  catedraCount: 0,
  catedraStats: {},
  catedraAccess: {},
};

async function fetchFromNetwork(): Promise<PendingCountData> {
  const res = await fetch("/api/quizzes/pending-count");
  if (!res.ok) throw new Error(`pending-count ${res.status}`);
  const data = (await res.json()) as PendingCountData;
  if (!data || typeof data.count !== "number") throw new Error("pending-count invalid");
  cachedData = data;
  cacheFetchedAt = Date.now();
  return data;
}

function notifyListeners(): void {
  if (!cachedData) return;
  for (const listener of listeners) {
    listener(cachedData);
  }
}

/** Devuelve el dato, reutilizando la caché o la petición en vuelo (dedupe). */
export async function getPendingCountData(
  options: { force?: boolean } = {},
): Promise<PendingCountData> {
  const { force = false } = options;
  const now = Date.now();

  if (cachedData && !force && now - cacheFetchedAt < CACHE_TTL_MS) {
    return cachedData;
  }
  if (inFlight) {
    return inFlight;
  }

  inFlight = fetchFromNetwork()
    .catch((err) => {
      console.error("Error fetching pending count:", err);
      return cachedData ?? EMPTY;
    })
    .finally(() => {
      inFlight = null;
    });

  notifyListeners();
  return inFlight;
}

/** Fuerza una recarga y notifica a todos los suscriptores (badges del sidebar). */
export function refreshPendingCountData(): Promise<void> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = getPendingCountData({ force: true })
    .then(() => {
      notifyListeners();
    })
    .catch(() => undefined)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

export function subscribePendingCount(listener: (data: PendingCountData) => void): () => void {
  listeners.add(listener);
  if (cachedData) listener(cachedData);
  return () => {
    listeners.delete(listener);
  };
}
