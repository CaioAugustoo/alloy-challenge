import { adaptRoute } from "../adapters/express-route";
import { auth } from "../middlewares/auth";
import type { Router } from "express";
import type { TokenProvider } from "../../shared/auth/token-provider";
import type { Controller } from "../../presentation/protocols/controller";

export class WorkflowsRoutes {
  constructor(
    private readonly createWorkflowController: Controller,
    private readonly listWorkflowsController: Controller,
    private readonly executeWorkflowController: Controller,
    private readonly deleteWorkflowController: Controller,
    private readonly getWorkflowController: Controller,
    private readonly updateWorkflowController: Controller,
    private readonly tokenProvider: TokenProvider
  ) {}

  register(router: Router): void {
    const authMiddleware = auth(this.tokenProvider);

    router.post(
      "/workflows",
      authMiddleware,
      adaptRoute(this.createWorkflowController)
    );

    router.get(
      "/workflows/:workflowId",
      authMiddleware,
      adaptRoute(this.getWorkflowController)
    );

    router.get(
      "/workflows",
      authMiddleware,
      adaptRoute(this.listWorkflowsController)
    );

    router.post(
      "/workflows/:workflowId/executions",
      authMiddleware,
      adaptRoute(this.executeWorkflowController)
    );

    router.delete(
      "/workflows/:workflowId",
      authMiddleware,
      adaptRoute(this.deleteWorkflowController)
    );

    router.put(
      "/workflows/:workflowId",
      authMiddleware,
      adaptRoute(this.updateWorkflowController)
    );
  }
}
