import { ArrowRight, Trash } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { useNavigate } from "react-router";
import { formatDate } from "../../../utils/format-date";

export type Workflow = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  actions: Record<string, any>;
};

type WorkflowCardProps = Workflow & {
  onDelete: (id: string) => void;
};

export const WorkflowCard = (props: WorkflowCardProps) => {
  const navigate = useNavigate();
  const { onDelete, ...workflow } = props;

  return (
    <Card
      key={workflow.id}
      className="hover:shadow-lg transition-shadow duration-200 pb-0 justify-between"
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {workflow.title}
        </CardTitle>
        <CardDescription>{workflow.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <div className="flex items-center text-sm text-muted-foreground px-6">
          <span className="font-medium">Created:</span>
          <span className="ml-2">{formatDate(workflow.created_at)}</span>
        </div>
        <div className="bg-zinc-50 px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={() => {
                navigate(`/workflow/${workflow.id}`);
              }}
            >
              <span>Go to Workflow</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(workflow.id)}
            >
              <span>Delete</span>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
