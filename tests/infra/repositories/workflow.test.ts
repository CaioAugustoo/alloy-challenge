import { describe, expect, vi, beforeEach, test } from "vitest";
import { WorkflowsRepository } from "../../../src/infra/repositories/workflows";
import { Workflow } from "../../../src/domain/entities/workflow";

describe("WorkflowsRepository", () => {
  let db: any;
  let repo: WorkflowsRepository;

  beforeEach(() => {
    db = { query: vi.fn() };
    repo = new WorkflowsRepository(db);
  });

  test("should list workflows", async () => {
    const result = [{ id: "workflow-1" }];
    db.query.mockResolvedValueOnce(result);

    const workflows = await repo.listWorkflows("user-1");
    expect(workflows).toEqual(result);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM workflows"),
      ["user-1"]
    );
  });

  test("should return empty array when no workflows found", async () => {
    db.query.mockResolvedValueOnce(undefined);

    const workflows = await repo.listWorkflows("user-1");
    expect(workflows).toEqual([]);
  });

  test("should find workflow by id with actions", async () => {
    const workflowData = {
      id: "workflow-1",
      trigger_type: "time",
      created_by: "user-1",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const actionNodes = [
      {
        action_id: "a1",
        type: "log",
        params: { message: "hello" },
        next_ids: ["a2"],
      },
    ];

    db.query.mockResolvedValueOnce(workflowData);
    db.query.mockResolvedValueOnce(actionNodes);

    vi.spyOn(Workflow, "createFromPersistence").mockReturnValueOnce({
      id: "workflow-1",
    } as unknown as Workflow);

    const workflow = await repo.findById("workflow-1");
    expect(workflow).toBeDefined();
    expect(Workflow.createFromPersistence).toHaveBeenCalledWith({
      ...workflowData,
      actions: {
        a1: {
          action_id: "a1",
          type: "log",
          params: { message: "hello" },
          next_ids: ["a2"],
        },
      },
    });
  });

  test("should return undefined if workflow not found by id", async () => {
    db.query.mockResolvedValueOnce(undefined);
    const workflow = await repo.findById("invalid-id");
    expect(workflow).toBeUndefined();
  });

  test("should create workflow and its actions", async () => {
    const now = new Date();
    const fakeWorkflow = {
      toPersistence: () => ({
        id: "workflow-3",
        triggerType: "http",
        createdBy: "user-3",
        actions: {
          a1: {
            action_id: "a1",
            type: "log",
            params: { message: "hello" },
            next_ids: ["a2"],
          },
        },
        createdAt: now,
        updatedAt: now,
      }),
    } as unknown as Workflow;

    await repo.create(fakeWorkflow);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO workflows"),
      expect.arrayContaining(["workflow-3", "http", "user-3"])
    );

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO action_nodes"),
      expect.arrayContaining(["a1", "workflow-3", "log"])
    );
  });

  test("should delete a workflow by id", async () => {
    await repo.delete("workflow-4");
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM workflows"),
      ["workflow-4"]
    );
  });
});
