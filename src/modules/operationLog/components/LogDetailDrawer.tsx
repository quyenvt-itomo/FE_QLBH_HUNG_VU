import {
  CheckCircleFilled,
  CloseCircleFilled,
  CodeOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { App, App as AntApp, Avatar, Collapse, Drawer, Tag, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { OperationLog } from "../operationLog.model";
import LogChangesDiff from "./LogChangesDiff";
import { getActionLabel, getEntityLabel, getFieldLabel, humanizeFieldName } from "./logLabels";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";

const { Text, Paragraph } = Typography;

const ACTION_COLORS: Record<string, string> = {
  create: "green",
  update: "blue",
  delete: "red",
  login: "purple",
  logout: "default",
  approve: "cyan",
  reject: "volcano",
  cancel: "orange",
  export: "geekblue",
  import: "geekblue",
  confirmCollect: "green",
  sync: "blue",
  retry: "gold",
  upload: "blue",
};

function actionColor(action: string): string {
  if (ACTION_COLORS[action]) return ACTION_COLORS[action];
  if (action.includes("Approve") || action.includes("approve")) return "cyan";
  if (action.includes("Reject") || action.includes("reject")) return "volcano";
  if (action.includes("Confirm") || action.includes("confirm")) return "green";
  return "default";
}

const PRIMARY_FIELDS_BY_ENTITY: Record<string, string[]> = {
  user: ["code", "name", "phone", "email", "roleId", "branchId", "isActive"],
  employee: [
    "code",
    "name",
    "phone",
    "email",
    "gender",
    "dob",
    "identityNumber",
    "address",
    "branchId",
  ],
  branch: ["code", "name", "address", "phone", "managerId", "isActive"],
  company: ["name", "code", "taxCode", "address", "phone", "email"],
  product: ["code", "name", "categoryId", "unitId", "price", "cost", "isActive"],
  partner: ["code", "name", "type", "phone", "email", "address", "debtAmount", "isActive"],
  warehouse: ["code", "name", "address", "branchId", "isActive"],
  purchase: [
    "code",
    "supplierId",
    "totalAmount",
    "paidAmount",
    "debtAmount",
    "status",
    "orderDate",
  ],
  salesOrder: [
    "code",
    "customerId",
    "totalAmount",
    "paidAmount",
    "debtAmount",
    "status",
    "orderDate",
  ],
  directSale: ["code", "customerId", "totalAmount", "paidAmount", "status", "orderDate"],
  production: ["code", "productId", "quantity", "startDate", "expectedCompletedAt", "status"],
  stockDocument: ["code", "type", "warehouseId", "totalAmount", "status", "referenceType"],
  warehouseTransfer: ["code", "fromWarehouseId", "toWarehouseId", "totalAmount", "status"],
  inventoryAdjustment: ["code", "warehouseId", "status"],
  inventoryLot: ["code", "productId", "warehouseId", "quantity", "expiryDate", "status"],
  fund: ["code", "name", "balance", "branchId", "isActive"],
  incomeExpense: ["code", "type", "fundId", "categoryId", "amount", "date"],
  priceList: ["code", "name", "type", "startDate", "endDate", "isActive"],
  billOfMaterial: ["code", "productId", "quantity"],
  role: ["name", "description", "isActive"],
};

const SKIP_FIELDS = new Set([
  "id",
  "creatorId",
  "creatorSnapshot",
  "updaterId",
  "updaterSnapshot",
  "creator",
  "updater",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "requestId",
  "actorId",
  "actorSnapshot",
  "actor",
  "targetEntity",
  "targetId",
  "branchId",
  "requestBody",
  "targetSnapshot",
  "changes",
  "metadata",
  "ipAddress",
  "userAgent",
  "method",
  "endpoint",
  "error",
  "success",
  "branch",
  "role",
  "user",
  "supplier",
  "customer",
  "items",
  "details",
  "files",
  "file",
  "images",
  "avatar",
  "bankAccount",
  "address",
  "actorId",
  "branchId",
]);

function CopyableText({ value }: { value: string }) {
  const { message } = AntApp.useApp();
  return (
    <Tooltip title="Sao chép">
      <span
        className="inline-flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 font-mono text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        onClick={() => {
          navigator.clipboard?.writeText(value).then(
            () => message.success("Đã sao chép"),
            () => message.error("Không thể sao chép"),
          );
        }}
      >
        {value}
        <CopyOutlined style={{ fontSize: 11 }} />
      </span>
    </Tooltip>
  );
}

function InfoBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-sm text-slate-800">
        {children || <span className="text-slate-400">—</span>}
      </div>
    </div>
  );
}

function StatusTag({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Tag
      color={ok ? "success" : "error"}
      icon={ok ? <CheckCircleFilled /> : <CloseCircleFilled />}
      className="!m-0 !px-2.5 !py-0.5"
    >
      {text}
    </Tag>
  );
}

