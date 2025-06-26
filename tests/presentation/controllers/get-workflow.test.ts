import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { GetWorkflowUseCase } from "../../../src/domain/use-cases/get-workflow";
import { GetWorkflowController } from "../../../src/presentation/controllers/get-workflow";
import { Workflow } from "../../../src/domain/entities/workflow";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";
import { ok } from "../../../src/presentation/helpers/http";

const makeUseCase = () => {
  const useCase: Partial<GetWorkflowUseCase> = {
    execute: vi.fn(),
  };
  return useCase as GetWorkflowUseCase;
};

describe("GetWorkflowController", () => {
  let useCase: GetWorkflowUseCase;
  let controller: GetWorkflowController;
  const request: GetWorkflowController.Request = {
    workflowId: "wf-321",
    accountId: "acc-654",
  };

  beforeEach(() => {
    useCase = makeUseCase();
    controller = new GetWorkflowController(useCase);
  });

  test("should call useCase.execute with correct values and return ok response", async () => {
    const workflow = Workflow.createNew("acc-123", "time");

    const result: GetWorkflowController.Response = { workflow: workflow };
    (useCase.execute as Mock).mockResolvedValue(result);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      workflowId: request.workflowId,
      accountId: request.accountId,
    });
    expect(response).toEqual(ok(result));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(result);
  });

  test("should return internalServerError if useCase throws", async () => {
    const error = new Error("get error");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      workflowId: request.workflowId,
      accountId: request.accountId,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(InternalServerError);
    const body = response.body as InternalServerError;
    expect(body.message).toBe(error.message);
  });
});
