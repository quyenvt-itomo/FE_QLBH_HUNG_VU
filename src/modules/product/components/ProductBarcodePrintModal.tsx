import React, { useEffect, useRef, useState } from "react";
import { Button, InputNumber, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Product } from "../product.model";
import "./ProductBarcodePrintModal.css";

export interface BarcodePrintItem {
  id: string;
  barcode: string;
  code: string;
  name: string;
  price?: number | null;
  quantity?: number;
}

interface ProductBarcodePrintModalProps {
  open: boolean;
  products: Product[];
  initialItems?: BarcodePrintItem[];
  onClose: () => void;
}

const CODE128B_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

const code128BToBits = (value: string): string => {
  const values = Array.from(value).map((character) => {
    const code = character.charCodeAt(0);
    return code >= 32 && code <= 126 ? code - 32 : 0;
  });
  const checksum = (104 + values.reduce((sum, item, index) => sum + item * (index + 1), 0)) % 103;
  const symbols = [104, ...values, checksum, 106];

  return symbols
    .map((symbol) => {
      let isBar = true;
      return Array.from(CODE128B_PATTERNS[symbol] || "212222")
        .map((width) => {
          const segment = (isBar ? "1" : "0").repeat(Number(width));
          isBar = !isBar;
          return segment;
        })
        .join("");
    })
    .join("");
};

const BarcodeSvg: React.FC<{ value: string }> = ({ value }) => {
  const bits = code128BToBits(value);
  const bars = bits
    .split("")
    .map((bit, index) => (bit === "1" ? <rect key={index} x={index} y="0" width="1" height="30" /> : null));

  return (
    <svg
      className="product-barcode-svg"
      viewBox={`0 0 ${bits.length} 30`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Mã vạch ${value}`}
    >
      {bars}
    </svg>
  );
};

const formatMoney = (value?: number | null): string =>
  value == null ? "" : `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;

export const ProductBarcodePrintModal: React.FC<ProductBarcodePrintModalProps> = ({
  open,
  products,
  initialItems,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [printItems, setPrintItems] = useState<BarcodePrintItem[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (open) {
      setPrintItems(
        initialItems?.length
          ? initialItems.map((item) => ({ ...item }))
          : products
            .filter((product) => product.barcode?.trim())
            .map((product) => ({
              id: product.id,
              barcode: product.barcode!.trim(),
              code: product.code,
              name: product.name,
              price: product.salePrice,
              quantity: 1,
            })),
      );
      setIsPreview(false);
    }
  }, [open, products, initialItems]);

  const updateQuantity = (index: number, quantity: number | null) => {
    setPrintItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, quantity: Math.max(1, quantity || 1) } : item,
      ),
    );
  };

  const labels = (): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    printItems.forEach((item, itemIndex) => {
      for (let index = 0; index < (item.quantity || 1); index += 1) {
        result.push(
          <div className="product-barcode-label" key={`${item.id}-${itemIndex}-${index}`}>
            <div className="product-label-name">{item.name}</div>
            <div className="product-label-code">{item.code}</div>
            <div className="product-barcode-wrapper">
              <BarcodeSvg value={item.barcode} />
            </div>
            <div className="product-label-barcode-value">{item.barcode}</div>
            {item.price != null && <div className="product-label-price">{formatMoney(item.price)}</div>}
          </div>,
        );
      }
    });
    return result;
  };

  const print = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html><head><title>In tem mã vạch</title>
      <style>
        * { box-sizing: border-box; }
        @page { size: 74mm 22mm; margin: 0; }
        html, body { margin: 0; padding: 0; }
        .product-barcode-container { display: flex; flex-direction: column; }
        .product-barcode-row { width: 74mm; height: 22mm; display: flex; page-break-after: always; }
        .product-barcode-row:last-child { page-break-after: auto; }
        .product-barcode-label { width: 37mm; height: 22mm; padding: 0.6mm; display: flex; flex-direction: column; justify-content: center; align-items: center; overflow: hidden; text-align: center; }
        .product-label-name { width: 100%; font: 600 6pt Arial, sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-label-code, .product-label-barcode-value { font: 5pt Arial, sans-serif; line-height: 1.1; }
        .product-barcode-wrapper { width: 35mm; height: 10mm; display: flex; align-items: center; justify-content: center; }
        .product-barcode-svg { width: 35mm; height: 9mm; display: block; }
        .product-label-price { font: 600 6pt Arial, sans-serif; line-height: 1.1; }
      </style></head><body>${printRef.current.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const totalQuantity = printItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const tableColumns = [
    {
      title: "",
      key: "delete",
      width: 45,
      render: (_: unknown, __: BarcodePrintItem, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => setPrintItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}
        />
      ),
    },
    { title: "Tên hàng", dataIndex: "name", key: "name", ellipsis: true },
    { title: "Mã hàng", dataIndex: "code", key: "code", width: 110 },
    { title: "Mã vạch", dataIndex: "barcode", key: "barcode", width: 125 },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 105,
      render: (_: unknown, item: BarcodePrintItem, index: number) => (
        <InputNumber
          min={1}
          max={9999}
          value={item.quantity || 1}
          onChange={(value) => updateQuantity(index, value)}
        />
      ),
    },
  ];

  if (isPreview) {
    return (
      <Modal
        title={`Xem trước in tem (${totalQuantity} tem)`}
        open={open}
        onCancel={onClose}
        centered
        width={440}
        footer={[
          <Button key="back" onClick={() => setIsPreview(false)}>
            Quay lại
          </Button>,
          <Button key="print" type="primary" onClick={print}>
            In
          </Button>,
        ]}
      >
        <div className="product-barcode-preview">
          <div className="product-barcode-container">{labels()}</div>
        </div>
        <div className="product-barcode-print-source" ref={printRef}>
          <div className="product-barcode-container">
            {Array.from({ length: Math.ceil(totalQuantity / 2) }, (_, index) => (
              <div className="product-barcode-row" key={`print-row-${index}`}>
                {labels()[index * 2]}
                {labels()[index * 2 + 1]}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Cài đặt in tem (${printItems.length} sản phẩm)`}
      open={open}
      onCancel={onClose}
      centered
      width={760}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="preview"
          type="primary"
          disabled={!printItems.length}
          onClick={() => setIsPreview(true)}
        >
          Xem trước & In
        </Button>,
      ]}
    >
      <div className="pt-4">
        <div className="mb-3 text-sm text-gray-600">
          Tổng số tem sẽ in: <span className="font-semibold text-blue-600">{totalQuantity}</span>
        </div>
        {printItems.length ? (
          <Table
            rowKey={(item) => item.id}
            columns={tableColumns}
            dataSource={printItems}
            pagination={false}
            size="small"
            scroll={{ y: 380 }}
          />
        ) : (
          <div className="py-8 text-center text-gray-500">Không có sản phẩm có mã vạch để in.</div>
        )}
      </div>
    </Modal>
  );
};

export default ProductBarcodePrintModal;
