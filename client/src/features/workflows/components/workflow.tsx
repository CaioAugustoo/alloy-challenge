import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useCallback } from "react";
import httpRequest from "./nodes/http-request";
import delay from "./nodes/delay";
import log from "./nodes/log";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "httpRequestNode",
    data: {
      label: "Http Request",
      params: {
        url: "https://example.com",
        method: "GET",
        metadata: {
          "content-type": "application/json",
        },
      },
    },
  },
  {
    id: "2",
    type: "delayNode",
    position: { x: 400, y: 0 },
    data: {
      label: "Delay",
      params: {
        ms: 1000,
      },
    },
  },
  {
    id: "3",
    type: "logNode",
    position: { x: 750, y: 0 },
    data: {
      label: "Log",
      params: {
        content: "Hello World!",
      },
    },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = {
  httpRequestNode: httpRequest,
  delayNode: delay,
  logNode: log,
};

export function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

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
      >
        <Controls />
        <MiniMap />
        <Background
          bgColor="#FFF"
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </div>
  );
}
