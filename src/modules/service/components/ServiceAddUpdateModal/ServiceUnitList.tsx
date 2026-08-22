import React, { useState } from "react";
import { Form, InputNumber } from "antd";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormSection } from "@/shared/components/form/FormSection";
import {
  Attribute,
  AttributeManagerMultipleSelect,
  AttributeManagerSelect,
  AttributeType,
} from "@/modules/attribute";
import { FormInstance } from "antd/lib";
import { Service } from "../../service.model";
import { InputMoney } from "@/shared/components/input";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";

interface Props {
  form: FormInstance<Service>;
}

export const ServiceUnitList: React.FC<Props> = ({ form }) => {
  const units: any[] = Form.useWatch("units", form) || [];
  const [selectedUnit, setSelectedUnit] = useAutoResetItem<Attribute>();

  return (
    <Form.List name="units">
      {(fields, { add, remove }) => (
        <FormSection
          title="Đơn vị tính"
          subtitle={
            <div className="flex w-[274px]">
              <div className="w-60 ml-auto mr-0">
                <AttributeManagerMultipleSelect
                  type={AttributeType.UNIT}
                  value={selectedUnit ? [selectedUnit.id] : []}
                  prefix={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
                  suffixIcon={false}
                  placeholder="Tìm đơn vị để thêm"
                  onChangeData={(values) => {
                    const unit = values[0];
                    if (!unit) return;
                    setSelectedUnit(unit);
                    add({ unitId: unit.id, unit });
                  }}
                />
              </div>
            </div>
          }
        >
          <div className="h-40 overflow-y-auto scrollbar-hide">
            <table className="w-full table-fixed">
              <colgroup>
                <col />
                <col style={{ width: 120 }} />
                <col style={{ width: 120 }} />
                <col style={{ width: 32 }} />
              </colgroup>
              {fields.map(({ key, name, ...restField }) => {
                const item = units[name] || {};
                const unitName = item.unit?.name || "—";
                return (
                  <tr key={key} className="border-b border-dashed">
                    <td className="py-1">{unitName}</td>
                    <td>
                      <Form.Item {...restField} name={[name, "costPrice"]} noStyle>
                        <InputMoney placeholder="Giá đầu vào" />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item {...restField} name={[name, "unitPrice"]} noStyle>
                        <InputMoney placeholder="Giá đầu ra" />
                      </Form.Item>
                    </td>
                    <td className="pr-1">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => remove(name)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {fields.length === 0 && (
                <p className="text-gray-400 text-sm italic py-2">Chưa có đơn vị tính nào</p>
              )}
            </table>
          </div>
        </FormSection>
      )}
    </Form.List>
  );
};
