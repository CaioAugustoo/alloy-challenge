import type { ActionNode, TriggerType } from "../entities/workflow";

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
      title: string;
      description: string;
      triggerType: TriggerType;
      actions: ActionNode[];
      createdAt: Date;
      updatedAt: Date;
    };
  };
}
