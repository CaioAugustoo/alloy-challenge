import type { ActionNode, TriggerType, Workflow } from "../entities/workflow";

export interface GetWorkflowUseCase {
  execute(
    data: GetWorkflowUseCase.Params
  ): Promise<GetWorkflowUseCase.Response>;
}

export namespace GetWorkflowUseCase {
  export type Params = {
    workflowId: string;
    accountId: string;
  };

  export type Response = {
    workflow: {
      id: string;
      triggerType: TriggerType;
      actions: Record<string, ActionNode>;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}
