import { describe, it, expect, vi, beforeEach, test } from "vitest";
import { Client } from "pg";
import type { Mock } from "vitest";
import { Postgres } from "../../../../src/infra/database/adapters/postgres";

vi.mock("pg", () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      connect: vi.fn(),
      end: vi.fn(),
      query: vi.fn(),
    })),
  };
});

describe("Postgres", () => {
  let postgres: Postgres;
  let mockClient: any;

  beforeEach(() => {
    vi.clearAllMocks();

    postgres = new Postgres("postgres://user:pass@localhost/db");

    mockClient = (Client as unknown as Mock).mock.results[0].value;
  });

  test("should connect the client", async () => {
    await postgres.connect();
    expect(mockClient.connect).toHaveBeenCalled();
  });

  test("should close the client", async () => {
    await postgres.close();
    expect(mockClient.end).toHaveBeenCalled();
  });

  test("should return multiple rows if more than one row", async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    mockClient.query.mockResolvedValueOnce({ rows });

    const result = await postgres.query("SELECT * FROM test");

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM test",
      undefined
    );
    expect(result).toEqual(rows);
  });

  test("should return single row if only one row", async () => {
    const rows = [{ id: 1 }];
    mockClient.query.mockResolvedValueOnce({ rows });

    const result = await postgres.query("SELECT * FROM test");

    expect(result).toEqual(rows[0]);
  });

  test("should return undefined if no rows", async () => {
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await postgres.query("SELECT * FROM test");

    expect(result).toBeUndefined();
  });

  test("should pass query parameters", async () => {
    const rows = [{ id: 1 }];
    mockClient.query.mockResolvedValueOnce({ rows });

    const result = await postgres.query("SELECT * FROM test WHERE id = $1", [
      1,
    ]);

    expect(mockClient.query).toHaveBeenCalledWith(
      "SELECT * FROM test WHERE id = $1",
      [1]
    );
    expect(result).toEqual(rows[0]);
  });
});
