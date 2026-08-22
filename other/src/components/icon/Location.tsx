import { IconProps } from "../../utils/types/icon";

export const IconLocation: React.FC<IconProps> = ({ color }) => {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle opacity="0.3" cx="17.5" cy="17.5" r="17.5" fill="#E3E3E3" />
      <path
        d="M17.5 24.3C17.5 24.3 22.8217 19.5696 22.8217 16.0218C22.8217 13.0826 20.4391 10.7 17.5 10.7C14.5608 10.7 12.1782 13.0826 12.1782 16.0218C12.1782 19.5696 17.5 24.3 17.5 24.3Z"
        stroke="#8F8E8E"
        strokeWidth="1.5"
      />
      <path
        d="M19.2002 15.8001C19.2002 16.739 18.4391 17.5001 17.5002 17.5001C16.5613 17.5001 15.8002 16.739 15.8002 15.8001C15.8002 14.8612 16.5613 14.1001 17.5002 14.1001C18.4391 14.1001 19.2002 14.8612 19.2002 15.8001Z"
        stroke="#8F8E8E"
        strokeWidth="1.5"
      />
    </svg>
  );
};
