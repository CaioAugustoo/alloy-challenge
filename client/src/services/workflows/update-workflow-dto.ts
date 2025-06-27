export type UpdateWorkflowDTOInput = {
  title: string;
  description: string;
  workflowId: string;
  actions: Record<string, any>;
  accessToken: string;
};

export type UpdateWorkflowDTOOutput = void;
