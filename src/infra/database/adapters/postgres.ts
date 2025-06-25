import { Client } from "pg";
import type { Database } from "../database";

export class Postgres implements Database {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }

  async query<T>(query: string, params?: any[]): Promise<T> {
    const client = await this.getClient();
    const result = await client.query(query, params);
    return result.rows.length === 1 ? result.rows[0] : (result.rows as T);
  }

  async connect(): Promise<this> {
    await this.client.connect();
    return this;
  }

  async close(): Promise<void> {
    await this.client.end();
  }

  private async getClient(): Promise<Client> {
    return this.client;
  }
}
