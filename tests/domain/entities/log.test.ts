import { describe, expect, vi, beforeEach, test, afterEach } from "vitest";
import {
  ExecutionStatus,
  WorkflowExecutionLog,
} from "../../../src/domain/entities/log";

describe("WorkflowExecutionLog", () => {
  const FIXED_DATE = new Date("2025-01-01T00:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
    vi.mock("uuid", () => ({ v4: vi.fn(() => "test-uuid") }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("should createNew generates a new log with default attempt and timestamp", () => {
    const log = WorkflowExecutionLog.createNew({
      workflowId: "wf-1",
      executionId: "ex-1",
      actionId: "act-1",
      status: "success",
    });

    expect(log).toBeInstanceOf(WorkflowExecutionLog);
    const persisted = log.toPersistence();
    expect(persisted.id).toBe("test-uuid");
    expect(persisted.workflowId).toBe("wf-1");
    expect(persisted.executionId).toBe("ex-1");
    expect(persisted.actionId).toBe("act-1");
    expect(persisted.status).toBe("success");
    expect(persisted.attempt).toBe(1);
    expect(persisted.message).toBeNull();
    expect(persisted.createdAt).toEqual(FIXED_DATE);
  });

  test("should createNew allows overriding attempt and message", () => {
    const log = WorkflowExecutionLog.createNew({
      workflowId: "wf-2",
      executionId: "ex-2",
      actionId: "act-2",
      status: "failed",
      attempt: 5,
      message: "error occurred",
    });

    const persisted = log.toPersistence();
    expect(persisted.attempt).toBe(5);
    expect(persisted.message).toBe("error occurred");
  });

  test("fromPersistence maps DB row to entity correctly", () => {
    const row = {
      id: "row-uuid",
      workflow_id: "wf-3",
      execution_id: "ex-3",
      action_id: "act-3",
      status: "skipped" as ExecutionStatus,
      attempt: 2,
      message: null,
      created_at: "2025-02-02T12:34:56Z",
    };

    const log = WorkflowExecutionLog.fromPersistence(row);
    expect(log).toBeInstanceOf(WorkflowExecutionLog);
    const persisted = log.toPersistence();
    expect(persisted.id).toBe("row-uuid");
    expect(persisted.workflowId).toBe("wf-3");
    expect(persisted.executionId).toBe("ex-3");
    expect(persisted.actionId).toBe("act-3");
    expect(persisted.status).toBe("skipped");
    expect(persisted.attempt).toBe(2);
    expect(persisted.message).toBeNull();
    expect(persisted.createdAt).toEqual(new Date("2025-02-02T12:34:56Z"));
  });
});
