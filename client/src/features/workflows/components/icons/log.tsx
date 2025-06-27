import { defaultIconProps, type IconProps } from "./globe";

export const LogIcon = (props: IconProps = defaultIconProps) => {
  const { className, size, strokeWidth } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={"none"}
    >
      <path
        d="M12 5.5L21 5.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      ></path>
      <path
        d="M12 12L21 12"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      ></path>
      <path
        d="M12 18.5L21 18.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      ></path>
      <path
        d="M8 5.5H3M4.04167 8L6.95833 3M6.95833 8L4.04167 3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M8 18.5H3M4.04167 21L6.95833 16M6.95833 21L4.04167 16"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
