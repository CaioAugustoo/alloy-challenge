import { describe, expect, vi, beforeEach, test } from "vitest";
import { UpdateWorkflowUseCase } from "../../../src/application/use-cases/update-workflow";
import { UserNotFoundError } from "../../../src/domain/errors/user-not-found";
import { WorkflowNotFoundError } from "../../../src/domain/errors/workflow-not-found";
import { NotAuthorizedToUpdateWorkflowError } from "../../../src/domain/errors/not-authorized-to-update-workflow";
import type { UsersRepository } from "../../../src/domain/repositories/users";
import type { WorkflowsRepository } from "../../../src/domain/repositories/workflows";

describe("UpdateWorkflowUseCase", () => {
  let usersRepository: UsersRepository;
  let workflowsRepository: WorkflowsRepository;
  let useCase: UpdateWorkflowUseCase;

  const params = {
    id: "wf-1",
    workflowId: "wf-1",
    accountId: "user-1",
    actions: {},
    title: "New Title",
    description: "New Description",
  };

  const fakeUser = { id: "user-1", email: "u@example.com", name: "User" };
  const fakeWorkflow = {
    id: "wf-1",
    createdBy: "user-1",
    updateActions: vi.fn(),
    setTitle: vi.fn(),
    setDescription: vi.fn(),
  };

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
    };
    workflowsRepository = {
      findById: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      listWorkflows: vi.fn(),
    };
    useCase = new UpdateWorkflowUseCase(workflowsRepository, usersRepository);
  });

  test("throws UserNotFoundError if user not found", async () => {
    (usersRepository.findById as any).mockResolvedValue(undefined);

    await expect(useCase.execute(params)).rejects.toThrow(
      new UserNotFoundError(params.accountId)
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(params.accountId);
  });

  test("throws WorkflowNotFoundError if workflow not found", async () => {
    (usersRepository.findById as any).mockResolvedValue(fakeUser);
    (workflowsRepository.findById as any).mockResolvedValue(undefined);

    await expect(useCase.execute(params)).rejects.toThrow(
      new WorkflowNotFoundError(params.workflowId)
    );
    expect(workflowsRepository.findById).toHaveBeenCalledWith(
      params.workflowId
    );
  });

  test("throws NotAuthorizedToUpdateWorkflowError if not owner", async () => {
    (usersRepository.findById as any).mockResolvedValue(fakeUser);
    (workflowsRepository.findById as any).mockResolvedValue({
      ...fakeWorkflow,
      createdBy: "other-user",
    });

    await expect(useCase.execute(params)).rejects.toThrow(
      new NotAuthorizedToUpdateWorkflowError(
        params.workflowId,
        params.accountId
      )
    );
  });

  test("updates and persists workflow when authorized", async () => {
    (usersRepository.findById as any).mockResolvedValue(fakeUser);
    (workflowsRepository.findById as any).mockResolvedValue(fakeWorkflow);

    await useCase.execute(params);

    expect(fakeWorkflow.updateActions).toHaveBeenCalledWith(params.actions);
    expect(fakeWorkflow.setTitle).toHaveBeenCalledWith(params.title);
    expect(fakeWorkflow.setDescription).toHaveBeenCalledWith(
      params.description
    );
    expect(workflowsRepository.update).toHaveBeenCalledWith(
      params.workflowId,
      fakeWorkflow
    );
  });
});
