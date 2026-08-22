import React from "react";

interface SortableItemProps {
  colgroupWidthConfig?: (number | string | undefined)[];
  children?: React.ReactNode;
  className?: string;
}

export const SortableItem: React.FC<SortableItemProps> = ({
  colgroupWidthConfig,
  children,
  className,
}) => {
  return (
    <table className={`w-full table-fixed ${className}`}>
      <colgroup>
        {colgroupWidthConfig?.map((config, index) => (
          <col
            key={index}
            style={{
              width: config,
            }}
          />
        ))}
      </colgroup>

      <tbody>{children}</tbody>
    </table>
  );
};
