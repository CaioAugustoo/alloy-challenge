import { Header } from "../components/header";
import { Workflow } from "../components/workflow";

export function WorkflowPage() {
  return (
    <div>
      <Header />

      <div className="w-screen h-screen">
        <Workflow />
      </div>
    </div>
  );
}
