import { describe, expect, vi, beforeEach, test } from "vitest";
import { WorkflowsRepository } from "../../../src/domain/repositories/workflows";
import { UsersRepository } from "../../../src/domain/repositories/users";
import { CreateWorkflowUseCase as CreateWorkflowUseCaseInterface } from "../../../src/domain/use-cases/create-workflow";
import { NodeType, Workflow } from "../../../src/domain/entities/workflow";
import { CreateWorkflowUseCase } from "../../../src/application/use-cases/create-workflow";
import { UserNotFoundError } from "../../../src/domain/errors/user-not-found";
import { User } from "../../../src/domain/entities/user";
import { BcryptHasher } from "../../../src/shared/hashing/bcrypt";

vi.mock("../../domain/entities/workflow");

describe("CreateWorkflowUseCase", () => {
  let workflowsRepository: WorkflowsRepository;
  let usersRepository: UsersRepository;
  let useCase: CreateWorkflowUseCase;

  const params: CreateWorkflowUseCaseInterface.Params = {
    title: "title",
    description: "description",
    accountId: "acc-123",
    triggerType: "webhook",
    actions: {
      node1: {
        action_id: "node1",
        type: NodeType.LOG,
        params: { message: "Hello" },
      },
      node2: {
        action_id: "node2",
        type: NodeType.HTTP,
        params: { url: "http://test.com" },
      },
    },
  };

  beforeEach(() => {
    workflowsRepository = {
      create: vi.fn(),
    } as any;

    usersRepository = {
      findById: vi.fn(),
    } as any;

    useCase = new CreateWorkflowUseCase(workflowsRepository, usersRepository);
  });

  test("should throw UserNotFoundError if user does not exist", async () => {
    vi.mocked(usersRepository.findById).mockResolvedValue(undefined);

    await expect(useCase.execute(params)).rejects.toThrow(UserNotFoundError);
    expect(usersRepository.findById).toHaveBeenCalledWith("acc-123");
  });

  test("should create a workflow and return its id", async () => {
    const fakeUser = await User.createNew(
      "john",
      "john@example.com",
      "123456",
      new BcryptHasher(10)
    );
    vi.mocked(usersRepository.findById).mockResolvedValue(fakeUser);
    const fakeWorkflow = {
      id: "workflow-001",
      addAction: vi.fn(),
    };
    vi.spyOn(Workflow, "createNew").mockReturnValue(fakeWorkflow as any);

    const result = await useCase.execute(params);

    expect(usersRepository.findById).toHaveBeenCalledWith("acc-123");
    expect(Workflow.createNew).toHaveBeenCalledWith(
      "title",
      "description",
      "acc-123",
      "webhook"
    );
    expect(fakeWorkflow.addAction).toHaveBeenCalledTimes(2);
    expect(workflowsRepository.create).toHaveBeenCalledWith(fakeWorkflow);
    expect(result).toEqual({ workflowId: "workflow-001" });
  });
});
