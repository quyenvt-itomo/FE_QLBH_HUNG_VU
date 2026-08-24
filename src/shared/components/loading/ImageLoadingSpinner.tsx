import React from "react";

interface ImageLoadingSpinnerProps {
  size?: number;
  className?: string;
}

const ImageLoadingSpinner: React.FC<ImageLoadingSpinnerProps> = ({ size = 40, className = "" }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <circle cx="25" cy="25" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="4"
          strokeDasharray="80 200"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export { ImageLoadingSpinner };
