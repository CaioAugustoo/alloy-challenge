import { Router } from "express";
import { adaptRoute } from "../adapters/express-route";
import { auth } from "../middlewares/auth";
import type { TokenProvider } from "../../shared/auth/token-provider";
import type { Controller } from "../../presentation/protocols/controller";

export class WorkflowsRoutes {
  constructor(
    private readonly createWorkflowController: Controller,
    private readonly tokenProvider: TokenProvider
  ) {}

  register(router: Router): void {
    const authMiddleware = auth(this.tokenProvider);

    router.post(
      "/workflows",
      authMiddleware,
      adaptRoute(this.createWorkflowController)
    );
  }
}
