import { describe, expect, vi, beforeEach, test } from "vitest";
import { UsersRepository } from "../../../src/infra/repositories/users";
import { User } from "../../../src/domain/entities/user";

describe("UsersRepository", () => {
  let db: any;
  let repo: UsersRepository;

  beforeEach(() => {
    db = { query: vi.fn() };
    repo = new UsersRepository(db);
  });

  test("should find a user by id", async () => {
    const now = new Date();
    const userData = {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashed-password",
      created_at: now,
      updated_at: now,
    };

    db.query.mockResolvedValueOnce(userData);
    vi.spyOn(User, "createFromPersistence").mockReturnValueOnce({
      id: "user-1",
    } as unknown as User);

    const user = await repo.findById("user-1");
    expect(user).toBeDefined();
    expect(User.createFromPersistence).toHaveBeenCalledWith(userData);
  });

  test("should return undefined if user not found by id", async () => {
    db.query.mockResolvedValueOnce(undefined);
    const user = await repo.findById("non-existent");
    expect(user).toBeUndefined();
  });

  test("should find a user by email", async () => {
    const now = new Date();
    const userData = {
      id: "user-2",
      name: "Jane Doe",
      email: "jane@example.com",
      created_at: now,
      updated_at: now,
    };

    db.query.mockResolvedValueOnce(userData);
    vi.spyOn(User, "createFromPersistence").mockReturnValueOnce({
      id: "user-2",
    } as unknown as User);

    const user = await repo.findByEmail("jane@example.com");
    expect(user).toBeDefined();
    expect(User.createFromPersistence).toHaveBeenCalledWith(userData);
  });

  test("should return undefined if user not found by email", async () => {
    db.query.mockResolvedValueOnce(undefined);
    const user = await repo.findByEmail("notfound@example.com");
    expect(user).toBeUndefined();
  });

  test("should create a user", async () => {
    const now = new Date();
    const fakeUser = {
      toPersistence: () => ({
        id: "user-3",
        name: "Test User",
        email: "test@example.com",
        password: "hashed",
        createdAt: now,
        updatedAt: now,
      }),
    } as unknown as User;

    await repo.create(fakeUser);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      expect.arrayContaining(["user-3", "Test User"])
    );
  });
});
