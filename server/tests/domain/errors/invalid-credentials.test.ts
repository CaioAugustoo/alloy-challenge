import { describe, expect, test } from "vitest";
import { InvalidCredentialsError } from "../../../src/domain/errors/invalid-credentials";

describe("InvalidCredentialsError", () => {
  test("should have the correct name and message", () => {
    const error = new InvalidCredentialsError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("InvalidCredentialsError");
    expect(error.message).toBe("Invalid credentials");
  });
});
