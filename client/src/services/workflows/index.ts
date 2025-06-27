import { env } from "../../env";
import type {
  NewWorkflowDTOInput,
  NewWorkflowDTOOutput,
} from "./create-workflow-dto";
import type { DeleteWorkflowDTOInput } from "./delete-workflow-dto";
import type {
  GetWorkflowDTOInput,
  GetWorkflowDTOOutput,
} from "./get-workflow-dto";
import type {
  GetWorkflowsDTOInput,
  GetWorkflowsDTOOutput,
} from "./get-workflows-dto";
import type { UpdateWorkflowDTOInput } from "./update-workflow-dto";

export class WorkflowsService {
  async getWorkflows(
    dto: GetWorkflowsDTOInput
  ): Promise<GetWorkflowsDTOOutput> {
    const response = await fetch(`${env.apiURL}/workflows`, {
      headers: {
        "Content-Type": "application/json",
        "access-token": dto.accessToken,
      },
      method: "GET",
    });

    const json = (await response.json()) as GetWorkflowsDTOOutput;
    if ("error" in json) {
      throw new Error(json.error);
    }
    return json;
  }

  async createWorkflow(
    dto: NewWorkflowDTOInput
  ): Promise<NewWorkflowDTOOutput> {
    const response = await fetch(`${env.apiURL}/workflows`, {
      headers: {
        "Content-Type": "application/json",
        "access-token": dto.accessToken,
      },
      method: "POST",
      body: JSON.stringify({
        triggerType: "webhook",
        actions: [],
        title: dto.title,
        description: dto.description,
      }),
    });

    const json = (await response.json()) as NewWorkflowDTOOutput;
    if ("error" in json) {
      throw new Error(json.error);
    }
    return json;
  }

  async deleteWorkflow(dto: DeleteWorkflowDTOInput): Promise<void> {
    await fetch(`${env.apiURL}/workflows/${dto.id}`, {
      headers: {
        "Content-Type": "application/json",
        "access-token": dto.accessToken,
      },
      method: "DELETE",
    });
  }

  async getWorkflow(dto: GetWorkflowDTOInput): Promise<GetWorkflowDTOOutput> {
    const response = await fetch(`${env.apiURL}/workflows/${dto.workflowId}`, {
      headers: {
        "Content-Type": "application/json",
        "access-token": dto.accessToken,
      },
      method: "GET",
    });

    const json = (await response.json()) as GetWorkflowDTOOutput;
    if ("error" in json) {
      throw new Error(json.error);
    }
    return json;
  }

  async updateWorkflow(dto: UpdateWorkflowDTOInput): Promise<void> {
    await fetch(`${env.apiURL}/workflows/${dto.workflowId}`, {
      headers: {
        "Content-Type": "application/json",
        "access-token": dto.accessToken,
      },
      method: "PUT",
      body: JSON.stringify({
        title: dto.title,
        description: dto.description,
        actions: dto.actions,
      }),
    });
  }
}
