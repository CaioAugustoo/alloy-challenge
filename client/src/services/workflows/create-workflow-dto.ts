export type NewWorkflowDTOInput = {
  title: string;
  description: string;
  accessToken: string;
};

export type NewWorkflowDTOOutput =
  | {
      error: string;
    }
  | {
      workflowId: string;
    };
