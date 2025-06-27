import type { ActionHandler } from "../../application/use-cases/execute-workflow";
import type { ActionNode } from "../../domain/entities/workflow";

export class LogActionHandler implements ActionHandler {
  async handle(node: ActionNode): Promise<void> {
    const { message, level = "info" } = node.params as {
      message: string;
      level?: "info" | "warn" | "error" | "debug";
    };

    if (!message) {
      throw new Error("LogAction requires a `message` parameter");
    }

    console[level](`[LogAction] ${message}`);
  }
}
