import { describe, test, expect, vi, beforeEach } from "vitest";
import { UpdateWorkflowController } from "../../../src/presentation/controllers/update-workflow";
import {
  internalServerError,
  noContent,
} from "../../../src/presentation/helpers/http";

describe("UpdateWorkflowController", () => {
  const makeRequest = (): UpdateWorkflowController.Request => ({
    title: "New Title",
    description: "Updated Description",
    workflowId: "workflow-123",
    actions: {
      node1: { type: "log", params: { message: "Hello" } },
    },
    accountId: "account-xyz",
  });

  const makeUseCase = () => ({
    execute: vi.fn(),
  });

  let controller: UpdateWorkflowController;
  let useCaseMock: ReturnType<typeof makeUseCase>;

  beforeEach(() => {
    useCaseMock = makeUseCase();
    controller = new UpdateWorkflowController(useCaseMock as any);
  });

  test("should call UpdateWorkflowUseCase with correct values", async () => {
    const req = makeRequest();
    await controller.handle(req);

    expect(useCaseMock.execute).toHaveBeenCalledWith({
      title: req.title,
      description: req.description,
      workflowId: req.workflowId,
      actions: req.actions,
      accountId: req.accountId,
    });
  });

  test("should return 204 if use case succeeds", async () => {
    const req = makeRequest();
    const response = await controller.handle(req);

    expect(response).toEqual(noContent());
  });

  test("should return 500 if use case throws", async () => {
    useCaseMock.execute.mockRejectedValueOnce(new Error("Unexpected error"));

    const req = makeRequest();
    const response = await controller.handle(req);

    expect(response).toEqual(
      internalServerError(new Error("Unexpected error"))
    );
  });
});
