import IORedis from "ioredis";

export class RedisService {
  public readonly connection: IORedis;

  constructor(redisUrl: string) {
    this.connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null
    });
  }

  async ping(): Promise<string> {
    return this.connection.ping();
  }
}
