import { describe, test, expect, vi, beforeEach, afterAll } from "vitest";
import { Postgres } from "./postgres";

vi.mock("pg", () => ({
  Client: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    query: vi.fn().mockResolvedValue({ rows: [{ id: 1, name: "test" }] }),
    end: vi.fn(),
  })),
}));

describe("Postgres", () => {
  let postgres: Postgres;

  beforeEach(() => {
    postgres = new Postgres("postgres://localhost:5432/test");
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should connect to database", async () => {
    const result = await postgres.connect();
    expect(result).toBeInstanceOf(Postgres);
  });

  test("should query database", async () => {
    await postgres.connect();
    const result = await postgres.query<{ id: number; name: string }>(
      "SELECT * FROM test"
    );
    expect(result).toEqual({ id: 1, name: "test" });
    expect(
      async () => await postgres.query("SELECT * FROM test")
    ).not.toThrow();
  });
});
