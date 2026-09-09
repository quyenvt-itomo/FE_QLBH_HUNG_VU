import React from "react";
import { InternalExportType, internalExportTypeMap } from "../internalExport.model";

export const InternalExportTypeTag: React.FC<{ value?: InternalExportType }> = ({ value }) => {
  if (!value) return null;

  const color =
    value === InternalExportType.USAGE
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-red-200 bg-red-50 text-red-700";

  const label = internalExportTypeMap[value] || value;

  return <span className={`inline-flex rounded border px-2 py-0.5 text-xs ${color}`}>{label}</span>;
};
