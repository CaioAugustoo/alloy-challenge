import { FailedExecuteWorkflowError } from "../../domain/errors/failed-execute-workflow";
import { WorkflowNotFoundError } from "../../domain/errors/workflow-not-found";
import { NoWorkflowHandlerError } from "../../domain/errors/no-workflow-handler";
import { sleep } from "../../shared/timing/sleep";
import { v4 as uuid } from "uuid";
import { type ActionNode } from "../../domain/entities/workflow";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { ExecuteWorkflowUseCase as ExecuteWorkflowUseCaseInterface } from "../../domain/use-cases/execute-workflow";
import type {
  ExecutionsRepository,
  ExecutionState,
} from "../../domain/repositories/executions";
import { WorkflowHasNoActionsError } from "../../domain/errors/workflow-has-no-actions";

export interface ActionHandler {
  handle(node: ActionNode): Promise<any>;
}

export class ExecuteWorkflowUseCase implements ExecuteWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly executionsRepository: ExecutionsRepository,
    private readonly handlers: Record<string, ActionHandler>
  ) {}

  async execute(
    params: ExecuteWorkflowUseCaseInterface.Params
  ): Promise<ExecuteWorkflowUseCaseInterface.Response> {
    const {
      workflowId,
      executionId,
      maxRetries = 3,
      backoffBaseMs = 500,
    } = params;

    let state = await this.loadOrCreateExecution(workflowId, executionId);
    if (state.completed) {
      return state;
    }

    const workflow = await this.workflowsRepository.findById(workflowId);
    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    while (!state.completed) {
      const currentId = state.currentActionId ?? workflow.entryActionId;
      if (!currentId) {
        throw new WorkflowHasNoActionsError(workflowId);
      }

      const node = workflow.getAction(currentId);

      const handler = this.handlers[node.type];
      if (!handler) {
        throw new NoWorkflowHandlerError(node.type);
      }

      console.log(`Executing action "${node.type}"`);

      let attempt = state.retries[currentId] ?? 0;

      const success = await this.executeWithRetry(
        handler,
        node,
        currentId,
        state,
        maxRetries,
        backoffBaseMs,
        attempt
      );

      if (!success) {
        await this.saveState(state);
        console.log(`Action "${node.type}" failed`);
        throw new FailedExecuteWorkflowError(currentId);
      }

      console.log(`Action "${node.type}" succeeded`);

      const [nextId] = node.next_ids ?? [];
      state.currentActionId = nextId;
      state.completed = !nextId;

      await this.saveState(state);
    }

    return state;
  }

  private async loadOrCreateExecution(workflowId: string, executionId: string) {
    let state = await this.executionsRepository.find(workflowId, executionId);
    if (!state) {
      const now = new Date();
      state = {
        workflowId,
        executionId: uuid(),
        currentActionId: undefined,
        completed: false,
        retries: {},
        startedAt: now,
        updatedAt: now,
      };
      await this.executionsRepository.create(state);
    }
    return state;
  }

  private async executeWithRetry(
    handler: ActionHandler,
    node: ActionNode,
    currentId: string,
    state: ExecutionState,
    maxRetries: number,
    backoffBaseMs: number,
    attempt = 0
  ): Promise<boolean> {
    while (attempt <= maxRetries) {
      try {
        await handler.handle(node);
        return true;
      } catch {
        attempt++;
        state.retries[currentId] = attempt;

        if (attempt > maxRetries) return false;

        const delay = backoffBaseMs * Math.pow(2, attempt - 1);
        await sleep(delay);
      }
    }

    return false;
  }

  private async saveState(state: ExecutionState) {
    state.updatedAt = new Date();
    await this.executionsRepository.update(state);
  }
}
