import { useState } from "react";
import { WorkflowsList } from "./list";
import { Button } from "../../../components/ui/button";
import { PlusIcon } from "lucide-react";

export const WorkflowsListPage = () => {
  const [isNewWorkflowDialogOpen, setIsNewWorkflowDialogOpen] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Workflows</h1>
          <p className="text-muted-foreground">A list of all your workflows</p>
        </div>

        <Button onClick={() => setIsNewWorkflowDialogOpen(true)}>
          <span>Create workflow</span>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <WorkflowsList
        isNewWorkflowDialogOpen={isNewWorkflowDialogOpen}
        setIsNewWorkflowDialogOpen={setIsNewWorkflowDialogOpen}
      />
    </div>
  );
};
