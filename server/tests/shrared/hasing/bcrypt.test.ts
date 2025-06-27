import { describe, expect, vi, beforeEach, test, type Mock } from "vitest";
import bcrypt from "bcrypt";
import { BcryptHasher } from "../../../src/shared/hashing/bcrypt";

vi.mock("bcrypt");

describe("BcryptHasher", () => {
  const saltRounds = 10;
  let hasher: BcryptHasher;

  beforeEach(() => {
    hasher = new BcryptHasher(saltRounds);
    vi.clearAllMocks();
  });

  describe("hash", () => {
    test("should call bcrypt.hash with correct params and return hashed string", async () => {
      const plain = "myPassword";
      const hashed = "hashedPassword";

      (bcrypt.hash as unknown as Mock).mockResolvedValue(hashed);

      const result = await hasher.hash(plain);

      expect(bcrypt.hash).toHaveBeenCalledWith(plain, saltRounds);
      expect(result).toBe(hashed);
    });
  });

  describe("compare", () => {
    test("should call bcrypt.compare with correct params and return true when matched", async () => {
      const plain = "myPassword";
      const hashed = "hashedPassword";

      (bcrypt.compare as unknown as Mock).mockResolvedValue(true);

      const result = await hasher.compare(plain, hashed);

      expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashed);
      expect(result).toBe(true);
    });

    test("should return false when passwords do not match", async () => {
      const plain = "wrongPassword";
      const hashed = "hashedPassword";

      (bcrypt.compare as unknown as Mock).mockResolvedValue(false);

      const result = await hasher.compare(plain, hashed);

      expect(bcrypt.compare).toHaveBeenCalledWith(plain, hashed);
      expect(result).toBe(false);
    });
  });
});
