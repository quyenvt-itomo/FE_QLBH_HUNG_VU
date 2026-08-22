import { Modal, InputNumber, Button, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import { Icon } from "@iconify/react";
import { formatMoney } from "../../../../utils/formatNumber";
import "./BarcodePrintModal.css";
import { useReactToPrint } from "react-to-print";

interface BarcodePrintItem {
  barcode: string;
  name: string;
  code: string;
  quantity?: number;
  price?: number;
}

interface Props {
  open: boolean;
  items: BarcodePrintItem[];
  onClose: () => void;
}

const BarcodePrintModal: React.FC<Props> = ({ open, items, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [printItems, setPrintItems] = useState<BarcodePrintItem[]>([]);
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  useEffect(() => {
    if (open && items.length > 0) {
      // Khởi tạo số lượng mặc định là 1 cho mỗi item
      setPrintItems(items.map((item) => ({ ...item, quantity: item.quantity || 1 })));
      setIsPrintPreview(false);
    }
  }, [open, items]);

  const handleQuantityChange = (index: number, value: number | null) => {
    const newItems = [...printItems];
    newItems[index].quantity = value || 1;
    setPrintItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = printItems.filter((_, i) => i !== index);
    setPrintItems(newItems);
  };

  const handlePrintPreview = () => {
    setIsPrintPreview(true);
    // Delay để đảm bảo barcode được render
    setTimeout(() => {
      handlePrint();
    }, 500);
  };

  // const handlePrint = () => {
  //   if (!printRef.current) return;

  //   const printContent = printRef.current.innerHTML;
  //   const printWindow = window.open("", "_blank");

  //   if (!printWindow) return;

  //   printWindow.document.write(`
  //     <!DOCTYPE html>
  //     <html>
  //       <head>
  //         <title>In mã vạch</title>
  //         <style>
  //           * {
  //             margin: 0;
  //             padding: 0;
  //             box-sizing: border-box;
  //           }

  //           @page {
  //             size: 74mm 22mm;
  //             margin: 0;
  //           }

  //           @media print {
  //             body {
  //               margin: 0;
  //               padding: 0;
  //               width: 74mm;
  //             }

  //             .barcode-container {
  //               width: 74mm;
  //             }

  //             .barcode-row {
  //               width: 74mm;
  //               height: 22mm;
  //               display: flex;
  //               page-break-after: always;
  //               page-break-inside: avoid;
  //             }

  //             .barcode-row:last-child {
  //               page-break-after: auto;
  //             }

  //             .barcode-label {
  //               width: 37mm;
  //               height: 22mm;
  //               display: flex;
  //               flex-direction: column;
  //               justify-content: center;
  //               align-items: center;
  //               padding: 0.5mm;
  //               overflow: hidden;
  //               box-sizing: border-box;
  //             }

  //             .product-info {
  //               width: 100%;
  //               text-align: center;
  //               margin-bottom: 0.5mm;
  //             }

  //             .product-name {
  //               font-size: 6pt;
  //               font-weight: 600;
  //               white-space: nowrap;
  //               overflow: hidden;
  //               text-overflow: ellipsis;
  //               max-width: 100%;
  //               line-height: 1.2;
  //             }

  //             .product-code {
  //               font-size: 5pt;
  //               color: #666;
  //               line-height: 1.2;
  //             }

  //             .barcode-wrapper {
  //               display: flex;
  //               justify-content: center;
  //               align-items: center;
  //               width: 100%;
  //             }

  //             .barcode-wrapper svg {
  //               max-width: 35mm !important;
  //               height: 10mm !important;
  //             }
  //           }

  //           @media screen {
  //             body {
  //               background: #f0f0f0;
  //               padding: 10px;
  //             }

  //             .barcode-container {
  //               display: flex;
  //               flex-direction: column;
  //               gap: 2mm;
  //             }

  //             .barcode-row {
  //               display: flex;
  //               gap: 2mm;
  //             }

  //             .barcode-label {
  //               width: 37mm;
  //               height: 22mm;
  //               background: white;
  //               border: 1px dashed #ccc;
  //               display: flex;
  //               flex-direction: column;
  //               justify-content: center;
  //               align-items: center;
  //               padding: 1mm;
  //               overflow: hidden;
  //             }

  //             .product-info {
  //               width: 100%;
  //               text-align: center;
  //               margin-bottom: 1mm;
  //             }

  //             .product-name {
  //               font-size: 7pt;
  //               font-weight: 600;
  //               white-space: nowrap;
  //               overflow: hidden;
  //               text-overflow: ellipsis;
  //               max-width: 100%;
  //             }

  //             .product-code {
  //               font-size: 6pt;
  //               color: #666;
  //             }

  //             .barcode-wrapper {
  //               display: flex;
  //               justify-content: center;
  //               align-items: center;
  //             }
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         ${printContent}
  //         <script>
  //           window.onload = function() {
  //             setTimeout(function () {
  //               window.focus();
  //               window.print();
  //             }, 100);

  //             window.onafterprint = function () {
  //               window.close();
  //             };

  //             setTimeout(function () {
  //               window.close();
  //             }, 1200);
  //           };
  //         </script>
  //       </body>
  //     </html>
  //   `);

  //   printWindow.document.close();
  // };

  // Tạo mảng items để in dựa trên quantity

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const generatePrintLabels = () => {
    // Bước 1: Tạo tất cả các tem đơn lẻ
    const allLabels: JSX.Element[] = [];

    printItems.forEach((item, itemIndex) => {
      for (let i = 0; i < (item.quantity || 1); i++) {
        allLabels.push(
          <div key={`${itemIndex}-${i}`} className="barcode-label">
            <div className="product-info">
              <div className="product-name">{item.name}</div>
            </div>
            {item.barcode && (
              <div className="barcode-wrapper">
                <Barcode
                  value={item.barcode}
                  width={1.2}
                  height={20}
                  fontSize={10}
                  margin={0}
                  displayValue={true}
                />
              </div>
            )}
            <span style={{ fontWeight: 600, fontSize: 10 }}>
              {item.price ? formatMoney(item.price) + " VNĐ" : ""}
            </span>
          </div>,
        );
      }

      // if ((item.quantity || 1) % 2 !== 0) {
      //   allLabels.push(<div key="empty-last" className="barcode-label" />);
      // }
    });

    // Bước 2: Nhóm thành từng cặp 2 tem (1 hàng = 1 trang)
    const rows: JSX.Element[] = [];
    for (let i = 0; i < allLabels.length; i += 2) {
      rows.push(
        <div key={`row-${i}`} className="barcode-row">
          {allLabels[i]}
          {allLabels[i + 1]}
        </div>,
      );
    }

    return rows;
  };

  const columns = [
    {
      title: "",
      key: "action",
      width: 50,
      render: (_: any, record: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<Icon icon="mdi:delete-outline" width="18" height="18" />}
          onClick={() => handleDeleteItem(index)}
          size="small"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Mã vạch",
      dataIndex: "barcode",
      key: "barcode",
      width: 120,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={1}
          max={9999}
          value={printItems[index]?.quantity || 1}
          onChange={(value) => handleQuantityChange(index, value)}
          className="w-full"
        />
      ),
    },
  ];

  const totalQuantity = printItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  if (isPrintPreview) {
    return (
      <Modal
        title={`Xem trước in mã vạch (${totalQuantity} tem)`}
        open={open}
        onCancel={() => {
          setIsPrintPreview(false);
          onClose();
        }}
        footer={[
          <Button key="back" onClick={() => setIsPrintPreview(false)} className="font-light">
            Quay lại chỉnh sửa
          </Button>,
          <Button key="print" type="primary" onClick={handlePrint} className="font-light">
            In
          </Button>,
        ]}
        width={400}
        centered
        destroyOnClose
      >
        <div className="max-h-[70vh] overflow-auto scrollbar-hide mt-8">
          <div className="barcode-container mx-auto">{generatePrintLabels()}</div>
        </div>

        <div style={{ display: "none" }}>
          <div ref={printRef}>{generatePrintLabels()}</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Cài đặt in mã vạch (${printItems.length} sản phẩm)`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="font-light">
          Hủy
        </Button>,
        <Button
          key="preview"
          type="primary"
          onClick={handlePrintPreview}
          className="font-light"
          disabled={printItems.length === 0}
        >
          Xem trước & In
        </Button>,
      ]}
      width={700}
      centered
      destroyOnClose
    >
      <div className="flex flex-col gap-4 mt-8">
        <div className="text-sm text-gray-600">
          Tổng số tem sẽ in: <span className="font-semibold text-blue-600">{totalQuantity}</span>
        </div>
        {printItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Không có sản phẩm nào để in. Vui lòng đóng và chọn lại.
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={printItems}
            pagination={false}
            rowKey={(record, index) => `${record.barcode}-${index}`}
            size="small"
            scroll={{ y: 400 }}
          />
        )}
      </div>
    </Modal>
  );
};

export default BarcodePrintModal;
