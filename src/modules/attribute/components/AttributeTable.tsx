import React, { useMemo } from "react";
import { TableColumnConfig, ObjectTableProps } from "@/shared";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { AttributeType, attributeTypeMap } from "../attribute.enum";
import { Attribute } from "../attribute.model";

interface Props extends ObjectTableProps {
  type: AttributeType;
  onViewDetail?: (record: Attribute) => void;
}

export const AttributeTable: React.FC<Props> = ({ type, onViewDetail, ...rest }) => {
  const nameColumn = useMemo(
    () => ({
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (value: string, record: Attribute) => (
        <span
          className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={(event) => {
            event.stopPropagation();
            onViewDetail?.(record);
          }}
        >
          {value}
        </span>
      ),
    }),
    [onViewDetail],
  );

  const columns: any = useMemo(() => {
    const quantityColumn = {
      title: "Số lượng hàng hóa",
      dataIndex: "productCount",
      key: "productCount",
      align: "right",
      width: 170,
      render: (value: number) => formatQuantity(value || 0),
    };

    switch (type) {
      case AttributeType.PRODUCT_GROUP:
        return [
          nameColumn,
          {
            title: "Nhóm cha",
            key: "parent",
            width: 220,
            render: (_: unknown, record: Attribute) => record.parent?.name || "—",
          },
          quantityColumn,
        ];
      case AttributeType.BRAND:
      case AttributeType.UNIT:
        return [nameColumn, quantityColumn];
      case AttributeType.LOCATION:
        return [
          nameColumn,
          quantityColumn,
          {
            title: "Cửa hàng",
            key: "store",
            width: 220,
            render: (_: unknown, record: Attribute) => record.store?.name || "—",
          },
        ].filter(Boolean);
      case AttributeType.CUSTOMER_GROUP:
      case AttributeType.SUPPLIER_GROUP:
      case AttributeType.SHIPPER_GROUP:
        return [
          nameColumn,
          {
            title: "Số lượng đối tác",
            dataIndex: "partnerCount",
            key: "partnerCount",
            align: "right",
            width: 170,
            render: (value: number) => formatQuantity(value || 0),
          },
        ];
      case AttributeType.INCOME_CATEGORY:
      case AttributeType.EXPENSE_CATEGORY:
        return [
          nameColumn,
          {
            title: "Số phiếu",
            dataIndex: "incomeExpenseCount",
            key: "incomeExpenseCount",
            align: "right",
            width: 140,
            render: (value: number) => formatQuantity(value || 0),
          },
          {
            title: "Tổng tiền",
            dataIndex: "incomeExpenseAmount",
            key: "incomeExpenseAmount",
            align: "right",
            width: 180,
            render: (value: number) => formatMoney(value || 0),
          },
        ];
      default:
        return [nameColumn];
    }
  }, [nameColumn, type]);

  return (
    <TableColumnConfig
      columns={columns}
      itemName={attributeTypeMap[type]?.toLowerCase()}
      tableKey={`attribute-${type}-table`}
      showCreator={false}
      showUpdater={false}
      showTotal={false}
      {...rest}
    />
  );
};
