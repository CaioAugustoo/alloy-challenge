import { describe, test, expect, vi } from "vitest";
import { UsersRepository } from "./users";
import { MockPostgres } from "../database/adapters/mock.postgres";
import { User } from "../../domain/entities/user";

const db = new MockPostgres();

describe("UsersRepository", () => {
  test("should return user by id", async () => {
    const repository = new UsersRepository(db);

    db.query.mockResolvedValue({
      id: "123",
      name: "John Doe",
      email: "john@doe.com",
      password: "@$32321sdas2$",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await repository.findById("123");

    expect(user!.name).toBe("John Doe");
    expect(user!.email.getValue()).toBe("john@doe.com");
  });

  test("should return user by email", async () => {
    const repository = new UsersRepository(db);

    db.query.mockResolvedValue({
      id: "123",
      name: "John Doe",
      email: "john@doe.com",
      password: "@$32321sdas2$",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await repository.findByEmail("john@doe.com");

    expect(user!.name).toBe("John Doe");
    expect(user!.email.getValue()).toBe("john@doe.com");
  });

  test("should create user", async () => {
    const repository = new UsersRepository(db);

    const fakeUser = await User.createNew(
      "John Doe",
      "john@doe.com",
      "@$32321sdas2$",
      {
        hash: vi.fn().mockResolvedValue("@$32321sdas2$"),
        compare: vi.fn().mockResolvedValue(true),
      }
    );

    expect(() => repository.create(fakeUser)).not.toThrow();
  });
});
