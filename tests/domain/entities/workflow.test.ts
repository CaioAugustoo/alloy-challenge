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
    const workflow = Workflow.createNew("user-1", "time");

    expect(workflow.id).toBe("fake-uuid");
    expect(workflow.triggerType).toBe("time");
    expect(workflow.createdBy).toBe("user-1");
    expect(workflow.getActions()).toEqual({});
    expect(workflow.createdAt).toBeInstanceOf(Date);
    expect(workflow.updatedAt).toBeInstanceOf(Date);
  });

  test("should add and retrieve an action correctly", () => {
    const workflow = Workflow.createNew("user-2", "webhook");
    const action: ActionNode = {
      action_id: "node1",
      type: NodeType.LOG,
      params: { message: "hello" },
    };

    workflow.addAction(action);

    expect(workflow.getActions()).toEqual({ node1: action });
    expect(workflow.entryActionId).toBe("node1");
    expect(workflow.getAction("node1")).toBe(action);
  });

  test("should throw when adding a duplicate action", () => {
    const workflow = Workflow.createNew("user-3", "time");
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
    const workflow = Workflow.createNew("user-4", "time");
    expect(() => workflow.getAction("not-found")).toThrowError(
      'Action node "not-found" not found'
    );
  });

  test("should serialize to persistence and recreate from persistence", () => {
    const workflow = Workflow.createNew("creator", "webhook");
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
      triggerType: "webhook",
      createdBy: "creator",
    });
    expect(persistence.actions).toHaveProperty("A", actionA);
    expect(persistence.actions).toHaveProperty("B", actionB);

    const record = {
      id: persistence.id,
      trigger_type: persistence.triggerType,
      created_by: persistence.createdBy,
      created_at: persistence.createdAt,
      updated_at: persistence.updatedAt,
      actions: persistence.actions,
    };

    const rehydrated = Workflow.createFromPersistence(record);
    expect(rehydrated.id).toBe(persistence.id);
    expect(rehydrated.triggerType).toBe(persistence.triggerType);
    expect(rehydrated.createdBy).toBe(persistence.createdBy);
    expect(rehydrated.createdAt).toBe(persistence.createdAt);
    expect(rehydrated.updatedAt).toBe(persistence.updatedAt);
    expect(rehydrated.getActions()).toEqual(persistence.actions);
  });
});
