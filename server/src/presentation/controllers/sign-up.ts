import { created, internalServerError } from "../helpers/http";
import type { SignUpUseCase } from "../../domain/use-cases/sign-up";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  constructor(private readonly createUserUseCase: SignUpUseCase) {}

  async handle(req: SignUpController.Request): Promise<HttpResponse> {
    try {
      const { name, email, password } = req;

      const res = await this.createUserUseCase.execute({
        name,
        email,
        password,
      });
      return created(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
  };
}
