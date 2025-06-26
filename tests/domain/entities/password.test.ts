import { describe, test, expect } from "vitest";
import { Password } from "../../../src/domain/entities/password";

describe("Password", () => {
  test("should return password", () => {
    let password = new Password("@$32321sdas2$");
    expect(password.getHashed()).toBe("@$32321sdas2$");

    password = new Password("foobar");
    expect(password.getHashed()).toBe("foobar");

    password = new Password("@22222@@!!!");
    expect(password.getHashed()).toBe("@22222@@!!!");
  });
});
