import { UserNotFoundError } from "../../domain/errors/user-not-found";
import { WorkflowNotFoundError } from "../../domain/errors/workflow-not-found";
import { NotAuthorizedToUpdateWorkflowError } from "../../domain/errors/not-authorized-to-update-workflow";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { UsersRepository } from "../../domain/repositories/users";
import type { UpdateWorkflowUseCase as UpdateWorkflowUseCaseInterface } from "../../domain/use-cases/update-workflow";

export class UpdateWorkflowUseCase implements UpdateWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(
    params: UpdateWorkflowUseCaseInterface.Params
  ): Promise<UpdateWorkflowUseCaseInterface.Response> {
    const { workflowId, actions, accountId, title, description } = params;

    const createdBy = await this.usersRepository.findById(accountId);
    if (!createdBy) {
      throw new UserNotFoundError(accountId);
    }

    const workflow = await this.workflowsRepository.findById(workflowId);
    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    if (workflow.createdBy !== accountId) {
      throw new NotAuthorizedToUpdateWorkflowError(workflowId, accountId);
    }

    workflow.updateActions(actions);
    workflow.setTitle(title);
    workflow.setDescription(description);

    await this.workflowsRepository.update(workflowId, workflow);
  }
}
