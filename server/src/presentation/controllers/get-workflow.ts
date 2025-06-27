import { Workflow } from "../../domain/entities/workflow";
import { GetWorkflowUseCase } from "../../domain/use-cases/get-workflow";
import { internalServerError, ok } from "../helpers/http";
import { Controller } from "../protocols/controller";
import { HttpResponse } from "../protocols/http";

export class GetWorkflowController implements Controller {
  constructor(private readonly getWorkflowUseCase: GetWorkflowUseCase) {}

  async handle(req: GetWorkflowController.Request): Promise<HttpResponse> {
    try {
      const { workflowId, accountId } = req;
      const res = await this.getWorkflowUseCase.execute({
        workflowId,
        accountId,
      });
      return ok(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace GetWorkflowController {
  export type Request = {
    workflowId: string;
    accountId: string;
  };

  export type Response = {
    workflow: Workflow;
  };
}
