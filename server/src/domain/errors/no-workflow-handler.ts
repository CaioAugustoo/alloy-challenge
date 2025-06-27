export class NoWorkflowHandlerError extends Error {
  constructor(actionType: string) {
    super(`No handler registered for action type "${actionType}"`);
    this.name = "NoWorkflowHandlerError";
  }
}
