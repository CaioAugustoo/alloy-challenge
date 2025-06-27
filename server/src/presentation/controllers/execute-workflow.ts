import { ExecuteWorkflowUseCase } from "../../domain/use-cases/execute-workflow";
import { internalServerError, ok } from "../helpers/http";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class ExecuteWorkflowController implements Controller {
  constructor(
    private readonly executeWorkflowUseCase: ExecuteWorkflowUseCase
  ) {}

  async handle(req: ExecuteWorkflowController.Request): Promise<HttpResponse> {
    try {
      const { workflowId, executionId, backoffBaseMs, maxRetries } = req;
      const res = await this.executeWorkflowUseCase.execute({
        workflowId,
        executionId,
        maxRetries,
        backoffBaseMs,
      });
      return ok(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace ExecuteWorkflowController {
  export type Request = {
    workflowId: string;
    executionId: string;
    maxRetries?: number;
    backoffBaseMs?: number;
  };

  export type Response = {
    workflowId: string;
    executionId: string;
  };
}
