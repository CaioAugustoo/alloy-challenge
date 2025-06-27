import { WorkflowExecutionLog } from "../../domain/entities/log";
import { LogsRepository as LogsRepositoryInterface } from "../../domain/repositories/logs";
import { Database } from "../database/database";

export class LogsRepository implements LogsRepositoryInterface {
  constructor(private readonly db: Database) {}

  async listLogs(workflowId: string): Promise<WorkflowExecutionLog[]> {
    const logs = await this.db.query<WorkflowExecutionLog[]>(
      `SELECT * FROM workflow_execution_Logs WHERE workflow_id = $1`,
      [workflowId]
    );

    if (!logs) return [];

    return Array.isArray(logs) ? logs : [logs];
  }

  async create(log: WorkflowExecutionLog): Promise<void> {
    const {
      id,
      workflowId,
      executionId,
      actionId,
      status,
      attempt,
      message,
      createdAt,
    } = log.toPersistence();

    await this.db.query(
      `INSERT INTO workflow_execution_Logs
         (id, workflow_id, execution_id, action_id, status, attempt, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        workflowId,
        executionId,
        actionId,
        status,
        attempt,
        message,
        createdAt,
      ]
    );
  }
}
