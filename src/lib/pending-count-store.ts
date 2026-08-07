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
const STORAGE_KEY = "teolingo_pending_count_v1";

const EMPTY: PendingCountData = {
  count: 0,
  catedraCount: 0,
  catedraStats: {},
  catedraAccess: {},
};

function loadFromStorage(): PendingCountData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.count === "number" && typeof parsed.catedraCount === "number") {
      return parsed as PendingCountData;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function saveToStorage(data: PendingCountData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function removeFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

let cachedData: PendingCountData | null = null;
let cacheFetchedAt = 0;
let inFlight: Promise<PendingCountData> | null = null;
let refreshPromise: Promise<void> | null = null;
const listeners = new Set<(data: PendingCountData) => void>();

function notifyListeners(): void {
  const dataToNotify = cachedData || loadFromStorage();
  if (!dataToNotify) return;
  for (const listener of listeners) {
    listener(dataToNotify);
  }
}

async function fetchFromNetwork(): Promise<PendingCountData> {
  const res = await fetch("/api/quizzes/pending-count");
  if (!res.ok) throw new Error(`pending-count ${res.status}`);
  const data = (await res.json()) as PendingCountData;
  if (!data || typeof data.count !== "number") throw new Error("pending-count invalid");
  cachedData = data;
  cacheFetchedAt = Date.now();
  saveToStorage(data);
  notifyListeners();
  return data;
}

/** Devuelve el dato, reutilizando la caché o la petición en vuelo (dedupe). */
export async function getPendingCountData(
  options: { force?: boolean } = {},
): Promise<PendingCountData> {
  const { force = false } = options;
  const now = Date.now();

  if (!cachedData) {
    cachedData = loadFromStorage();
  }

  if (cachedData && !force && now - cacheFetchedAt < CACHE_TTL_MS) {
    notifyListeners();
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

export function resetPendingCountData(): void {
  cachedData = null;
  cacheFetchedAt = 0;
  removeFromStorage();
  for (const listener of listeners) {
    listener(EMPTY);
  }
}

export function subscribePendingCount(listener: (data: PendingCountData) => void): () => void {
  listeners.add(listener);
  const current = cachedData || loadFromStorage();
  if (current) {
    listener(current);
  }
  return () => {
    listeners.delete(listener);
  };
}
