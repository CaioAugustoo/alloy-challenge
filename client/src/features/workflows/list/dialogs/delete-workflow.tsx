import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";
import { WorkflowsService } from "../../../../services/workflows";
import Cookies from "js-cookie";
import { useState } from "react";
import { getErrorMessage } from "../../../../utils/get-error-message";

type DeleteWorkflowDialogProps = {
  isOpen: boolean;
  workflowId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function DeleteWorkflowDialog({
  isOpen,
  onClose,
  workflowId,
  onSuccess,
}: DeleteWorkflowDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = Cookies.get("accessToken") ?? "";

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const workflowsService = new WorkflowsService();
      await workflowsService.deleteWorkflow({ id: workflowId, accessToken });
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            workflow data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
