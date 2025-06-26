export class NotAllowedToGetWorkflowError extends Error {
  constructor(workflowId: string, accountId: string) {
    super(`User ${accountId} is not allowed to get workflow ${workflowId}`);
    this.name = "NotAllowedToGetWorkflowError";
  }
}
