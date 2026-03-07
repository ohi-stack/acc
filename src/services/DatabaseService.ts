import { Client } from "pg";

export class DatabaseService {
  private readonly client: Client;

  constructor(databaseUrl: string) {
    this.client = new Client({ connectionString: databaseUrl });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async ping(): Promise<void> {
    await this.client.query("SELECT 1");
  }
}
