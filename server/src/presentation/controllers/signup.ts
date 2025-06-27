import { internalServerError, ok } from "../helpers/http";
import type { CreateUserUseCase } from "../../domain/use-cases/create-user";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async handle(req: SignUpController.Request): Promise<HttpResponse> {
    try {
      const { name, email, password } = req;

      const res = await this.createUserUseCase.execute({
        name,
        email,
        password,
      });
      return ok(res);
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
