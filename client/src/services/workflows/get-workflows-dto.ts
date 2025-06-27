import type { Workflow } from "../../features/workflows/list/card";

export type GetWorkflowsDTOInput = {
  accessToken: string;
};

export type GetWorkflowsDTOOutput =
  | {
      workflows: Workflow[];
    }
  | {
      error: string;
    };
