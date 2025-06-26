import { describe, it, expect, vi, beforeEach, test } from "vitest";
import type { Mock } from "vitest";
import { ListWorkflowsUseCase } from "../../../src/domain/use-cases/list-workflows";
import { ListWorkflowsController } from "../../../src/presentation/controllers/list-workflows";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import { ok } from "../../../src/presentation/helpers/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";

const makeUseCase = () => {
  const useCase: Partial<ListWorkflowsUseCase> = {
    execute: vi.fn(),
  };
  return useCase as ListWorkflowsUseCase;
};

describe("ListWorkflowsController", () => {
  let useCase: ListWorkflowsUseCase;
  let controller: ListWorkflowsController;
  const request: ListWorkflowsController.Request = { accountId: "acc-999" };

  beforeEach(() => {
    useCase = makeUseCase();
    controller = new ListWorkflowsController(useCase);
  });

  test("should call useCase.execute with correct accountId and return ok response", async () => {
    const workflows = [{ id: "wf1" }, { id: "wf2" }];
    (useCase.execute as Mock).mockResolvedValue(workflows);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      accountId: request.accountId,
    });
    expect(response).toEqual(ok(workflows));
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(workflows);
  });

  test("should return internalServerError if useCase throws", async () => {
    const error = new Error("list failed");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      accountId: request.accountId,
    });
    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(InternalServerError);
    const body = response.body as InternalServerError;
    expect(body.message).toBe(error.message);
  });
});
