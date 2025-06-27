import { internalServerError, ok } from "../helpers/http";
import type { HttpResponse } from "../protocols/http";
import type { Controller } from "../protocols/controller";
import type { SignInUseCase } from "../../domain/use-cases/sign-in";

export class SignInController implements Controller {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(req: SignInController.Request): Promise<HttpResponse> {
    try {
      const { email, password } = req;

      const res = await this.signInUseCase.execute({
        email,
        password,
      });
      return ok(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace SignInController {
  export type Request = {
    email: string;
    password: string;
  };
}
