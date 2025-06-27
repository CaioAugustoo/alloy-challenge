import { ActionNode, Workflow } from "../../domain/entities/workflow";
import type { WorkflowsRepository as WorkflowsRepositoryInterface } from "../../domain/repositories/workflows";
import type { Database } from "../database/database";

export class WorkflowsRepository implements WorkflowsRepositoryInterface {
  constructor(private readonly db: Database) {}

  async listWorkflows(userId: string): Promise<Workflow[]> {
    const workflows = await this.db.query<Workflow[]>(
      "SELECT * FROM workflows WHERE created_by = $1",
      [userId]
    );

    if (!workflows) return [];

    return Array.isArray(workflows) ? workflows : [workflows];
  }

  async findById(id: string): Promise<Workflow | undefined> {
    const workflow = await this.db.query<Workflow>(
      `SELECT id, trigger_type, created_by, created_at, updated_at
         FROM workflows
        WHERE id = $1
        LIMIT 1`,
      [id]
    );

    if (!workflow) return;

    const foundNodes = await this.db.query<ActionNode[]>(
      `SELECT action_id, type, params, next_ids
         FROM action_nodes
        WHERE workflow_id = $1`,
      [id]
    );

    const nodes = foundNodes ?? [];

    const actions: Record<string, ActionNode> = {};
    for (const node of nodes) {
      actions[node.action_id] = {
        action_id: node.action_id,
        type: node.type,
        params: node.params,
        next_ids: (node.next_ids ?? []).length > 0 ? node.next_ids : undefined,
      };
    }

    return Workflow.createFromPersistence({
      ...workflow,
      actions,
    });
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
            node.action_id,
            id,
            node.type,
            node.params,
            node.next_ids ?? [],
            new Date(),
            new Date(),
          ]
        )
      );
    }

    await Promise.all(actionsPromises);
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      `DELETE FROM workflows
         WHERE id = $1`,
      [id]
    );
  }
}
