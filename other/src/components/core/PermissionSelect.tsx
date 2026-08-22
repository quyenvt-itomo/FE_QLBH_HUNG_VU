import { Checkbox, Form, FormInstance, Select } from "antd";
import {
  getPermissionOptionsByContext,
  Module,
  moduleMap,
  PermissionContext,
  permissionMap,
} from "../../constants/permission";
import { useEffect, useMemo, useState } from "react";
import "./PermissionSelect.css";
import { IconArrowDown } from "../icon/ArrowDown";

interface PermissionSelectProps {
  context: PermissionContext;
  module: Module;
  form: FormInstance;
  disabled?: boolean;
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({
  context,
  module,
  form,
  disabled = false,
}) => {
  const permissionOptions = useMemo(
    () => getPermissionOptionsByContext(module, context),
    [module, context],
  );

  const allPermissionValues = useMemo(
    () => permissionOptions?.filter((opt) => opt.value).map((opt) => opt.value) || [],
    [permissionOptions],
  );

  const moduleValue: string[] = Form.useWatch(module, form) || [];

  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  if (!permissionOptions) return null;

  useEffect(() => {
    if (!moduleValue || moduleValue.length === 0) {
      setChecked(false);
      setIndeterminate(false);
    } else if (
      moduleValue.length >= allPermissionValues.length &&
      allPermissionValues.every((p) => moduleValue.includes(p))
    ) {
      setChecked(true);
      setIndeterminate(false);
    } else {
      setChecked(false);
      setIndeterminate(true);
    }
  }, [moduleValue, allPermissionValues]);

  useEffect(() => {
    if (moduleValue.length === 0 || moduleValue.includes("read")) return;

    form.setFieldValue(module, [...moduleValue, "read"]);
  }, [moduleValue]);

  const handleCheckboxChange = (checked: boolean) => {
    setChecked(checked);
    setIndeterminate(false);

    form.setFieldValue(module, checked ? allPermissionValues : []);
  };

  const handleTagPlaceholder = () => {
    if (!moduleValue.length) return "Không có";

    if (moduleValue.length === permissionOptions.length) return "Toàn quyền";

    return permissionOptions
      .map((opt) => opt.value)
      .filter((val) => moduleValue.includes(val))
      .map((key) => permissionMap[key as keyof typeof permissionMap])
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div key={module} className="flex items-center gap-3 custom-permission-select group">
      <div
        className="flex items-center gap-2 justify-between"
        style={{
          width: "calc(100% - 268px)",
        }}
      >
        <label
          className="min-w-[100px] truncate group-hover:text-blue-500"
          title={moduleMap[module]}
        >
          {moduleMap[module]}
        </label>
        <Checkbox
          className="permission-checkbox"
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          disabled={disabled}
        />
      </div>
      <div className="relative select-none cursor-pointer">
        <Form.Item name={module} noStyle>
          <Select
            mode="multiple"
            tagRender={() => <></>}
            options={permissionOptions}
            className="w-64 h-8 cursor-pointer"
            suffixIcon={<IconArrowDown />}
            disabled={disabled}
          />
        </Form.Item>
        <div className="absolute w-full h-full top-0 left-3 flex items-center pointer-events-none cursor-pointer text-sm text-gray-700">
          {handleTagPlaceholder()}
        </div>
      </div>
    </div>
  );
};

export default PermissionSelect;
