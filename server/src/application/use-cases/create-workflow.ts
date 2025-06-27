import { Workflow } from "../../domain/entities/workflow";
import { UserNotFoundError } from "../../domain/errors/user-not-found";
import type { UsersRepository } from "../../domain/repositories/users";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { CreateWorkflowUseCase as CreateWorkflowUseCaseInterface } from "../../domain/use-cases/create-workflow";

export class CreateWorkflowUseCase implements CreateWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    params: CreateWorkflowUseCaseInterface.Params
  ): Promise<CreateWorkflowUseCaseInterface.Response> {
    const { triggerType, actions, accountId, description, title } = params;

    const createdBy = await this.usersRepository.findById(params.accountId);
    if (!createdBy) {
      throw new UserNotFoundError(params.accountId);
    }

    const workflow = Workflow.createNew(
      title,
      description,
      accountId,
      triggerType
    );
    for (const [_, node] of Object.entries(actions)) {
      workflow.addAction(node);
    }

    await this.workflowsRepository.create(workflow);

    return {
      workflowId: workflow.id,
    };
  }
}
