import { useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { GlobeIcon, type IconProps } from "./icons/globe";
import { TimeIcon } from "./icons/time";
import { LogIcon } from "./icons/log";
import type { CustomNode } from "../../../utils/actions-mappers";

type Action = CustomNode & {
  icon: (props?: IconProps) => JSX.Element;
  color: string;
  label: string;
};

const getId = () => (new Date().getTime() * Math.random() * 100).toString();

const speedDialActions: Action[] = [
  {
    icon: GlobeIcon,
    label: "HTTP Request",
    color: "bg-rose-500 hover:bg-rose-600",
    id: getId(),
    type: "httpRequestNode",
    position: { x: 0, y: 0 },
    data: {
      label: "http",
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
    id: getId(),
    icon: TimeIcon,
    label: "Delay",
    color: "bg-orange-500 hover:bg-orange-600",
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
    id: getId(),
    icon: LogIcon,
    label: "Log",
    position: { x: 750, y: 0 },
    type: "logNode",
    color: "bg-purple-500 hover:bg-purple-600",
    data: {
      label: "Log",
      params: {
        message: "Hello World!",
      },
    },
  },
];

type SpeedDialProps = {
  addNode: (node: CustomNode) => void;
};

export function SpeedDial({ addNode }: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action: Action) => {
    console.log(`${JSON.stringify(action)} clicked`);
    addNode(action);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <AnimatePresence>
          {isOpen && (
            <div className="absolute left-16 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {speedDialActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    y: 20,
                    transition: {
                      delay: (speedDialActions.length - index - 1) * 0.05,
                    },
                  }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: index * 0.1 + 0.1 },
                    }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap"
                  >
                    {action.label}
                  </motion.div>

                  <Button
                    size="icon"
                    className={`w-10 h-10 rounded-full shadow-lg ${action.color} text-white border-0`}
                    onClick={() => handleActionClick(action)}
                  >
                    <action.icon className="!w-5 !h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-white shadow-lg border-0"
            onClick={toggleSpeedDial}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <X className="!w-5 !h-5" />
              ) : (
                <Plus className="!w-5 !h-5" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 -z-10"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
