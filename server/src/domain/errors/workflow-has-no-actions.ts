export class WorkflowHasNoActionsError extends Error {
  constructor(workflowId: string) {
    super(`Workflow ${workflowId} has no actions`);
    this.name = "WorkflowHasNoActionsError";
  }
}