function SnapshotGrid({
  snapshot,
  entity,
}: {
  snapshot: Record<string, unknown> | null;
  entity: string;
}) {
  if (!snapshot || Object.keys(snapshot).length === 0) {
    return <Text type="secondary">Không có dữ liệu</Text>;
  }

  const primaryOrder = PRIMARY_FIELDS_BY_ENTITY[entity] || [];
  const entries = Object.entries(snapshot).filter(([k]) => !SKIP_FIELDS.has(k));

  const ordered: [string, unknown][] = [];
  primaryOrder.forEach((key) => {
    if (snapshot[key] !== undefined) ordered.push([key, snapshot[key]]);
  });
  entries.forEach(([k, v]) => {
    if (!primaryOrder.includes(k) && v !== null && v !== undefined && v !== "") {
      ordered.push([k, v]);
    }
  });

  if (ordered.length === 0) {
    return <Text type="secondary">Không có dữ liệu hiển thị</Text>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
      {ordered.map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <span className="text-xs text-slate-500">{getFieldLabel(entity, key)}</span>
          <span className="break-words text-sm text-slate-800">
            {renderValue(value, entity, key)}
          </span>
        </div>
      ))}
    </div>
  );
}

function renderValue(value: unknown, entity: string, field: string): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }
  if (typeof value === "boolean") {
    return value ? (
      <Tag color="green" className="!m-0">
        Có
      </Tag>
    ) : (
      <Tag className="!m-0">Không</Tag>
    );
  }
  if (Array.isArray(value)) {
    return (
      <span className="text-slate-600">
        {value.length} mục
        <Tooltip title={<pre className="text-[11px]">{JSON.stringify(value, null, 2)}</pre>}>
          <InfoCircleOutlined className="ml-1.5 text-slate-400" />
        </Tooltip>
      </span>
    );
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === "string") return obj.name;
    if (typeof obj.code === "string") return obj.code;
    return (
      <Tooltip title={<pre className="text-[11px]">{JSON.stringify(value, null, 2)}</pre>}>
        <span className="cursor-help text-blue-600 underline decoration-dotted underline-offset-2">
          Xem chi tiết
        </span>
      </Tooltip>
    );
  }
  return String(value);
}

