import { describe, expect, vi, beforeEach, test } from "vitest";
import { WorkflowExecutionsRepository } from "../../../src/infra/repositories/executions";
import { ExecutionState } from "../../../src/domain/repositories/executions";

describe("WorkflowExecutionsRepository", () => {
  let db: { query: ReturnType<typeof vi.fn> };
  let repo: WorkflowExecutionsRepository;

  beforeEach(() => {
    db = { query: vi.fn() };
    repo = new WorkflowExecutionsRepository(db as any);
  });

  describe("create", () => {
    test("inserts a new execution with all fields", async () => {
      const now = new Date();
      const state: ExecutionState = {
        workflowId: "wf-1",
        executionId: "ex-1",
        currentActionId: undefined,
        completed: false,
        retries: { a1: 2 },
        startedAt: now,
        updatedAt: now,
      };

      await repo.create(state);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO workflow_executions"),
        ["wf-1", "ex-1", "", false, { a1: 2 }, now, now]
      );
    });
  });

  describe("find", () => {
    test("returns null when no execution found", async () => {
      db.query.mockResolvedValueOnce(undefined);
      const result = await repo.find("wf-1", "ex-1");
      expect(result).toBeNull();
    });

    test("maps row to ExecutionState correctly", async () => {
      const now = new Date().toISOString();
      const row = {
        workflow_id: "wf-1",
        execution_id: "ex-1",
        current_node: "a1",
        completed: true,
        retries: { a1: 3 },
        started_at: now,
        updated_at: now,
      };
      db.query.mockResolvedValueOnce(row);

      const result = await repo.find("wf-1", "ex-1");
      expect(result).toBeDefined();
      expect(result?.workflowId).toBe("wf-1");
      expect(result?.executionId).toBe("ex-1");
      expect(result?.currentActionId).toBe("a1");
      expect(result?.completed).toBe(true);
      expect(result?.retries).toEqual({ a1: 3 });
      expect(result?.startedAt).toEqual(new Date(now));
      expect(result?.updatedAt).toEqual(new Date(now));
    });

    test("maps null current_node to undefined", async () => {
      const now = new Date().toISOString();
      const row = {
        workflow_id: "wf-2",
        execution_id: "ex-2",
        current_node: null,
        completed: false,
        retries: {},
        started_at: now,
        updated_at: now,
      };
      db.query.mockResolvedValueOnce(row);

      const result = await repo.find("wf-2", "ex-2");
      expect(result?.currentActionId).toBeUndefined();
    });

    test("calls db.query with correct SQL and parameters", async () => {
      db.query.mockResolvedValueOnce(null);
      await repo.find("wf-42", "exec-42");
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT workflow_id, execution_id, current_node"
        ),
        ["wf-42", "exec-42"]
      );
    });
  });

  describe("update", () => {
    test("updates execution state with all fields", async () => {
      const now = new Date();
      const state: ExecutionState = {
        workflowId: "wf-1",
        executionId: "ex-1",
        currentActionId: undefined,
        completed: true,
        retries: { a1: 4 },
        startedAt: now,
        updatedAt: now,
      };

      await repo.update(state);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE workflow_executions"),
        ["wf-1", null, true, { a1: 4 }, now, "ex-1"]
      );
    });
  });
});
