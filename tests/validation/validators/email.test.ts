import { describe, test, expect, vi } from "vitest";
import { EmailValidator } from "../../../src/validation/protocols/email";
import { EmailValidation } from "../../../src/validation/validators/email";
import { InvalidParamError } from "../../../src/presentation/errors/invalid-param";

const makeEmailValidator = (valid: boolean): EmailValidator => ({
  isValid: vi.fn().mockReturnValue(valid),
});

describe("EmailValidation", () => {
  test("should return InvalidParamError if emailValidator returns false", () => {
    const emailValidator = makeEmailValidator(false);
    const validation = new EmailValidation("email", emailValidator);
    const input = { email: "invalid_email" };
    const error = validation.validate(input);

    expect(emailValidator.isValid).toHaveBeenCalledWith("invalid_email");
    expect(error).toBeInstanceOf(InvalidParamError);
  });

  test("should return undefined if emailValidator returns true", () => {
    const emailValidator = makeEmailValidator(true);
    const validation = new EmailValidation("email", emailValidator);
    const input = { email: "valid@example.com" };
    const error = validation.validate(input);

    expect(emailValidator.isValid).toHaveBeenCalledWith("valid@example.com");
    expect(error).toBeUndefined();
  });

  test("should pass undefined to emailValidator if field is missing", () => {
    const emailValidator = makeEmailValidator(false);
    const validation = new EmailValidation("email", emailValidator);
    const input = {};
    const error = validation.validate(input);

    expect(emailValidator.isValid).toHaveBeenCalledWith(undefined);
    expect(error).toBeInstanceOf(InvalidParamError);
  });

  test("should not throw if emailValidator throws", () => {
    const emailValidator: EmailValidator = {
      isValid: vi.fn().mockImplementation(() => {
        throw new Error("validator error");
      }),
    };
    const validation = new EmailValidation("email", emailValidator);
    expect(() => validation.validate({ email: "test" })).toThrow(
      "validator error"
    );
  });
});
