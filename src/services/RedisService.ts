// MOCKED — in-memory store for AI Studio container environment
const store = new Map<string, string>();

export class RedisService {
  public readonly connection: any;

  constructor(_redisUrl?: string) {
    this.connection = {
      status: "ready",
      get: async (k: string) => store.get(k) ?? null,
      set: async (k: string, v: string) => {
        store.set(k, v);
        return "OK";
      },
      del: async (k: string) => {
        const deleted = store.delete(k);
        return deleted ? 1 : 0;
      },
      incr: async (k: string) => {
        const n = Number(store.get(k) || 0) + 1;
        store.set(k, String(n));
        return n;
      },
      ping: async () => "PONG",
      quit: async () => "OK",
      disconnect: () => {},
      on: () => this.connection,
      once: () => this.connection,
      off: () => this.connection,
      emit: () => true
    };
  }

  async ping(): Promise<string> {
    return "PONG";
  }
}

