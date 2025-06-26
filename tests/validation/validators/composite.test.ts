import { describe, expect, vi, test } from "vitest";
import { ValidationComposite } from "../../../src/validation/validators/composite";
import type { Validation } from "../../../src/presentation/protocols/validation";

const makeValidation = (error: Error | undefined): Validation => ({
  validate: vi.fn().mockReturnValue(error),
});

describe("ValidationComposite", () => {
  test("should return undefined if no validations provided", () => {
    const composite = new ValidationComposite([]);
    const result = composite.validate({ any: "data" });
    expect(result).toBeUndefined();
  });

  test("should return first error when a single validation fails", () => {
    const error = new Error("error1");
    const validation = makeValidation(error);
    const composite = new ValidationComposite([validation]);

    const result = composite.validate({});
    expect(validation.validate).toHaveBeenCalledWith({});
    expect(result).toBe(error);
  });

  test("should return second error if first validation passes", () => {
    const error = new Error("error2");
    const v1 = makeValidation(undefined);
    const v2 = makeValidation(error);
    const composite = new ValidationComposite([v1, v2]);

    const result = composite.validate({});
    expect(v1.validate).toHaveBeenCalled();
    expect(v2.validate).toHaveBeenCalled();
    expect(result).toBe(error);
  });

  test("should return undefined if all validations pass", () => {
    const v1 = makeValidation(undefined);
    const v2 = makeValidation(undefined);
    const composite = new ValidationComposite([v1, v2]);

    const result = composite.validate({});
    expect(v1.validate).toHaveBeenCalled();
    expect(v2.validate).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
