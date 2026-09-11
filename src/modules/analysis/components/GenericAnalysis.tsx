import React from "react";
import { Empty, Spin, Table } from "antd";
import { formatMoney } from "@/shared/utils/number.util";
import { AnalysisQuery, GenericAnalysisData } from "../analysis.model";
import {
  useAnalysisCustomerClassificationStore,
  useAnalysisCustomerOverviewStore,
  useAnalysisProductClassificationStore,
  useAnalysisProductInventoryStore,
  useAnalysisProductOverviewStore,
  useAnalysisReceivableStore,
} from "../analysis.store";
import { AnalysisFilterProps, AnalysisViewHeader } from "./AnalysisToolbar";

interface GenericAnalysisRequest {
  data?: GenericAnalysisData;
  loading: boolean;
}

export const GenericAnalysis: React.FC<{ title: string; data?: GenericAnalysisData; loading: boolean }> = ({ title, data, loading }) => {
  const rows = data?.rows || [];
  const keys = rows.length ? Object.keys(rows[0]).filter((key) => key !== "id") : [];
  const columns = keys.map((key) => ({
    title: key,
    dataIndex: key,
    render: (value: unknown) => typeof value === "number" ? formatMoney(value) || "0" : String(value ?? "—"),
  }));

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {!data ? (
        <div className="flex h-48 items-center justify-center">
          <Spin tip="Đang tải dữ liệu..." />
        </div>
      ) : (
        <Table
          size="small"
          rowKey={(row) => String(row.id || row.name || row.group || row.code || "row")}
          loading={loading}
          dataSource={rows}
          pagination={false}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu" /> }}
          columns={columns}
        />
      )}
    </section>
  );
};

const ResourceView: React.FC<AnalysisFilterProps & { title: string; request: GenericAnalysisRequest }> = ({ title, request, ...filters }) => (
  <div className="space-y-4">
    <AnalysisViewHeader title={title} {...filters} />
    <GenericAnalysis title={title} data={request.data} loading={request.loading} />
  </div>
);

export const ProductOverviewAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisProductOverviewStore(query);
  return <ResourceView title="Tổng quan hàng hóa" request={request} {...filters} />;
};

export const ProductInventoryAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisProductInventoryStore(query);
  return <ResourceView title="Tồn kho" request={request} {...filters} />;
};

export const ProductClassificationAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisProductClassificationStore(query);
  return <ResourceView title="Phân loại hàng hóa" request={request} {...filters} />;
};

export const CustomerOverviewAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisCustomerOverviewStore(query);
  return <ResourceView title="Tổng quan khách hàng" request={request} {...filters} />;
};

export const CustomerClassificationAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisCustomerClassificationStore(query);
  return <ResourceView title="Phân loại khách hàng" request={request} {...filters} />;
};

export const ReceivableAnalysis: React.FC<AnalysisFilterProps & { query: AnalysisQuery }> = ({ query, ...filters }) => {
  const request = useAnalysisReceivableStore(query);
  return <ResourceView title="Công nợ khách hàng" request={request} {...filters} />;
};
