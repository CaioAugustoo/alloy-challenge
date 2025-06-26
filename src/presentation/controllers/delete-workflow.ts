import { internalServerError, noContent } from "../helpers/http";
import type { DeleteWorkflowUseCase } from "../../domain/use-cases/delete-workflow";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class DeleteWorkflowController implements Controller {
  constructor(private readonly deleteWorkflowUseCase: DeleteWorkflowUseCase) {}

  async handle(req: DeleteWorkflowController.Request): Promise<HttpResponse> {
    try {
      const { workflowId, accountId } = req;
      await this.deleteWorkflowUseCase.execute({
        workflowId,
        accountId,
      });
      return noContent();
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace DeleteWorkflowController {
  export type Request = {
    workflowId: string;
    accountId: string;
  };
}
