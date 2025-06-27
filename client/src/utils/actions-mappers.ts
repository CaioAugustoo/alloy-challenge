import type { Edge } from "@xyflow/react";

export type ActionItem = {
  action_id: string;
  type: string;
  params: any;
  next_ids?: string[];
};

export type CustomNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    params: any;
  };
};

export type CustomEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

function topoSortArray(actionsArr: ActionItem[]): string[] {
  const actionsMap: Record<string, ActionItem> = {};
  actionsArr.forEach((a) => {
    actionsMap[a.action_id] = a;
  });

  const inDegree: Record<string, number> = {};
  actionsArr.forEach((a) => {
    inDegree[a.action_id] = 0;
  });
  actionsArr.forEach((a) => {
    (a.next_ids || []).forEach((nxt) => {
      inDegree[nxt] = (inDegree[nxt] || 0) + 1;
    });
  });

  const queue = Object.entries(inDegree)
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);

  const sorted: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const nxt of actionsMap[id].next_ids || []) {
      inDegree[nxt]!--;
      if (inDegree[nxt] === 0) queue.push(nxt);
    }
  }

  if (sorted.length !== actionsArr.length) {
    console.warn("topoSortArray: dependency cycle detected");
  }
  return sorted;
}

export function mapActionsToFlow(actionsArr: ActionItem[]): {
  nodes: CustomNode[];
  edges: Edge[];
} {
  const spacingX = 400;

  const sortedIds = topoSortArray(actionsArr);

  const typeMap: Record<string, string> = {
    log: "logNode",
    delay: "delayNode",
    http: "httpRequestNode",
  };

  const nodes: CustomNode[] = sortedIds.map((id, idx) => {
    const act = actionsArr.find((a) => a.action_id === id)!;
    return {
      id,
      type: typeMap[act.type] || "default",
      position: { x: idx * spacingX, y: 0 },
      data: { label: act.type.toUpperCase(), params: act.params },
    };
  });

  const edges: Edge[] = actionsArr.flatMap((act) =>
    (act.next_ids || []).map((nxt) => ({
      id: `${act.action_id}-${nxt}`,
      source: act.action_id,
      target: nxt,
      animated: true,
    }))
  );

  return { nodes, edges };
}

export function mapFlowToActions(
  nodes: CustomNode[],
  edges: Edge[]
): ActionItem[] {
  const actionsMap: Record<string, ActionItem> = {};
  const typeMap: Record<string, string> = {
    logNode: "log",
    delayNode: "delay",
    httpRequestNode: "http",
  };

  nodes.forEach((node) => {
    actionsMap[node.id] = {
      action_id: node.id,
      type: typeMap[node.type] || "unknown",
      params: node.data.params,
      next_ids: [],
    };
  });

  edges.forEach(({ source, target }) => {
    if (actionsMap[source]) {
      actionsMap[source].next_ids!.push(target);
    }
  });

  Object.values(actionsMap).forEach((a) => {
    if (a.next_ids && a.next_ids.length === 0) {
      delete a.next_ids;
    }
  });

  return Object.values(actionsMap);
}
