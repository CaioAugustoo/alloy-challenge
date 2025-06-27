import { describe, test, expect, vi, beforeEach } from "vitest";
import { HttpActionHandler } from "../../../src/infra/actions/http";
import {
  NodeType,
  type ActionNode,
} from "../../../src/domain/entities/workflow";

const makeFetchResponse = (status: number, statusText: string, ok = true) => ({
  status,
  statusText,
  ok,
});

describe("HttpActionHandler", () => {
  let handler: HttpActionHandler;

  beforeEach(() => {
    handler = new HttpActionHandler();
    vi.restoreAllMocks();
  });

  test("should throw if url is missing", async () => {
    const node: ActionNode = {
      action_id: "1",
      type: NodeType.HTTP,
      params: {},
    };
    await expect(handler.handle(node)).rejects.toThrow(
      "HttpAction requires a `url` parameter"
    );
  });

  test("should perform fetch with default GET and log twice when response ok", async () => {
    const url = "http://example.com";
    const node: ActionNode = {
      action_id: "2",
      type: NodeType.HTTP,
      params: { url },
    };

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(makeFetchResponse(200, "OK", true))
    );

    await expect(handler.handle(node)).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledWith(url, {
      method: "GET",
      headers: undefined,
      body: undefined,
    });
    expect(logSpy).toHaveBeenCalledWith(`[HttpAction] GET ${url}`);
    expect(logSpy).toHaveBeenCalledWith(`[HttpAction] 200 OK ${url}`);
  });

  test("should perform fetch with custom params and throw on non-ok", async () => {
    const node: ActionNode = {
      action_id: "3",
      type: NodeType.HTTP,
      params: {
        url: "https://api.test",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { key: "value" },
      },
    };

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const response = makeFetchResponse(500, "Error", false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    await expect(handler.handle(node)).rejects.toThrow(
      `[HttpAction] failed: 500 Error`
    );

    expect(fetch).toHaveBeenCalledWith("https://api.test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "value" }),
    });
    expect(logSpy).toHaveBeenCalledWith(`[HttpAction] POST https://api.test`);
    expect(logSpy).toHaveBeenCalledWith(
      `[HttpAction] 500 Error https://api.test`
    );
  });
});
