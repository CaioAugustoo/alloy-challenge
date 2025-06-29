import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { ExecuteWorkflowUseCase } from "../../../src/domain/use-cases/execute-workflow";
import { ExecuteWorkflowController } from "../../../src/presentation/controllers/execute-workflow";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";
import { ok } from "../../../src/presentation/helpers/http";

const makeUseCase = () => {
  const useCase: Partial<ExecuteWorkflowUseCase> = {
    execute: vi.fn(),
  };
  return useCase as ExecuteWorkflowUseCase;
};

describe("ExecuteWorkflowController", () => {
  let useCase: ExecuteWorkflowUseCase;
  let controller: ExecuteWorkflowController;
  const request: ExecuteWorkflowController.Request = {
    workflowId: "wf-789",
    executionId: "exec-456",
    maxRetries: 3,
    backoffBaseMs: 200,
  };

  beforeEach(() => {
    useCase = makeUseCase();
    controller = new ExecuteWorkflowController(useCase);
  });

  test("should call useCase.execute with correct values and return ok response", async () => {
    const result: ExecuteWorkflowController.Response = {
      workflowId: request.workflowId,
      executionId: request.executionId,
    };
    (useCase.execute as Mock).mockResolvedValue(result);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      workflowId: request.workflowId,
      executionId: request.executionId,
      maxRetries: request.maxRetries,
      backoffBaseMs: request.backoffBaseMs,
    });
    expect(response).toEqual(ok(result));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(result);
  });

  test("should return internalServerError if useCase throws", async () => {
    const error = new Error("execution error");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      workflowId: request.workflowId,
      executionId: request.executionId,
      maxRetries: request.maxRetries,
      backoffBaseMs: request.backoffBaseMs,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(InternalServerError);
    const body = response.body as InternalServerError;
    expect(body.message).toBe(error.message);
  });
});
