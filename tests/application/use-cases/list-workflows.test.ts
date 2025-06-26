import { describe, expect, vi, beforeEach, test } from "vitest";
import { ListWorkflowsUseCase } from "../../../src/application/use-cases/list-workflows";
import { UserNotFoundError } from "../../../src/domain/errors/user-not-found";

const mockWorkflows = [
  {
    id: "wf-1",
    triggerType: "webhook",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "acc-123",
    getActions: () => ({}),
  },
  {
    id: "wf-2",
    triggerType: "time",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "acc-123",
    getActions: () => ({}),
  },
];

describe("ListWorkflowsUseCase", () => {
  let usersRepository: any;
  let workflowsRepository: any;
  let useCase: ListWorkflowsUseCase;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    };
    workflowsRepository = {
      listWorkflows: vi.fn(),
    };
    useCase = new ListWorkflowsUseCase(workflowsRepository, usersRepository);
  });

  const params = { accountId: "acc-123" };

  test("should throw UserNotFoundError if user is not found", async () => {
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(params)).rejects.toThrow(UserNotFoundError);
    expect(usersRepository.findById).toHaveBeenCalledWith("acc-123");
  });

  test("should return list of workflows for valid user", async () => {
    usersRepository.findById.mockResolvedValue({ id: "acc-123" });
    workflowsRepository.listWorkflows.mockResolvedValue(mockWorkflows);

    const result = await useCase.execute(params);

    expect(result.workflows).toEqual(mockWorkflows);
    expect(workflowsRepository.listWorkflows).toHaveBeenCalledWith("acc-123");
  });
});
