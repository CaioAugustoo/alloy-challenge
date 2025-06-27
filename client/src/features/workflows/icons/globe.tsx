import { cn } from "../../../lib/utils";

export type IconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
};

export const defaultIconProps: IconProps = {
  className: "",
  size: 20,
  strokeWidth: 1,
};

export const GlobeIcon = (props: IconProps = defaultIconProps) => {
  const { className, size, strokeWidth } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={"none"}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      ></circle>
      <path
        d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      ></path>
      <path
        d="M21 15H3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M21 9H3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
