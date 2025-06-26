import { describe, test, expect } from "vitest";
import { RequiredFieldValidation } from "../../../src/validation/validators/required-field";
import { MissingParamError } from "../../../src/presentation/errors/missing-param";

describe("RequiredFieldValidation", () => {
  test("should return MissingParamError if field is not provided", () => {
    const validation = new RequiredFieldValidation("any_field");
    const error = validation.validate({
      foo: "bar",
    });

    expect(error).toBeInstanceOf(MissingParamError);
  });

  test("should return undefined if field is provided", () => {
    const validation = new RequiredFieldValidation("field");
    const input = { field: "value" };
    const error = validation.validate(input);

    expect(error).toBeUndefined();
  });

  test("should treat empty string as missing", () => {
    const validation = new RequiredFieldValidation("name");
    const error = validation.validate({ name: "" });

    expect(error).toBeInstanceOf(MissingParamError);
  });

  test("should treat zero and false as missing", () => {
    const validation = new RequiredFieldValidation("count");
    expect(validation.validate({ count: 0 })).toBeInstanceOf(MissingParamError);
    expect(validation.validate({ count: false })).toBeInstanceOf(
      MissingParamError
    );
  });
});
