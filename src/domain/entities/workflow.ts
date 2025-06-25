import { v4 as uuid } from "uuid";

export type TriggerType = "time" | "webhook";
export type ActionNode = {
  id: string;
  type: string;
  params: Record<string, any>;
  next?: string[];
};

export class Workflow {
  private constructor(
    public readonly id: string,
    public readonly triggerType: TriggerType,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly createdBy: string,
    private readonly nodes: Map<string, ActionNode>
  ) {}

  static createNew(createdBy: string, triggerType: TriggerType): Workflow {
    return new Workflow(
      uuid(),
      triggerType,
      new Date(),
      new Date(),
      createdBy,
      new Map()
    );
  }

  static createFromPersistence(record: any): Workflow {
    const map = new Map<string, ActionNode>(Object.entries(record.actions));
    return new Workflow(
      record.id,
      record.triggerType,
      record.createdAt,
      record.updatedAt,
      record.createdBy,
      map
    );
  }

  toPersistence(): {
    id: string;
    triggerType: TriggerType;
    actions: Record<string, ActionNode>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    const actions: Record<string, ActionNode> = {};
    for (const [id, node] of this.nodes.entries()) {
      actions[id] = node;
    }
    return {
      id: this.id,
      triggerType: this.triggerType,
      actions,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  addAction(node: ActionNode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Action with id "${node.id}" already exists`);
    }
    this.nodes.set(node.id, node);
    this.ensureAcyclic();
  }

  getAction(id: string): ActionNode {
    const node = this.nodes.get(id);
    if (!node) throw new Error(`Action node "${id}" not found`);
    return node;
  }

  get entryActionId(): string {
    const ids = Array.from(this.nodes.keys());
    if (ids.length === 0) throw new Error("Workflow has no actions");
    return ids[0];
  }

  private ensureAcyclic(): void {
    const visited = new Set<string>();
    const inStack = new Set<string>();

    const dfs = (id: string) => {
      if (inStack.has(id)) {
        throw new Error(`Cycle detected at action "${id}"`);
      }
      if (visited.has(id)) return;
      visited.add(id);
      inStack.add(id);

      const node = this.nodes.get(id);
      if (node?.next) {
        for (const nextId of node.next) {
          dfs(nextId);
        }
      }
      inStack.delete(id);
    };

    for (const start of this.nodes.keys()) {
      dfs(start);
    }
  }
}
