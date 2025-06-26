export class FailedExecuteWorkflowError extends Error {
  constructor(actionId: string) {
    super(`Failed to execute action "${actionId}"`);
    this.name = "FailedExecuteWorkflowError";
  }
}
