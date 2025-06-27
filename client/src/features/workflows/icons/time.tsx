import { cn } from "../../../lib/utils";
import { defaultIconProps, type IconProps } from "./globe";

export const TimeIcon = (props: IconProps = defaultIconProps) => {
  const { className, size, strokeWidth } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("w-6 h-6", className)}
      width={size}
      height={size}
      fill={"none"}
    >
      <path
        d="M18.0104 7.48959L19.5 6M20.5 13.5C20.5 18.1944 16.6944 22 12 22C7.30558 22 3.5 18.1944 3.5 13.5C3.5 8.80558 7.30558 5 12 5C16.6944 5 20.5 8.80558 20.5 13.5Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 19C8.96243 19 6.5 16.5376 6.5 13.5C6.5 10.4624 8.96243 8 12 8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M14.5 2H9.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 13.5L15.5 10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
