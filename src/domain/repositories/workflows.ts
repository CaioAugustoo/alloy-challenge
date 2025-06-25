import type { Workflow } from "../entities/workflow";

export interface WorkflowsRepository {
  getWorkflows(userId: string): Promise<Workflow[]>;
  create(workflow: Workflow): Promise<void>;
}
