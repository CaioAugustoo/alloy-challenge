import { Empty as EmptyComponent } from "../../../components/empty";
import { Ghost } from "lucide-react";
import { Button } from "../../../components/ui/button";

type EmptyProps = {
  setIsDialogOpen: (isOpen: boolean) => void;
};

export const Empty = ({ setIsDialogOpen }: EmptyProps) => {
  return (
    <div>
      <EmptyComponent
        icon={<Ghost size={38} strokeWidth={1.5} />}
        title="No workflows"
        description="You haven't created any workflows yet"
      >
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Create workflow
        </Button>
      </EmptyComponent>
    </div>
  );
};
