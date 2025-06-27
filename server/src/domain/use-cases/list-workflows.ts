import type { Workflow } from "../entities/workflow";

export interface ListWorkflowsUseCase {
  execute(
    data: ListWorkflowsUseCase.Params
  ): Promise<ListWorkflowsUseCase.Response>;
}

export namespace ListWorkflowsUseCase {
  export type Params = {
    accountId: string;
  };

  export type Response = {
    workflows: Workflow[];
  };
}
