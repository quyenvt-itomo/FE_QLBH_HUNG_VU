import React from "react";
import { Form, InputNumber } from "antd";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormSection } from "@/shared";
import { Attribute, AttributeManagerMultipleSelect, AttributeType } from "@/modules/attribute";
import { PartialProps } from ".";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { collectUnits } from "../../product.util";
import { InputMoney, InputQuantity } from "@/shared";

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
        <FormSection
          title="Đơn vị quy đổi"
          subtitle={
            <div className="flex w-[514px]">
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
            </div>
          }
        >
          <div className="flex flex-col gap-1">
            {fields.length === 0 && (
              <p className="text-gray-400 text-sm italic py-2">Chưa có đơn vị quy đổi nào</p>
            )}

            {fields.map(({ key, name, ...restField }) => {
              const item = extraUnits[name] || {};
              const unitName = item.unit?.name || "—";

              return (
                <div key={key} className="flex gap-2 items-center group relative">
                  <div className="flex border rounded-md overflow-hidden ml-auto">
                    <div className="w-36 bg-gray-100 px-3 flex items-center border-r text-sm truncate">
                      1 {unitName} =
                    </div>
                    <Form.Item
                      {...restField}
                      name={[name, "conversionRate"]}
                      noStyle
                      rules={[{ required: true, message: "SL" }]}
                    >
                      <InputQuantity className="flex items-center !w-20" variant="borderless" />
                    </Form.Item>
                    <div className="bg-gray-100 px-3 flex items-center border-x text-sm text-gray-500 min-w-[80px]">
                      {baseUnitName}
                    </div>
                    <Form.Item
                      {...restField}
                      name={[name, "pricePerUnit"]}
                      noStyle
                      rules={[{ required: true, message: "SL" }]}
                    >
                      <InputMoney
                        className="flex items-center !w-52"
                        variant="borderless"
                        placeholder="Đơn giá"
                        notRightAlign
                        suffix={
                          <span className="text-gray-400 italic text-xs">VNĐ/{unitName}</span>
                        }
                      />
                    </Form.Item>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-red-600 hover:text-red-800"
                    onClick={() => remove(name)}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </FormSection>
      )}
    </Form.List>
  );
};
