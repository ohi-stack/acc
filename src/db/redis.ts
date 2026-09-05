// MOCKED — in-memory, data lost on container sleep
const store = new Map<string, string>();

export const redis = {
  status: 'ready',
  get: async (k: string) => store.get(k) ?? null,
  set: async (k: string, v: string) => {
    store.set(k, v);
    return 'OK';
  },
  del: async (k: string) => (store.delete(k) ? 1 : 0),
  incr: async (k: string) => {
    const n = Number(store.get(k) || 0) + 1;
    store.set(k, String(n));
    return n;
  },
  ping: async () => 'PONG',
  quit: async () => 'OK',
  disconnect: () => {},
  on: () => redis,
  once: () => redis,
  off: () => redis,
  emit: () => true
} as any;

export async function redisHealth(): Promise<boolean> {
  return true;
}

