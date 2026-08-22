import { Table } from "antd";
import React from "react";
import { CLASSNAME } from "../../constants/UI";
import { calculateSummaryRow } from "../../utils/tableUtils";
import HeaderTooltip from "./HeaderTooltip";
import "./DetailTable.css";

export const renderIfDataRow = (
  index: number,
  renderFn: () => React.ReactNode,
  fallback: React.ReactNode = "",
) => (index ? renderFn() : fallback);

type DataRow = {
  quantity?: number;
  price?: number;
  vat?: number;
  commission?: number;
  [key: string]: any;
};

interface DetailTableProps {
  columns: any[];
  dataSource: DataRow[];
  groupKey: string;
}

const DetailTable: React.FC<DetailTableProps> = ({
  columns,
  dataSource,
  groupKey,
}) => {
  const summaryRow = calculateSummaryRow(dataSource, groupKey);
  return (
    <Table
      columns={[
        {
          title: <HeaderTooltip title="STT" />,
          dataIndex: "stt",
          key: "stt",
          width: 50,
          align: "center",
          fixed: "left",
          render: (_: any, __: any, index: number) => (index ? index : ""),
        },
        ...columns,
      ]}
      rowKey="key"
      tableLayout="fixed"
      pagination={false}
      footer={() => <></>}
      className={CLASSNAME.detail_table}
      dataSource={[summaryRow, ...dataSource]}
      scroll={{
        x: "max-content",
        y: `max-content`,
      }}
      rowClassName={(record: any) =>
        record.isSummary
          ? "editable-row font-semibold leading-[30px]"
          : "editable-row"
      }
    />
  );
};

export default DetailTable;
