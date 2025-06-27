import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useKeyPress,
  useNodesState,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import httpRequest from "./nodes/http-request";
import delay from "./nodes/delay";
import { useCallback, useEffect, useMemo } from "react";
import log from "./nodes/log";
import type { Workflow } from "../list/card";
import {
  mapActionsToFlow,
  mapFlowToActions,
  type ActionItem,
  type CustomNode,
} from "../../../utils/actions-mappers";
import { SavingLabel } from "./saving-label";
import { useInterval } from "usehooks-ts";
import { INTERVAL_TO_AUTO_SAVE } from "./constants";
import { SpeedDial } from "./speed-dial";
import { toast } from "sonner";

const nodeTypes: Record<string, any> = {
  httpRequestNode: httpRequest,
  delayNode: delay,
  logNode: log,
};

type WorkflowProps = {
  data: Workflow;
  isSaving: boolean;
  onSave: (actions: ActionItem[]) => void;
};

export function Workflow({ data, onSave, isSaving }: WorkflowProps) {
  const mappedActions = useMemo(() => mapActionsToFlow(data.actions), [data]);
  const shouldSave = useKeyPress(["ctrl+s", "command+s", "Meta+s", "Strg+s"]);

  const [nodes, setNodes, onNodesChange] = useNodesState(mappedActions.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(mappedActions.edges);

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = useCallback(
    (node: CustomNode) => {
      setNodes((ns) => [...ns, node]);
    },
    [setNodes]
  );

  const fromReactFlowToActions = useMemo(
    () => mapFlowToActions(nodes, edges),
    [nodes, edges]
  );

  useEffect(() => {
    if (shouldSave) {
      onSave(fromReactFlowToActions);
      toast.success("Workflow saved successfully");
    }
  }, [shouldSave]);

  useInterval(() => {
    onSave(fromReactFlowToActions);
  }, INTERVAL_TO_AUTO_SAVE);

  return (
    <>
      <div className="w-screen h-screen">
        <ReactFlow
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Controls />
          <MiniMap />
          <Background
            bgColor="#FFF"
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
          />
          <SavingLabel isSaving={isSaving} />
          <SpeedDial addNode={addNode} />
        </ReactFlow>
      </div>
    </>
  );
}
