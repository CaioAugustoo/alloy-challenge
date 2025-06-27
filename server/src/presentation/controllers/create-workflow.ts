import { CreateWorkflowUseCase } from "../../domain/use-cases/create-workflow";
import { internalServerError, ok } from "../helpers/http";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class CreateWorkflowController implements Controller {
  constructor(private readonly createWorkflowUseCase: CreateWorkflowUseCase) {}

  async handle(req: CreateWorkflowController.Request): Promise<HttpResponse> {
    try {
      const { triggerType, accountId, actions } = req;
      const res = await this.createWorkflowUseCase.execute({
        triggerType,
        accountId,
        actions,
      });
      return ok(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace CreateWorkflowController {
  export type Request = {
    triggerType: "time" | "webhook";
    actions: Record<string, any>;
    accountId: string;
  };
}
