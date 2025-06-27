import React from "react";
import { cn } from "../lib/utils";

interface EmptyProps {
  title: string;
  description: React.ReactNode | string;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Empty = ({
  title,
  description,
  className,
  icon,
  children,
}: EmptyProps) => {
  return (
    <div
      className={cn(
        "flex items-center flex-col justify-center rounded-sm w-full h-72 bg-zinc-50",
        className
      )}
    >
      <div className="space-y-6 flex flex-col justify-center items-center">
        <div className="space-y-2 flex items-center flex-col">
          {!!icon && icon}

          <h4 className="text-xl font-semibold dark:text-zinc-200">{title}</h4>
          {typeof description === "string" ? (
            <p className="text-sm text-zinc-500">{description}</p>
          ) : (
            description
          )}
        </div>

        {children}
      </div>
    </div>
  );
};
