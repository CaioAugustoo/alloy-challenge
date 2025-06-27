import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/utils";

type SavingLabelProps = {
  isSaving: boolean;
};

export const SavingLabel = ({ isSaving }: SavingLabelProps) => {
  return (
    <div
      className={cn(
        "fixed bottom-5 left-15 opacity-100 flex items-center gap-1 rounded-sm border border-slate-100 bg-white px-2 py-1 duration-100",
        {
          "opacity-0 pointer-events-none": !isSaving,
        }
      )}
    >
      <Loader2 className="animate-spin" size={15} />
      <p className="text-sm text-black">Saving</p>
    </div>
  );
};
