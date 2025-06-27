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
import {
  mapActionsToFlow,
  mapFlowToActions,
  type ActionItem,
} from "../../../utils/actions-mappers";
import type { Workflow } from "../list/card";
import { useInterval } from "usehooks-ts";
import { INTERVAL_TO_AUTO_SAVE } from "./constants";
import { SavingLabel } from "./saving-label";

const nodeTypes = {
  httpRequestNode: httpRequest,
  delayNode: delay,
  logNode: log,
};

type WorkflowProps = {
  data: Workflow;
  onSave: (actions: ActionItem[]) => void;
};

export function Workflow({ data, onSave }: WorkflowProps) {
  const mappedActions = useMemo(() => mapActionsToFlow(data.actions), [data]);

  const shouldSave = useKeyPress(["ctrl+s", "command+s", "Meta+s", "Strg+s"]);

  console.log(shouldSave);

  const [nodes, _, onNodesChange] = useNodesState(mappedActions.nodes);
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

  const fromReactFlowToActions = useMemo(
    () => mapFlowToActions(nodes, edges),
    [nodes, edges]
  );

  useEffect(() => {
    if (shouldSave) {
      onSave(fromReactFlowToActions);
    }
  }, [shouldSave]);

  useInterval(() => {
    onSave(fromReactFlowToActions);
  }, INTERVAL_TO_AUTO_SAVE);

  return (
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
        <SavingLabel />
      </ReactFlow>
    </div>
  );
}
