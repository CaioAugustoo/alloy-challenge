import type { Workflow } from "../entities/workflow";

export interface WorkflowsRepository {
  listWorkflows(userId: string): Promise<Workflow[]>;
  create(workflow: Workflow): Promise<void>;
  findById(id: string): Promise<Workflow | undefined>;
  delete(id: string): Promise<void>;
}