const LogDetailDrawer: React.FC<{
  open: boolean;
  log: OperationLog | null;
  onClose: () => void;
}> = ({ open, log, onClose }) => {
  const { modal } = App.useApp();
  const [showRaw, setShowRaw] = useState(false);

  const summary = useMemo(() => {
    if (!log) return "";
    const actorName = log.actorSnapshot?.name || "Hệ thống";
    const action = getActionLabel(log.action);
    const target = getEntityLabel(log.targetEntity);
    const code =
      (log.targetSnapshot as any)?.code || (log.targetSnapshot as any)?.name || log.targetId || "";
    return `${actorName} · ${action}${log.targetEntity ? ` · ${target}` : ""}${code ? ` · ${code}` : ""}`;
  }, [log]);

  if (!log) return null;
  console.log("log", log);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={760}
      destroyOnClose
      title={
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Tag color={actionColor(log.action)} className="!m-0">
              {getActionLabel(log.action)}
            </Tag>
            <span className="text-base font-semibold text-slate-800">
              {getEntityLabel(log.targetEntity)}
            </span>
            {(log.targetSnapshot as any)?.code && (
              <span className="font-mono text-sm text-slate-500">
                · {(log.targetSnapshot as any).code}
              </span>
            )}
          </div>
          <Text type="secondary" className="!text-xs">
            {formatDateTimeDDMMYYYY(log.createdAt)} · Mã log: {log.id}
          </Text>
        </div>
      }
      extra={
        <div className="flex items-center gap-2">
          <StatusTag ok={log.success} text={log.success ? "Thành công" : "Thất bại"} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Tóm tắt hành động */}
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Tóm tắt thao tác
          </div>
          <Paragraph className="!mb-0 !text-sm !text-slate-800">{summary}</Paragraph>
        </div>

        {/* Người thao tác */}
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2">
            <UserOutlined className="text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Người thực hiện</span>
          </div>
          <div className="flex items-start gap-3">
            <Avatar size={48} className="flex-shrink-0 bg-blue-500">
              {log.creatorSnapshot?.name?.[0]?.toUpperCase() || <UserOutlined />}
            </Avatar>
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
              <InfoBlock icon={null} label="Họ tên">
                {log.creatorSnapshot?.name || "—"}
              </InfoBlock>
              <InfoBlock icon={null} label="Mã ND">
                {log.creatorSnapshot?.code && <CopyableText value={log.creatorSnapshot.code} />}
              </InfoBlock>
            </div>
          </div>
        </div>

        {/* Đối tượng */}
        {log.targetSnapshot && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <TagOutlined className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">
                Dữ liệu đối tượng sau thao tác
              </span>
            </div>
            <SnapshotGrid snapshot={log.targetSnapshot} entity={log.targetEntity} />
          </div>
        )}

        {/* Changes diff */}
        {log.changes && log.changes.length > 0 && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                Thay đổi dữ liệu ({log.changes.length} trường)
              </span>
            </div>
            <LogChangesDiff changes={log.changes} entity={log.targetEntity} />
          </div>
        )}

        {/* Error block */}
        {!log.success && log.error && (
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CloseCircleFilled className="text-red-500" />
              <span className="text-sm font-semibold text-red-700">Lỗi thao tác</span>
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              {log.error.message && (
                <div>
                  <span className="text-slate-500">Mô tả: </span>
                  <span className="text-slate-800">{log.error.message}</span>
                </div>
              )}
              {log.error.code !== undefined && log.error.code !== null && (
                <div>
                  <span className="text-slate-500">Mã lỗi: </span>
                  <span className="font-mono text-slate-800">{String(log.error.code)}</span>
                </div>
              )}
              {log.error.statusCode !== undefined && log.error.statusCode !== null && (
                <div>
                  <span className="text-slate-500">HTTP status: </span>
                  <Tag color={log.error.statusCode >= 500 ? "red" : "orange"}>
                    {log.error.statusCode}
                  </Tag>
                </div>
              )}
              {log.error.name && (
                <div>
                  <span className="text-slate-500">Loại: </span>
                  <span className="font-mono text-slate-800">{log.error.name}</span>
                </div>
              )}
              {log.error.errors && log.error.errors.length > 0 && (
                <div>
                  <span className="text-slate-500">Chi tiết lỗi: </span>
                  <ul className="list-disc pl-5">
                    {log.error.errors.map((err, index) => (
                      <li key={index} className="text-slate-800">
                        {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Request body */}
        {log.requestBody && Object.keys(log.requestBody).length > 0 && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CodeOutlined className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-800">Dữ liệu gửi đi</span>
              </div>
            </div>
            <pre className="max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {JSON.stringify(log.requestBody, null, 2)}
            </pre>
          </div>
        )}

        {/* Metadata block */}
        {log.metadata && Object.keys(log.metadata).length > 0 && (
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2">
              <InfoCircleOutlined className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">Thông tin bổ sung</span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(log.metadata).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-slate-500">{humanizeFieldName(k)}</span>
                  <span className="break-words text-sm text-slate-800">
                    {renderValue(v, log.targetEntity, k)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical details (collapsible) */}
        <Collapse
          ghost
          items={[
            {
              key: "tech",
              label: (
                <span className="text-sm font-semibold text-slate-600">
                  Thông tin kỹ thuật (dành cho IT)
                </span>
              ),
              children: (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoBlock icon={<GlobalOutlined />} label="Địa chỉ IP">
                    {log.ipAddress ? <CopyableText value={log.ipAddress} /> : "—"}
                  </InfoBlock>
                  <InfoBlock icon={<EnvironmentOutlined />} label="Endpoint">
                    <span className="font-mono text-xs">
                      {log.method && (
                        <Tag
                          color={
                            log.method === "GET"
                              ? "blue"
                              : log.method === "POST"
                                ? "green"
                                : log.method === "PUT" || log.method === "PATCH"
                                  ? "orange"
                                  : "red"
                          }
                          className="!mr-1.5"
                        >
                          {log.method}
                        </Tag>
                      )}
                      {log.endpoint || "—"}
                    </span>
                  </InfoBlock>
                  <InfoBlock icon={null} label="Mã log">
                    <CopyableText value={log.id} />
                  </InfoBlock>
                  <InfoBlock icon={null} label="Mã yêu cầu">
                    {log.requestId ? <CopyableText value={log.requestId} /> : "—"}
                  </InfoBlock>
                  <InfoBlock icon={null} label="Thời gian tạo">
                    {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </InfoBlock>
                  {log.updatedAt && log.updatedAt !== log.createdAt && (
                    <InfoBlock icon={null} label="Cập nhật lần cuối">
                      {dayjs(log.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                    </InfoBlock>
                  )}
                  {log.userAgent && (
                    <div className="md:col-span-2">
                      <InfoBlock icon={null} label="Trình duyệt / thiết bị">
                        <span className="break-all text-xs text-slate-600">{log.userAgent}</span>
                      </InfoBlock>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: "raw",
              label: (
                <span className="text-sm font-semibold text-slate-600">Dữ liệu thô (JSON)</span>
              ),
              children: (
                <div>
                  <button
                    onClick={() => setShowRaw((v) => !v)}
                    className="mb-2 text-xs text-blue-600 hover:underline"
                  >
                    {showRaw ? "Ẩn" : "Hiện"} toàn bộ JSON
                  </button>
                  {showRaw && (
                    <pre className="max-h-80 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </Drawer>
  );
};

export default LogDetailDrawer;
