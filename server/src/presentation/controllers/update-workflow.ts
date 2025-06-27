import { UpdateWorkflowUseCase } from "../../domain/use-cases/update-workflow";
import { internalServerError, noContent, ok } from "../helpers/http";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class UpdateWorkflowController implements Controller {
  constructor(private readonly updateWorkflowUseCase: UpdateWorkflowUseCase) {}

  async handle(req: UpdateWorkflowController.Request): Promise<HttpResponse> {
    try {
      const { title, description, workflowId, actions } = req;
      await this.updateWorkflowUseCase.execute({
        title,
        description,
        workflowId,
        actions,
        accountId: req.accountId,
      });
      return noContent();
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace UpdateWorkflowController {
  export type Request = {
    title: string;
    description: string;
    workflowId: string;
    actions: any[];
    accountId: string;
  };
}
