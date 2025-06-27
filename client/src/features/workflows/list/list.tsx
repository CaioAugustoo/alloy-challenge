import React, { useEffect, useState } from "react";
import { WorkflowsService } from "../../../services/workflows";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { getErrorMessage } from "../../../utils/get-error-message";
import { WorkflowCard, type Workflow } from "./card";
import { Empty } from "./empty";
import { NewWorkflowDialog } from "./dialogs/new-workflow";
import { DeleteWorkflowDialog } from "./dialogs/delete-workflow";

type WorkflowsListProps = {
  setIsNewWorkflowDialogOpen: (isOpen: boolean) => void;
  isNewWorkflowDialogOpen: boolean;
};

export function WorkflowsList({
  isNewWorkflowDialogOpen,
  setIsNewWorkflowDialogOpen,
}: WorkflowsListProps) {
  const accessToken = Cookies.get("accessToken") ?? "";
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowToDeleteId, setWorkflowToDeleteId] = useState("");

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setIsLoading(true);
        const workflowsService = new WorkflowsService();
        const res = await workflowsService.getWorkflows({ accessToken });
        if ("workflows" in res) {
          setWorkflows(res.workflows);
        }
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }
    fetchWorkflows();
  }, [accessToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      {workflows.length === 0 && !isLoading && (
        <Empty setIsDialogOpen={setIsNewWorkflowDialogOpen} />
      )}

      {workflows.length > 0 && (
        <React.Fragment>
          <DeleteWorkflowDialog
            isOpen={!!workflowToDeleteId}
            workflowId={workflowToDeleteId}
            onClose={() => setWorkflowToDeleteId("")}
            onSuccess={() => {
              setWorkflows((prev) =>
                prev.filter((w) => w.id !== workflowToDeleteId)
              );
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                {...workflow}
                onDelete={(id) => {
                  setWorkflowToDeleteId(id);
                }}
              />
            ))}
          </div>
        </React.Fragment>
      )}

      <NewWorkflowDialog
        isOpen={isNewWorkflowDialogOpen}
        onClose={() => setIsNewWorkflowDialogOpen(false)}
        onSuccess={(data) => {
          const newWorkflow: Workflow = {
            id: data.id,
            title: data.title,
            description: data.description,
            created_at: new Date().toString(),
          };
          setWorkflows((prev) => [newWorkflow, ...prev]);
        }}
      />
    </section>
  );
}
