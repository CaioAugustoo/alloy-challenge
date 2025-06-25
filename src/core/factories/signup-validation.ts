import { EmailValidatorAdapter } from "../../infra/validators/email";
import { Validation } from "../../presentation/protocols/validation";
import { ValidationComposite } from "../../validation/validators/composite";
import { EmailValidation } from "../../validation/validators/email";
import { RequiredFieldValidation } from "../../validation/validators/required-field";

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ["name", "email", "password"]) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation("email", new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
