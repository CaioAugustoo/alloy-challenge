import { Handle, Position, type Node } from "@xyflow/react";
import { memo } from "react";
import { TimeIcon } from "./icons/time";

type DelayNodeData = {
  label: string;
  params: {
    ms: number;
  };
};

type DelayNodeProps = Node<DelayNodeData> & {
  isConnectable: boolean;
};

export default memo(({ data, isConnectable }: DelayNodeProps) => {
  return (
    <>
      <div className="flex items-center gap-2 text-left">
        <div className="border rounded-full border-zinc-300">
          <TimeIcon className="text-orange-500 h-6 w-6 m-0.5" />
        </div>

        <div>
          <span className="uppercase text-zinc-400 text-xs">{data.label}</span>
          <p className="font-medium text-sm truncate min-w-[200px] max-w-[250px]">
            Wait for {data.params.ms} milliseconds
          </p>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
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
