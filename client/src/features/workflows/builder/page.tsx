import { Header } from "./header";
import Cookies from "js-cookie";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { WorkflowsService } from "../../../services/workflows";
import { Workflow as Builder } from "./builder";
import type { Workflow } from "../list/card";
import { toast } from "sonner";
import { getErrorMessage } from "../../../utils/get-error-message";
import type { ActionItem } from "../../../utils/actions-mappers";

const workflowsService = new WorkflowsService();

export function WorkflowPage() {
  const accessToken = Cookies.get("accessToken") ?? "";
  const { id } = useParams();

  const [workflow, setWorkflow] = useState<Workflow | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchWorkflow() {
      try {
        if (!id) return;
        setIsLoading(true);
        const res = await workflowsService.getWorkflow({
          workflowId: id,
          accessToken,
        });
        if ("workflow" in res) {
          setWorkflow(res.workflow);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflow();
  }, [accessToken, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  const saveWorkflow = async (actions: ActionItem[]) => {
    try {
      await workflowsService.updateWorkflow({
        workflowId: workflow.id,
        title: workflow.title,
        description: workflow.description,
        actions: actions,
        accessToken,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <Header workflow={workflow} />

      <div className="w-screen h-screen">
        <Builder data={workflow} onSave={saveWorkflow} />
      </div>
    </div>
  );
}
