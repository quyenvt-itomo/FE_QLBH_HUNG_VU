import { Select } from "antd";
import { Ranger, RangerKey } from "../../models/base/interface";
import { InputQuantityDebounce } from "./InputQuantityDebounce";

interface InputRangeFieldProps {
  fieldKey: RangerKey;
  value?: Ranger;
  onChange: (value: Ranger) => void;
  disabled?: boolean;
}

export function InputRangeField({
  fieldKey,
  value,
  onChange,
  disabled = false,
}: InputRangeFieldProps) {
  const defaultFirstOp = "Gte";
  const defaultLastOp = "Lte";

  const firstOp =
    value?.[`${fieldKey}Gte`] != null
      ? "Gte"
      : value?.[`${fieldKey}Gt`] != null
        ? "Gt"
        : value?.[`${fieldKey}Eq`] != null
          ? "Eq"
          : defaultFirstOp;

  const lastOp =
    value?.[`${fieldKey}Lte`] != null
      ? "Lte"
      : value?.[`${fieldKey}Lt`] != null
        ? "Lt"
        : defaultLastOp;

  const firstVal = value?.[`${fieldKey}${firstOp}`] ?? undefined;
  const lastVal = value?.[`${fieldKey}${lastOp}`] ?? undefined;

  const disabledLast = firstOp === "Eq";

  const clearFirstOps = (obj: Ranger) => {
    delete obj[`${fieldKey}Gte`];
    delete obj[`${fieldKey}Gt`];
    delete obj[`${fieldKey}Eq`];
  };

  const clearLastOps = (obj: Ranger) => {
    delete obj[`${fieldKey}Lte`];
    delete obj[`${fieldKey}Lt`];
  };

  const handleFirstOpChange = (op: string) => {
    const v = firstVal ?? 0;

    const newValue: Ranger = { ...value };
    clearFirstOps(newValue);

    if (op === "Eq") {
      clearLastOps(newValue);
    }

    onChange({
      ...newValue,
      [`${fieldKey}${op}`]: v,
    });
  };

  const handleLastOpChange = (op: string) => {
    const v = lastVal ?? 0;

    const newValue: Ranger = { ...value };
    clearLastOps(newValue);

    onChange({
      ...newValue,
      [`${fieldKey}${op}`]: v,
    });
  };

  const handleFirstValueChange = (v?: number) => {
    const newValue: Ranger = { ...value };

    if (v == null) {
      clearFirstOps(newValue);
      onChange(newValue);
      return;
    }

    onChange({
      ...newValue,
      [`${fieldKey}${firstOp}`]: v || undefined,
    });
  };

  const handleLastValueChange = (v?: number) => {
    const newValue: Ranger = { ...value };

    if (v == null) {
      clearLastOps(newValue);
      onChange(newValue);
      return;
    }

    onChange({
      ...newValue,
      [`${fieldKey}${lastOp}`]: v || undefined,
    });
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="flex w-full items-center overflow-hidden rounded-lg border border-gray-300 hover:border-primary transition">
        <Select
          tabIndex={-1}
          disabled={disabled}
          value={firstOp}
          onChange={handleFirstOpChange}
          options={[
            { value: "Gte", label: "≥" },
            { value: "Gt", label: ">" },
            { value: "Eq", label: "=" },
          ]}
          bordered={false}
          suffixIcon={null}
          className="h-8 !w-8 shrink-0 !border-none !shadow-none"
        />

        <div className="w-px h-6 bg-gray-300" />

        <InputQuantityDebounce
          value={firstVal}
          disabled={disabled}
          onChange={handleFirstValueChange}
          className="!border-none !shadow-none !ring-0"
          placeholder="Từ..."
          notRightAlign
        />
      </div>

      <span>-</span>

      <div
        className={`
        flex w-full items-center overflow-hidden rounded-lg
        border border-gray-300 hover:border-primary transition
        ${disabledLast || disabled ? "bg-[#e9e9e9] pointer-events-none" : ""}
        `}
      >
        <Select
          tabIndex={-1}
          disabled={disabledLast || disabled}
          value={lastOp}
          onChange={handleLastOpChange}
          options={[
            { value: "Lte", label: "≤" },
            { value: "Lt", label: "<" },
          ]}
          bordered={false}
          suffixIcon={null}
          className="h-8 !w-8 shrink-0 !border-none !shadow-none"
        />

        <div className="w-px h-6 bg-gray-300" />

        <InputQuantityDebounce
          value={lastVal}
          disabled={disabledLast || disabled}
          onChange={handleLastValueChange}
          className="!border-none !shadow-none !ring-0"
          placeholder="Đến..."
          notRightAlign
        />
      </div>
    </div>
  );
}
