import { UserNotFoundError } from "../../domain/errors/user-not-found";
import type { UsersRepository } from "../../domain/repositories/users";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { ListWorkflowsUseCase as ListWorkflowsUseCaseInterface } from "../../domain/use-cases/list-workflows";

export class ListWorkflowsUseCase implements ListWorkflowsUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    params: ListWorkflowsUseCaseInterface.Params
  ): Promise<ListWorkflowsUseCaseInterface.Response> {
    const createdBy = await this.usersRepository.findById(params.accountId);
    if (!createdBy) {
      throw new UserNotFoundError(params.accountId);
    }

    const workflows = await this.workflowsRepository.listWorkflows(
      createdBy.id
    );

    return {
      workflows,
    };
  }
}
