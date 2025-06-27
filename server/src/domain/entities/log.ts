import { v4 as uuid } from "uuid";

export type ExecutionStatus = "success" | "failed" | "skipped";

export interface WorkflowExecutionLogProps {
  id: string;
  workflowId: string;
  executionId: string;
  actionId: string;
  status: ExecutionStatus;
  attempt: number;
  message?: string;
  createdAt: Date;
}

export class WorkflowExecutionLog {
  private constructor(private readonly props: WorkflowExecutionLogProps) {}

  static createNew(params: {
    workflowId: string;
    executionId: string;
    actionId: string;
    status: ExecutionStatus;
    attempt?: number;
    message?: string;
  }): WorkflowExecutionLog {
    const now = new Date();
    return new WorkflowExecutionLog({
      id: uuid(),
      workflowId: params.workflowId,
      executionId: params.executionId,
      actionId: params.actionId,
      status: params.status,
      attempt: params.attempt ?? 1,
      message: params.message,
      createdAt: now,
    });
  }

  static fromPersistence(row: {
    id: string;
    workflow_id: string;
    execution_id: string;
    action_id: string;
    status: ExecutionStatus;
    attempt: number;
    message: string | null;
    created_at: string;
  }): WorkflowExecutionLog {
    return new WorkflowExecutionLog({
      id: row.id,
      workflowId: row.workflow_id,
      executionId: row.execution_id,
      actionId: row.action_id,
      status: row.status,
      attempt: row.attempt,
      message: row.message ?? undefined,
      createdAt: new Date(row.created_at),
    });
  }

  toPersistence(): {
    id: string;
    workflowId: string;
    executionId: string;
    actionId: string;
    status: ExecutionStatus;
    attempt: number;
    message: string | null;
    createdAt: Date;
  } {
    return {
      id: this.props.id,
      workflowId: this.props.workflowId,
      executionId: this.props.executionId,
      actionId: this.props.actionId,
      status: this.props.status,
      attempt: this.props.attempt,
      message: this.props.message ?? null,
      createdAt: this.props.createdAt,
    };
  }
}
