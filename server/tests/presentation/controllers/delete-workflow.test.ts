import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { DeleteWorkflowUseCase } from "../../../src/domain/use-cases/delete-workflow";
import { DeleteWorkflowController } from "../../../src/presentation/controllers/delete-workflow";
import { HttpResponse } from "../../../src/presentation/protocols/http";
import { noContent } from "../../../src/presentation/helpers/http";
import { InternalServerError } from "../../../src/presentation/errors/internal-server-error";

const makeUseCase = () => {
  const useCase: Partial<DeleteWorkflowUseCase> = {
    execute: vi.fn(),
  };
  return useCase as DeleteWorkflowUseCase;
};

describe("DeleteWorkflowController", () => {
  let useCase: DeleteWorkflowUseCase;
  let controller: DeleteWorkflowController;
  const request: DeleteWorkflowController.Request = {
    workflowId: "wf-123",
    accountId: "acc-456",
  };

  beforeEach(() => {
    useCase = makeUseCase();
    controller = new DeleteWorkflowController(useCase);
  });

  test("should call useCase.execute with correct values and return noContent response", async () => {
    (useCase.execute as Mock).mockResolvedValue(undefined);

    const response: HttpResponse = await controller.handle(request);

    expect(useCase.execute).toHaveBeenCalledWith({
      workflowId: request.workflowId,
      accountId: request.accountId,
    });

    expect(response).toEqual(noContent());
    expect(response.statusCode).toBe(204);
    expect(response.body).toBeUndefined();
  });

  test("should return internalServerError if useCase throws", async () => {
    const error = new Error("delete failed");
    (useCase.execute as Mock).mockRejectedValue(error);

    const response: HttpResponse = await controller.handle(request);

    expect(response.statusCode).toBe(500);
    expect(response.body).toBeInstanceOf(InternalServerError);
    const body = response.body as InternalServerError;
    expect(body.message).toBe(error.message);
  });
});
