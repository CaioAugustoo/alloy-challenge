export type ExecutionState = {
  workflowId: string;
  executionId: string;
  currentActionId?: string;
  completed: boolean;
  retries: Record<string, number>;
  startedAt: Date;
  updatedAt: Date;
};

export interface ExecutionsRepository {
  create(state: ExecutionState): Promise<void>;
  find(workflowId: string, executionId: string): Promise<ExecutionState | null>;
  update(state: ExecutionState): Promise<void>;
}
