import React from "react";
import { Form } from "antd";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormSection, Label } from "@/shared/components";
import { Attribute } from "@/modules/attribute/attribute.model";
import { AttributeManagerMultipleSelect } from "@/modules/attribute/components/Select";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { PartialProps } from ".";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { collectUnits } from "../../product.util";
import { InputMoney, InputQuantity } from "@/shared/components";

export const ExtraUnitList: React.FC<PartialProps> = ({ form }) => {
  const formValues = Form.useWatch([], form) || {};
  const extraUnits = Form.useWatch("extraUnits", form) || [];
  const baseUnit = Form.useWatch("baseUnit", form);
  const baseUnitName = baseUnit?.name || "ĐVCB";
  const [selectedUnit, setSelectedUnit] = useAutoResetItem<Attribute>();

  const hideUnits = collectUnits(formValues);

  return (
    <Form.List name="extraUnits">
      {(fields, { add, remove }) => (
        <div className="border rounded-xl p-6 pr-0 mt-4 flex-1">
          <FormSection
            title="Đơn vị quy đổi"
            subtitle={
              <div className="w-96 ml-auto mr-0">
                <AttributeManagerMultipleSelect
                  type={AttributeType.UNIT}
                  value={selectedUnit ? [selectedUnit?.id] : undefined}
                  hideOptions={hideUnits}
                  prefix={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                  suffixIcon={false}
                  placeholder="Tìm kiếm đơn vị tính để thêm"
                  onChangeData={(values) => {
                    const unit = values?.[0];
                    if (!unit) return;
                    setSelectedUnit(unit);
                    add({ unitId: unit.id, unit, conversionRate: 1 });
                  }}
                />
              </div>
            }
          >
            <div className="flex flex-col gap-2">
              {fields.length === 0 && (
                <p className="text-gray-400 text-sm italic py-2">Chưa có đơn vị quy đổi nào</p>
              )}

              {fields.map(({ key, name, ...restField }) => {
                const item = extraUnits[name] || {};
                const unitName = item.unit?.name || "—";

                return (
                  <div key={key} className="flex items-center gap-3 rounded-md border px-3 pt-2">
                    <div className="w-48">
                      <div className="font-medium">
                        {item.unit?.name || item.unitId || unitName}
                      </div>
                      <div className="text-xs text-gray-400">
                        1 {unitName} = {item.conversionRate || 1} {baseUnitName}
                      </div>
                    </div>

                    <Form.Item
                      {...restField}
                      name={[name, "conversionRate"]}
                      label={<Label title="Quy đổi" />}
                      className="mb-0 w-36"
                      rules={[{ required: true, message: "Nhập tỷ lệ quy đổi" }]}
                    >
                      <InputQuantity notRightAlign />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "salePrice"]}
                      label={<Label title="Giá bán" />}
                      className="mb-0 w-56"
                      rules={[{ required: true, message: "Nhập giá bán" }]}
                    >
                      <InputMoney
                        placeholder="Đơn giá bán"
                        notRightAlign
                        suffix={
                          <span className="text-gray-400 italic text-xs">VNĐ/{unitName}</span>
                        }
                      />
                    </Form.Item>

                    <button
                      type="button"
                      className="p-1 text-red-600 hover:text-red-800"
                      onClick={() => remove(name)}
                      aria-label="Xóa đơn vị quy đổi"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </FormSection>
        </div>
      )}
    </Form.List>
  );
};
