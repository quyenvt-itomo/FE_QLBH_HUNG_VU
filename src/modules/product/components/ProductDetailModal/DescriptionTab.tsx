import React from "react";
import { Product } from "../../product.model";

export const DescriptionTab: React.FC<{ data: Product }> = ({ data }) => (
  <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
    <section className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Mô tả</h3>
      <div className="min-h-32 whitespace-pre-wrap text-sm leading-6 text-gray-600">
        {data.description || "Chưa có mô tả"}
      </div>
    </section>
    <section className="rounded-xl border border-gray-100 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Ghi chú</h3>
      <div className="min-h-32 whitespace-pre-wrap text-sm leading-6 text-gray-600">
        {data.note || "Chưa có ghi chú"}
      </div>
    </section>
  </div>
);
