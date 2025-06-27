import { internalServerError, ok } from "../helpers/http";
import type { ListWorkflowsUseCase } from "../../domain/use-cases/list-workflows";
import type { Controller } from "../protocols/controller";
import type { HttpResponse } from "../protocols/http";

export class ListWorkflowsController implements Controller {
  constructor(private readonly listWorkflowsUseCase: ListWorkflowsUseCase) {}

  async handle(req: ListWorkflowsController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = req;
      const res = await this.listWorkflowsUseCase.execute({ accountId });
      return ok(res);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}

export namespace ListWorkflowsController {
  export type Request = {
    accountId: string;
  };
}
