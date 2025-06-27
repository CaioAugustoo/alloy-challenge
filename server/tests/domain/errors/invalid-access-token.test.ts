import { describe, expect, test } from "vitest";
import { InvalidAccessTokenError } from "../../../src/domain/errors/invalid-access-token";

describe("InvalidAccessTokenError", () => {
  test("should have the correct name and message", () => {
    const error = new InvalidAccessTokenError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("InvalidAccessTokenError");
    expect(error.message).toBe("Invalid access token");
  });
});
