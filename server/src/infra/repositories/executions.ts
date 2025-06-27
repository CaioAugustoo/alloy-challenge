import type { Database } from "../database/database";
import type { ExecutionState } from "../../domain/repositories/executions";
import type { ExecutionsRepository as ExecutionsRepositoryInterface } from "../../domain/repositories/executions";

type Execution = {
  workflow_id: string;
  execution_id: string;
  current_node: string | null;
  completed: boolean;
  retries: Record<string, number>;
  started_at: string;
  updated_at: string;
};

export class WorkflowExecutionsRepository
  implements ExecutionsRepositoryInterface
{
  constructor(private readonly db: Database) {}

  async create(state: ExecutionState): Promise<void> {
    await this.db.query(
      `INSERT INTO workflow_executions
         (workflow_id, execution_id, current_node, completed, retries, started_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        state.workflowId,
        state.executionId,
        state.currentActionId ?? "",
        state.completed,
        state.retries,
        state.startedAt,
        state.updatedAt,
      ]
    );
  }

  async find(
    workflowId: string,
    executionId: string
  ): Promise<ExecutionState | null> {
    const foundExecution = await this.db.query<Execution>(
      `SELECT workflow_id, execution_id, current_node, completed, retries, started_at, updated_at
         FROM workflow_executions
        WHERE workflow_id = $1
          AND execution_id = $2
        LIMIT 1`,
      [workflowId, executionId]
    );

    if (!foundExecution) {
      return null;
    }

    return {
      workflowId: foundExecution.workflow_id,
      executionId: foundExecution.execution_id,
      currentActionId: foundExecution.current_node ?? undefined,
      completed: foundExecution.completed,
      retries: foundExecution.retries,
      startedAt: new Date(foundExecution.started_at),
      updatedAt: new Date(foundExecution.updated_at),
    };
  }

  async update(state: ExecutionState): Promise<void> {
    await this.db.query(
      `UPDATE workflow_executions
          SET current_node = $2,
              completed    = $3,
              retries      = $4,
              updated_at   = $5
        WHERE workflow_id  = $1
          AND execution_id = $6`,
      [
        state.workflowId,
        state.currentActionId ?? null,
        state.completed,
        state.retries,
        state.updatedAt,
        state.executionId,
      ]
    );
  }
}
