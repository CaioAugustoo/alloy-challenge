export const initialNodes = [
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
export const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
