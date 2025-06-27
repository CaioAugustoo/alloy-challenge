import { Handle, Position, type Node } from "@xyflow/react";
import { memo } from "react";
import { GlobeIcon } from "../icons/globe";

type HTTPRequestNodeData = {
  label: string;
  params: {
    url: string;
    method: string;
    metadata: {
      [key: string]: string;
    };
  };
};

type HTTPRequestNodeProps = Node<HTTPRequestNodeData> & {
  isConnectable: boolean;
};

export default memo(({ data, isConnectable }: HTTPRequestNodeProps) => {
  return (
    <>
      <div className="flex items-center gap-2 text-left">
        <div className="border rounded-full border-zinc-300">
          <GlobeIcon className="text-rose-500 h-6 w-6 m-0.5" />
        </div>

        <div>
          <span className="uppercase text-zinc-400 text-xs">{data.label}</span>
          <p className="font-medium text-sm truncate min-w-[150px] max-w-[250px]">
            Send a {data.params.method} request to{" "}
            <span className="font-bold text-rose-500">{data.params.url}</span>
          </p>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});
