import { beforeEach, describe, expect, test, vi } from "vitest";
import { UsersRepository } from "../../../src/domain/repositories/users";
import { WorkflowsRepository } from "../../../src/domain/repositories/workflows";
import { DeleteWorkflowUseCase } from "../../../src/application/use-cases/delete-workflow";
import { UserNotFoundError } from "../../../src/domain/errors/user-not-found";
import { User } from "../../../src/domain/entities/user";
import { BcryptHasher } from "../../../src/shared/hashing/bcrypt";
import { WorkflowNotFoundError } from "../../../src/domain/errors/workflow-not-found";
import { NotAuthorizedToDeleteWorkflowError } from "../../../src/domain/errors/not-authorized-to-delete-workflow";
import { Workflow } from "../../../src/domain/entities/workflow";

describe("DeleteWorkflowUseCase", () => {
  let usersRepository: UsersRepository;
  let workflowsRepository: WorkflowsRepository;
  let useCase: DeleteWorkflowUseCase;

  const params = {
    workflowId: "wf-123",
    accountId: "fake-user",
  };

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as any;

    workflowsRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as any;

    useCase = new DeleteWorkflowUseCase(workflowsRepository, usersRepository);
  });

  test("should throw UserNotFoundError if user does not exist", async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(undefined);

    await expect(useCase.execute(params)).rejects.toThrow(UserNotFoundError);
    expect(usersRepository.findById).toHaveBeenCalledWith(params.accountId);
  });

  test("should throw WorkflowNotFoundError if workflow does not exist", async () => {
    const fakeUser = await User.createNew(
      "john",
      "john@example.com",
      "123456",
      new BcryptHasher(10)
    );
    vi.mocked(usersRepository.findById).mockResolvedValue(fakeUser);
    vi.mocked(workflowsRepository.findById).mockResolvedValue(undefined);

    await expect(useCase.execute(params)).rejects.toThrow(
      WorkflowNotFoundError
    );
    expect(workflowsRepository.findById).toHaveBeenCalledWith("wf-123");
  });

  test("should throw NotAuthorizedToDeleteWorkflowError if workflow not owned by user", async () => {
    const fakeUser = await User.createNew(
      "john",
      "john@example.com",
      "123456",
      new BcryptHasher(10)
    );
    const fakeWorkflow = Workflow.createNew("foo", "time");
    vi.mocked(usersRepository.findById).mockResolvedValue(fakeUser);
    vi.mocked(workflowsRepository.findById).mockResolvedValue(fakeWorkflow);

    await expect(useCase.execute(params)).rejects.toThrow(
      NotAuthorizedToDeleteWorkflowError
    );
  });

  test("should delete workflow if user is owner", async () => {
    const fakeUser = await User.createNew(
      "john",
      "john@example.com",
      "123456",
      new BcryptHasher(10)
    );
    const fakeWorkflow = Workflow.createNew("fake-user", "time");

    vi.mocked(usersRepository.findById).mockResolvedValue(fakeUser);
    vi.mocked(workflowsRepository.findById).mockResolvedValue(fakeWorkflow);

    await useCase.execute(params);

    expect(workflowsRepository.delete).toHaveBeenCalledWith("wf-123");
  });
});
