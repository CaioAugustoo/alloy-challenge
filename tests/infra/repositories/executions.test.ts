import { describe, expect, vi, beforeEach, test } from "vitest";
import { WorkflowExecutionsRepository } from "../../../src/infra/repositories/executions";

describe("WorkflowExecutionsRepository", () => {
  let dbMock: { query: any };
  let repo: WorkflowExecutionsRepository;

  beforeEach(() => {
    dbMock = {
      query: vi.fn(),
    };
    repo = new WorkflowExecutionsRepository(dbMock as any);
  });

  test("should create a new execution state", async () => {
    const state = {
      workflowId: "wf1",
      executionId: "exec1",
      currentActionId: "action1",
      completed: false,
      retries: { action1: 0 },
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    await repo.create(state);

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO workflow_executions"),
      [
        state.workflowId,
        state.executionId,
        state.currentActionId,
        state.completed,
        state.retries,
        state.startedAt,
        state.updatedAt,
      ]
    );
  });

  test("should find an existing execution state", async () => {
    const dbResult = {
      workflow_id: "wf1",
      execution_id: "exec1",
      current_node: "action1",
      completed: false,
      retries: { action1: 0 },
      started_at: "2023-01-01T00:00:00.000Z",
      updated_at: "2023-01-01T00:00:00.000Z",
    };

    dbMock.query.mockResolvedValueOnce(dbResult);

    const result = await repo.find("wf1", "exec1");

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT workflow_id"),
      ["wf1", "exec1"]
    );

    expect(result).toEqual({
      workflowId: "wf1",
      executionId: "exec1",
      currentActionId: "action1",
      completed: false,
      retries: { action1: 0 },
      startedAt: new Date(dbResult.started_at),
      updatedAt: new Date(dbResult.updated_at),
    });
  });

  test("should return null if execution state not found", async () => {
    dbMock.query.mockResolvedValueOnce(null);

    const result = await repo.find("wf1", "exec1");

    expect(result).toBeNull();
  });

  test("should update an existing execution state", async () => {
    const state = {
      workflowId: "wf1",
      executionId: "exec1",
      currentActionId: "action2",
      completed: true,
      retries: { action1: 1, action2: 0 },
      startedAt: new Date(),
      updatedAt: new Date(),
    };

    await repo.update(state);

    expect(dbMock.query).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE workflow_executions"),
      [
        state.workflowId,
        state.currentActionId,
        state.completed,
        state.retries,
        state.updatedAt,
        state.executionId,
      ]
    );
  });
});
