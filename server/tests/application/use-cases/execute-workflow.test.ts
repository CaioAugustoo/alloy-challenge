import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import {
  ActionHandler,
  ExecuteWorkflowUseCase,
} from "../../../src/application/use-cases/execute-workflow";
import { WorkflowNotFoundError } from "../../../src/domain/errors/workflow-not-found";
import { WorkflowHasNoActionsError } from "../../../src/domain/errors/workflow-has-no-actions";
import { NoWorkflowHandlerError } from "../../../src/domain/errors/no-workflow-handler";
import { FailedExecuteWorkflowError } from "../../../src/domain/errors/failed-execute-workflow";
import * as timing from "../../../src/shared/timing/sleep";

const fakeWorkflow = {
  id: "wf-1",
  entryActionId: "action-1",
  getAction: vi.fn(),
};

describe("ExecuteWorkflowUseCase", () => {
  let workflowsRepository: any;
  let executionsRepository: any;
  let logsRepository: any;
  let handlers: Record<string, ActionHandler>;
  let handler: ActionHandler;
  let useCase: ExecuteWorkflowUseCase;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(timing, "sleep").mockResolvedValue(undefined);
    workflowsRepository = {
      findById: vi.fn(),
    };
    logsRepository = {
      create: vi.fn(),
    };
    executionsRepository = {
      find: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };
    handler = { handle: vi.fn() };
    handlers = {
      log: handler,
    };
    useCase = new ExecuteWorkflowUseCase(
      workflowsRepository,
      executionsRepository,
      logsRepository,
      handlers
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should throw WorkflowNotFoundError if workflow does not exist", async () => {
    workflowsRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ workflowId: "wf-1", executionId: "exec-1" })
    ).rejects.toThrow(WorkflowNotFoundError);
  });

  test("should throw WorkflowHasNoActionsError if entryActionId is undefined", async () => {
    workflowsRepository.findById.mockResolvedValue({
      ...fakeWorkflow,
      entryActionId: undefined,
    });
    executionsRepository.find.mockResolvedValue(null);

    await expect(
      useCase.execute({ workflowId: "wf-1", executionId: "exec-1" })
    ).rejects.toThrow(WorkflowHasNoActionsError);
  });

  test("should throw NoWorkflowHandlerError if no handler is registered", async () => {
    workflowsRepository.findById.mockResolvedValue(fakeWorkflow);
    executionsRepository.find.mockResolvedValue(null);

    fakeWorkflow.getAction.mockReturnValue({
      action_id: "action-1",
      type: "delay",
      params: {},
    });

    useCase = new ExecuteWorkflowUseCase(
      workflowsRepository,
      executionsRepository,
      logsRepository,
      {}
    );

    await expect(
      useCase.execute({ workflowId: "wf-1", executionId: "exec-1" })
    ).rejects.toThrow(NoWorkflowHandlerError);
  });

  test("should retry on failure and throw after max retries", async () => {
    workflowsRepository.findById.mockResolvedValue(fakeWorkflow);
    executionsRepository.find.mockResolvedValue(null);
    fakeWorkflow.getAction.mockReturnValue({
      action_id: "action-1",
      type: "log",
      params: {},
    });

    vi.spyOn(handler, "handle").mockRejectedValue(new Error("fail"));

    await expect(
      useCase.execute({
        workflowId: "wf-1",
        executionId: "exec-1",
        maxRetries: 1,
        backoffBaseMs: 100,
      })
    ).rejects.toThrow(FailedExecuteWorkflowError);

    expect(handler.handle).toHaveBeenCalledTimes(2);
  });

  test("should execute successfully on first attempt", async () => {
    workflowsRepository.findById.mockResolvedValue(fakeWorkflow);
    executionsRepository.find.mockResolvedValue(null);
    fakeWorkflow.getAction.mockReturnValue({
      action_id: "action-1",
      type: "log",
      params: {},
    });

    vi.spyOn(handler, "handle").mockResolvedValue(undefined);

    await useCase.execute({
      workflowId: "wf-1",
      executionId: "exec-1",
    });

    expect(handler.handle).toHaveBeenCalledTimes(1);
  });
});
