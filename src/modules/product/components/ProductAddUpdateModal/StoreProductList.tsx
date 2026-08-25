import React from "react";
import { Form, FormInstance, InputNumber, Switch } from "antd";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";

import { FormSection, InputMoney, Label } from "@/shared/components";
import { StoreSelect } from "@/modules/store/components/Select";
import { AttributeManagerSelect } from "@/modules/attribute/components/Select";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { Product } from "../../product.model";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { Store } from "@/shared/base/entity";

interface StoreProductListProps {
  form: FormInstance<Product>;
}

export const StoreProductList: React.FC<StoreProductListProps> = ({ form }) => {
  const storeProducts = Form.useWatch("storeProducts", form) || [];
  const [selectedStore, setSelectedStore] = useAutoResetItem<Store>();

  return (
    <Form.List name="storeProducts">
      {(fields, { add, remove }) => (
        <FormSection
          title="Chi nhánh kinh doanh"
          subtitle={
            <div className="ml-auto flex w-96">
              <StoreSelect
                value={selectedStore?.id}
                prefix={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                placeholder="Tìm chi nhánh để thêm"
                onChangeData={(store) => {
                  if (!store || storeProducts.some((item: any) => item?.storeId === store.id)) {
                    return;
                  }
                  setSelectedStore(store);
                  add({
                    storeId: store.id,
                    store,
                    costPrice: 0,
                    isSelling: true,
                    locationId: null,
                  });
                }}
              />
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            {!fields.length && (
              <p className="py-2 text-sm italic text-gray-400">
                Chưa cấu hình chi nhánh kinh doanh nào
              </p>
            )}

            {fields.map(({ key, name, ...restField }) => {
              const item = storeProducts[name] || {};
              return (
                <div key={key} className="flex items-center gap-3 rounded-md border p-3">
                  <div className="min-w-48 flex-1">
                    <div className="font-medium">{item.store?.name || item.storeId}</div>
                    {item.store?.code && <div className="text-xs text-gray-400">{item.store.code}</div>}
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, "costPrice"]}
                    label={<Label title="Giá vốn" />}
                    className="mb-0 w-44"
                    rules={[{ required: true, message: "Nhập giá vốn" }]}
                  >
                    <InputMoney notRightAlign />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "locationId"]}
                    label={<Label title="Vị trí" />}
                    className="mb-0 w-56"
                  >
                    <AttributeManagerSelect
                      type={AttributeType.LOCATION}
                      defaultData={item.location}
                      onChangeData={(location) =>
                        form.setFieldValue(["storeProducts", name, "location"], location)
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "isSelling"]}
                    valuePropName="checked"
                    label={<Label title="Đang bán" />}
                    className="mb-0"
                  >
                    <Switch />
                  </Form.Item>

                  <button
                    type="button"
                    className="mt-5 p-1 text-red-600 hover:text-red-800"
                    onClick={() => remove(name)}
                    aria-label="Xóa chi nhánh"
                  >
                    <TrashIcon className="h-5 w-5" />
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
