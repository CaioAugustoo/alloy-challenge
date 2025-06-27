import { describe, expect, test } from "vitest";
import { AccessDeniedError } from "../../../src/presentation/errors/access-denied";

describe("AccessDeniedError", () => {
  test("should have the correct name and message", () => {
    const error = new AccessDeniedError();

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("AccessDeniedError");
    expect(error.message).toBe("Access denied");
  });
});
