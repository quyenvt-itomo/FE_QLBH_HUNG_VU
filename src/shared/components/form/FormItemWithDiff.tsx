import { Form } from "antd";
import { useRef } from "react";
import type { FormItemProps } from "antd/lib";

interface FormItemWithDiffProps extends Omit<FormItemProps, "help" | "validateStatus"> {
  /** The original value from editData */
  originalValue: unknown;
  /** Optional custom renderer for the original value (e.g., for select labels) */
  renderValue?: (value: unknown) => string | number | undefined;
  /** Custom label for the warning message (default: "Giá trị cũ") */
  warningLabel?: string;
}

/**
 * Wraps Ant Design Form.Item and shows a warning (validateStatus="warning") when
 * the current value differs from the original. The warning appears in the same
 * position as validation errors (using Form.Item's help prop), so it inherits
 * any absolute-positioning CSS applied to .ant-form-item-explain-error.
 *
 * Only shows when:
 * - The value has changed from original
 * - There are no validation errors (error takes priority)
 */
const FormItemWithDiff: React.FC<FormItemWithDiffProps> = ({
  originalValue,
  renderValue,
  warningLabel = "Giá trị cũ",
  name,
  children,
  ...formItemProps
}) => {
  // Track whether the field has been initialized (setFieldsValue has run).
  // Before initialization, undefined means "not yet populated" → no warning.
  // After initialization, undefined means "user cleared" → show warning.
  const wasInitializedRef = useRef(false);

  return (
    <Form.Item noStyle shouldUpdate={() => true}>
      {({ getFieldValue, getFieldError }) => {
        const currentValue = getFieldValue(name!);
        const errors = getFieldError(name!);
        const hasError = errors.length > 0;

        if (currentValue !== undefined) {
          wasInitializedRef.current = true;
        }

        const isDirty =
          originalValue != null &&
          originalValue !== "" &&
          currentValue !== originalValue &&
          (currentValue !== undefined || wasInitializedRef.current);

        const displayValue = renderValue
          ? renderValue(originalValue)
          : originalValue != null
            ? String(originalValue)
            : "";

        return (
          <Form.Item
            {...formItemProps}
            name={name}
            validateStatus={!hasError && isDirty ? "warning" : undefined}
            help={!hasError && isDirty ? `${warningLabel}: ${displayValue}` : undefined}
          >
            {children}
          </Form.Item>
        );
      }}
    </Form.Item>
  );
};

export { FormItemWithDiff };
