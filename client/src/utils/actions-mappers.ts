type RawActions = Record<
  string,
  {
    action_id: string;
    type: string;
    params: any;
    next_ids?: string[];
  }
>;

type RFNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    params: any;
  };
};

type RFEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
};

function topoSort(actions: RawActions): string[] {
  const inDegree: Record<string, number> = {};
  Object.keys(actions).forEach((id) => (inDegree[id] = 0));

  for (const act of Object.values(actions)) {
    (act.next_ids || []).forEach((nxt) => {
      inDegree[nxt] = (inDegree[nxt] ?? 0) + 1;
    });
  }

  const queue: string[] = Object.entries(inDegree)
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);

  const sorted: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const nxt of actions[id].next_ids || []) {
      inDegree[nxt]!--;
      if (inDegree[nxt] === 0) queue.push(nxt);
    }
  }

  if (sorted.length !== Object.keys(actions).length) {
    console.warn("topoSort: dependency cycle detected");
  }

  return sorted;
}

export function mapActionsToFlow(actions: RawActions): {
  nodes: RFNode[];
  edges: RFEdge[];
} {
  const spacingX = 400;
  const sortedIds = topoSort(actions);

  const nodes: RFNode[] = sortedIds.map((id, idx) => {
    const act = actions[id];
    const typeMap: Record<string, string> = {
      log: "logNode",
      delay: "delayNode",
      http: "httpRequestNode",
    };

    return {
      id: act.action_id,
      type: typeMap[act.type] || "default",
      position: {
        x: idx * spacingX,
        y: 0,
      },
      data: {
        label: act.type.toUpperCase(),
        params: act.params,
      },
    };
  });

  const edges: RFEdge[] = Object.values(actions).flatMap((act) =>
    (act.next_ids || []).map((nxt) => ({
      id: `${act.action_id}-${nxt}`,
      source: act.action_id,
      target: nxt,
      animated: true,
    }))
  );

  return { nodes, edges };
}

export type ActionItem = {
  action_id: string;
  type: string;
  params: any;
  next_ids?: string[];
};

export function mapFlowToActions(
  nodes: RFNode[],
  edges: RFEdge[]
): ActionItem[] {
  const actionsMap: Record<string, ActionItem> = {};

  for (const node of nodes) {
    const typeMap: Record<string, string> = {
      logNode: "log",
      delayNode: "delay",
      httpRequestNode: "http",
    };

    actionsMap[node.id] = {
      action_id: node.id,
      type: typeMap[node.type] || "unknown",
      params: node.data.params,
      next_ids: [],
    };
  }

  for (const { source, target } of edges) {
    if (actionsMap[source]) {
      actionsMap[source].next_ids!.push(target);
    }
  }

  for (const key in actionsMap) {
    if (actionsMap[key].next_ids!.length === 0) {
      delete actionsMap[key].next_ids;
    }
  }

  return Object.values(actionsMap);
}
