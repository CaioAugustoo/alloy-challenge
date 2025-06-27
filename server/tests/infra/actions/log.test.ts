import { describe, test, expect, vi, beforeEach } from "vitest";
import { LogActionHandler } from "../../../src/infra/actions/log";
import { ActionNode, NodeType } from "../../../src/domain/entities/workflow";

describe("LogActionHandler", () => {
  let handler: LogActionHandler;

  beforeEach(() => {
    handler = new LogActionHandler();
    vi.restoreAllMocks();
  });

  test("should log the message with the specified level", async () => {
    const node: ActionNode = {
      action_id: "1",
      type: NodeType.LOG,
      params: {
        message: "Test log message",
        level: "warn",
      },
    };

    const logSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await handler.handle(node);

    expect(logSpy).toHaveBeenCalledWith("[LogAction] Test log message");
  });

  test('should log the message with default level "info" when not provided', async () => {
    const node: ActionNode = {
      action_id: "2",
      type: NodeType.LOG,
      params: {
        message: "Default level message",
      },
    };

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    await handler.handle(node);

    expect(infoSpy).toHaveBeenCalledWith("[LogAction] Default level message");
  });

  test("should throw if message is missing", async () => {
    const node: ActionNode = {
      action_id: "3",
      type: NodeType.LOG,
      params: {},
    };

    await expect(handler.handle(node)).rejects.toThrow(
      "LogAction requires a `message` parameter"
    );
  });
});
