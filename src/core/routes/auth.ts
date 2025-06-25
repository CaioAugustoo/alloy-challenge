import { Router } from "express";
import { adaptRoute } from "../adapters/express-route";
import { Controller } from "../../presentation/protocols/controller";

export class AuthRoutes {
  constructor(private readonly signUpController: Controller) {}

  register(router: Router): void {
    router.post("/signup", adaptRoute(this.signUpController));
  }
}
