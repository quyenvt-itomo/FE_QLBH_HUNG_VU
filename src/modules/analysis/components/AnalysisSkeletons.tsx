import React from "react";
import { Skeleton } from "antd";

const MetricCardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <Skeleton.Input active size="small" className="!h-4 !w-28" />
    <div className="mt-3">
      <Skeleton.Input active className="!h-8 !w-36" />
    </div>
    <div className="mt-5 flex justify-between gap-4">
      <Skeleton.Input active size="small" className="!h-4 !w-24" />
      <Skeleton.Input active size="small" className="!h-4 !w-24" />
    </div>
  </div>
);

export const AnalysisMetricCardsSkeleton: React.FC<{ count: number; columns?: string }> = ({ count, columns = "xl:grid-cols-3" }) => (
  <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 ${columns}`}>
    {Array.from({ length: count }, (_, index) => <MetricCardSkeleton key={index} />)}
  </div>
);
