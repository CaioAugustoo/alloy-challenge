import { UserNotFoundError } from "../../domain/errors/user-not-found";
import { WorkflowNotFoundError } from "../../domain/errors/workflow-not-found";
import { NotAllowedToGetWorkflowError } from "../../domain/errors/not-allowed-to-get-workflow";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { UsersRepository } from "../../domain/repositories/users";
import type { GetWorkflowUseCase as GetWorkflowUseCaseInterface } from "../../domain/use-cases/get-workflow";

export class GetWorkflowUseCase implements GetWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    params: GetWorkflowUseCaseInterface.Params
  ): Promise<GetWorkflowUseCaseInterface.Response> {
    const { workflowId, accountId } = params;

    const createdBy = await this.usersRepository.findById(accountId);
    if (!createdBy) {
      throw new UserNotFoundError(accountId);
    }

    const workflow = await this.workflowsRepository.findById(workflowId);
    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    if (workflow.createdBy !== accountId) {
      throw new NotAllowedToGetWorkflowError(workflowId, accountId);
    }

    return {
      workflow: {
        id: workflow.id,
        triggerType: workflow.triggerType,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        actions: workflow.getActions(),
      },
    };
  }
}
