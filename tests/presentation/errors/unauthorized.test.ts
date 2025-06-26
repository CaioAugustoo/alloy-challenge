import { describe, expect, test } from "vitest";
import { UnauthorizedError } from "../../../src/presentation/errors/unauthorized";

describe("UnauthorizedError", () => {
  test("should have the correct name and message", () => {
    const error = new UnauthorizedError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("UnauthorizedError");
    expect(error.message).toBe("Unauthorized");
  });
});
