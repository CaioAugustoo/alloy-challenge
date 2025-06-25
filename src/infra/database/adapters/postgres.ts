import { Client } from "pg";
import type { Database } from "../database";

export class Postgres implements Database {
  private client: Client;

  constructor(connectionString: string) {
    this.client = new Client({ connectionString });
  }

  async query<T>(query: string): Promise<T> {
    const client = await this.getClient();
    const result = await client.query(query);
    return result.rows[0];
  }

  async connect(): Promise<this> {
    await this.client.connect();
    return this;
  }

  private async getClient(): Promise<Client> {
    return this.client;
  }
}
