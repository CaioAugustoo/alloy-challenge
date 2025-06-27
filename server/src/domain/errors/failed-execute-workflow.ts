export class FailedExecuteWorkflowError extends Error {
  constructor(actionId: string, message: string) {
    super(`Failed to execute action "${actionId}: ${message}"`);
    this.name = "FailedExecuteWorkflowError";
  }
}
