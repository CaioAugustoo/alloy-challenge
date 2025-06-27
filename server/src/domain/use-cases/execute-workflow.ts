export interface ExecuteWorkflowUseCase {
  execute(
    data: ExecuteWorkflowUseCase.Params
  ): Promise<ExecuteWorkflowUseCase.Response>;
}

export namespace ExecuteWorkflowUseCase {
  export type Params = {
    workflowId: string;
    executionId: string;
    maxRetries?: number;
    backoffBaseMs?: number;
  };

  export type Response = {
    workflowId: string;
    executionId: string;
  };
}
