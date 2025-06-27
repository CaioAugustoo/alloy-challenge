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
    public title: string,
    public description: string,
    public readonly triggerType: TriggerType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy: string,
    private actions: ActionNode[]
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
      []
    );
  }

  static createFromPersistence(record: any): Workflow {
    return new Workflow(
      record.id,
      record.title,
      record.description,
      record.trigger_type,
      record.created_at,
      record.updated_at,
      record.created_by,
      record.actions
    );
  }

  toPersistence(): {
    id: string;
    title: string;
    description: string;
    triggerType: TriggerType;
    actions: ActionNode[];
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      triggerType: this.triggerType,
      actions: this.actions,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getActions(): ActionNode[] {
    return this.actions;
  }

  addAction(node: ActionNode): void {
    const found = this.actions.find((a) => a.action_id === node.action_id);
    if (found) {
      throw new Error(`Action with id "${node.action_id}" already exists`);
    }
    this.actions.push(node);
  }

  updateActions(actions: ActionNode[]): void {
    this.actions = actions;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getAction(id: string): ActionNode {
    const node = this.actions.find((a) => a.action_id === id);
    if (!node) throw new Error(`Action node "${id}" not found`);
    return node;
  }

  get entryActionId(): string {
    return this.actions[0]?.action_id ?? "";
  }
}
