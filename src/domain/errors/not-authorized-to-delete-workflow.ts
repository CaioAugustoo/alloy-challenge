export class NotAuthorizedToDeleteWorkflowError extends Error {
  constructor(workflowId: string, accountId: string) {
    super(
      `User ${accountId} is not authorized to delete workflow ${workflowId}`
    );
    this.name = "NotAuthorizedToDeleteWorkflowError";
  }
}
