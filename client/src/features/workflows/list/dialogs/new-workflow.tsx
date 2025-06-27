import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
import { toast } from "sonner";
import { getErrorMessage } from "../../../../utils/get-error-message";
import { WorkflowsService } from "../../../../services/workflows";
import Cookies from "js-cookie";
import type { NewWorkflowDTOInput } from "../../../../services/workflows/create-workflow-dto";

export type OnSuccessParams = {
  id: string;
} & Omit<NewWorkflowDTOInput, "accessToken">;

type NewWorkflowDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: OnSuccessParams) => void;
};

export function NewWorkflowDialog({
  isOpen,
  onClose,
  onSuccess,
}: NewWorkflowDialogProps) {
  const accessToken = Cookies.get("accessToken") ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const workflowsService = new WorkflowsService();
      const res = await workflowsService.createWorkflow({
        title,
        description,
        accessToken,
      });
      if ("workflowId" in res) {
        onSuccess({ title, description, id: res.workflowId });
        toast.success("Workflow created successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setTitle("");
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Workflow</DialogTitle>
          <DialogDescription>
            Create a new workflow and start building your automation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="Title"
              value={title}
              placeholder="My Workflow"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Workflow created for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
