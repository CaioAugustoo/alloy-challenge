import type { Workflow } from "../../features/workflows/list/card";

export type GetWorkflowDTOInput = {
  workflowId: string;
  accessToken: string;
};

export type GetWorkflowDTOOutput =
  | {
      workflow: Workflow;
    }
  | {
      error: string;
    };
