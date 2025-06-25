import { vi } from "vitest";
import { Database } from "../database";

export class MockPostgres implements Database {
  public connect = vi.fn().mockResolvedValue(this);
  public query = vi.fn();
  public close = vi.fn().mockResolvedValue(undefined);
}
