import { describe, expect, vi, beforeEach, test } from "vitest";
import { LogsRepository } from "../../../src/infra/repositories/logs";
import { WorkflowExecutionLog } from "../../../src/domain/entities/log";

describe("LogsRepository", () => {
  let db: { query: ReturnType<typeof vi.fn> };
  let repo: LogsRepository;

  beforeEach(() => {
    db = { query: vi.fn() };
    repo = new LogsRepository(db as any);
  });

  describe("listLogs", () => {
    test("returns empty array when db.query returns undefined", async () => {
      db.query.mockResolvedValueOnce(undefined);
      const logs = await repo.listLogs("wf-1");
      expect(logs).toEqual([]);
    });

    test("returns empty array when db.query returns null", async () => {
      db.query.mockResolvedValueOnce(null);
      const logs = await repo.listLogs("wf-1");
      expect(logs).toEqual([]);
    });

    test("wraps single object into array", async () => {
      const raw = {
        id: "log-1",
        workflow_id: "wf-1",
        execution_id: "ex-1",
        action_id: "act-1",
        status: "success" as const,
        attempt: 1,
        message: "all good",
        created_at: new Date().toISOString(),
      };
      db.query.mockResolvedValueOnce(raw);

      const result = await repo.listLogs("wf-1");
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(raw);
    });

    test("returns array when db.query returns array", async () => {
      const now = new Date().toISOString();
      const raws = [
        {
          id: "log-1",
          workflow_id: "wf-1",
          execution_id: "ex-1",
          action_id: "act-1",
          status: "success" as const,
          attempt: 1,
          message: "ok",
          created_at: now,
        },
        {
          id: "log-2",
          workflow_id: "wf-1",
          execution_id: "ex-1",
          action_id: "act-2",
          status: "failed" as const,
          attempt: 2,
          message: "error",
          created_at: now,
        },
      ];
      db.query.mockResolvedValueOnce(raws);

      const logs = await repo.listLogs("wf-1");
      expect(logs).toHaveLength(2);
      expect(logs).toEqual(raws);
    });

    test("calls db.query with correct SQL and parameters", async () => {
      db.query.mockResolvedValueOnce([]);
      await repo.listLogs("wf-42");
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT * FROM workflow_execution_Logs WHERE workflow_id = $1"
        ),
        ["wf-42"]
      );
    });
  });

  describe("create", () => {
    test("inserts a log with correct values", async () => {
      const createdAt = new Date();
      const log = WorkflowExecutionLog.createNew({
        workflowId: "wf-1",
        executionId: "ex-1",
        actionId: "act-1",
        status: "failed",
        attempt: 3,
        message: "something went wrong",
      });
      (log as any).props.id = "log-123";
      (log as any).props.createdAt = createdAt;

      await repo.create(log);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO workflow_execution_Logs"),
        [
          "log-123",
          "wf-1",
          "ex-1",
          "act-1",
          "failed",
          3,
          "something went wrong",
          createdAt,
        ]
      );
    });
  });
});
