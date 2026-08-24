import { Checkbox, Form, FormInstance, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import "./PermissionSelect.css";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  getPermissionOptions,
  Module,
  moduleMap,
  permissionMap,
} from "@/shared/constants/permission";
import { CLASSNAME } from "@/shared/constants/ui";

interface PermissionSelectProps {
  module: Module;
  form: FormInstance;
  disabled?: boolean;
}

const PermissionSelect: React.FC<PermissionSelectProps> = ({ module, form, disabled = false }) => {
  const permissionOptions = useMemo(() => getPermissionOptions(module), [module]);

  const allPermissionValues = useMemo(
    () => permissionOptions?.filter((opt) => opt.value).map((opt) => opt.value) || [],
    [permissionOptions],
  );

  const fieldPath = useMemo(() => ["permissions", module], [module]);
  const watchedModuleValue = Form.useWatch(fieldPath, form) as string[] | undefined;
  const moduleValue = watchedModuleValue ?? [];

  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

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

    form.setFieldValue(fieldPath, [...moduleValue, "read"]);
  }, [form, fieldPath, moduleValue]);

  const handleCheckboxChange = (checked: boolean) => {
    setChecked(checked);
    setIndeterminate(false);

    form.setFieldValue(fieldPath, checked ? allPermissionValues : []);
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

  if (!permissionOptions) return null;

  return (
    <div key={module} className="flex items-center gap-3 group">
      {/* LEFT */}
      <div className="flex items-center gap-2 justify-between flex-1 min-w-40">
        <label
          className="min-w-[140px] max-w-[220px] truncate group-hover:text-blue-500"
          title={moduleMap[module]}
        >
          {moduleMap[module]}
        </label>

        <Checkbox
          className="permission-checkbox shrink-0"
          checked={checked}
          indeterminate={indeterminate}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          disabled={disabled}
        />
      </div>

      {/* RIGHT */}
      <div className="relative select-none cursor-pointer shrink-0">
        <Form.Item name={fieldPath} noStyle>
          <Select
            mode="multiple"
            tagRender={() => <></>}
            options={permissionOptions}
            className={`w-52 ${CLASSNAME.inputHeight} cursor-pointer`}
            suffixIcon={<ChevronDownIcon className="h-3.5" />}
            disabled={disabled}
          />
        </Form.Item>

        <div className="absolute w-full h-full top-0 left-3 flex items-center pointer-events-none text-sm text-gray-700 dark:text-slate-300">
          {handleTagPlaceholder()}
        </div>
      </div>
    </div>
  );
};

export { PermissionSelect };
