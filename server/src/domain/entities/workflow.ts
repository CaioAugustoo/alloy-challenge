import { v4 as uuid } from "uuid";

export enum NodeType {
  DELAY = "delay",
  HTTP = "http",
  LOG = "log",
}

export type TriggerType = "time" | "webhook";
export type ActionNode = {
  action_id: string;
  type: NodeType;
  params: Record<string, any>;
  next_ids?: string[];
};

export class Workflow {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly triggerType: TriggerType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy: string,
    private readonly actions: Map<string, ActionNode>
  ) {}

  static createNew(
    title: string,
    description: string,
    createdBy: string,
    triggerType: TriggerType
  ): Workflow {
    return new Workflow(
      uuid(),
      title,
      description,
      triggerType,
      new Date(),
      new Date(),
      createdBy,
      new Map()
    );
  }

  static createFromPersistence(record: any): Workflow {
    const actions = new Map<string, ActionNode>(Object.entries(record.actions));
    return new Workflow(
      record.id,
      record.title,
      record.description,
      record.trigger_type,
      record.created_at,
      record.updated_at,
      record.created_by,
      actions
    );
  }

  toPersistence(): {
    id: string;
    title: string;
    description: string;
    triggerType: TriggerType;
    actions: Record<string, ActionNode>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    const actionsNodes: Record<string, ActionNode> = {};
    const nodes = this.actions.entries();

    for (const [id, node] of nodes) {
      actionsNodes[id] = node;
    }

    return {
      id: this.id,
      title: this.title,
      description: this.description,
      triggerType: this.triggerType,
      actions: actionsNodes,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getActions(): Record<string, ActionNode> {
    const actions: Record<string, ActionNode> = {};
    this.actions.forEach((value) => {
      actions[value.action_id] = value;
    });
    return actions;
  }

  addAction(node: ActionNode): void {
    if (this.actions.has(node.action_id)) {
      throw new Error(`Action with id "${node.action_id}" already exists`);
    }
    this.actions.set(node.action_id, node);
  }

  getAction(id: string): ActionNode {
    let node = undefined;

    this.actions.forEach((value) => {
      if (value.action_id === id) {
        node = value;
      }
    });

    if (!node) throw new Error(`Action node "${id}" not found`);
    return node;
  }

  get entryActionId(): string {
    const ids = Array.from(this.actions.keys());
    return ids[0];
  }
}
