import React, { useEffect, useMemo } from "react";
import { Modal, Form, FormProps, App, Table, Checkbox, Descriptions, TableProps } from "antd";
import dayjs from "dayjs";
import { AddUpdateModalProps } from "@/shared/interfaces/common";
import { ReferralCode, ReferralCodeLineSnapshot } from "../referralCode.model";
import { PurchaseRequisition, PurchaseRequisitionLine } from "@/modules/purchaseRequisition";
import { PartnerSelect, PartnerType } from "@/modules/partner";
import { AppDatePicker } from "@/shared";
import { Label } from "@/shared";
import { SubmitButton } from "@/shared";
import { useAppMessage } from "@/shared/hooks/useAppMessage";
import { formatDate, formatFormData } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { resolveByPath } from "@/shared/utils/common.util";

interface Props extends AddUpdateModalProps<ReferralCode> {
  purchaseRequisition: PurchaseRequisition;
}

export const ReferralCodeAddModal: React.FC<Props> = ({
  open,
  loading,
  purchaseRequisition,
  onAdd,
  onClose,
}) => {
  const { showFormErrorMessages } = useAppMessage();
  const { modal } = App.useApp();
  const [form] = Form.useForm();

  const lines: PurchaseRequisitionLine[] = purchaseRequisition.lines || [];

  const onFinish: FormProps["onFinish"] = (values: any) => {
    const selectedIds: string[] = values.selectedLineIds || [];
    if (selectedIds.length === 0) {
      form.setFields([
        { name: "selectedLineIds", errors: ["Vui lòng chọn ít nhất 1 dòng sản phẩm"] },
      ]);
      return;
    }

    const selectedLines = lines.filter((l) => selectedIds.includes(l.id));
    const linesSnapshot: ReferralCodeLineSnapshot[] = selectedLines.map((l) => ({
      productId: l.productId || "",
      productCode: resolveByPath(l, ["product", "code"]),
      productName: resolveByPath(l, ["product", "name"]),
      unitId: l.unitId || "",
      unitName: resolveByPath(l, ["unit", "name"]),
      quantity: l.quantity,
    }));

    modal.confirm({
      title: "Xác nhận tạo mã giới thiệu?",
      content: `Tạo mã giới thiệu cho ${selectedLines.length} dòng sản phẩm từ phiếu ${purchaseRequisition.code}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        onAdd?.(
          formatFormData({
            ...values,
            purchaseRequisitionId: purchaseRequisition.id,
            linesSnapshot,
          }),
        );
        onClose?.();
      },
    });
  };

  const selectedIds: string[] = Form.useWatch("selectedLineIds", form) || [];

  const lineColumns: TableProps["columns"] = useMemo(
    () => [
      {
        title: (
          <Checkbox
            checked={selectedIds.length === lines.length && lines.length > 0}
            indeterminate={selectedIds.length > 0 && selectedIds.length < lines.length}
            onChange={(e) => {
              const next = e.target.checked ? lines.map((l) => l.id) : [];
              form.setFieldValue("selectedLineIds", next);
            }}
          />
        ), // Thêm checkbox để chọn tất cả
        dataIndex: "id",
        key: "select",
        width: 40,
        align: "center",
        render: (id: string) => (
          <Checkbox
            checked={selectedIds.includes(id)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...selectedIds, id]
                : selectedIds.filter((x) => x !== id);
              form.setFieldValue("selectedLineIds", next);
            }}
            disabled={!lines.find((l) => l.id === id)?.productId}
          />
        ),
      },
      {
        title: "Mã HH",
        dataIndex: ["product", "code"],
        key: "pCode",
        width: 100,
        render: (_: any, r: any) => (resolveByPath as any)(r, ["product", "code"]),
      },
      {
        title: "Tên sản phẩm",
        dataIndex: ["product", "name"],
        key: "pName",
        render: (_: any, r: any) => (resolveByPath as any)(r, ["product", "name"]),
      },
      {
        title: "ĐVT",
        dataIndex: ["unit", "name"],
        key: "unit",
        width: 80,
        render: (_: any, r: any) => (resolveByPath as any)(r, ["unit", "name"]),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 120,
        align: "right",
        render: (val: number) => formatQuantity(val),
      },
    ],
    [selectedIds],
  );

  return (
    <Modal
      title={`Tạo mã giới thiệu cho phiếu đề nghị ${purchaseRequisition.code}`}
      open={open}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
      centered
      width={860}
      destroyOnClose
      afterOpenChange={(open) => {
        if (!open) {
          form.resetFields();
          return;
        }
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={showFormErrorMessages}
        layout="vertical"
        className="flex flex-col gap-3"
        initialValues={{
          expiresAt: dayjs().add(7, "day"),
        }}
      >
        {/* ── Thông tin phiếu đề nghị (card lite) ── */}
        <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Thông tin phiếu đề nghị
          </h4>
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="Mã phiếu">{purchaseRequisition.code}</Descriptions.Item>
            <Descriptions.Item label="Bộ phận">
              {resolveByPath(purchaseRequisition, ["department", "name"])}
            </Descriptions.Item>
            <Descriptions.Item label="Người đề nghị">
              {resolveByPath(purchaseRequisition, ["requester", "name"])}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {purchaseRequisition.createdAt ? formatDate(purchaseRequisition.createdAt) : "--"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* ── Chọn nhà cung cấp + ngày hết hạn ── */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Form.Item name="partnerId" label={<Label title="Nhà cung cấp (không bắt buộc)" />}>
              <PartnerSelect query={{ type: PartnerType.SUPPLIER }} />
            </Form.Item>
          </div>
          <div className="w-48">
            <Form.Item
              name="expiresAt"
              label={<Label title="Ngày hết hạn" required />}
              rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
            >
              <AppDatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        </div>

        {/* ── Danh sách lines + checkbox ── */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Chọn sản phẩm ({selectedIds.length}/{lines.length})
          </h4>
          <Form.Item
            name="selectedLineIds"
            rules={[
              {
                validator: (_, value: string[]) => {
                  if (!value || value.length === 0) {
                    return Promise.reject("Vui lòng chọn ít nhất 1 dòng sản phẩm");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Table
              dataSource={lines}
              columns={lineColumns}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 300 }}
            />
          </Form.Item>
        </div>

        {/* ── Submit ── */}
        <div className="flex justify-end">
          <SubmitButton loading={loading} onCancel={onClose} />
        </div>
      </Form>
    </Modal>
  );
};
