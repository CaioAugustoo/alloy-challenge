import type { ActionNode } from "../entities/workflow";

export interface UpdateWorkflowUseCase {
  execute(
    data: UpdateWorkflowUseCase.Params
  ): Promise<UpdateWorkflowUseCase.Response>;
}

export namespace UpdateWorkflowUseCase {
  export type Params = {
    workflowId: string;
    title: string;
    description: string;
    actions: ActionNode[];
    accountId: string;
  };

  export type Response = void;
}
