import { describe, test, expect, vi, beforeEach } from "vitest";
import { User } from "../../../src/domain/entities/user";
import { Email } from "../../../src/domain/entities/email";

const mockHasher = {
  hash: vi.fn(),
  compare: vi.fn(),
};

describe("User Entity", () => {
  const baseId = "user-123";
  const baseName = "John Doe";
  const baseEmail = "john@example.com";
  const basePassword = "securepass123";
  const hashedPassword = "hashed_password";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create a new user with valid input", async () => {
    mockHasher.hash.mockResolvedValue(hashedPassword);

    const user = await User.createNew(
      baseName,
      baseEmail,
      basePassword,
      mockHasher
    );

    expect(user.id).toBeDefined();
    expect(user.name).toBe(baseName);
    expect(user.email).toBeInstanceOf(Email);
    expect(user.toPersistence().password).toBe(hashedPassword);
  });

  test("should throw error if name is empty", async () => {
    await expect(() =>
      User.createNew("", baseEmail, basePassword, mockHasher)
    ).rejects.toThrow("Name cannot be empty");
  });

  test("should recreate user from persistence", () => {
    const now = new Date();
    const record = {
      id: baseId,
      name: baseName,
      email: baseEmail,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    const user = User.createFromPersistence(record);
    expect(user.email.getValue()).toBe(baseEmail);
    expect(user.toPersistence()).toEqual(record);
  });

  test("should validate password using hasher", async () => {
    mockHasher.hash.mockResolvedValue(hashedPassword);
    mockHasher.compare.mockResolvedValue(true);

    const user = await User.createNew(
      baseName,
      baseEmail,
      basePassword,
      mockHasher
    );

    const isValid = await user.validatePassword("wrongpass", mockHasher);
    expect(isValid).toBeTruthy();
    expect(mockHasher.compare).toHaveBeenCalledWith(
      "wrongpass",
      hashedPassword
    );
  });
});
