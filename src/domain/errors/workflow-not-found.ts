export class WorkflowNotFoundError extends Error {
  constructor(workflowId: string) {
    super(`Workflow ${workflowId} not found`);
    this.name = "WorkflowNotFoundError";
  }
}
