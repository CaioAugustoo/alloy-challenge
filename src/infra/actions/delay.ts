import { sleep } from "../../shared/timing/sleep";
import type { ActionNode } from "../../domain/entities/workflow";
import type { ActionHandler } from "../../application/use-cases/execute-workflow";

export class DelayActionHandler implements ActionHandler {
  async handle(node: ActionNode): Promise<void> {
    const { ms } = node.params as { ms: number };
    if (typeof ms !== "number" || ms < 0) {
      throw new Error(
        "DelayAction requires a non-negative `ms` number parameter"
      );
    }
    await sleep(ms);
  }
}
