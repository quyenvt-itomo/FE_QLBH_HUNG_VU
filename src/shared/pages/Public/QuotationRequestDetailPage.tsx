import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spin, Card, Descriptions, TableProps } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Organization, useOrganizationStore } from "@/modules/organization";
import {
  QuotationRequest,
  QuotationRequestLine,
  useQuotationRequestStore,
} from "@/modules/quotationRequest";
import { StoreImage } from "@/shared";
import { getMainFile } from "@/shared/utils/file.util";
import { formatDateTime, formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";
import { formatQuantity } from "@/shared/utils/number.util";
import { ApproveStatus } from "@/modules/shared/business.model";
import { resolveByPath } from "@/shared/utils/common.util";
import { DocumentGroup } from "@/shared";
import { ApproveStatusTag } from "@/shared";

const QuotationRequestDetailPage: React.FC = () => {
  const { companyCode, code } = useParams();
  const [company, setStore] = useState<Organization | null>(null);
  const [data, setData] = useState<QuotationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const { getByCode: getOrgByCode } = useOrganizationStore({ isLocked: true });
  const { getByCodePublic } = useQuotationRequestStore({ isLocked: true });

  useEffect(() => {
    if (!companyCode) return;
    (async () => {
      const org = await getOrgByCode(companyCode);
      setStore(org);
      if (org) localStorage.setItem("x-store-id", org.id);
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

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );

  const isApproved = data?.approveStatus === ApproveStatus.APPROVED;
  const isRejected = data?.approveStatus === ApproveStatus.REJECTED;

  const statusConfig = isApproved
    ? { color: "green", icon: <CheckCircleOutlined />, label: "Đã tiếp nhận" }
    : isRejected
      ? { color: "red", icon: <CloseCircleOutlined />, label: "Đã từ chối" }
      : { color: "orange", icon: <ClockCircleOutlined />, label: "Đang chờ duyệt" };

  const lineCols: TableProps<QuotationRequestLine>["columns"] = [
    {
      title: "STT",
      key: "idx",
      width: 50,
      align: "center",
      render: (_: any, __: any, i: number) => i + 1,
    },
    {
      title: "HÀNG HÓA",
      key: "product",
      width: 280,
      render: (_: any, r: QuotationRequestLine) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {resolveByPath(r, ["product", "name"]) || "—"}
          </span>
        </div>
      ),
    },
    {
      title: "ĐVT",
      key: "unit",
      width: 80,
      render: (_: any, r: QuotationRequestLine) => resolveByPath(r, ["unit", "name"]) || "—",
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      align: "right",
      render: (v: number) => <span className="font-medium">{formatQuantity(v)}</span>,
    },
    {
      title: "GHI CHÚ",
      dataIndex: "note",
      key: "note",
      render: (v: string) => v || "—",
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
            Chi tiết đề nghị báo giá
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl px-6 py-6">
        {!data ? (
          <Card className="text-center py-16">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">Không tìm thấy yêu cầu báo giá</p>
            <p className="text-gray-400 text-sm mt-1">Liên hệ với công ty để biết thêm chi tiết</p>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">#{data.code}</h1>
                <ApproveStatusTag value={data.approveStatus} size="lg" variant="solid" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  Ngày yêu cầu: {data.timeAt ? formatDateTime(data.timeAt) : "—"}
                </span>
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
                    <span className="text-red-600 font-medium text-sm">Lý do từ chối: </span>
                    <span className="text-red-600 text-sm">{data.rejectReason}</span>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card
                title={
                  <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Thông tin khách hàng
                  </span>
                }
                size="small"
                className="shadow-sm"
                styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "12px 20px" } }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Tên đơn vị">
                    {resolveByPath(data, ["customer", "name"]) || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="MST">
                    {resolveByPath(data, ["customer", "taxCode"]) || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="SĐT">
                    {resolveByPath(data, ["customer", "phone"]) || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Người yêu cầu">
                    {resolveByPath(data, ["requester", "name"]) || "—"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Card
                title={
                  <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    Thông tin yêu cầu
                  </span>
                }
                size="small"
                className="shadow-sm"
                styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "12px 20px" } }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Mã yêu cầu">{data.code}</Descriptions.Item>
                  <Descriptions.Item label="Ngày yêu cầu">
                    {formatDateTimeDDMMYYYY(data.timeAt)}
                  </Descriptions.Item>
                </Descriptions>

                <div className="flex flex-col mt-4">
                  <DocumentGroup files={data.document} />
                </div>
              </Card>
            </div>

            <Card
              title={
                <span className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
                  Hàng hóa yêu cầu báo giá
                </span>
              }
              className="shadow-sm"
              styles={{
                header: { borderBottom: "1px solid #f0f0f0", padding: "6px 16px" },
                body: { padding: 0 },
              }}
            >
              <Table
                dataSource={data.lines || []}
                columns={lineCols}
                rowKey="id"
                pagination={false}
                size="small"
                summary={() => {
                  const totalQty = (data.lines || []).reduce((s, l) => s + (l.quantity || 0), 0);
                  return (
                    <Table.Summary.Row className="bg-gray-50">
                      <Table.Summary.Cell index={0}>
                        <span className="font-semibold text-gray-700">Tổng</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} />
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} align="right">
                        <span className="font-semibold">{formatQuantity(totalQty)}</span>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} />
                    </Table.Summary.Row>
                  );
                }}
              />
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default QuotationRequestDetailPage;
