import { NotAuthorizedToDeleteWorkflowError } from "../../domain/errors/not-authorized-to-delete-workflow";
import { UserNotFoundError } from "../../domain/errors/user-not-found";
import { WorkflowNotFoundError } from "../../domain/errors/workflow-not-found";
import { UsersRepository } from "../../domain/repositories/users";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { DeleteWorkflowUseCase as DeleteWorkflowUseCaseInterface } from "../../domain/use-cases/delete-workflow";

export class DeleteWorkflowUseCase implements DeleteWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    params: DeleteWorkflowUseCaseInterface.Params
  ): Promise<DeleteWorkflowUseCaseInterface.Response> {
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
      throw new NotAuthorizedToDeleteWorkflowError(workflowId, accountId);
    }

    await this.workflowsRepository.delete(workflowId);
  }
}
