import { describe, test, expect } from "vitest";
import { Email } from "../../../src/domain/entities/email";

describe("Email", () => {
  test("should create email", () => {
    const email = Email.create("test@test.com");
    expect(email.getValue()).toBe("test@test.com");
  });

  test("should return email value", () => {
    const email = new Email("test@test.com");
    expect(email.getValue()).toBe("test@test.com");
  });

  test("should compare emails", () => {
    const email1 = new Email("test@test.com");
    const email2 = new Email("test@test.com");
    expect(email1.equals(email2)).toBeTruthy();
  });
});
