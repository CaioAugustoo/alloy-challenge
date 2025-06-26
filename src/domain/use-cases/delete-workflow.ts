export interface DeleteWorkflowUseCase {
  execute(
    data: DeleteWorkflowUseCase.Params
  ): Promise<DeleteWorkflowUseCase.Response>;
}

export namespace DeleteWorkflowUseCase {
  export type Params = {
    workflowId: string;
    accountId: string;
  };

  export type Response = void;
}
