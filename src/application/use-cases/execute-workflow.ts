import { FailedExecuteWorkflowError } from "../../domain/errors/failed-execute-workflow";
import { WorkflowNotFoundError } from "../../domain/errors/workflow-not-found";
import { NoWorkflowHandlerError } from "../../domain/errors/no-workflow-handler";
import { sleep } from "../../shared/timing/sleep";
import { v4 as uuid } from "uuid";
import { WorkflowExecutionLog } from "../../domain/entities/log";
import { WorkflowHasNoActionsError } from "../../domain/errors/workflow-has-no-actions";
import { type ActionNode } from "../../domain/entities/workflow";
import type { WorkflowsRepository } from "../../domain/repositories/workflows";
import type { ExecuteWorkflowUseCase as ExecuteWorkflowUseCaseInterface } from "../../domain/use-cases/execute-workflow";
import type {
  ExecutionsRepository,
  ExecutionState,
} from "../../domain/repositories/executions";
import type { LogsRepository } from "../../domain/repositories/logs";

export interface ActionHandler {
  handle(node: ActionNode): Promise<any>;
}

export class ExecuteWorkflowUseCase implements ExecuteWorkflowUseCaseInterface {
  constructor(
    private readonly workflowsRepository: WorkflowsRepository,
    private readonly executionsRepository: ExecutionsRepository,
    private readonly logsRepository: LogsRepository,
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

    const workflow = await this.workflowsRepository.findById(workflowId);
    if (!workflow) {
      throw new WorkflowNotFoundError(workflowId);
    }

    let state = await this.loadOrCreateExecution(workflowId, executionId);
    if (state.completed) {
      return state;
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
      let success = false;
      let lastError: Error | undefined;

      while (attempt <= maxRetries) {
        try {
          await handler.handle(node);
          success = true;
          break;
        } catch (err: any) {
          lastError = err;

          if (attempt === maxRetries) {
            break;
          }
          const delay = backoffBaseMs * 2 ** (attempt - 1);
          await sleep(delay);
          attempt++;
        }
      }

      state.retries[currentId] = attempt;

      if (success) {
        await this.saveLog({
          workflowId,
          executionId: state.executionId,
          actionId: currentId,
          status: "success",
          attempt,
          message: undefined,
        });
      } else {
        const promises = [
          this.saveLog({
            workflowId,
            executionId: state.executionId,
            actionId: currentId,
            status: "failed",
            attempt,
            message: lastError?.message ?? "unknown error",
          }),
          this.saveState(state),
        ];
        await Promise.all(promises);
        throw new FailedExecuteWorkflowError(
          currentId,
          lastError?.message ?? ""
        );
      }

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

  private async saveState(state: ExecutionState) {
    state.updatedAt = new Date();
    await this.executionsRepository.update(state);
  }

  private async saveLog(params: {
    workflowId: string;
    executionId: string;
    actionId: string;
    status: "success" | "failed" | "skipped";
    attempt: number;
    message?: string;
  }) {
    const { workflowId, executionId, actionId, status, attempt, message } =
      params;

    const log = WorkflowExecutionLog.createNew({
      workflowId,
      executionId,
      actionId,
      status,
      attempt,
      message,
    });
    await this.logsRepository.create(log);
  }
}
