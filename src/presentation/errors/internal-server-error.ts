export class InternalServerError extends Error {
  constructor(stack: string, message: string) {
    super("Internal server error");
    this.name = "ServerError";
    this.stack = stack;
    this.message = message;
  }
}
