import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Mock } from "vitest";
import { CreateWorkflowUseCase } from "../../../src/domain/use-cases/create-workflow";
import { CreateWorkflowController } from "../../../src/presentation/controllers/create-workflow";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";
import { ok } from "../../../src/presentation/helpers/http";

const makeUseCase = () => {
  const useCase: Partial<CreateWorkflowUseCase> = {
    execute: vi.fn(),
  };
  return useCase as CreateWorkflowUseCase;
};

describe("CreateWorkflowController", () => {
  let useCase: CreateWorkflowUseCase;
  let controller: CreateWorkflowController;
  const request: CreateWorkflowController.Request = {
    triggerType: "time",
    accountId: "acc-123",
    actions: { a: { action_id: "a", type: "log", params: {} } },
  };

  beforeEach(() => {
    useCase = makeUseCase();
    controller = new CreateWorkflowController(useCase);
  });

  test("should call useCase.execute with correct values and return ok response", async () => {
    const result = { id: "wf-1", ...request };
    (useCase.execute as Mock).mockResolvedValue(result);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      triggerType: request.triggerType,
      accountId: request.accountId,
      actions: request.actions,
    });

    expect(response).toEqual(ok(result));
  });

  test("should return internal server error if useCase throws", async () => {
    const error = new Error("fail");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(InternalServerError);
    const body = response.body as InternalServerError;
    expect(body.message).toBe(error.message);
  });
});
