import { Router } from "express";
import { SignUpController } from "../../presentation/controllers/signup";
import { adaptRoute } from "../adapters/express-route";

export class AuthRoutes {
  constructor(private readonly controller: SignUpController) {}

  register(router: Router): void {
    router.post("/signup", adaptRoute(this.controller));
  }
}
