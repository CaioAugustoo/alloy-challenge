import { Workflow } from "../../domain/entities/workflow";
import type { WorkflowsRepository as WorkflowsRepositoryInterface } from "../../domain/repositories/workflows";
import type { Database } from "../database/database";

export class WorkflowsRepository implements WorkflowsRepositoryInterface {
  constructor(private readonly db: Database) {}

  async listWorkflows(userId: string): Promise<Workflow[]> {
    const workflows = await this.db.query<Workflow[]>(
      "SELECT * FROM workflows WHERE created_by = $1",
      [userId]
    );

    return workflows;
  }

  async create(workflow: Workflow): Promise<void> {
    const { id, triggerType, createdBy, actions, createdAt, updatedAt } =
      workflow.toPersistence();

    await this.db.query(
      `INSERT INTO workflows
         (id, trigger_type, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, triggerType, createdBy, createdAt, updatedAt]
    );

    let actionsPromises = [];

    for (const node of Object.values(actions)) {
      actionsPromises.push(
        this.db.query(
          `INSERT INTO action_nodes
             (action_id, workflow_id, type, params, next_ids, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            node.id,
            id,
            node.type,
            node.params,
            node.next ?? [],
            new Date(),
            new Date(),
          ]
        )
      );
    }

    await Promise.all(actionsPromises);
  }
}
