import { describe, test, expect, beforeEach, vi } from "vitest";
import {
  type ActionNode,
  NodeType,
  Workflow,
} from "../../../src/domain/entities/workflow";

vi.mock("uuid", () => ({ v4: () => "fake-uuid" }));

describe("Workflow Entity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create new workflow with proper properties", () => {
    const workflow = Workflow.createNew(
      "title",
      "description",
      "user-1",
      "time"
    );

    expect(workflow.id).toBe("fake-uuid");
    expect(workflow.triggerType).toBe("time");
    expect(workflow.createdBy).toBe("user-1");
    expect(workflow.getActions()).toEqual([]);
    expect(workflow.createdAt).toBeInstanceOf(Date);
    expect(workflow.updatedAt).toBeInstanceOf(Date);
  });

  test("should add and retrieve an action correctly", () => {
    const workflow = Workflow.createNew(
      "title-2",
      "description-2",
      "user-2",
      "webhook"
    );
    const action: ActionNode = {
      action_id: "node1",
      type: NodeType.LOG,
      params: { message: "hello" },
    };

    workflow.addAction(action);

    expect(workflow.getActions()).toEqual([action]);
    expect(workflow.entryActionId).toBe("node1");
    expect(workflow.getAction("node1")).toBe(action);
  });

  test("should throw when adding a duplicate action", () => {
    const workflow = Workflow.createNew(
      "title-3",
      "description-3",
      "user-3",
      "time"
    );
    const action: ActionNode = {
      action_id: "dup",
      type: NodeType.HTTP,
      params: { url: "http://example.com" },
    };
    workflow.addAction(action);
    expect(() => workflow.addAction(action)).toThrowError(
      'Action with id "dup" already exists'
    );
  });

  test("should throw when retrieving a non-existent action", () => {
    const workflow = Workflow.createNew(
      "title-4",
      "description-4",
      "user-4",
      "time"
    );
    expect(() => workflow.getAction("not-found")).toThrowError(
      'Action node "not-found" not found'
    );
  });

  test("should serialize to persistence and recreate from persistence", () => {
    const workflow = Workflow.createNew(
      "title",
      "description",
      "creator",
      "webhook"
    );
    const actionA: ActionNode = {
      action_id: "A",
      type: NodeType.DELAY,
      params: { ms: 100 },
    };
    const actionB: ActionNode = {
      action_id: "B",
      type: NodeType.HTTP,
      params: { url: "http://test" },
    };
    workflow.addAction(actionA);
    workflow.addAction(actionB);

    const persistence = workflow.toPersistence();
    expect(persistence).toMatchObject({
      id: "fake-uuid",
      title: "title",
      description: "description",
      triggerType: "webhook",
      createdBy: "creator",
    });
    expect(persistence.actions).toHaveLength(2);

    const record = {
      id: persistence.id,
      title: persistence.title,
      description: persistence.description,
      trigger_type: persistence.triggerType,
      created_by: persistence.createdBy,
      created_at: persistence.createdAt,
      updated_at: persistence.updatedAt,
      actions: persistence.actions,
    };

    const rehydrated = Workflow.createFromPersistence(record);
    expect(rehydrated.id).toBe(persistence.id);
    expect(rehydrated.title).toBe(persistence.title);
    expect(rehydrated.description).toBe(persistence.description);
    expect(rehydrated.triggerType).toBe(persistence.triggerType);
    expect(rehydrated.createdBy).toBe(persistence.createdBy);
    expect(rehydrated.createdAt).toBe(persistence.createdAt);
    expect(rehydrated.updatedAt).toBe(persistence.updatedAt);
    expect(rehydrated.getActions()).toEqual(persistence.actions);
  });

  test("should update actions with updateActions", () => {
    const workflow = Workflow.createNew(
      "old-title",
      "old-description",
      "user-5",
      "webhook"
    );

    const newActions: ActionNode[] = [
      {
        action_id: "nodeA",
        type: NodeType.LOG,
        params: { message: "log A" },
      },
      {
        action_id: "nodeB",
        type: NodeType.DELAY,
        params: { ms: 500 },
      },
    ];

    workflow.updateActions(newActions);

    expect(workflow.getActions()).toEqual(newActions);
    expect(workflow.entryActionId).toBe("nodeA");
  });

  test("should update the title with setTitle", () => {
    const workflow = Workflow.createNew(
      "initial-title",
      "description",
      "user-6",
      "time"
    );

    workflow.setTitle("new-updated-title");

    expect(workflow.title).toBe("new-updated-title");
  });

  test("should update the description with setDescription", () => {
    const workflow = Workflow.createNew(
      "title",
      "initial-description",
      "user-7",
      "time"
    );

    workflow.setDescription("updated-description");

    expect(workflow.description).toBe("updated-description");
  });
});
