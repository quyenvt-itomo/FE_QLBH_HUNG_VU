import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Tag, Spin, Input, Button, Form, Divider, Card } from "antd";
import {
  PrinterOutlined,
  FileExcelOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Organization, useOrganizationStore } from "@/modules/organization";
import {
  PurchaseQuotation,
  PurchaseQuotationLine,
  usePurchaseQuotationStore,
} from "@/modules/purchaseQuotation";
import { StoreImage } from "@/shared";
import { getMainFile } from "@/shared/utils/file.util";
import { formatDate } from "@/shared/utils/date.util";
import { formatMoney, formatQuantity } from "@/shared/utils/number.util";
import { ApproveStatus } from "@/modules/shared/business.model";
import { CalculationUtil } from "@/shared/utils/calculation.util";
import { getTaxCodeRules, getPhoneRules } from "@/shared/constants/formItemRule";
import { maskText, resolveByPath } from "@/shared/utils/common.util";

const SupplierQuotationDetailPage: React.FC = () => {
  const { companyCode, code } = useParams();
  const [company, setStore] = useState<Organization | null>(null);
  const [data, setData] = useState<PurchaseQuotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifyForm] = Form.useForm();
  const { getByCode: getOrgByCode } = useOrganizationStore({ isLocked: true });
  const { getByCodePublic } = usePurchaseQuotationStore({ isLocked: true });
  const calc = new CalculationUtil();

  useEffect(() => {
    if (!companyCode) return;
    (async () => {
      const org = await getOrgByCode(companyCode);
      setStore(org);
      if (org) localStorage.setItem("x-company-id", org.id);
    })();
  }, [companyCode]);

  useEffect(() => {
    if (!code || !company) return;
    (async () => {
      const quotation = await getByCodePublic(code);
      setData(quotation ?? null);
      setLoading(false);
    })();
  }, [code, company]);

  const handleVerify = () => {
    const taxCode = verifyForm.getFieldValue("taxCode");
    const phone = verifyForm.getFieldValue("phone");
    const expectedTaxCode = data?.supplierSnapshot?.taxCode;
    const expectedPhone = data?.quoterSnapshot?.phone;

    if (taxCode !== expectedTaxCode) {
      setVerifyError("M? s? thu? không chính xác");
      return;
    }
    if (expectedPhone && phone !== expectedPhone) {
      setVerifyError("S? ði?n tho?i ngý?i báo giá không chính xác");
      return;
    }
    setVerifyError("");
    setIsVerified(true);
  };

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );

  const supplierTaxCode = resolveByPath(data, ["supplier", "taxCode"]);
  const quoterPhone = resolveByPath(data, ["quoter", "phone"]);
  const maskedTaxCode = supplierTaxCode ? maskText(supplierTaxCode, 3) : "";
  const maskedPhone = quoterPhone ? maskText(quoterPhone, 3) : "";

  const isApproved = data?.approveStatus === ApproveStatus.APPROVED;
  const isRejected = data?.approveStatus === ApproveStatus.REJECTED;

  const statusConfig = isApproved
    ? { color: "green", icon: <CheckCircleOutlined />, label: "Ð? ti?p nh?n" }
    : isRejected
      ? { color: "red", icon: <CloseCircleOutlined />, label: "Ð? t? ch?i" }
      : { color: "orange", icon: <ClockCircleOutlined />, label: "Ðang ch? duy?t" };

  const total = calc.calculateTotalForArray(data?.lines || []);

  const lineCols = [
    {
      title: "HÀNG HÓA",
      key: "product",
      width: 280,
      render: (_: any, r: PurchaseQuotationLine) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {r.productSnapshot?.name || r.product?.name || "—"}
          </span>
          {r.productCode && <span className="text-xs text-gray-400">SKU: {r.productCode}</span>}
        </div>
      ),
    },
    {
      title: "SL",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "right" as const,
      render: (v: number) => <span className="font-medium">{formatQuantity(v)}</span>,
    },
    {
      title: "ÐÕN GIÁ",
      dataIndex: "unitPrice",
      key: "price",
      width: 140,
      align: "right" as const,
      render: (v: number) => <span>{formatMoney(v)}</span>,
    },
    {
      title: "THÀNH TI?N",
      dataIndex: "subTotal",
      key: "sub",
      width: 150,
      align: "right" as const,
      render: (v: number) => <span className="font-medium">{formatMoney(v)}</span>,
    },
    {
      title: "%VAT",
      dataIndex: "taxRate",
      key: "tax",
      width: 70,
      align: "right" as const,
      render: (v: number) => v + "%",
    },
    {
      title: "T?NG",
      dataIndex: "grossAmount",
      key: "gross",
      width: 160,
      align: "right" as const,
      render: (v: number) => <span className="font-semibold">{formatMoney(v)}</span>,
    },
  ];

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-gray-50">
      {/* Header */}
      <div className="flex justify-center left-0 w-full h-14 xl:h-16 flex-shrink-0 bg-white border-b shadow-sm">
        <div className="flex justify-between items-center w-full max-w-7xl h-full px-6">
          <div className="flex items-center gap-4">
            <StoreImage image={getMainFile(company?.logo)} />
            <span className="text-gray-800 text-lg font-bold uppercase tracking-wide">
              {company?.name}
            </span>
          </div>
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
            Chi ti?t báo giá
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl px-6 py-6">
        {!data ? (
          <Card className="text-center py-16">
            <div className="text-gray-400 text-5xl mb-4">??</div>
            <p className="text-gray-500 text-lg">Không t?m th?y báo giá</p>
            <p className="text-gray-400 text-sm mt-1">
              Liên h? v?i bên mua hàng ð? bi?t thêm chi ti?t
            </p>
          </Card>
        ) : !isVerified ? (
          <div className="max-w-lg mx-auto mt-10">
            <Card className="text-center shadow-md" styles={{ body: { padding: "40px 32px" } }}>
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <SafetyCertificateOutlined className="text-3xl text-blue-600" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Xác th?c truy c?p báo giá</h2>
              <p className="text-sm text-gray-500 mb-6">
                Vui l?ng cung c?p thông tin ð? xác minh danh tính c?a b?n.
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-blue-600 font-semibold mb-3 uppercase tracking-wide">
                  Thông tin g?i ?
                </p>
                <div className="space-y-2">
                  {maskedTaxCode && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-8">MST:</span>
                      <span className="font-mono text-lg font-bold text-blue-700 tracking-[0.15em]">
                        {maskedTaxCode}
                      </span>
                    </div>
                  )}
                  {maskedPhone && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-8">SÐT:</span>
                      <span className="font-mono text-lg font-bold text-blue-700 tracking-[0.15em]">
                        {maskedPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Form form={verifyForm} layout="vertical" onFinish={handleVerify}>
                <Form.Item
                  name="taxCode"
                  label={<span className="text-gray-700 font-medium">M? s? thu?</span>}
                  rules={getTaxCodeRules(true)}
                  extra={
                    maskedTaxCode
                      ? 'G?i ?: k?t thúc b?ng "' + (supplierTaxCode?.slice(-3) || "") + '"'
                      : undefined
                  }
                >
                  <Input
                    placeholder="Nh?p m? s? thu?"
                    autoFocus
                    size="large"
                    className="text-center tracking-wider"
                  />
                </Form.Item>
                {quoterPhone && (
                  <Form.Item
                    name="phone"
                    label={
                      <span className="text-gray-700 font-medium">S? ði?n tho?i ngý?i báo giá</span>
                    }
                    rules={getPhoneRules(true)}
                    extra={
                      maskedPhone
                        ? 'G?i ?: k?t thúc b?ng "' + (quoterPhone?.slice(-3) || "") + '"'
                        : undefined
                    }
                  >
                    <Input
                      placeholder="Nh?p s? ði?n tho?i"
                      size="large"
                      className="text-center tracking-wider"
                    />
                  </Form.Item>
                )}
                {verifyError && (
                  <p className="text-red-500 text-sm mb-4 bg-red-50 py-2 px-3 rounded-lg">
                    {verifyError}
                  </p>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="h-11 font-semibold"
                >
                  Xác th?c
                </Button>
              </Form>

              <div className="flex items-center justify-center gap-1 mt-6 text-xs text-gray-400">
                <LockOutlined />
                <span>K?t n?i ðý?c m? hóa b?o m?t an toàn</span>
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">#{data.code}</h1>
                <Tag
                  color={statusConfig.color}
                  icon={statusConfig.icon}
                  className="text-sm px-3 py-1 rounded-full font-medium"
                >
                  {statusConfig.label}
                </Tag>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Ngày báo giá: {data.timeAt ? formatDate(data.timeAt) : "—"}
                </span>
                <Divider type="vertical" />
                <Button icon={<PrinterOutlined />} size="middle">
                  In báo giá
                </Button>
                <Button icon={<FileExcelOutlined />} size="middle">
                  Xu?t Excel
                </Button>
              </div>
            </div>

            {data.rejectReason && (
              <Card
                size="small"
                className="mb-6 border-red-200 bg-red-50"
                styles={{ body: { padding: "12px 16px" } }}
              >
                <div className="flex items-start gap-2">
                  <CloseCircleOutlined className="text-red-500 mt-0.5" />
                  <div>
                    <span className="text-red-600 font-medium text-sm">L? do t? ch?i: </span>
                    <span className="text-red-600 text-sm">{data.rejectReason}</span>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card
                title={
                  <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Thông tin chung
                  </span>
                }
                size="small"
                className="shadow-sm"
                styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "12px 20px" } }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">M? báo giá</span>
                    <span className="text-gray-800 font-mono font-medium">{data.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Lo?i</span>
                    <span className="text-gray-800">
                      {data.type === "quotation" ? "Báo giá" : "Chào giá"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Ngý?i ph? trách</span>
                    <span className="text-gray-800">
                      {resolveByPath(data, ["staff", "name"], "—")}
                    </span>
                  </div>
                </div>
              </Card>

              <Card
                title={
                  <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Thông tin nhà cung c?p
                  </span>
                }
                size="small"
                className="shadow-sm"
                styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "12px 20px" } }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Nhà cung c?p</span>
                    <span className="text-gray-800 font-medium">
                      {resolveByPath(data, ["supplier", "name"], "—")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">MST</span>
                    <span className="text-gray-800 font-mono">
                      {resolveByPath(data, ["supplier", "taxCode"], "—")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Ngý?i liên h?</span>
                    <span className="text-gray-800">
                      {resolveByPath(data, ["quoter", "name"], "—")}
                      {quoterPhone && <span className="text-gray-400 ml-1">- {quoterPhone}</span>}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            <Card
              title={
                <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                  Hàng hóa báo giá
                </span>
              }
              className="shadow-sm"
              styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "12px 20px" } }}
            >
              <Table
                dataSource={data.lines || []}
                columns={lineCols}
                rowKey="id"
                pagination={false}
                size="middle"
                summary={() => (
                  <Table.Summary.Row className="bg-gray-50">
                    <Table.Summary.Cell index={0}>
                      <span className="font-semibold text-gray-700">T?ng c?ng</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <span className="font-semibold">{formatQuantity(total.quantity)}</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                    <Table.Summary.Cell index={3} align="right">
                      <span className="font-semibold">{formatMoney(total.subTotal)}</span>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4} />
                    <Table.Summary.Cell index={5} align="right">
                      <span className="font-semibold text-blue-700 text-base">
                        {formatMoney(total.grossAmount)}
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </Card>

            <div className="flex justify-end mt-6">
              <div className="bg-blue-600 text-white rounded-xl px-8 py-4 shadow-lg">
                <span className="text-sm opacity-90">T?ng giá tr? báo giá</span>
                <div className="text-2xl font-bold mt-0.5">
                  {formatMoney(total.grossAmount)} VNÐ
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierQuotationDetailPage;
