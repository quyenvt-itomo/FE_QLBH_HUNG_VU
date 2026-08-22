import { IconProps } from "../../utils/types/icon";

export const IconFilter: React.FC<IconProps> = ({ color }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6.5H10"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12.5H12"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12.5H21"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6.5L21 6.5"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 18.5H20"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18.5H6"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="8"
        cy="18.5"
        r="2"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
      />
      <circle
        cx="17"
        cy="12.5"
        r="2"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="6.5"
        r="2"
        stroke={color || "#A6A6A6"}
        strokeWidth="1.5"
      />
    </svg>
  );
};
