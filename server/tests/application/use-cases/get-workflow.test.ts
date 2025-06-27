import { describe, expect, vi, beforeEach, test } from "vitest";
import { GetWorkflowUseCase } from "../../../src/application/use-cases/get-workflow";
import { UserNotFoundError } from "../../../src/domain/errors/user-not-found";
import { WorkflowNotFoundError } from "../../../src/domain/errors/workflow-not-found";
import { NotAllowedToGetWorkflowError } from "../../../src/domain/errors/not-allowed-to-get-workflow";

const mockWorkflow = {
  id: "wf-1",
  title: "title",
  description: "description",
  triggerType: "webhook",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-02"),
  createdBy: "acc-123",
  getActions: () => ({ a: { action_id: "a", type: "log", params: {} } }),
};

describe("GetWorkflowUseCase", () => {
  let usersRepository: any;
  let workflowsRepository: any;
  let useCase: GetWorkflowUseCase;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    };
    workflowsRepository = {
      findById: vi.fn(),
    };
    useCase = new GetWorkflowUseCase(workflowsRepository, usersRepository);
  });

  const params = {
    workflowId: "wf-1",
    accountId: "acc-123",
  };

  test("should throw UserNotFoundError if user is not found", async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(params)).rejects.toThrow(UserNotFoundError);
    expect(usersRepository.findById).toHaveBeenCalledWith("acc-123");
  });

  test("should throw WorkflowNotFoundError if workflow is not found", async () => {
    usersRepository.findById.mockResolvedValue({ id: "acc-123" });
    workflowsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(params)).rejects.toThrow(
      WorkflowNotFoundError
    );
    expect(workflowsRepository.findById).toHaveBeenCalledWith("wf-1");
  });

  test("should throw NotAllowedToGetWorkflowError if user is not the owner", async () => {
    usersRepository.findById.mockResolvedValue({ id: "acc-123" });
    workflowsRepository.findById.mockResolvedValue({
      ...mockWorkflow,
      createdBy: "other-account",
    });

    await expect(useCase.execute(params)).rejects.toThrow(
      NotAllowedToGetWorkflowError
    );
  });

  test("should return workflow if user is the owner", async () => {
    usersRepository.findById.mockResolvedValue({ id: "acc-123" });
    workflowsRepository.findById.mockResolvedValue(mockWorkflow);

    const result = await useCase.execute(params);

    expect(result.workflow).toEqual({
      id: "wf-1",
      title: "title",
      description: "description",
      triggerType: "webhook",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-02"),
      actions: { a: { action_id: "a", type: "log", params: {} } },
    });
  });
});
