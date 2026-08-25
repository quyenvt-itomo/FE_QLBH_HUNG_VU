import React from "react";
import { Form, FormInstance, InputNumber, Switch } from "antd";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";

import { AppSwitch, FormSection, InputMoney, Label } from "@/shared/components";
import { StoreMultipleSelect } from "@/modules/store/components/Select";
import { AttributeManagerMultipleSelect } from "@/modules/attribute/components/Select";
import { AttributeType } from "@/modules/attribute/attribute.enum";
import { Product } from "../../product.model";
import { useAutoResetItem } from "@/shared/hooks/useAutoResetItem";
import { Store } from "@/shared/base/entity";
import { collectLocationsFromStoreProducts } from "../../product.util";
import { useGlobalData } from "@/shared/hooks/useGlobalData";

interface StoreProductListProps {
  form: FormInstance<Product>;
}

export const StoreProductList: React.FC<StoreProductListProps> = ({ form }) => {
  const storeProducts = Form.useWatch("storeProducts", form) || [];
  const { currentStore } = useGlobalData();
  const [selectedStore, setSelectedStore] = useAutoResetItem<Store>();
  const hideStores = storeProducts.map((item) => item?.store).filter(Boolean);
  const currentStoreConfigured = Boolean(
    currentStore && storeProducts.some((item) => item?.storeId === currentStore.id),
  );

  return (
    <Form.List name="storeProducts">
      {(fields, { add, remove }) => (
        <FormSection
          title="Chi nhánh kinh doanh"
          subtitle={
            <div className="ml-auto flex w-96">
              {currentStore ? (
                <button
                  type="button"
                  disabled={currentStoreConfigured}
                  className="h-8 rounded-md border border-primary px-3 text-sm text-primary disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
                  onClick={() => {
                    if (currentStoreConfigured) return;
                    // This branch is scoped to the active store, so it is safe
                    // to add only the current store without exposing others.
                    const fields = form.getFieldValue("storeProducts") || [];
                    form.setFieldValue("storeProducts", [
                      ...fields,
                      {
                        storeId: currentStore.id,
                        store: currentStore,
                        costPrice: 0,
                        isSelling: true,
                        locationIds: [],
                      },
                    ]);
                  }}
                >
                  {currentStoreConfigured ? "Đã cấu hình cửa hàng" : "Thêm cửa hàng hiện tại"}
                </button>
              ) : (
              <StoreMultipleSelect
                value={selectedStore ? [selectedStore.id] : []}
                prefix={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                placeholder="Tìm chi nhánh để thêm"
                hideOptions={hideStores}
                onChangeData={(values) => {
                  const store = values?.[0];
                  if (!store || storeProducts.some((item) => item?.storeId === store.id)) {
                    return;
                  }
                  setSelectedStore(store);
                  add({
                    storeId: store.id,
                    store,
                    costPrice: 0,
                    isSelling: true,
                    locationIds: [],
                  });
                }}
              />
              )}
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
              const canEdit = !currentStore || item.storeId === currentStore.id;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-3 rounded-md border px-4 pt-2 ${
                    canEdit ? "" : "bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="w-48">
                    <div className="font-medium">{item.store?.name || item.storeId}</div>
                    {item.store?.code && (
                      <div className="text-xs text-gray-400">{item.store.code}</div>
                    )}
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, "costPrice"]}
                    label={<Label title="Giá vốn" />}
                    className="mb-0 w-44"
                    rules={[{ required: true, message: "Nhập giá vốn" }]}
                  >
                    <InputMoney notRightAlign disabled={!canEdit} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "locationIds"]}
                    label={<Label title="Vị trí" />}
                    className="w-96"
                  >
                    <AttributeManagerMultipleSelect
                      query={{ storeId: item.storeId }}
                      type={AttributeType.LOCATION}
                      disabled={!canEdit}
                      value={
                        item.locationIds ||
                        (item.locations || []).map((item: any) => item.locationId).filter(Boolean)
                      }
                      defaultData={collectLocationsFromStoreProducts(item)}
                      onChangeData={(locations) =>
                        form.setFieldValue(
                          ["storeProducts", name, "locations"],
                          locations.map((location) => ({
                            locationId: location.id,
                            location,
                          })),
                        )
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "isSelling"]}
                    valuePropName="checked"
                    label={<Label title="Đang bán" />}
                    className="w-60"
                  >
                    <AppSwitch disabled={!canEdit} label="Hiển thị khi bán hàng" />
                  </Form.Item>

                  <button
                    type="button"
                    disabled={!canEdit}
                    className="p-1 text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:text-gray-400"
                    onClick={() => canEdit && remove(name)}
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
