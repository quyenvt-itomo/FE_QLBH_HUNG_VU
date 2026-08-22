import React, { useEffect } from "react";
import { Button, Form, Modal, Table, Descriptions, TableProps } from "antd";
import { AppDatePicker } from "@/shared/components/input/AppDatePicker";
import { InputQuantity } from "@/shared/components/input";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";
import {
  StockDocument,
  stockDocumentStatusMap,
  stockDocumentTypeMap,
} from "../stockDocument.model";
import { StockDocumentLine } from "@/modules/stockDocumentLine";

type Mode = "export" | "import" | "complete";

interface Props {
  open: boolean;
  mode: Mode;
  data?: StockDocument;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    actualDate?: string;
    lines: Array<{
      id: string;
      stockQuantity: number;
      additionalQuantity?: number | null;
      billingQuantity?: number | null;
    }>;
  }) => void;
}

export const StockDocumentQuantityModal: React.FC<Props> = ({
  open,
  mode,
  data,
  loading,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm<any>();

  useEffect(() => {
    if (!open || !data) return;
    form.setFieldsValue({
      actualDate: undefined,
      lines: (data.lines || []).map((line) => ({
        id: line.id,
        stockQuantity: line.stockQuantity ?? 0,
        additionalQuantity: line.additionalQuantity ?? 0,
        billingQuantity: line.billingQuantity ?? line.stockQuantity ?? 0,
      })),
    });
  }, [open, data, form]);

  if (!data) return null;

  const isExport = mode === "export";
  const isComplete = mode === "complete";
  const title =
    mode === "export"
      ? "Xác nhận xuất kho"
      : mode === "import"
        ? "Xác nhận nhập kho"
        : "Hoàn thành phiếu";

  const columns: TableProps["columns"] = [
    {
      title: "STT",
      width: 50,
      align: "center",
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "Hàng hóa",
      key: "productName",
      width: 220,
      render: (r: StockDocumentLine) => (
        <div className="flex flex-col">
          <span className="font-medium">{resolveByPath(r, ["product", "name"], "--")}</span>
          <span className="text-xs text-gray-400 font-mono">
            {resolveByPath(r, ["product", "code"], "")}
          </span>
        </div>
      ),
    },
    {
      title: "ĐVT",
      key: "unitName",
      width: 90,
      align: "center",
      render: (r: StockDocumentLine) => resolveByPath(r, ["unit", "name"], "--"),
    },
    {
      title: "SL yêu cầu",
      dataIndex: "requestQuantity",
      key: "requestQuantity",
      width: 100,
      align: "right",
      render: (val: number) => formatQuantity(val),
    },
    {
      title: "SL thực tế",
      width: 130,
      align: "right",
      render: (_: any, __: any, i: number) => (
        <Form.Item name={["lines", i, "stockQuantity"]} className="mb-0">
          <InputQuantity variant="borderless" min={0} notRightAlign disabled={isComplete} />
        </Form.Item>
      ),
    },
    // ...(isExport
    //   ? [
    //       {
    //         title: "SL cộng thêm",
    //         width: 130,
    //         align: "right",
    //         render: (_: any, __: any, i: number) => (
    //           <Form.Item name={["lines", i, "additionalQuantity"]} className="mb-0">
    //             <InputQuantity variant="borderless" min={0} notRightAlign />
    //           </Form.Item>
    //         ),
    //       },
    //     ]
    //   : []),
    // ...(!isExport
    //   ? [
    //       {
    //         title: "SL hóa đơn",
    //         width: 130,
    //         align: "right",
    //         render: (_: any, __: any, i: number) => (
    //           <Form.Item name={["lines", i, "billingQuantity"]} className="mb-0">
    //             <InputQuantity variant="borderless" min={0} notRightAlign />
    //           </Form.Item>
    //         ),
    //       },
    //     ]
    //   : []),
    {
      title: "Chênh lệch",
      dataIndex: "varianceQuantity",
      key: "varianceQuantity",
      width: 110,
      align: "right",
      render: (val: number) => {
        return (
          <span className={val === 0 ? "" : val > 0 ? "text-green-600" : "text-red-600"}>
            {formatQuantity(val)}
          </span>
        );
      },
    },
    {
      title: "Giá trị CL",
      dataIndex: "varianceAmount",
      key: "varianceAmount",
      width: 140,
      align: "right",
      render: (val: number) => {
        return (
          <span className={val === 0 ? "" : val > 0 ? "text-green-600" : "text-red-600"}>
            {formatMoney(val)}
          </span>
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    onConfirm({
      actualDate: values.actualDate,
      lines: (values.lines || []).map((line: any) => ({
        id: line.id,
        stockQuantity: Number(line.stockQuantity) || 0,
        additionalQuantity: isExport ? Number(line.additionalQuantity) || 0 : undefined,
        billingQuantity: isExport ? undefined : Number(line.billingQuantity) || 0,
      })),
    });
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      width={1120}
      destroyOnClose
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="bg-gray-50 rounded-lg p-3 border mb-4">
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="Số phiếu">{data.code}</Descriptions.Item>
            <Descriptions.Item label="Loại">
              {stockDocumentTypeMap[data.type] || data.type}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {stockDocumentStatusMap[data.status] || data.status}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày hiệu lực">
              {data.effectiveDate ? formatDate(data.effectiveDate) : "--"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Form.Item name="actualDate" label="Ngày thực hiện" className="mb-2">
          <AppDatePicker onlyDate style={{ width: 200 }} />
        </Form.Item>

        <Table
          rowKey="id"
          pagination={false}
          dataSource={data.lines}
          columns={columns}
          size="small"
          scroll={{ x: "max-content" }}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Xác nhận
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
