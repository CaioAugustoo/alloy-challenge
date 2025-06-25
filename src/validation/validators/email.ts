import { InvalidParamError } from "../../presentation/errors/invalid-param";
import type { Validation } from "../../presentation/protocols/validation";
import type { EmailValidator } from "../protocols/email";

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error | undefined {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
