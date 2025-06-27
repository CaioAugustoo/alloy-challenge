import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useNavigate } from "react-router";

export function Header() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 w-full bg-white border-b z-50">
      <div className="flex items-center gap-3 px-6 py-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg text-gray-900">
                Worfklow 570537e2-cfff-49a6-9273-0a013e861bf5
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6">
        <Tabs defaultValue="workflow" className="w-full">
          <TabsList className="h-10 bg-transparent p-0 border-b-0">
            <TabsTrigger
              onClick={() => navigate("/workflow")}
              value="workflow"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-rose-500 data-[state=active]:rounded-none px-4 py-2 font-medium"
            >
              Workflow
            </TabsTrigger>
            <TabsTrigger
              onClick={() => navigate("/workflow/logs")}
              value="logs"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-rose-500 data-[state=active]:rounded-none px-4 py-2 font-medium"
            >
              <span className="flex items-center gap-2">Logs</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
