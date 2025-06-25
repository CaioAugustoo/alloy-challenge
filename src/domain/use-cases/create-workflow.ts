import type { ActionNode, TriggerType } from "../entities/workflow";

export interface CreateWorkflowUseCase {
  execute(
    data: CreateWorkflowUseCase.Params
  ): Promise<CreateWorkflowUseCase.Response>;
}

export namespace CreateWorkflowUseCase {
  export type Params = {
    triggerType: TriggerType;
    actions: Record<string, ActionNode>;
    accountId: string;
  };

  export type Response = {
    workflowId: string;
  };
}
