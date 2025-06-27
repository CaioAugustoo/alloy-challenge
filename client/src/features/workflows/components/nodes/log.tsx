import { Handle, Position, type Node } from "@xyflow/react";
import { memo } from "react";
import { LogIcon } from "../icons/log";

type LogNodeData = {
  label: string;
  params: {
    content: string;
  };
};

type LogNodeProps = Node<LogNodeData> & {
  isConnectable: boolean;
};

export default memo(({ data, isConnectable }: LogNodeProps) => {
  return (
    <>
      <div className="flex items-center gap-2 text-left">
        <div className="border rounded-full border-zinc-300">
          <LogIcon className="text-purple-500 h-6 w-6 m-0.5" />
        </div>

        <div>
          <span className="uppercase text-zinc-400 text-xs">{data.label}</span>
          <p className="font-medium text-sm truncate min-w-[150px] max-w-[250px]">
            Log{" "}
            <span className="font-bold text-purple-500">
              {data.params.content}
            </span>
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
