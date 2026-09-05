// MOCKED — PostgreSQL fallback for AI Studio container environment
export class DatabaseService {
  private connected: boolean = false;

  constructor(private readonly databaseUrl: string) {}

  async connect(): Promise<void> {
    this.connected = true;
    console.log("[AI Studio] DatabaseService connected (in-memory mode)");
  }

  async ping(): Promise<void> {
    if (!this.connected) {
      throw new Error("Database not connected");
    }
  }
}

