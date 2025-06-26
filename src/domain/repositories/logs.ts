import { WorkflowExecutionLog } from "../entities/log";

export interface LogsRepository {
  listLogs(workflowId: string): Promise<WorkflowExecutionLog[]>;
  create(log: WorkflowExecutionLog): Promise<void>;
}
