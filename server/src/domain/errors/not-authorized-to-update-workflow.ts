export class NotAuthorizedToUpdateWorkflowError extends Error {
  constructor(id: string, accountId: string) {
    super(
      `User with id "${accountId}" is not authorized to update workflow with id "${id}"`
    );
    this.name = "NotAuthorizedToUpdateWorkflowError";
  }
}
