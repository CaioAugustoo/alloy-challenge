import { describe, expect, vi, afterEach, test } from "vitest";
import jwt from "jsonwebtoken";
import type { Mock } from "vitest";
import { JWTProvider } from "../../../src/shared/auth/jwt";

vi.mock("jsonwebtoken", () => {
  return {
    __esModule: true,
    default: {
      sign: vi.fn(),
      verify: vi.fn(),
    },
  };
});

describe("JWTProvider", () => {
  const secret = "mysecret";
  const provider = new JWTProvider(secret);

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("sign", () => {
    test("should call jwt.sign with correct params and return token", () => {
      const payload = { userId: "123" };
      const expiresInSeconds = 3600;
      const token = "signed.token.value";

      (jwt.sign as unknown as Mock).mockReturnValue(token);

      const result = provider.sign(payload, expiresInSeconds);

      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, {
        expiresIn: expiresInSeconds,
      });
      expect(result).toBe(token);
    });
  });

  describe("verify", () => {
    test("should verify token and return decoded payload", () => {
      const token = "valid.token";
      const decodedPayload = { userId: "123" };

      (jwt.verify as unknown as Mock).mockReturnValue(decodedPayload);

      const result = provider.verify(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toEqual(decodedPayload);
    });

    test("should throw error if jwt.verify throws", () => {
      const token = "invalid.token";
      (jwt.verify as unknown as Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => provider.verify(token)).toThrow("Invalid or expired token");
      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    });
  });
});
