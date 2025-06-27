import { describe, expect, vi, beforeEach, test } from "vitest";
import { Workflow } from "../../../src/domain/entities/workflow";
import { WorkflowsRepository } from "../../../src/infra/repositories/workflows";

describe("WorkflowsRepository", () => {
  let db: { query: ReturnType<typeof vi.fn> };
  let repo: WorkflowsRepository;

  beforeEach(() => {
    db = { query: vi.fn() };
    repo = new WorkflowsRepository(db as any);
  });

  describe("listWorkflows", () => {
    test("should return empty array when db.query returns undefined", async () => {
      db.query.mockResolvedValueOnce(undefined);
      const result = await repo.listWorkflows("user-1");
      expect(result).toEqual([]);
    });

    test("should wrap single workflow into array", async () => {
      const wf = {
        id: "wf-1",
        title: "T1",
        description: "D1",
      } as unknown as Workflow;
      db.query.mockResolvedValueOnce(wf);
      const result = await repo.listWorkflows("user-1");
      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([wf]);
    });

    test("should return array when db.query returns array", async () => {
      const wfs = [
        { id: "wf-1", title: "T1", description: "D1" } as unknown as Workflow,
        { id: "wf-2", title: "T2", description: "D2" } as unknown as Workflow,
      ];
      db.query.mockResolvedValueOnce(wfs);
      const result = await repo.listWorkflows("user-1");
      expect(result).toEqual(wfs);
    });

    test("should call db.query with correct SQL and parameter", async () => {
      db.query.mockResolvedValueOnce([]);
      await repo.listWorkflows("user-42");
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT * FROM workflows WHERE created_by = $1 ORDER BY created_at DESC"
        ),
        ["user-42"]
      );
    });
  });

  describe("findById", () => {
    const workflowRow = {
      id: "wf-1",
      title: "T1",
      description: "D1",
      trigger_type: "time",
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const nodeRows: Array<{
      action_id: string;
      type: string;
      params: Record<string, any>;
      next_ids: string[];
    }> = [
      {
        action_id: "a1",
        type: "log",
        params: { message: "hi" },
        next_ids: ["a2"],
      },
      {
        action_id: "a2",
        type: "delay",
        params: { ms: 100 },
        next_ids: [],
      },
    ];

    beforeEach(() => {
      vi.spyOn(Workflow, "createFromPersistence").mockReturnValue(
        {} as unknown as Workflow
      );
    });

    test("should return undefined when workflow not found", async () => {
      db.query.mockResolvedValueOnce(undefined);
      const result = await repo.findById("missing");
      expect(result).toBeUndefined();
    });

    test("should reconstruct Workflow from DB rows", async () => {
      db.query
        .mockResolvedValueOnce(workflowRow) // workflow
        .mockResolvedValueOnce(nodeRows); // nodes

      await repo.findById("wf-1");

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("FROM workflows"),
        ["wf-1"]
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("FROM action_nodes"),
        ["wf-1"]
      );

      expect(Workflow.createFromPersistence).toHaveBeenCalledWith({
        ...workflowRow,
        actions: {
          a1: {
            action_id: "a1",
            type: "log",
            params: { message: "hi" },
            next_ids: ["a2"],
          },
          a2: {
            action_id: "a2",
            type: "delay",
            params: { ms: 100 },
          },
        },
      });
    });
  });

  describe("create", () => {
    test("should insert workflow and its actions", async () => {
      const fakeWorkflow = {
        toPersistence: () => ({
          id: "wf-1",
          title: "T1",
          description: "D1",
          triggerType: "webhook",
          createdBy: "user-1",
          actions: {
            a1: {
              action_id: "a1",
              type: "log",
              params: { msg: "hi" },
              next_ids: ["a2"],
            },
            a2: { action_id: "a2", type: "http", params: { url: "x" } },
          },
          createdAt: new Date("2025-01-01T00:00:00Z"),
          updatedAt: new Date("2025-01-01T00:00:00Z"),
        }),
      } as unknown as Workflow;

      await repo.create(fakeWorkflow);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO workflows"),
        expect.arrayContaining([
          "wf-1",
          "T1",
          "D1",
          "webhook",
          "user-1",
          new Date("2025-01-01T00:00:00Z"),
          new Date("2025-01-01T00:00:00Z"),
        ])
      );

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO action_nodes"),
        expect.arrayContaining([
          "a1",
          "wf-1",
          "log",
          { msg: "hi" },
          ["a2"],
          expect.any(Date),
          expect.any(Date),
        ])
      );
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO action_nodes"),
        expect.arrayContaining([
          "a2",
          "wf-1",
          "http",
          { url: "x" },
          [],
          expect.any(Date),
          expect.any(Date),
        ])
      );
    });
  });

  describe("delete", () => {
    test("should delete workflow by id", async () => {
      await repo.delete("wf-1");
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM workflows"),
        ["wf-1"]
      );
    });
  });
});
