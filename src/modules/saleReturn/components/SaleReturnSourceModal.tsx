import React, { useState } from "react";
import { Button, DatePicker, Input, Modal, Table } from "antd";
import dayjs from "dayjs";
import { useSaleStore } from "@/modules/sale/store";
import { Sale } from "@/modules/sale/model";
import { OrderStatus } from "@/modules/order/order.model";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatMoney } from "@/shared/utils/number.util";
import { MagnifyingGlassIcon } from "@/shared/icons";
import { ProductSelect } from "@/modules/product";
import { CLASSNAME } from "@/shared/constants";
import { PartnerSelect, PartnerType } from "@/modules/partner";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { AppDatePicker } from "@/shared/components";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (sale: Sale) => void;
  onQuickReturn: () => void;
}

export const SaleReturnSourceModal: React.FC<Props> = ({
  open,
  onClose,
  onSelect,
  onQuickReturn,
}) => {
  const [keyword, setKeyword] = useState("");
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const [productId, setProductId] = useState<string | undefined>(undefined);
  // Mắc định 30 ngày trước
  const [orderAtGte, setOrderAtGte] = useState<string | undefined>(
    dayjs().subtract(30, "day").startOf("day").toISOString(),
  );
  const [orderAtLte, setOrderAtLte] = useState<string | undefined>(undefined);

  const store = useSaleStore({
    page: 1,
    size: 20,
    keyword,
    productId,
    customerId,
    orderAtGte,
    orderAtLte,
    statuses: [OrderStatus.COMPLETED],
    isLocked: !open,
  });

  return (
    <Modal
      open={open}
      width={1280}
      centered
      destroyOnClose
      title="Chọn hóa đơn trả hàng"
      onCancel={onClose}
      footer={[
        <Button key="quick" type="primary" onClick={onQuickReturn}>
          Trả nhanh
        </Button>,
      ]}
    >
      <div className="flex gap-6">
        <div className="flex flex-col w-52 flex-shrink-0 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm hóa đơn</label>
            <Input
              allowClear
              prefix={<MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5 text-[#747E76]" />}
              value={keyword}
              placeholder="Mã hóa đơn, khách hàng hoặc số điện thoại"
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Sản phẩm</label>
            <ProductSelect
              value={productId}
              onChange={setProductId}
              prefix={<MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5 text-[#747E76]" />}
              suffixIcon={null}
              allowClear
              placeholder="Chọn sản phẩm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Khách hàng</label>
            <PartnerSelect
              value={customerId}
              onChange={setCustomerId}
              prefix={<MagnifyingGlassIcon className="w-4 h-4 md:w-5 md:h-5 text-[#747E76]" />}
              suffixIcon={null}
              allowClear
              query={{ type: PartnerType.CUSTOMER }}
              placeholder="Chọn khách hàng"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Ngày bán</label>
            <AppDatePicker
              onlyDate
              placeholder="Từ ngày"
              value={orderAtGte ? dayjs(orderAtGte) : undefined}
              onChange={(date) =>
                setOrderAtGte(date ? date.startOf("day").toISOString() : undefined)
              }
            />
            <AppDatePicker
              onlyDate
              placeholder="Đến ngày"
              value={orderAtLte ? dayjs(orderAtLte) : undefined}
              onChange={(date) => setOrderAtLte(date ? date.endOf("day").toISOString() : undefined)}
            />
          </div>
        </div>

        <div className="w-[calc(100%-232px)] border rounded-md flex flex-col h-96">
          <Table<Sale>
            rowKey="id"
            size="small"
            loading={store.loading}
            dataSource={store.data}
            pagination={false}
            scroll={{ x: "max-content", y: "max-content" }}
            className={CLASSNAME.table}
            columns={[
              {
                title: "STT",
                key: "index",
                width: 60,
                align: "center",
                render: (_, __, index) => index + 1,
              },
              {
                title: "Mã hóa đơn",
                dataIndex: "code",
                key: "code",
                render: (value) => <span className="text-blue-600">{value}</span>,
              },
              {
                title: "Thời gian",
                dataIndex: "orderAt",
                key: "orderAt",
                render: (value) => formatDateTimeDDMMYYYY(value),
              },
              {
                title: "Khách hàng",
                key: "customer",
                render: (_, record) =>
                  record.partner?.name || record.partnerSnapshot?.name || "Khách lẻ",
              },
              {
                title: "Tổng cộng",
                dataIndex: "totalAmount",
                key: "totalAmount",
                className: "font-medium",
                align: "right",
                width: 120,
                render: (value) => formatMoney(value),
              },
              {
                title: "",
                key: "select",
                width: 90,
                align: "end",
                render: (_, record) => <Button onClick={() => onSelect(record)}>Chọn</Button>,
              },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
};
