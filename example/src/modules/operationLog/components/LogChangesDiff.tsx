import { ArrowRightOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Empty, Tag } from "antd";
import { OperationChangeItem } from "../operationLog.model";
import { getEnumLabel, getFieldLabel } from "./logLabels";
import { formatMoney } from "@/shared/utils/number.util";
import { formatDateTimeDDMMYYYY } from "@/shared/utils/date.util";

const MONEY_FIELDS = new Set([
  "amount",
  "total",
  "totalAmount",
  "paidAmount",
  "debtAmount",
  "paid",
  "debt",
  "fee",
  "rate",
  "commissionRate",
]);

const DATE_FIELDS = new Set(["date", "createdAt", "updatedAt", "issuedDate", "dueDate"]);

function formatValue(entity: string, field: string, value: unknown): string {
  if (!field) return "";

  if (value === null || value === undefined || value === "") return "—";
  const last = field.split(".").pop() || field;
  if (MONEY_FIELDS.has(last) && typeof value === "number") {
    return formatMoney(value);
  }
  if (DATE_FIELDS.has(last) && typeof value === "string") {
    return formatDateTimeDDMMYYYY(value);
  }
  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "object") return JSON.stringify(value);
  return getEnumLabel(entity, field, value);
}

function ChangeRow({ change, entity }: { change: OperationChangeItem; entity: string }) {
  const fieldLabel = getFieldLabel(entity, change.path);
  const beforeText = formatValue(entity, change.path, change.before);
  const afterText = formatValue(entity, change.path, change.after);

  const isAdded = change.before === null || change.before === undefined || change.before === "";
  const isRemoved = change.after === null || change.after === undefined || change.after === "";

  const isMoney = MONEY_FIELDS.has(change.path.split(".").pop() || change.path);
  const delta =
    isMoney && typeof change.before === "number" && typeof change.after === "number"
      ? change.after - change.before
      : null;

  if (change.path === "createdAt" || change.path === "updatedAt" || change.path === "password") {
    return null; // Skip rendering for these fields
  }

  return (
    <div className="grid grid-cols-12 gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0 hover:bg-slate-50/60">
      <div className="col-span-4 flex flex-col">
        <span className="text-sm font-medium text-slate-800">{fieldLabel}</span>
        <span className="font-mono text-[11px] text-slate-400">{change.path}</span>
      </div>

      <div className="col-span-4">
        {!!beforeText && (
          <div
            className={`break-words rounded border px-2.5 py-1.5 text-sm
              border-slate-200 bg-slate-50 text-slate-600 line-through decoration-slate-300`}
          >
            {beforeText}
          </div>
        )}
      </div>

      <div className="col-span-1 flex items-center justify-center text-slate-400">
        <ArrowRightOutlined />
      </div>

      <div className="col-span-3">
        {!!afterText && (
          <div
            className={`break-words rounded border px-2.5 py-1.5 text-sm ${
              isRemoved
                ? "border-red-200 bg-red-50 text-red-700"
                : isAdded
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-emerald-200 bg-emerald-50/60 text-slate-800"
            }`}
          >
            {isRemoved ? <Tag color="red">Đã xóa</Tag> : afterText}
          </div>
        )}
        {delta !== null && delta !== 0 && (
          <div
            className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
              delta > 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {delta > 0 ? <PlusOutlined /> : <MinusOutlined />}
            {new Intl.NumberFormat("vi-VN").format(Math.abs(delta))}
          </div>
        )}
      </div>
    </div>
  );
}

const LogChangesDiff: React.FC<{
  changes: OperationChangeItem[] | null;
  entity: string;
}> = ({ changes, entity }) => {
  if (!changes || changes.length === 0) {
    return (
      <div className="py-4">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có thay đổi dữ liệu nào được ghi nhận"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <div className="grid grid-cols-12 gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <div className="col-span-4">Trường dữ liệu</div>
        <div className="col-span-4">Giá trị cũ</div>
        <div className="col-span-1 text-center">→</div>
        <div className="col-span-3">Giá trị mới</div>
      </div>
      <div>
        {changes.map((c, i) => (
          <ChangeRow key={`${c.path}-${i}`} change={c} entity={entity} />
        ))}
      </div>
    </div>
  );
};

export default LogChangesDiff;
