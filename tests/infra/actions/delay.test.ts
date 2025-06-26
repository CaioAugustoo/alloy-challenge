import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { DelayActionHandler } from "../../../src/infra/actions/delay";
import { ActionNode, NodeType } from "../../../src/domain/entities/workflow";

describe("DelayActionHandler", () => {
  let handler: DelayActionHandler;

  beforeEach(() => {
    handler = new DelayActionHandler();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should throw if ms is negative", async () => {
    const node: ActionNode = {
      action_id: "2",
      type: NodeType.DELAY,
      params: { ms: -10 },
    };
    await expect(handler.handle(node)).rejects.toThrow(
      "DelayAction requires a non-negative `ms` number parameter"
    );
  });

  test("should throw if ms is not a number", async () => {
    const node: ActionNode = {
      action_id: "3",
      type: NodeType.DELAY,
      params: { ms: "100" as any },
    };
    await expect(handler.handle(node)).rejects.toThrow(
      "DelayAction requires a non-negative `ms` number parameter"
    );
  });

  test("should throw if ms is missing", async () => {
    const node: ActionNode = {
      action_id: "4",
      type: NodeType.DELAY,
      params: {},
    };
    await expect(handler.handle(node)).rejects.toThrow(
      "DelayAction requires a non-negative `ms` number parameter"
    );
  });
});
